// main.js
import { appState } from "./data.js";
import { initCanvasInteractions, renderCanvas } from "./canvasActions.js";
import { renderRebarList } from "./rebarTable.js";
import { calculateMinimalReinforcement } from "./minimalReinforcement.js";

window.addEventListener("DOMContentLoaded", () => {
	initCrossSectionControls();

	const canvas = document.getElementById("myCanvas");
	if (canvas) {
		initCanvasInteractions(canvas);
		initDragAndDrop(canvas);
	}

	initMinimalReinforcementUI();
	refreshCanvasAndTable(); // initial render
});

/**************************************************
 * Cross-section dimension controls
 **************************************************/
function initCrossSectionControls() {
	const widthInput = document.getElementById("widthInput");
	const heightInput = document.getElementById("heightInput");
	if (widthInput) {
		widthInput.addEventListener("change", () => {
			appState.crossSectionWidth = parseFloat(widthInput.value) || 500;
			refreshCanvasAndTable();
		});
	}
	if (heightInput) {
		heightInput.addEventListener("change", () => {
			appState.crossSectionHeight = parseFloat(heightInput.value) || 300;
			refreshCanvasAndTable();
		});
	}
}

/**************************************************
 * Drag-and-Drop for adding new rebars
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
		const newId = appState.rebarCounter++;
		const newRebar = {
			id: newId,
			x: mouseX,
			y: mouseY,
			diameter,
		};
		appState.rebars.push(newRebar);

		appState.selectedRebarId = newId;
		refreshCanvasAndTable();
	});
}

/**************************************************
 * Minimal Reinforcement UI
 **************************************************/
function initMinimalReinforcementUI() {
	const checkBtn = document.getElementById("checkMinReinfBtn");
	if (checkBtn) {
		checkBtn.addEventListener("click", () => {
			calculateMinimalReinforcement();
		});
	}
}

/**************************************************
 * Re-render canvas + table
 **************************************************/
export function refreshCanvasAndTable() {
	const canvas = document.getElementById("myCanvas");
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	renderCanvas(ctx);
	renderRebarList();
}
