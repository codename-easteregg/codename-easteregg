// @ts-check
import { showEndscreenModal, countdown, styleMonitor, animateSVG, footerSVG, setVerificationCookie, addTooltip, ASCII_MESSAGE } from './utils.js';

/**
 * @type {Map<string, 'start' | 'reset'>}
 */
const HOVER_EVENTS = new Map([
	['mouseenter', 'start'],
	['focusin', 'start'],
]);

/**
 * @typedef {'init' | 'step1' | 'final' } State
 */
export class EasterEgg {
	/**
	 * @param {State} state
	 */
	constructor(state = 'init', cookieDomain = 'localhost') {
		/**
		 * @todo ensure that this type throws error when it doesn't contain all State types.
		 * @type {State[]}
		 */
		this._states = ['init', 'step1', 'final'];
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
		if (this._jobsLink) {
			this._jobsLink.addEventListener('mouseenter', this._jobsLinkStartCountdown.bind(this));
			this._jobsLink.addEventListener('focusin', this._jobsLinkStartCountdown.bind(this));
		}
	}

	_initCleanup() {
		// run cleanup on our event listeners
		console.log('cleaning up events')
		if (this._jobsLink) {
			/**@todo these events aren't being cleaned up */
			this._jobsLink.removeEventListener('mouseenter', this._jobsLinkStartCountdown.bind(this));
			this._jobsLink.removeEventListener('focusin', this._jobsLinkStartCountdown.bind(this));
		}
	}

	_jobsLinkStartCountdown() {
		animateSVG('wiggle');
		if (this._state === 'init') {
			this.nextStep();
		}
	}

	/**
	 * Step 1
	 */
	async _step1() {
		console.log('starting step 1');
		const svg = await footerSVG();
		if (svg) {
			// add tooltip
			addTooltip(svg, '');
			// Inject stuff into the source.
			this._renderHintMarkup();
			// Start the watcher for monitoring the color.
			this._styleMonitor = styleMonitor(svg);
			this._styleMonitor.promise.then(() => {
				console.log('styled!')
				if (this._state === 'step1') {
					this.nextStep();
				}
			}).catch(() => { });
		}
	}

	_step1Cleanup() {
		this._styleMonitor?.cancel?.call(this, 'cleanup');
		console.log('step1 cleanup');
	}

	async _final() {
		console.log('entered final state');
		localStorage.setItem('easteregg', 'complete');
		setVerificationCookie(this._cookieDomain);
		await animateSVG('pop');
		await countdown(2).promise;
		showEndscreenModal();
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
		svg?.insertAdjacentHTML('beforebegin', ASCII_MESSAGE);
	}
}