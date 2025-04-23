// main.js
import { appState } from "./data.js";
import { initCanvasInteractions, renderCanvas } from "./canvasActions.js";
import { renderRebarList } from "./rebarTable.js";
import { calculateMinimalReinforcement } from "./minimalReinforcement.js";

window.addEventListener("DOMContentLoaded", () => {
	initCrossSectionControls();
	initRebarButtons();

	const canvas = document.getElementById("myCanvas");
	if (canvas) {
		initCanvasInteractions(canvas);
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
 * Rebar Button Toggle (Click-to-Activate)
 **************************************************/
function initRebarButtons() {
	document.querySelectorAll(".rebar-icon").forEach((icon) => {
		icon.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			icon.blur(); // prevent focus from triggering layout shift

			const isActive = icon.classList.contains("active");
			document.querySelectorAll(".rebar-icon").forEach((i) => i.classList.remove("active"));
			if (!isActive) {
				icon.classList.add("active");
				appState.activeRebarDiameter = parseFloat(icon.dataset.diameter);
			} else {
				appState.activeRebarDiameter = null;
			}
		});
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
