// canvasActions.js
import { appState, getNextRebarId, findClickedRebar, findRebarsInBox } from "./data.js";
import { refreshCanvasAndTable } from "./main.js";

export function initCanvasInteractions(canvas) {
	canvas.addEventListener("mousedown", (e) => {
		e.preventDefault();
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		appState._mouseDownTime = Date.now();
		appState._mouseDownCoord = { x: mouseX, y: mouseY };
		appState.selectionStart = { x: mouseX, y: mouseY };
		appState._pendingSelection = false;
		const clickedRebar = findClickedRebar(mouseX, mouseY);
		if (!clickedRebar && appState.activeRebarDiameter !== null) {
			const newId = getNextRebarId();
			const newRebar = {
				id: newId,
				x: mouseX,
				y: mouseY,
				diameter: appState.activeRebarDiameter,
			};
			appState.rebars.push(newRebar);
			appState.selectedRebarId = newId;
			appState.selectedRebarIds = [newId];
			refreshCanvasAndTable();
			return;
		}

		if (!clickedRebar && e.button === 0 && appState.activeRebarDiameter === null) {
			appState._pendingSelection = true;
			appState.selectedRebarId = null;
		} else if (clickedRebar && e.ctrlKey) {
			const newId = getNextRebarId();
			const newRebar = {
				id: newId,
				x: clickedRebar.x + 10,
				y: clickedRebar.y + 10,
				diameter: clickedRebar.diameter,
			};
			appState.rebars.push(newRebar);
			appState.selectedRebarIds = [newId];
			appState.selectedRebarId = newId;
			appState.isDragging = true;
			appState.dragOffsets = {
				[newRebar.id]: {
					dx: mouseX - newRebar.x,
					dy: mouseY - newRebar.y,
				},
			};
		} else if (clickedRebar) {
			if (!e.shiftKey) {
				appState.selectedRebarIds = [clickedRebar.id];
			} else {
				if (!appState.selectedRebarIds.includes(clickedRebar.id)) {
					appState.selectedRebarIds.push(clickedRebar.id);
				}
			}
			appState.selectedRebarId = clickedRebar.id;
			appState.isDragging = true;
			appState.dragOffsets = {};
			appState.selectedRebarIds.forEach((id) => {
				const rebar = appState.rebars.find((r) => r.id === id);
				if (rebar) {
					appState.dragOffsets[id] = {
						dx: mouseX - rebar.x,
						dy: mouseY - rebar.y,
					};
				}
			});
		}
		refreshCanvasAndTable();
	});

	canvas.addEventListener("mousemove", (e) => {
		const holdTime = Date.now() - appState._mouseDownTime;
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		let dx = 0,
			dy = 0;
		if (appState.selectionStart) {
			dx = mouseX - appState.selectionStart.x;
			dy = mouseY - appState.selectionStart.y;
		}

		// Trigger selection mode if held and moved enough
		if (!appState.isSelecting && appState._pendingSelection && appState._mouseDownCoord) {
			const holdTime = Date.now() - appState._mouseDownTime;
			if (holdTime > 150 && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
				appState.isSelecting = true;
				appState._pendingSelection = false;
			}
		}

		if (appState.isSelecting) {
			appState.selectionRect = {
				x1: appState.selectionStart.x,
				y1: appState.selectionStart.y,
				x2: mouseX,
				y2: mouseY,
			};
			refreshCanvasAndTable();
			return;
		}

		if (appState.isDragging && appState.selectedRebarIds.length > 0) {
			appState.selectedRebarIds.forEach((id) => {
				const rebar = appState.rebars.find((r) => r.id === id);
				if (rebar) {
					const offset = appState.dragOffsets[id];
					if (offset) {
						rebar.x = mouseX - offset.dx;
						rebar.y = mouseY - offset.dy;
					}
				}
			});
			refreshCanvasAndTable();
		}
	});

	canvas.addEventListener("mouseup", () => {
		// stop dragging if active
		const wasDragging = appState.isDragging;
		appState.dragOffsets = {};
		const wasSelecting = appState.isSelecting && appState.selectionRect;

		// if box selection happened, select those rebars
		if (wasSelecting) {
			const { x1, y1, x2, y2 } = appState.selectionRect;
			const selected = findRebarsInBox(x1, y1, x2, y2);
			appState.selectedRebarIds = selected.map((r) => r.id);
		} else if (!wasDragging && !wasSelecting) {
			// Only clear selection if click without dragging or selection
			appState.selectedRebarIds = [];
		}

		// Clear temporary interaction state
		appState.isSelecting = false;
		appState._pendingSelection = false;
		appState.selectionRect = null;
		appState.isDragging = false;
		refreshCanvasAndTable();
	});

	canvas.addEventListener("mouseleave", () => {
		appState.isDragging = false;
		appState.isSelecting = false;
		appState.selectionRect = null;
	});

	canvas.addEventListener("dblclick", (e) => {
		e.preventDefault();
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		const clickedRebar = findClickedRebar(mouseX, mouseY);
		if (clickedRebar) {
			appState.rebars = appState.rebars.filter((r) => r.id !== clickedRebar.id);
			appState.selectedRebarIds = appState.selectedRebarIds.filter((id) => id !== clickedRebar.id);
			refreshCanvasAndTable();
		}
	});
}

export function renderCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.fillStyle = "#cccccc";
	ctx.fillRect(appState.rectX, appState.rectY, appState.crossSectionWidth, appState.crossSectionHeight);
	drawDimensionLines(ctx);

	if (appState.selectionRect) {
		const { x1, y1, x2, y2 } = appState.selectionRect;
		ctx.strokeStyle = "rgba(0, 0, 255, 0.6)";
		ctx.lineWidth = 1;
		ctx.setLineDash([4, 2]);
		ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
		ctx.setLineDash([]);
	}

	appState.rebars.forEach((rebar) => {
		const isSelected = appState.selectedRebarIds.includes(rebar.id);
		ctx.fillStyle = isSelected ? "red" : "blue";
		ctx.beginPath();
		ctx.arc(rebar.x, rebar.y, rebar.diameter / 2, 0, 2 * Math.PI);
		ctx.fill();
	});
}

function drawDimensionLines(ctx) {
	const offset = 20;
	const arrowSize = 8;
	const { rectX, rectY, crossSectionWidth, crossSectionHeight } = appState;

	let dimY = rectY + crossSectionHeight + offset;
	ctx.beginPath();
	ctx.moveTo(rectX, dimY);
	ctx.lineTo(rectX + crossSectionWidth, dimY);
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 1;
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(rectX, rectY + crossSectionHeight);
	ctx.lineTo(rectX, dimY);
	ctx.moveTo(rectX + crossSectionWidth, rectY + crossSectionHeight);
	ctx.lineTo(rectX + crossSectionWidth, dimY);
	ctx.stroke();

	drawSlashTick(ctx, rectX, dimY, arrowSize, true);
	drawSlashTick(ctx, rectX + crossSectionWidth, dimY, arrowSize, false);

	const midX = rectX + crossSectionWidth / 2;
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "14px sans-serif";
	ctx.fillStyle = "#000";
	ctx.fillText(`${crossSectionWidth} mm`, midX, dimY - 5);

	let dimX = rectX - offset;
	ctx.beginPath();
	ctx.moveTo(dimX, rectY);
	ctx.lineTo(dimX, rectY + crossSectionHeight);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(rectX, rectY);
	ctx.lineTo(dimX, rectY);
	ctx.moveTo(rectX, rectY + crossSectionHeight);
	ctx.lineTo(dimX, rectY + crossSectionHeight);
	ctx.stroke();

	drawSlashTick(ctx, dimX, rectY, arrowSize, true, true);
	drawSlashTick(ctx, dimX, rectY + crossSectionHeight, arrowSize, false, true);

	const midY = rectY + crossSectionHeight / 2;
	ctx.save();
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(`${crossSectionHeight} mm`, dimX - 15, midY);
	ctx.restore();
}

function drawSlashTick(ctx, x, y, size, leftOrTop, isVertical = false) {
	ctx.beginPath();
	if (!isVertical) {
		if (leftOrTop) {
			ctx.moveTo(x, y);
			ctx.lineTo(x + size * 0.5, y - size);
		} else {
			ctx.moveTo(x, y);
			ctx.lineTo(x - size * 0.5, y - size);
		}
	} else {
		if (leftOrTop) {
			ctx.moveTo(x, y);
			ctx.lineTo(x - size, y + size * 0.5);
		} else {
			ctx.moveTo(x, y);
			ctx.lineTo(x - size, y - size * 0.5);
		}
	}
	ctx.stroke();
}

export function alignSelectedRebars(mode) {
	const selected = appState.rebars.filter((r) => appState.selectedRebarIds.includes(r.id));
	if (selected.length < 2) return;

	if (mode === "horizontal") {
		const avgY = selected.reduce((sum, r) => sum + r.y, 0) / selected.length;
		selected.forEach((r) => (r.y = avgY));
	} else if (mode === "vertical") {
		const avgX = selected.reduce((sum, r) => sum + r.x, 0) / selected.length;
		selected.forEach((r) => (r.x = avgX));
	} else if (mode === "space-horizontal") {
		const sorted = [...selected].sort((a, b) => a.x - b.x);
		if (sorted.length < 2) return;
		const min = sorted[0].x;
		const max = sorted[sorted.length - 1].x;
		const step = (max - min) / (sorted.length - 1);
		sorted.forEach((r, i) => (r.x = min + i * step));
	} else if (mode === "space-vertical") {
		const sorted = [...selected].sort((a, b) => a.y - b.y);
		if (sorted.length < 2) return;
		const min = sorted[0].y;
		const max = sorted[sorted.length - 1].y;
		const step = (max - min) / (sorted.length - 1);
		sorted.forEach((r, i) => (r.y = min + i * step));
	}

	refreshCanvasAndTable();
}
