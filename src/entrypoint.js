// @ts-check
import { countdown, styleMonitor, animateSVG, pascalCase, footerSVG, setVerificationCookie } from './utils.js';

/**
 * @type {Map<string, 'start' | 'reset'>}
 */
const HOVER_EVENTS = new Map([
	['mouseenter', 'start'],
	['focusin', 'start'],
	['focusout', 'reset'],
	['mouseleave', 'reset'],
]);

/**
 * @typedef {'init' | 'step1' | 'step2' | 'final' } State
 */
class EasterEgg {
	/**
	 * @param {State} state
	 */
	constructor(state = 'init', cookieDomain = 'localhost') {
		/**
		 * @todo ensure that this type throws error when it doesn't contain all State types.
		 * @type {State[]}
		 */
		this._states = ['init', 'step1', 'step2', 'final'];
		this._state = state;
		this.state = state;
		this._cookieDomain = cookieDomain;
	}

	/**
	 * @param {State} state
	 */
	set state(state) {
		/**
		 * @type State
		 */
		this._state = state;
		this._update();
	}

	/**
	 * @return {void}
	 */
	nextStep() {
		if (this._nextState) {
			this.state = this._nextState;
		}
		else {
			console.log(`You are current in a final state.`)
		}
	}

	_update() {
		// look for any state functions or state cleanup functions.
		[this._state, `${this._previousState}Cleanup`].forEach(stateCallback => {
			const func = this[`_${stateCallback}`];
			// call any functions assined to that state.
			if (typeof func === 'function') func.bind(this)();
		});
	}

	/**
	 * Inital Step
	 */
	_init() {
		// add an event listener for hovering jobs.
		this._jobsLink = document.querySelector('[data-analytics-text="Jobs"]');
		for (const [event, action] of HOVER_EVENTS) {
			this._jobsLink?.addEventListener(event, this[`_jobsLink${pascalCase(action)}Countdown`].bind(this))
		}
	}

	_initCleanup() {
		// run cleanup on our event listeners
		for (const [event, action] of HOVER_EVENTS) {
			this._jobsLink?.removeEventListener(event, this[`_jobsLink${pascalCase(action)}Countdown`].bind(this))
		}
	}

	_jobsLinkStartCountdown() {
		this._jobsLinkCountdown = countdown(3);
		this._jobsLinkCountdown.promise
			.then(res => {
				this.nextStep();
			})
			.catch(err => console.log(err.message));
	}

	_jobsLinkResetCountdown(e) {
		this._jobsLinkCountdown?.cancel?.apply(undefined, ['Easter Egg Cancelled!']);
	}

	/**
	 * Step 1
	 */
	async _step1() {
		console.log('starting step 1');
		// Start the animation for the hat.
		animateSVG('wiggle');
		// Inject stuff into the source.
		this._renderHintMarkup();
		// Start the watcher for monitoring the color.
		const svg = await footerSVG();
		console.log(svg);
		if (svg) {
			this._styleMonitor = styleMonitor(svg);
			this._styleMonitor.promise.then(() => {
				console.log('styled!')
				this.nextStep();
			}).catch(() => { });
		}
	}

	_step1Cleanup() {
		this._styleMonitor?.cancel?.call(this, 'cleanup');
		console.log('step1 cleanup');
	}

	/**
	 * Step 2
	 */
	_step2() {
		console.log('starting step 2');
		animateSVG('pop');
		setVerificationCookie(this._cookieDomain);
	}

	_final() {
		console.log('entered final state');
	}

	/**
	 * Return what the previous next state is.
	 * @returns {State | undefined}
	 */
	get _previousState() {
		return this._states[this._states.indexOf(this._state) + -1];
	}

	/**
	 * Return what the potential next state will be.
	 * @returns {State | undefined}
	 */
	get _nextState() {
		return this._states[this._states.indexOf(this._state) + 1];
	}

	/**
	 * Injects the hint into the dom.
	 * @return {Promise<void>}
	 */
	async _renderHintMarkup() {
		const svg = await footerSVG();
		const template = `
<!-- Codename: Easter Egg -->
<!-- @todo Fedora should match brand standards. -->
<!-- - Link 1 -->
<!-- - Link 2 -->
		`
		svg?.insertAdjacentHTML('beforebegin', template);
	}
}

// @ts-ignore
const easterEgg = new EasterEgg();
// @ts-ignore
window.easterEgg = easterEgg;