// @ts-check

/**
 * Cancellable promised based countdown timer.
 * @param {number} timeout - Specified time to resolve the countdown specified in seconds.
 * @returns {{ cancel?: (string) => void, promise: Promise<void>}}
 */
export function countdown(timeout) {
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
export function styleMonitor(el) {
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

/**
 * @return {Promise<SVGSVGElement | null | undefined>}
 */
export function footerSVG() {
	return customElements.whenDefined('rh-global-footer')
		.then(async () => {
			const footer = document.querySelector('rh-global-footer');
			// @ts-ignore
			await footer.updateComplete;
			return footer?.shadowRoot?.querySelector('svg');
		})
}

/**
 *
 * @param {'wiggle' | 'pop'} animation
 */
export async function animateSVG(animation) {
	// wait for the footer to become available
	const svg = await footerSVG();
	if (animation === 'wiggle') {
		return svg?.animate(
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
		return svg?.animate(
			[
				{ transform: 'none' },
				{ transform: 'translateY(-50%)' },
				{ transform: 'none' },
			],
			{
				duration: 1000,
				easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
			}
		);
	}
}

/**
 * Convert string to pascal case
 * @param {string} string
 * @return {string}
 */
export function pascalCase(string) {
	return string.replace(/(\w)(\w*)/g,
		function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}

/**
 * @param {string} domain
 */
export function setVerificationCookie(domain = 'localhost') {
	console.log(domain);
	const cname = 'easteregg';
	const cvalue = 'complete';
	const days = 30;
	const dt = new Date();
	dt.setTime(dt.getTime() + (days * 24 * 60 * 60 * 1000));
	const expires = "; expires=" + dt.toGMTString();
	document.cookie = `${cname}=${cvalue}${expires}; domain=${domain}`
}