import { ViewPlugin, Decoration, DecorationSet, EditorView, ViewUpdate, WidgetType } from "@codemirror/view";
import { Range } from "@codemirror/state";
import { getDailyStatus } from "./utils/date-parser";
import { createStatusIcon } from "./utils/icon-renderer";
import { TFile } from "obsidian";

/**
 * Widget class for the status icon
 */
class StatusIconWidget extends WidgetType {
	constructor(private status: "today" | "not-today") {
		super();
	}

	toDOM() {
		return createStatusIcon(this.status);
	}

	ignoreEvent() {
		return false;
	}
}

/**
 * Creates a CodeMirror 6 extension that replaces {{dailystatus}} tags with icons
 */
export function createDailyStatusExtension(
	getCurrentFile: () => TFile | null,
) {
	const tagRegex = /\{\{\s*dailystatus\s*\}\}/g;

	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet) {
					this.decorations = this.buildDecorations(update.view);
				}
			}

			buildDecorations(view: EditorView): DecorationSet {
				const file = getCurrentFile();
				if (!file) {
					return Decoration.none;
				}

				const status = getDailyStatus(file.basename);
				const decorationRanges: Range<Decoration>[] = [];
				const doc = view.state.doc;
				const text = doc.toString();
				const selection = view.state.selection;

				// Find all {{dailystatus}} tags
				let match;
				tagRegex.lastIndex = 0; // Reset regex
				while ((match = tagRegex.exec(text)) !== null) {
					const from = match.index;
					const to = from + match[0].length;
					
					// Check if selection overlaps with this tag range
					let hasSelectionOverlap = false;
					for (const range of selection.ranges) {
						// Check if selection overlaps with tag (cursor is within or selection spans the tag)
						if ((range.from <= to && range.to >= from)) {
							hasSelectionOverlap = true;
							break;
						}
					}
					
					// Only apply decoration if selection doesn't overlap
					if (!hasSelectionOverlap) {
						decorationRanges.push(
							Decoration.replace({
								widget: new StatusIconWidget(status),
							}).range(from, to)
						);
					}
				}

				return Decoration.set(decorationRanges);
			}
		},
		{
			decorations: (v) => v.decorations,
		}
	);
}

