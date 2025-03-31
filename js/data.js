// data.js

/**
 * Application-wide state stored in one object.
 * Because it's an object, we can mutate its fields from anywhere.
 */
export const appState = {
	rebarCounter: 1,
	rebars: [], // array of {id, x, y, diameter}
	selectedRebarId: null,
	isDragging: false,
	dragOffsetX: 0,
	dragOffsetY: 0,

	// Cross-section dimensions
	crossSectionWidth: 500,
	crossSectionHeight: 300,

	// Rectangle top-left
	rectX: 80,
	rectY: 20,
};

/**
 * Helper to get the next rebar ID and increment the counter.
 */
export function getNextRebarId() {
	return appState.rebarCounter++;
}

/**
 * Finds a rebar under the (mouseX, mouseY) position, if any.
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
