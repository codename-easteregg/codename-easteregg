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

class EasterEgg {
	constructor() {
		/**
		 * @type State
		 */
		this._state = 'init'
		/**
		 * @todo ensure that this type throws error when it doesn't contain all State types.
		 * @type State[]
		 */
		this._states = ['init', 'step1', 'step2', 'final'];
		this.state = this._state;
	}

	/**
	 * @param {State} state
	 */
	set state(state) {
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
		}
	}
	_jobsLinkStartCountdown(e) {
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

	_step1() {
		console.log('starting step 1');
	}
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
}

console.log('hi');
const easterEgg = new EasterEgg();
// @ts-ignore
window.easterEgg = easterEgg;
