import { MarkdownPostProcessorContext, TFile, Vault } from "obsidian";
import { getDailyStatus } from "./utils/date-parser";
import { createStatusIcon } from "./utils/icon-renderer";

/**
 * Creates a markdown post-processor function that replaces <dailystatus /> tags with icons
 */
export function createDailyStatusProcessor(vault: Vault) {
	return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		const tagRegex = /<dailystatus\s*\/?>/g;
		const file = ctx.sourcePath 
			? vault.getAbstractFileByPath(ctx.sourcePath) 
			: null;
		
		if (!file || !(file instanceof TFile)) {
			return;
		}

		const status = getDailyStatus(file.basename);

		// Process all text content in the element
		const processNode = (node: Node): void => {
			if (node.nodeType === Node.TEXT_NODE) {
				const textNode = node as Text;
				const text = textNode.textContent || "";
				
				if (tagRegex.test(text)) {
					// Reset regex
					tagRegex.lastIndex = 0;
					const parts: (string | HTMLElement)[] = [];
					let lastIndex = 0;
					let match;

					while ((match = tagRegex.exec(text)) !== null) {
						// Add text before match
						if (match.index > lastIndex) {
							parts.push(text.substring(lastIndex, match.index));
						}

						// Add icon element
						parts.push(createStatusIcon(status));

						lastIndex = match.index + match[0].length;
					}

					// Add remaining text
					if (lastIndex < text.length) {
						parts.push(text.substring(lastIndex));
					}

					// Replace text node with fragments
					if (parts.length > 0 && textNode.parentNode) {
						const fragment = document.createDocumentFragment();
						for (const part of parts) {
							if (typeof part === "string") {
								fragment.appendChild(document.createTextNode(part));
							} else {
								fragment.appendChild(part);
							}
						}
						textNode.parentNode.replaceChild(fragment, textNode);
					}
				}
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				// Recursively process child nodes
				const element = node as Element;
				// Create a copy of child nodes array to avoid modification during iteration
				const children = Array.from(element.childNodes);
				for (const child of children) {
					processNode(child);
				}
			}
		};

		// Process all nodes in the element
		const children = Array.from(el.childNodes);
		for (const child of children) {
			processNode(child);
		}
	};
}

