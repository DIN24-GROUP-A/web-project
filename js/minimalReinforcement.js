// minimalReinforcement.js
import { appState } from "./data.js";

/**
 * Example minimal reinforcement calculation
 * reading from #elementType, #concreteGrade, #steelGrade
 */
export function calculateMinimalReinforcement() {
	const resultEl = document.getElementById("minReinfResult");
	if (!resultEl) return;

	// 1) Read user inputs
	const elementTypeSel = document.getElementById("elementType");
	const concreteSel = document.getElementById("concreteGrade");
	const steelSel = document.getElementById("steelGrade");

	const elementType = elementTypeSel?.value || "beam";
	// each option has data-fct="2.21", etc.
	const fctEff = parseFloat(concreteSel?.selectedOptions[0].dataset.fct || "2.21");
	const fyk = parseFloat(steelSel?.value || "500");

	// 2) Sum total rebar area As
	let totalAs = 0;
	appState.rebars.forEach((r) => {
		const area = Math.PI * (r.diameter / 2) ** 2;
		totalAs += area;
	});

	// 3) Just a placeholder formula. In real code, you'd use the doc's logic
	//    and possibly incorporate elementType, fctEff, fyk, crossSection dims, etc.
	let As_min = 1500; // For demonstration

	// 4) Compare
	if (totalAs >= As_min) {
		resultEl.style.color = "green";
		resultEl.textContent = `OK: total As = ${totalAs.toFixed(2)} mm² ≥ As_min = ${As_min} mm²
(elementType=${elementType}, fctEff=${fctEff}, fyk=${fyk})`;
	} else {
		resultEl.style.color = "red";
		resultEl.textContent = `NOT OK: total As = ${totalAs.toFixed(2)} mm² < As_min = ${As_min} mm²
(elementType=${elementType}, fctEff=${fctEff}, fyk=${fyk})`;
	}
}
