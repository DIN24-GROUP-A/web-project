/**************************************************
 * Global Data
 **************************************************/

// We'll store each placed rebar as an object:
// { id, x, y, diameter }
let rebars = [];

// Unique ID counter for new rebars
let rebarCounter = 1;

// Track selected rebar
let selectedRebarId = null;

// Cross-section dimensions (defaults set in HTML inputs)
let crossSectionWidth = 500;
let crossSectionHeight = 300;

// Flags & storage for dragging
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

/**************************************************
 * On Page Load
 **************************************************/
window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("myCanvas");
	const ctx = canvas.getContext("2d");

	// Initialize cross-section dimension controls
	initCrossSectionControls();

	// Initialize drag-and-drop for adding new rebars
	initDragAndDrop(canvas);

	// Initialize canvas event listeners for dragging existing rebars
	initCanvasInteractions(canvas);

	// Initial render
	renderCanvas(ctx);
	renderRebarList();
});

/**************************************************
 * Cross-Section Controls
 **************************************************/
function initCrossSectionControls() {
	const widthInput = document.getElementById("widthInput");
	const heightInput = document.getElementById("heightInput");

	// Sync global variables when changed
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
 * Drag-and-Drop: Adding New Rebars
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

		// Create a new rebar object
		const newRebar = {
			id: rebarCounter++,
			x: mouseX,
			y: mouseY,
			diameter: diameter,
		};
		rebars.push(newRebar);

		// Select the newly added rebar
		selectedRebarId = newRebar.id;

		// Update everything
		refreshCanvasAndTable();
	});
}

/**************************************************
 * Canvas Interactions: Selecting & Dragging Rebars
 **************************************************/
function initCanvasInteractions(canvas) {
	canvas.addEventListener("mousedown", (e) => {
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Check if we clicked on a rebar
		const clickedRebar = findClickedRebar(mouseX, mouseY);
		if (clickedRebar) {
			selectedRebarId = clickedRebar.id;
			isDragging = true;

			// Calculate offset so the rebar doesn't "jump" to mouse center
			dragOffsetX = mouseX - clickedRebar.x;
			dragOffsetY = mouseY - clickedRebar.y;
		} else {
			// Clicked on empty space -> no selection
			selectedRebarId = null;
		}
		refreshCanvasAndTable();
	});

	canvas.addEventListener("mousemove", (e) => {
		if (!isDragging) return;

		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		// Move the selected rebar to follow the mouse
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

	// If mouse leaves canvas, stop dragging
	canvas.addEventListener("mouseleave", () => {
		isDragging = false;
	});
}

/**************************************************
 * findClickedRebar: returns the rebar (if any)
 * whose circle contains the given (mouseX, mouseY)
 **************************************************/
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
 * Canvas Rendering
 **************************************************/
function renderCanvas(ctx) {
	const canvas = ctx.canvas;
	// Clear everything
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw the concrete cross-section
	// Let's place it at (50, 50) in the canvas
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(50, 50, crossSectionWidth, crossSectionHeight);

	// Draw each rebar
	rebars.forEach((rebar) => {
		ctx.fillStyle = rebar.id === selectedRebarId ? "red" : "blue";
		ctx.beginPath();
		ctx.arc(rebar.x, rebar.y, rebar.diameter / 2, 0, 2 * Math.PI);
		ctx.fill();
	});
}

/**************************************************
 * Rebar List (Table)
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
		inputX.addEventListener("change", () => {
			rebar.x = parseFloat(inputX.value) || rebar.x;
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

		// Clicking the row selects that rebar
		row.addEventListener("click", () => {
			selectedRebarId = rebar.id;
			refreshCanvasAndTable();
		});

		tbody.appendChild(row);
	});
}

/**************************************************
 * Refresh Canvas + Table
 **************************************************/
function refreshCanvasAndTable() {
	// Re-draw canvas
	const ctx = document.getElementById("myCanvas").getContext("2d");
	renderCanvas(ctx);
	// Re-render table
	renderRebarList();
}
