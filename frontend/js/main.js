// main.js
import { appState } from "./data.js";
import { initCanvasInteractions, renderCanvas, alignSelectedRebars } from "./canvasActions.js";
import { renderRebarList } from "./rebarTable.js";
import { calculateMinimalReinforcement } from "./minimalReinforcement.js";

window.addEventListener("DOMContentLoaded", () => {
	initCrossSectionControls();
	initRebarButtons();
	initRebarTableKeyListeners();
	document.getElementById("alignHorizontalBtn")?.addEventListener("click", () => alignSelectedRebars("horizontal"));
	document.getElementById("alignVerticalBtn")?.addEventListener("click", () => alignSelectedRebars("vertical"));
	document
		.getElementById("spaceHorizontalBtn")
		?.addEventListener("click", () => alignSelectedRebars("space-horizontal"));
	document.getElementById("spaceVerticalBtn")?.addEventListener("click", () => alignSelectedRebars("space-vertical"));

	const canvas = document.getElementById("myCanvas");
	if (canvas) {
		initCanvasInteractions(canvas);
		// Removed drag-and-drop logic
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
 * Enable Enter key for rebar table edits
 **************************************************/
function initRebarTableKeyListeners() {
	document.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && e.target.closest("#rebarTable")) {
			e.target.blur(); // trigger blur event to apply value
		}
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
	document.querySelectorAll("#rebarTable input").forEach((input) => input.blur());
}
