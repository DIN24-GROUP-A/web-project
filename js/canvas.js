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

// Rectangle top-left
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
 * 1) Cross-Section Controls (Width, Height)
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
 * 3) Canvas Interactions: Selecting & Dragging Rebars
 **************************************************/
function initCanvasInteractions(canvas) {
	canvas.addEventListener("mousedown", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const clickedRebar = findClickedRebar(mouseX, mouseY);
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

	// Draw dimension lines
	drawDimensionLines(ctx);

	// Draw each rebar
	rebars.forEach((rebar) => {
		ctx.fillStyle = rebar.id === selectedRebarId ? "red" : "blue";
		ctx.beginPath();
		ctx.arc(rebar.x, rebar.y, rebar.diameter / 2, 0, 2 * Math.PI);
		ctx.fill();
	});
}

/**************************************************
 * 4.1) Dimension Lines for the Rectangle
 **************************************************/
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

	// Extension lines
	ctx.beginPath();
	ctx.moveTo(rectX, rectY + crossSectionHeight);
	ctx.lineTo(rectX, dimY);
	ctx.moveTo(rectX + crossSectionWidth, rectY + crossSectionHeight);
	ctx.lineTo(rectX + crossSectionWidth, dimY);
	ctx.stroke();

	// Slash ticks
	drawSlashTick(ctx, rectX, dimY, arrowSize, true);
	drawSlashTick(ctx, rectX + crossSectionWidth, dimY, arrowSize, false);

	// Label
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

	// Label
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

		// X
		const tdX = document.createElement("td");
		const inputX = document.createElement("input");
		inputX.type = "number";
		inputX.value = rebar.x.toFixed(2);
		inputX.style.width = "60px";
		inputX.addEventListener("change", () => {
			rebar.x = parseFloat(inputX.value) || rebar.x;
			refreshCanvasAndTable();
		});
		tdX.appendChild(inputX);
		row.appendChild(tdX);

		// Y
		const tdY = document.createElement("td");
		const inputY = document.createElement("input");
		inputY.type = "number";
		inputY.value = rebar.y.toFixed(2);
		inputY.style.width = "60px";
		inputY.addEventListener("change", () => {
			rebar.y = parseFloat(inputY.value) || rebar.y;
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
		inputDiameter.addEventListener("change", () => {
			rebar.diameter = parseFloat(inputDiameter.value) || rebar.diameter;
			refreshCanvasAndTable();
		});
		tdDiameter.appendChild(inputDiameter);
		row.appendChild(tdDiameter);

		row.addEventListener("click", () => {
			selectedRebarId = rebar.id;
			renderRebarList(); // highlight row
			renderCanvas(document.getElementById("myCanvas").getContext("2d"));
		});
		tbody.appendChild(row);
	});
}

/**************************************************
 * 6) Minimal Reinforcement UI & Logic
 **************************************************/
function initMinimalReinforcementUI() {
	const checkBtn = document.getElementById("checkMinReinfBtn");
	checkBtn.addEventListener("click", () => {
		calculateMinimalReinforcement();
	});
}

/**************************************************
 * calculateMinimalReinforcement (the doc algorithm)
 **************************************************/
function calculateMinimalReinforcement() {
	const elementType = document.getElementById("elementType").value; // beam, column, tie
	const concreteSelect = document.getElementById("concreteGrade");
	const steelSelect = document.getElementById("steelGrade");
	const resultP = document.getElementById("minReinfResult");

	// Grab fct,eff from data attribute
	const fctEff = parseFloat(concreteSelect.selectedOptions[0].dataset.fct || "2.21"); // default 2.21 for C20/25
	const fyk = parseFloat(steelSelect.value || "500");

	// 1) Compute total As from rebars
	//    As for one rebar = π*(d/2)^2   (since diameter is in mm -> area in mm^2)
	//    If you have bars with a different cross-sectional area, adapt the formula.
	let totalAs = 0;
	rebars.forEach((r) => {
		const area = Math.PI * Math.pow(r.diameter / 2, 2);
		totalAs += area;
	});

	// 2) According to doc, we also need As by “top” or “bottom” for beams, etc.
	//    The doc lumps them if needed, but for simplicity we’ll just sum everything
	//    as bottom + top. Feel free to refine if you track top vs. bottom separately.
	//    So effectively: As = ΣAs_i.

	// 3) Compute As,min_crack = kc * k * fct,eff * Act
	//    - kc = 1 (simplified)
	//    - k depends on h (interpolation if 300 < h < 800)
	//    - Act depends on element type
	const kc = 1.0;
	const h = crossSectionHeight;
	const b = crossSectionWidth;

	// 3.1) Compute k based on h
	let k;
	if (h <= 300) {
		k = 1.0;
	} else if (h >= 800) {
		k = 0.65;
	} else {
		// linear interpolation between 300 -> 1.0 and 800 -> 0.65
		// slope = (0.65 - 1.0) / (800 - 300) = -0.35/500 = -0.0007
		// eq: k = 1.0 + slope*(h - 300)
		const slope = (0.65 - 1.0) / (800 - 300);
		k = 1.0 + slope * (h - 300);
	}

	// 3.2) Compute Act for tension zone (doc says):
	// Beam/bending -> Act = b*h/2
	// Column/compression -> Act = 0
	// Tie/tension -> Act = b*h
	let Act = 0;
	if (elementType === "beam") {
		Act = b * (h / 2.0);
	} else if (elementType === "column") {
		Act = 0; // per doc
	} else if (elementType === "tie") {
		Act = b * h;
	}

	const As_min_crack = kc * k * fctEff * Act;

	// 4) Compute As,min_el
	//    - Beam: As_min_el =(0.26 * fct,eff / fyk)*b*h  but also > 0.0013*b*h
	//    - Column: 0.5% of b*h => 0.5/100*b*h = 0.005*b*h
	//    - Tie: 0  (doc says As_min_el=0 for tie)
	let As_min_el = 0;
	if (elementType === "beam") {
		// from doc: As_min_el = (0.26 * fct,eff / fyk) * b*h
		// but also must be >= 0.0013 * b*h
		let temp = ((0.26 * fctEff) / fyk) * b * h;
		let limit = 0.0013 * b * h;
		As_min_el = Math.max(temp, limit);
	} else if (elementType === "column") {
		// doc says 0.5% => 0.5/100 => 0.005
		As_min_el = 0.005 * b * h;
	} else if (elementType === "tie") {
		As_min_el = 0;
	}

	// 5) As_min = max(As_min_crack, As_min_el)
	const As_min = Math.max(As_min_crack, As_min_el);

	// 6) Compare totalAs vs As_min
	const meetsRequirement = totalAs >= As_min;

	// 7) Show result
	let msg = `As = ${totalAs.toFixed(2)} mm², As_min = ${As_min.toFixed(2)} mm². `;
	if (meetsRequirement) {
		msg += "Minimum reinforcement ratio meets the requirements of EN 1992-1-1.";
		resultP.style.color = "green";
	} else {
		msg += "The minimum reinforcement ratio does NOT meet EN 1992-1-1. Increase the reinforcement area.";
		resultP.style.color = "red";
	}
	resultP.textContent = msg;
}

/**************************************************
 * Refresh Canvas + Table
 **************************************************/
function refreshCanvasAndTable() {
	const ctx = document.getElementById("myCanvas").getContext("2d");
	renderCanvas(ctx);
	renderRebarList();
}
