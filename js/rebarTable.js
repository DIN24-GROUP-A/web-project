// rebarTable.js
import { appState } from "./data.js";
import { refreshCanvasAndTable } from "./main.js";

/**
 * Renders the <table> rows for each rebar in appState.
 * Also handles editing coordinates/diameter on blur.
 */
export function renderRebarList() {
	const tbody = document.querySelector("#rebarTable tbody");
	if (!tbody) return;
	tbody.innerHTML = "";

	appState.rebars.forEach((rebar) => {
		const row = document.createElement("tr");
		if (rebar.id === appState.selectedRebarId) {
			row.classList.add("selected");
		}

		// ID cell
		const tdId = document.createElement("td");
		tdId.textContent = rebar.id;
		row.appendChild(tdId);

		// X, Y, Diameter
		row.appendChild(makeCoordCell(rebar, "x"));
		row.appendChild(makeCoordCell(rebar, "y"));
		row.appendChild(makeCoordCell(rebar, "diameter"));

		// Row click => select rebar
		row.addEventListener("click", () => {
			appState.selectedRebarId = rebar.id;
			renderRebarList(); // highlight row
			refreshCanvasAndTable(); // re-draw canvas
		});

		tbody.appendChild(row);
	});
}

function makeCoordCell(rebar, key) {
	const td = document.createElement("td");
	const input = document.createElement("input");
	input.type = "number";
	input.style.width = "60px";
	input.value = rebar[key].toFixed(2);

	// Prevent row click from interfering
	input.addEventListener("click", (e) => e.stopPropagation());

	// On blur => parse new value
	input.addEventListener("blur", (e) => {
		let newVal = parseFloat(e.target.value);
		if (!isNaN(newVal)) {
			rebar[key] = newVal;
			refreshCanvasAndTable();
		}
	});

	td.appendChild(input);
	return td;
}
