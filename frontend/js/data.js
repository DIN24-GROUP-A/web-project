// data.js

/**
 * Single application-wide state object
 * Storing everything we need: rebar array, counters, etc.
 */
export const appState = {
	rebarCounter: 1,
	rebars: [], // array of { id, x, y, diameter }
	selectedRebarId: null, // used for single-click selection
	selectedRebarIds: [], // for multi-selection

	// Cross-section:
	crossSectionWidth: 500,
	crossSectionHeight: 300,
	rectX: 80,
	rectY: 20,

	// Drag state
	isDragging: false,
	dragOffsetX: 0,
	dragOffsetY: 0,

	// Rebar placement
	activeRebarDiameter: null,

	// Selection box
	isSelecting: false,
	selectionStart: null,
	selectionRect: null,

	// offsets for moving multiple
	dragOffsets: {},
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

/**
 * Returns all rebars within a selection box
 */
export function findRebarsInBox(x1, y1, x2, y2) {
	const [left, right] = [Math.min(x1, x2), Math.max(x1, x2)];
	const [top, bottom] = [Math.min(y1, y2), Math.max(y1, y2)];

	return appState.rebars.filter((r) => r.x >= left && r.x <= right && r.y >= top && r.y <= bottom);
}
