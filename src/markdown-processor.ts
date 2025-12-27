import { MarkdownPostProcessorContext, TFile, Vault } from "obsidian";
import { getDailyStatus } from "./utils/date-parser";
import { createStatusIcon } from "./utils/icon-renderer";

/**
 * Creates a markdown post-processor function that replaces {{dailystatus}} tags with icons
 */
export function createDailyStatusProcessor(vault: Vault) {
	return (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
		const tagRegex = /\{\{\s*dailystatus\s*\}\}/gi;
		const file = ctx.sourcePath 
			? vault.getAbstractFileByPath(ctx.sourcePath) 
			: null;
		
		if (!file || !(file instanceof TFile)) {
			return;
		}

		const status = getDailyStatus(file.basename);

		// Search for the tag in all text nodes, including those that might be nested
		const processTextNode = (textNode: Text): void => {
			const text = textNode.textContent || "";
			
			if (!tagRegex.test(text)) {
				return;
			}
			
			tagRegex.lastIndex = 0; // Reset regex
			
			const parts: (string | HTMLElement)[] = [];
			let lastIndex = 0;
			let match;

			while ((match = tagRegex.exec(text)) !== null) {
				// Add text before match
				if (match.index > lastIndex) {
					parts.push(text.substring(lastIndex, match.index));
				}

				// Add icon element (create new one for each occurrence)
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
		};

		// Use a TreeWalker to find all text nodes, excluding those in code blocks
		const walker = document.createTreeWalker(
			el,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: (node) => {
					// Skip nodes inside code blocks or pre elements
					let parent = node.parentElement;
					while (parent && parent !== el) {
						const tagName = parent.tagName;
						if (tagName === 'CODE' || tagName === 'PRE' || 
						    parent.classList.contains('language-') || 
						    parent.closest('pre')) {
							return NodeFilter.FILTER_REJECT;
						}
						parent = parent.parentElement;
					}
					return NodeFilter.FILTER_ACCEPT;
				}
			}
		);

		// Collect all text nodes first, then process them
		// (processing during iteration can cause issues)
		const textNodes: Text[] = [];
		let node: Node | null;
		while ((node = walker.nextNode())) {
			textNodes.push(node as Text);
		}

		// Process each text node
		for (const textNode of textNodes) {
			processTextNode(textNode);
		}
	};
}

