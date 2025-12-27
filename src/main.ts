import { Plugin } from 'obsidian';
import { createDailyStatusExtension } from "./editor-extension";
import { createDailyStatusProcessor } from "./markdown-processor";

export default class DailyStatusPlugin extends Plugin {

	async onload() {
		// Register editor extension for edit mode
		this.registerEditorExtension(
			createDailyStatusExtension(
				() => this.app.workspace.getActiveFile()
			)
		);

		// Register markdown post-processor for reading mode
		this.registerMarkdownPostProcessor(
			createDailyStatusProcessor(this.app.vault)
		);
	}

	onunload() {
	}

	async loadSettings() {
	}

	async saveSettings() {
	}
}
