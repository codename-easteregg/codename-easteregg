// @ts-check
import { BADGE, css } from '../utils.js';

export const styles = new CSSStyleSheet();
styles.replaceSync(css`
	:host {
		text-align: center;
	}

	pfe-modal {
		--pfe-modal-width: calc(100vw - var(--rh-space-2xl, 32px));
		width: var(--pfe-modal-width);
	}

	[part="title"] *:is(h1,h2,h3,h4,h5) {
		font-family: var(--rh-font-family-heading, RedHatDisplay, "Red Hat Display", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif);
		font-weight: var(--rh-font-weight-heading-medium, 500);
		line-height: var(--rh-line-height-heading, 1.3);
		font-size: 28px;
	}

	[part="icon"] {
		width: 230px;
		margin-bottom: -50px;
	}
`);

export const pfeModalStyles = new CSSStyleSheet();
pfeModalStyles.replaceSync(`
	.pfe-modal__window {
		width: var(--pfe-modal-width);
		height: calc(100vw - var(--rh-space-2xl, 32px));
		display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    place-items: center;
    place-content: center;
	}

	.pfe-modal__container {
		display: contents;
	}

	.pfe-modal__content {
		padding-block-start: 5vw;
		padding-block-end: 5vw;
		display: flex;
	}
`);

export class RhCneePopup extends HTMLElement {
	constructor() {
		super();
		const template = document.createElement('template');
		template.innerHTML = `
			<pfe-modal>
				<div part="container">
				 	${BADGE}
					<div part="title"><h2>Success!</h2></div>
					<div part="content">
						<p>You've unlocked a secret page.</p>
					</div>
					<pfe-cta>
						<a href="/en/jobs">Proceed to open opportunities</a>
					</pfe-cta>
				</container>
			</pfe-modal>
		`;
		this.attachShadow({ mode: "open" });
		// @ts-ignore
		this.shadowRoot.appendChild(template.content.cloneNode(true));
		// @ts-ignore
		this.shadowRoot.adoptedStyleSheets = [styles];
		const pfeModalShadowroot = this.shadowRoot?.querySelector('pfe-modal')?.shadowRoot;
		if (pfeModalShadowroot) {
			pfeModalShadowroot.adoptedStyleSheets = [pfeModalStyles];
		}
	}

	connectedCallback() {
		// @ts-ignore
		this.shadowRoot.querySelector(`pfe-modal`)?.open();
	}
}
window.customElements.define('rh-cnee-popup', RhCneePopup);