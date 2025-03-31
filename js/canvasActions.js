// canvasActions.js
import { appState, getNextRebarId, findClickedRebar } from "./data.js";
import { refreshCanvasAndTable } from "./main.js";

/**
 * Initialize all mouse interactions on the canvas:
 * - mousedown to select or copy rebar
 * - mousemove to drag
 * - double-click to remove
 */
export function initCanvasInteractions(canvas) {
	canvas.addEventListener("mousedown", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const clickedRebar = findClickedRebar(mouseX, mouseY);

		// Ctrl + click => copy rebar
		if (clickedRebar && e.ctrlKey) {
			copyRebar(clickedRebar, mouseX, mouseY);
			return;
		}

		// Normal selection
		if (clickedRebar) {
			appState.selectedRebarId = clickedRebar.id;
			appState.isDragging = true;
			appState.dragOffsetX = mouseX - clickedRebar.x;
			appState.dragOffsetY = mouseY - clickedRebar.y;
		} else {
			appState.selectedRebarId = null;
		}
		refreshCanvasAndTable();
	});

	canvas.addEventListener("mousemove", (e) => {
		if (!appState.isDragging) return;
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const rebar = appState.rebars.find((r) => r.id === appState.selectedRebarId);
		if (rebar) {
			rebar.x = mouseX - appState.dragOffsetX;
			rebar.y = mouseY - appState.dragOffsetY;
			refreshCanvasAndTable();
		}
	});

	canvas.addEventListener("mouseup", () => {
		appState.isDragging = false;
	});
	canvas.addEventListener("mouseleave", () => {
		appState.isDragging = false;
	});

	// Double-click => remove rebar
	canvas.addEventListener("dblclick", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const clickedRebar = findClickedRebar(mouseX, mouseY);
		if (clickedRebar) {
			removeRebar(clickedRebar);
		}
	});
}

/**
 * Copy a rebar (Ctrl+click): create a new rebar at same coords & diameter,
 * and start dragging it.
 */
function copyRebar(clickedRebar, mouseX, mouseY) {
	const newId = getNextRebarId();
	const newRebar = {
		id: newId,
		x: clickedRebar.x,
		y: clickedRebar.y,
		diameter: clickedRebar.diameter,
	};
	appState.rebars.push(newRebar);

	// Select & drag the new rebar
	appState.selectedRebarId = newId;
	appState.isDragging = true;
	appState.dragOffsetX = mouseX - newRebar.x;
	appState.dragOffsetY = mouseY - newRebar.y;

	refreshCanvasAndTable();
}

/**
 * Remove a rebar from the array, if found.
 */
function removeRebar(rebarToRemove) {
	appState.rebars = appState.rebars.filter((r) => r.id !== rebarToRemove.id);
	if (appState.selectedRebarId === rebarToRemove.id) {
		appState.selectedRebarId = null;
	}
	refreshCanvasAndTable();
}

/**
 * Draw the rectangle, dimension lines, and all rebars.
 */
export function renderCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// Draw rectangle
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(appState.rectX, appState.rectY, appState.crossSectionWidth, appState.crossSectionHeight);

	// Draw dimension lines
	drawDimensionLines(ctx);

	// Draw rebars
	appState.rebars.forEach((rebar) => {
		ctx.fillStyle = rebar.id === appState.selectedRebarId ? "red" : "blue";
		ctx.beginPath();
		ctx.arc(rebar.x, rebar.y, rebar.diameter / 2, 0, 2 * Math.PI);
		ctx.fill();
	});
}

/**
 * Draw dimension lines + labels around the rectangle
 */
function drawDimensionLines(ctx) {
	const offset = 20;
	const arrowSize = 8;
	const { rectX, rectY, crossSectionWidth, crossSectionHeight } = appState;

	// Horizontal dimension
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

	// Vertical dimension
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
