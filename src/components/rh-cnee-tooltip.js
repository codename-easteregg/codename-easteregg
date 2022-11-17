import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/components/tooltip/tooltip.js';

export const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
	sl-tooltip {
		--sl-tooltip-background-color: white;
		--sl-tooltip-font-size: var(--rh-font-size-body-text-md, 1em);
		--sl-tooltip-color: #131313;
		--sl-tooltip-arrow-size: 8px;
		--sl-tooltip-border-radius: none;
		--sl-tooltip-padding: var(--rh-space-lg, 16px);
		--max-width: 300px;
    line-height: 1.6;
	}

	sl-tooltip::part(body) {
		pointer-events: all;
	}
`);

/**
 * Supports Code name easter egg. Using shoelace components.
 */
class RhCneeTooltip extends HTMLElement {
  constructor() {
    super();
    const template = `<sl-tooltip placement="right" trigger="click" distance="16">
			<div slot="content">Inspect <a href="https://blog.hubspot.com/website/how-to-inspect" target="_blank">the source</a> of our open-source way.</div>
			<slot clicktrap></slot>
		</sl-tooltip>
		`;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = template;
    // /**
    //  * Get adopt the document's reset styles
    //  * @type {[CSSStyleSheet]}
    //  */
    // const resetStyles = [...document.styleSheets]
    //   .filter(i => i?.href?.includes('reset.css'))
    //   .map(async i => await fetch(i.href).then(res => res.text()))
    //   .map(i => {
    //     const sheet = new CSSStyleSheet();
    //     sheet.replaceSync(i);
    //     return sheet;
    //   })
    this.shadowRoot.adoptedStyleSheets = [stylesheet];
    this.addEventListener('click', this._clickHander);
  }

  _clickHander(e) {
    let path = e.composedPath();
    // split at this parent
    path = path.slice(0, path.findIndex(i => i === this));
    const isTrappable = path.some(i => !!i.hasAttribute('clicktrap'));
    if (isTrappable) {
      e.preventDefault();
    }
  }
}

customElements.define('rh-cnee-tooltip', RhCneeTooltip);