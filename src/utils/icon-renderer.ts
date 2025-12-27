import { setIcon } from "obsidian";
import { DailyStatus } from "./date-parser";

/**
 * Creates an icon element based on daily status
 */
export function createStatusIcon(status: DailyStatus): HTMLElement {
	const iconEl = document.createElement("span");
	iconEl.className = "daily-status-icon";
	
	// Set icon based on status
	if (status === "today") {
		setIcon(iconEl, "check-circle");
		iconEl.setAttribute("aria-label", "Today's note");
		iconEl.classList.add("status-today");
	} else {
		setIcon(iconEl, "calendar-x");
		iconEl.setAttribute("aria-label", "Not today's note");
		iconEl.classList.add("status-not-today");
	}
	
	return iconEl;
}

