import { BADGE, css } from '../utils.js';

export const styles = new CSSStyleSheet();
styles.replaceSync(css`
	:host {
		--_badge-size: 200px;
		--_card-width: clamp(100px, 80%, 600px);
		--_card-spacing: clamp(1rem, 5vw, 50px);
		--_max-width: var(--_card-width * .7);
		--_bg-image: ;
		font-family: var(--rh-font-family-body-text, RedHatText, "Red Hat Text", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif);
		font-weight: var(--rh-font-weight-heading-light, 100);
		line-height: var(--rh-line-height-body-text, 1.5);
		font-size: var(--rh-font-size-body-text-md, 16px);
		display: flex;
		flex-direction: column;
		align-items: center;
		background: black;
		width: auto;
		color: white;
		padding: 5vmax;
		background-image: var(--_bg-image);
		background-size: contain;
		background-repeat: no-repeat;
	}

	[part="base"] {
		width: 90%;
		max-width: 650px;
		align-items: center;
    display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding-block-start: 64px;
	}

	[part="title"] {
		font-size: var(--rh-font-size-heading-xl, 52px);
	}

	*:is(h1,h2,h3,h4,h5) {
		font-family: var(--rh-font-family-heading, RedHatDisplay, "Red Hat Display", "Noto Sans Arabic", "Noto Sans Hebrew", "Noto Sans JP", "Noto Sans KR", "Noto Sans Malayalam", "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", Helvetica, Arial, sans-serif);
		font-weight: var(--rh-font-weight-heading-medium, 500);
		line-height: var(--rh-line-height-heading, 1.3);
		margin: 0;
	}

	[part="card"] {
		align-items: center;
    background: #151515;
    display: flex;
    flex-direction: column;
		width: var(--_card-width);
		border-radius: 5px;
		padding: var(--_card-spacing);
		padding-block-start: calc(var(--_badge-size) / 2);
		position: relative;
		z-index: 1;
	}

	[part="badge"] {
		background: white;
		border: 8px solid #E00;
		border-radius: 50%;
		max-width: var(--_badge-size);
		width: 100%;
		display: block;
		animation-name: badgeBounceIn;
		animation-duration: 2s;
		animation-delay: 1s;
		animation-fill-mode: forwards;
		position: relative;
		z-index: 1;
		transform: translateY(100%);
		margin-block-end: calc(var(--_badge-size) / -2);
	}

	[part="badge"] svg {
		display: block;
	}

	[part="description"] {
		font-size: 28px;
		text-align: center;
		max-width: calc(var(--_card-width) * .7);
	}

	.featured {
		font-size: 20px;
	}

	.highlight {
		color: #E00;
		font-weight: 500;
	}

	#placeholder {
		width: 100%;
	}

	[part="form"] {
		--_gap: 16px;
		display: flex;
		flex-direction: column;
		gap: var(--_gap);
		margin-block: 16px;
	}

	input:not([part="submit"]) {
		margin-top: calc(var(--_gap) * -1);
	}

	[part="submit"] {
		display: block;
		width: max-content;
		background: #2a9af3;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 3px;
	}

	[part="disclaimer"] {
		font-size: 13px;
	}

	a {
		color: #2a9af3;
	}

	input {
		padding-block: 6px;
	}

	@keyframes badgeBounceIn {
		0% { transform: translateY(100%); z-index: -1}
		50% { transform: translateY(-100%); z-index: 2 }
		100% { transform: none; z-index: 2;}
	}
`);

export class RhCneeSuccessBanner extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
			<div part="base">
			 	<div part="title"><h2>Excellent job!</h2></div>
			 	<div part="description">You've earned the <br> Red&nbsp;Hat Open Hatter badge!</div>
				<div part="badge">
					${BADGE}
				</div>
				<div part="card">
					<div part="main">
						<p class="featured">Your curious nature has served you well! It is also clear that you have a finley-tuned set of problem solving skills. <span class="highlight">Now let's put those skills to work!</span></p>
						<h3>Claim your badge</h3>
						<p>It is as easy as sharing your email address. Your email is required to claim your unique, digitally authenticated Red&nbps;Hat Open Hatter badge. The email will provide additional details on how to:</p>
						<ul>
							<li>Download your digitally authenticated badge</li>
							<li>Share this accomplishment on Linkedin</li>
							<li>Apply the badge to future job application submissions at Red Hat</li>
							<li>How to practice the Red Hat open source way by contributing to this project.</li>
						</ul>
						<form part="form">
							<label>First name</label>
							<input part="label"/>
							<label>Last name</label>
							<input part="label"/>
							<label>Email address</label>
							<input part="label" required/>
							<input part="submit" type="submit" value="Submit" />
						</form>
						<div part="disclaimer"><p>We promise we won't use your email for anything other than this purpose. Feel free to checkout our <a href="#">privacy statement</a>.</p></div>
					</div>
				</div>
			</div>
		`;
    this.attachShadow({ mode: "open" });
    // @ts-ignore
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.adoptedStyleSheets = [styles]
    this.style.setProperty('--_bg-image', `url(${new URL('../assets/hero-bg-img@2x.png', import.meta.url)})`)
  }
}

customElements.define('rh-cnee-success-banner', RhCneeSuccessBanner);
