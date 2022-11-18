// @ts-check
// import 'https://unpkg.com/construct-style-sheets-polyfill';
import { readyStateObservable, css } from './utils.js';
import './components/rh-cnee-success-banner.js';

export const styles = new CSSStyleSheet();
styles.replaceSync(css`
	[data-rh-unique-id="2301221"] {
		display: none;
	}

	[data-rh-unique-id="2388201"] {
		min-height: 200px;
	}

  rh-cnee-success-banner {
    transform: translateY(100vh) scale(0);
  }
`);

document.adoptedStyleSheets = [styles]

export class JobsBoard {
  constructor(target = '[data-rh-unique-id="2388201"]', initDelay = 1000) {
    if (localStorage.getItem('easteregg') === 'complete') {
      /**
       * @type {string} Target
       */
      this._target = target;
      /**
       * @type {Element | null | undefined} Banner
       */
      this._banner;
      this._initDelay = initDelay;
      this._init();
    }
  }

  async _init() {
    // inject our styles.
    document.adoptedStyleSheets = [styles];
    await readyStateObservable(state => {
      if (['interactive', 'complete'].includes(state)) {
        this._banner = document.querySelector(this._target);
      }
    }).promise
      .then(() => new Promise(res => setTimeout(res, this._initDelay)));

    if (this._banner) {
      const banner = this._banner;
      const container = this._banner.querySelector('.rh-band-container');
      const main = this._banner.querySelector('.rh-band-main');
      // @ts-ignore
      const mainHeight = getComputedStyle(main).height;

      // Inject the success banner above the content in the banner;
      const template = document.createElement('template');
      template.innerHTML = `<rh-cnee-success-banner></rh-cnee-success-banner>`;
      const successBanner = template.content.cloneNode(true);

      // fade out existing banner to black
      await Promise.all([
        banner.animate([{ backgroundColor: 'black', minHeight: '100vh' }], { duration: 1000, fill: 'forwards' }).finished,
        main.animate([{ transform: 'translateY(100vh)' },], { duration: 2000, fill: 'forwards' }).finished
      ]);

      // Inject new one
      container?.prepend(successBanner);
      const newBanner = container?.querySelector('rh-cnee-success-banner');
      newBanner?.animate([{ transform: 'none' }], { duration: 1000, fill: 'forwards' })
      // get the size of the new banner

      // await bannerAnimation.finished;
      // bannerAnimation.reverse();
    }
  }
}