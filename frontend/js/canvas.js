/**************************************************
 * Global Data
 **************************************************/

// Rebars: { id, x, y, diameter }
let rebars = [];
let rebarCounter = 1;
let selectedRebarId = null;

// Default cross-section dimension
let crossSectionWidth = 500;
let crossSectionHeight = 300;

// Rectangle at (80, 20)
const rectX = 80;
const rectY = 20;

// Variables for dragging existing rebars
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

/**************************************************
 * On Page Load
 **************************************************/
window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");

	initCrossSectionControls();
	initDragAndDrop(canvas);
	initCanvasInteractions(canvas);
	initMinimalReinforcementUI();

	// Initial rendering
	renderCanvas(ctx);
	renderRebarList();
});

/**************************************************
 * 1) Cross-Section Controls
 **************************************************/
function initCrossSectionControls() {
	const widthInput = document.getElementById("widthInput");
	const heightInput = document.getElementById("heightInput");

	widthInput.addEventListener("change", () => {
		crossSectionWidth = parseFloat(widthInput.value) || 500;
		refreshCanvasAndTable();
	});
	heightInput.addEventListener("change", () => {
		crossSectionHeight = parseFloat(heightInput.value) || 300;
		refreshCanvasAndTable();
	});
}

/**************************************************
 * 2) Drag-and-Drop: Adding New Rebars
 **************************************************/
function initDragAndDrop(canvas) {
	document.querySelectorAll(".rebar-icon").forEach((icon) => {
		icon.addEventListener("dragstart", (e) => {
			const diameter = icon.dataset.diameter;
			e.dataTransfer.setData("diameter", diameter);
		});
	});

	canvas.addEventListener("dragover", (e) => {
		e.preventDefault();
	});

	canvas.addEventListener("drop", (e) => {
		e.preventDefault();
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const diameter = parseFloat(e.dataTransfer.getData("diameter") || "16");

		// Create a new rebar
		const newRebar = {
			id: rebarCounter++,
			x: mouseX,
			y: mouseY,
			diameter: diameter,
		};
		rebars.push(newRebar);

		selectedRebarId = newRebar.id;
		refreshCanvasAndTable();
	});
}

/**************************************************
 * 3) Canvas Interactions
 **************************************************/
function initCanvasInteractions(canvas) {
	canvas.addEventListener("mousedown", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const clickedRebar = findClickedRebar(mouseX, mouseY);

		// Ctrl+click => copy
		if (clickedRebar && e.ctrlKey) {
			const newRebar = {
				id: rebarCounter++,
				x: clickedRebar.x,
				y: clickedRebar.y,
				diameter: clickedRebar.diameter,
			};
			rebars.push(newRebar);

			selectedRebarId = newRebar.id;
			isDragging = true;
			dragOffsetX = mouseX - newRebar.x;
			dragOffsetY = mouseY - newRebar.y;

			refreshCanvasAndTable();
			return;
		}

		// Normal selection
		if (clickedRebar) {
			selectedRebarId = clickedRebar.id;
			isDragging = true;
			dragOffsetX = mouseX - clickedRebar.x;
			dragOffsetY = mouseY - clickedRebar.y;
		} else {
			selectedRebarId = null;
		}
		refreshCanvasAndTable();
	});

	canvas.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const rebar = rebars.find((r) => r.id === selectedRebarId);
		if (rebar) {
			rebar.x = mouseX - dragOffsetX;
			rebar.y = mouseY - dragOffsetY;
			refreshCanvasAndTable();
		}
	});

	canvas.addEventListener("mouseup", () => {
		isDragging = false;
	});

	canvas.addEventListener("mouseleave", () => {
		isDragging = false;
	});

	canvas.addEventListener("dblclick", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const clickedRebar = findClickedRebar(mouseX, mouseY);
		if (clickedRebar) {
			rebars = rebars.filter((r) => r.id !== clickedRebar.id);
			if (selectedRebarId === clickedRebar.id) {
				selectedRebarId = null;
			}
			refreshCanvasAndTable();
		}
	});
}

function findClickedRebar(mouseX, mouseY) {
	for (let r of rebars) {
		const dx = mouseX - r.x;
		const dy = mouseY - r.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < r.diameter / 2) {
			return r;
		}
	}
	return null;
}

/**************************************************
 * 4) Rendering the Canvas
 **************************************************/
function renderCanvas(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// Draw the rectangle
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(rectX, rectY, crossSectionWidth, crossSectionHeight);

	// Dimension lines
	drawDimensionLines(ctx);

	// Draw each rebar
	rebars.forEach((rebar) => {
		ctx.fillStyle = rebar.id === selectedRebarId ? "red" : "blue";
		ctx.beginPath();
		ctx.arc(rebar.x, rebar.y, rebar.diameter / 2, 0, 2 * Math.PI);
		ctx.fill();
	});
}

function drawDimensionLines(ctx) {
	const offset = 20;
	const arrowSize = 8;

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

/**************************************************
 * 5) Rebar Table
 **************************************************/
function renderRebarList() {
	const tbody = document.querySelector("#rebarTable tbody");
	tbody.innerHTML = "";

	rebars.forEach((rebar) => {
		const row = document.createElement("tr");
		if (rebar.id === selectedRebarId) {
			row.classList.add("selected");
		}

		// ID
		const tdId = document.createElement("td");
		tdId.textContent = rebar.id;
		row.appendChild(tdId);

		// X coordinate
		const tdX = document.createElement("td");
		const inputX = document.createElement("input");
		inputX.type = "number";
		inputX.value = rebar.x.toFixed(2);
		inputX.style.width = "60px";

		// Prevent row click from interrupting
		inputX.addEventListener("click", (evt) => {
			evt.stopPropagation();
		});
		// Update on blur
		inputX.addEventListener("blur", (evt) => {
			rebar.x = parseFloat(evt.target.value) || rebar.x;
			refreshCanvasAndTable();
		});

		tdX.appendChild(inputX);
		row.appendChild(tdX);

		// Y coordinate
		const tdY = document.createElement("td");
		const inputY = document.createElement("input");
		inputY.type = "number";
		inputY.value = rebar.y.toFixed(2);
		inputY.style.width = "60px";
		inputY.addEventListener("click", (evt) => {
			evt.stopPropagation();
		});
		inputY.addEventListener("blur", (evt) => {
			rebar.y = parseFloat(evt.target.value) || rebar.y;
			refreshCanvasAndTable();
		});
		tdY.appendChild(inputY);
		row.appendChild(tdY);

		// Diameter
		const tdDiameter = document.createElement("td");
		const inputDiameter = document.createElement("input");
		inputDiameter.type = "number";
		inputDiameter.value = rebar.diameter.toFixed(2);
		inputDiameter.style.width = "60px";
		inputDiameter.addEventListener("click", (evt) => {
			evt.stopPropagation();
		});
		inputDiameter.addEventListener("blur", (evt) => {
			rebar.diameter = parseFloat(evt.target.value) || rebar.diameter;
			refreshCanvasAndTable();
		});
		tdDiameter.appendChild(inputDiameter);
		row.appendChild(tdDiameter);

		// Row click => select rebar
		row.addEventListener("click", () => {
			selectedRebarId = rebar.id;
			renderRebarList();
			renderCanvas(document.getElementById("myCanvas").getContext("2d"));
		});

		tbody.appendChild(row);
	});
}

/**************************************************
 * 6) Minimal Reinforcement UI
 **************************************************/
function initMinimalReinforcementUI() {
	const checkBtn = document.getElementById("checkMinReinfBtn");
	if (!checkBtn) return; // button not found
	checkBtn.addEventListener("click", () => {
		calculateMinimalReinforcement();
	});
}

/**************************************************
 * 7) Minimal Reinforcement Calculation (Example)
 **************************************************/
function calculateMinimalReinforcement() {
	console.log("Calculating minimal reinforcement...");
	const resultEl = document.getElementById("minReinfResult");
	if (!resultEl) return;

	// (A) Example: read from <select> if needed
	const elementType = document.getElementById("elementType")?.value || "beam";
	const concreteSel = document.getElementById("concreteGrade");
	const steelSel = document.getElementById("steelGrade");

	const fctEff = parseFloat(concreteSel?.selectedOptions[0].dataset.fct || "2.21");
	const fyk = parseFloat(steelSel?.value || "500");

	// (B) Sum total rebar area
	let totalAs = 0;
	rebars.forEach((r) => {
		const area = Math.PI * (r.diameter / 2) ** 2; // circle area
		totalAs += area;
	});

	// (C) Fake "minimum" for demonstration, say 1500 mm²
	// Replace with your real formula from the doc
	let As_min = 1500;

	// (D) Compare
	let meets = totalAs >= As_min;
	if (meets) {
		resultEl.style.color = "green";
		resultEl.textContent = `OK: total As = ${totalAs.toFixed(2)} mm² >= As_min = ${As_min} mm²`;
	} else {
		resultEl.style.color = "red";
		resultEl.textContent = `NOT OK: total As = ${totalAs.toFixed(2)} mm² < As_min = ${As_min} mm²`;
	}
}

/**************************************************
 * refreshCanvasAndTable
 **************************************************/
function refreshCanvasAndTable() {
	const ctx = document.getElementById("myCanvas").getContext("2d");
	renderCanvas(ctx);
	renderRebarList();
}
