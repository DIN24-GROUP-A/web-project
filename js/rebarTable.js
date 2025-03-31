// rebarTable.js
import { appState } from "./data.js";
import { refreshCanvasAndTable } from "./main.js";

/**
 * Populate the <table> with current rebars from appState.
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

		// X cell
		row.appendChild(makeCoordCell(rebar, "x"));
		// Y cell
		row.appendChild(makeCoordCell(rebar, "y"));
		// Diameter cell
		row.appendChild(makeCoordCell(rebar, "diameter"));

		// Clicking row => select rebar
		row.addEventListener("click", () => {
			appState.selectedRebarId = rebar.id;
			renderRebarList(); // highlight row
			refreshCanvasAndTable(); // re-draw canvas
		});

		tbody.appendChild(row);
	});
}

/**
 * Helper function that creates a <td> with an <input>
 * that edits a numeric field of the rebar (x, y, or diameter).
 */
function makeCoordCell(rebar, key) {
	const td = document.createElement("td");
	const input = document.createElement("input");
	input.type = "number";
	input.style.width = "60px";

	// Show the current value
	let val = rebar[key];
	input.value = val.toFixed(2);

	// Stop row click from interfering
	input.addEventListener("click", (e) => {
		e.stopPropagation();
	});

	// On blur, parse new value and update
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
