// @ts-check
/**
 * @typedef {'init' | 'step1' | 'step2' | 'final' } State
 */

/**
 * Promised based countdown timer.
 * @param {number} timeout - Specified time to resolve the countdown specified in seconds.
 * @returns {{ cancel?: (string) => void, promise: Promise<void>}}
 */
function countdown(timeout) {
	const ret = {};
	const signal = new Promise((res, rej) => {
		ret.cancel = (err) => {
			rej(new Error(err));
		}
	});

	/**
	 * @type {Promise<void>}
	 */
	ret.promise = new Promise((res, rej) => {
		let index = timeout;
		console.log('Easter Egg Coundown:', index);
		const interval = setInterval(() => {
			index--
			if (index <= 0) {
				res();
				clearInterval(interval);
			}
			console.log('Easter Egg Coundown:', index);
		}, 1000);

		signal.catch(err => {
			rej(err);
			clearInterval(interval);
		})
	});

	return ret;
}

/**
 * Promised based countdown timer.
 * @param {HTMLElement | SVGSVGElement} el - Specified time to resolve the countdown specified in seconds.
 * @returns {{ cancel?: (string) => void, promise: Promise<void>}}
 */
function styleMonitor(el) {
	const ret = {};
	const signal = new Promise((res, rej) => {
		ret.cancel = (err) => {
			rej(new Error(err));
		}
	});

	/**
	 * @type {Promise<void>}
	 */
	ret.promise = new Promise((res, rej) => {
		console.log('Waiting for color fix.');
		const interval = setInterval(() => {
			const computedStyle = window.getComputedStyle(el);
			// check the correct fill color of the svg
			if (computedStyle.fill === 'rgb(238, 0, 0)') {
				res();
				clearInterval(interval);
			}
		}, 1000);

		signal.catch(err => {
			rej(err);
			clearInterval(interval);
		})
	});

	return ret;
}

function animateSVG(animation) {
	// wait for the footer to become available
	customElements.whenDefined('rh-global-footer')
		.then(async () => {
			const footer = document.querySelector('rh-global-footer');
			// @ts-ignore
			await footer.updateComplete;
			const footerSVG = footer?.shadowRoot?.querySelector('svg');
			if (animation === 'wiggle') {
				footerSVG?.animate(
					[
						{ transform: 'rotate(0)' },
						{ transform: 'rotate(15deg)' },
						{ transform: 'rotate(-11deg)' },
						{ transform: 'rotate(0)' },
						{ transform: 'rotate(8deg)' },
						{ transform: 'rotate(-3deg)' },
						{ transform: 'rotate(0)' },
					],
					{
						duration: 2000,
						easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
					}
				);
			}
			else if (animation === 'pop') {
				footerSVG?.animate(
					[
						{ transform: 'rotate(0)' },
						{ transform: 'translateX(-50%)' },
						{ transform: 'rotate(0)' },
					],
					{
						duration: 1000,
						easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
					}
				);
			}
		});
}

class EasterEgg {
	/**
	 * @param {State} state
	 */
	constructor(state = 'init') {
		/**
		 * @todo ensure that this type throws error when it doesn't contain all State types.
		 * @type State[]
		 */
		this._states = ['init', 'step1', 'step2', 'final'];
		this._state = state;
		this.state = state;
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
		console.log(`State changed to ${this._state} from ${this._previousState}`);
		[this._state, this._previousState].forEach(state => {
			const func = this[`_${state}`];
			// call any functions assined to that state.
			if (typeof func === 'function') func.bind(this)();
		});
	}

	/**
	 * Inital Step
	 */
	_init() {
		if (this._state === 'init') {
			// add an event listener for hovering jobs.
			this._jobsLink = document.querySelector('[data-analytics-text="Jobs"]');
			if (this._jobsLink) {
				this._jobsLink.addEventListener('mouseenter', this._jobsLinkStartCountdown.bind(this));
				this._jobsLink.addEventListener('focusin', this._jobsLinkStartCountdown.bind(this));
				this._jobsLink.addEventListener('mouseleave', this._jobsLinkResetCountdown.bind(this));
				this._jobsLink.addEventListener('focusout', this._jobsLinkResetCountdown.bind(this));
			}
		}
		else {
			// run cleanup
			this._jobsLink?.removeEventListener('mouseenter', this._jobsLinkStartCountdown.bind(this));
			this._jobsLink?.removeEventListener('focusin', this._jobsLinkStartCountdown.bind(this));
			this._jobsLink?.removeEventListener('mouseleave', this._jobsLinkResetCountdown.bind(this));
			this._jobsLink?.removeEventListener('focusout', this._jobsLinkResetCountdown.bind(this));
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
		this._animateSVG('wiggle');
		// Inject stuff into the source.
		this._renderHintMarkup();
		// Start the watcher for monitoring the color.
		const svg = await this._footerSVG;
		if (svg) {
			styleMonitor(svg).promise.then(() => {
				this._animateSVG('pop');
				this.nextStep();
			}).catch(() => { });
		}
	}

	/**
	 * Step 2
	 */
	_step2() {
		console.log('starting step 2');
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
	 * @typedef {'wiggle' | 'pop'} SVGAnimation
	 * @param {SVGAnimation} animation
	 * @return
	 **/
	async _animateSVG(animation) {
		// wait for the footer to become available
		const svg = await this._footerSVG;
		if (animation === 'wiggle') {
			svg?.animate(
				[
					{ transform: 'rotate(0)' },
					{ transform: 'rotate(15deg)' },
					{ transform: 'rotate(-11deg)' },
					{ transform: 'rotate(0)' },
					{ transform: 'rotate(8deg)' },
					{ transform: 'rotate(-3deg)' },
					{ transform: 'rotate(0)' },
				],
				{
					duration: 2000,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				}
			);
		}
		else if (animation === 'pop') {
			svg?.animate(
				[
					{ transform: 'rotate(0)' },
					{ transform: 'translateY(-50%)' },
					{ transform: 'rotate(0)' },
				],
				{
					duration: 1000,
					easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
				}
			);
		}
	}

	/**
	 * Injects the hint into the dom.
	 * @return {Promise<void>}
	 */
	async _renderHintMarkup() {
		const svg = await this._footerSVG;
		const template = `
<!-- Codename: Easter Egg -->
<!-- @todo Fedora should match brand standards. -->
<!-- - Link 1 -->
<!-- - Link 2 -->
		`
		svg?.insertAdjacentHTML('beforebegin', template);
	}

	/**
	 * @return {Promise<HTMLElement | SVGSVGElement | null | undefined>}
	 */
	get _footerSVG() {
		return customElements.whenDefined('rh-global-footer')
			.then(async () => {
				const footer = document.querySelector('rh-global-footer');
				// @ts-ignore
				await footer.updateComplete;
				return footer?.shadowRoot?.querySelector('svg');
			})
	}
}

// @ts-ignore
const easterEgg = new EasterEgg();
// @ts-ignore
window.easterEgg = easterEgg;