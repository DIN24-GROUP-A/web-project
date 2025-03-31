// minimalReinforcement.js
import { appState } from "./data.js";

/**
 * Example "calculateMinimalReinforcement" that sums up total rebar area,
 * checks if it exceeds some threshold, and shows a result.
 */
export function calculateMinimalReinforcement() {
	const resultEl = document.getElementById("minReinfResult");
	if (!resultEl) return;

	// Sum total As
	let totalAs = 0;
	appState.rebars.forEach((r) => {
		const area = Math.PI * (r.diameter / 2) ** 2;
		totalAs += area;
	});

	// Let's pretend we want at least 1500 mm²
	const As_min = 1500;
	if (totalAs >= As_min) {
		resultEl.style.color = "green";
		resultEl.textContent = `OK: total As = ${totalAs.toFixed(2)} mm² >= As_min = ${As_min} mm²`;
	} else {
		resultEl.style.color = "red";
		resultEl.textContent = `NOT OK: total As = ${totalAs.toFixed(2)} mm² < As_min = ${As_min} mm²`;
	}
}
