// data.js

/**
 * Single application-wide state object
 * Storing everything we need: rebar array, counters, etc.
 */
export const appState = {
	rebarCounter: 1,
	rebars: [],
	selectedRebarId: null,

	// Cross-section:
	crossSectionWidth: 500,
	crossSectionHeight: 300,
	rectX: 80,
	rectY: 20,

	// Drag state
	isDragging: false,
	dragOffsetX: 0,
	dragOffsetY: 0,

	// Rebar button state
	activeRebarDiameter: null,
};

/**
 * Increments and returns the next rebar ID.
 * Fixes the NaN issue from trying to mutate an imported variable.
 */
export function getNextRebarId() {
	return appState.rebarCounter++;
}

/**
 * If user clicks near a rebar, find which rebar it is.
 */
export function findClickedRebar(mouseX, mouseY) {
	for (let r of appState.rebars) {
		const dx = mouseX - r.x;
		const dy = mouseY - r.y;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < r.diameter / 2) {
			return r;
		}
	}
	return null;
}
