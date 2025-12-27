import { moment } from "obsidian";

/**
 * Parses date from filename based on configured format
 * and compares it with today's date
 */

export type DailyStatus = "today" | "not-today";

/**
 * Extracts date from filename and compares with today
 */
export function getDailyStatus(filename: string): DailyStatus {
	// Parse date and normalize it to midnight
	const fileDate = moment(filename).toDate()
	fileDate.setHours(0, 0, 0, 0);
	
	if (!fileDate) {
		return "not-today";
	}
	
	// Get today's date (normalized to midnight)
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	
	// Compare dates
	if (fileDate.getTime() === today.getTime()) {
		return "today";
	}
	
	return "not-today";
}

