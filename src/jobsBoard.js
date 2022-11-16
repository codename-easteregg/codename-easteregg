// @ts-check
import { readyStateObservable } from './utils.js';

export const styles = new CSSStyleSheet();
styles.replaceSync(`
	[data-rh-unique-id="2301221"] {
		display: none;
	}

	#success {
		background: black;
		: black;
	}
`);

export class JobsBoard {
	constructor(target = '[data-rh-unique-id="2388201"]') {
		/**
		 * @type {string} Target
		 */
		this._target = target;
		/**
		 * @type {Element | null | undefined} Banner
		 */
		this._banner;

		this._init();
	}

	async _init() {
		// inject our styles.
		document.adoptedStyleSheets = [styles];
		await readyStateObservable(state => {
			if (['interactive', 'complete'].includes(state)) {
				this._banner = document.querySelector(this._target);
			}
		});
		if (this._banner) {
			this._banner.animate(
				[
					{ transform: 'none' },
					{ transform: 'translateY(100%)' },
					{ opacity: '0' }
				],
				{
					duration: 1000,
					fill: 'forwards'
				});
			this._banner.innerHTML = `<div id="success"></div>`;
		}
	}
}