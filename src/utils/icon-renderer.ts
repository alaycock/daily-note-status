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
		iconEl.style.color = "var(--text-success, #4caf50)";
	} else {
		setIcon(iconEl, "calendar-x");
		iconEl.setAttribute("aria-label", "Not today's note");
		iconEl.style.color = "var(--text-warning, #d97706)";
	}
	
	// Add inline display style
	iconEl.style.display = "inline-block";
	iconEl.style.verticalAlign = "middle";
	iconEl.style.margin = "0 2px";
	
	return iconEl;
}

