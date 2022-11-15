// @ts-check
export const ASCII_MESSAGE = `
<!--
RRRRRRRRRRRRRRrr::rr;;rr,,,;:rrrRRRRRRRRRRRRRRRRRR
HHHHHHHHHHHHHh,''''',,'''''''''';:hhhHHHHHHHHHHHHH
RRRRRRRRRRRRr;'''''''''''''''''''''',rrRRRRRRRRRRR
HHHHHHHHHHHH:''''''''''''''''''''''''',hHHHHHHHHHH
RRRRRRRRRRRr'''''''''''''''''''''''''''rRRRRRRRRRR
HHHHHHHHHHh:''''''''''''''''''''''''''',hHHHHHHHHH
RRRRRRrrrRRr:,''''''''''''''''''''''''''rRRRRRRRRR
Hhh;,''';hHHHhh;'''''''''''''''''''''''';hHHHHHHHH
r,'''''',rRRRRRRrr:,'''''''''''''''''''',rRRRRRRRR
,''''''''':hHHHHHHHHhhh:;,,'''''''''''';hHHHHHHHHH
r'''''''''',:rRRRRRRRRRRRRRrrrrrrrrrRRRRRRr,,rrRRR
hh,''''''''''',hhhHHHHHHHHHHHHHHHHHHHHHHHHh''',:hH
RRr:,''''''''''''';rrRRRRRRRRRRRRRRRRRRRr:,''''';r
HHHHhh;'''''''''''''''',;;:hhhhhhhhhhh;,''''''''':
RRRRRRRrr;''''''''''''''''''''''''''''''''''''''':
HHHHHHHHHHhh:,'''''''''''''''''''''''''''''''''';h
RRRRRRRRRRRRRRrrr:,''''''''''''''''''''''''''',rRR
HHHHHHHHHHHHHHHHHHHhhhh:;;,,'''''''''''''',;hhhHHH
RRRRRRRRRRRRRRRRRRRRRRRRRrrrRr:;;,,,,,;;:rrRRRRRRR
Traditionally, the word "source" in "open source" referred to the term "source code." Source code is what computer programmers use to create software. Typically source code is invisible to most users.

At Red Hat, we believe that open source way unlocks the world's potential to share knowledge and build upon each other's discoveries.

Unlock your potential by creating your own "red" hat.

Modify the color of the hat in the footer of the site with the officially Red Hat branded red.
-->
`

/**
 * Countdown timer as an observable.
 *
 * @param {number} timeout - Specified time to resolve the countdown specified in seconds.
 * @param {?(number) => void} callback - Callback that updates on countdown change.
 * @returns {{ cancel?: (string) => void, promise: Promise<void>}}
 */
export function countdown(timeout, callback = null) {
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
    const interval = setInterval(() => {
      index--
      if (!!callback) {
        callback(index);
      }
      if (index <= 0) {
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
  const cname = 'easteregg';
  const cvalue = 'complete';
  const days = 30;
  const dt = new Date();
  dt.setTime(dt.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + dt.toGMTString();
  document.cookie = `${cname}=${cvalue}${expires}; domain=${domain}`
}

export async function shootConfetti() {
  // @ts-ignore
  await import('https://unpkg.com/lit-confetti/dist/esm/index.js?module')
  document.body.insertAdjacentHTML('beforeend', `<lit-confetti gravity="1" count="40"></lit-confetti>`)
}

export async function startEndScreen() {
  // get collapse all body
  const body = document.querySelector('#main-content');
  const footer = document.querySelector('rh-footer');
  const globalFooter = document.querySelector('rh-global-footer');
  // @ts-ignore
  const collapseAnimation = ({ start, end }) => [
    [
      { maxHeight: start },
      { maxHeight: end },
    ],
    {
      duration: 1000,
      fill: 'forwards'
    }
  ];
  // @ts-ignore
  footer?.parentElement?.appendChild(globalFooter);
  globalFooter?.removeAttribute('slot');
  // @ts-ignore
  body?.style.setProperty('overflow', 'hidden');
  // @ts-ignore
  footer?.style.setProperty('overflow', 'hidden');
  // @ts-ignore
  body?.animate(...collapseAnimation({ start: '100vh', end: '0px' }));
  // @ts-ignore
  footer?.animate(...collapseAnimation({ start: '100vh', end: '95px' }));
  // fade out content
}

/**
 * Add a tooltip to an element
 * @param { Element } target
 * @param { string } html
 */
export async function addTooltip(target, html) {
  import('./components/rh-cnee-tooltip.js');
  // @ts-ignore
  const template = document.createElement('template');
  template.innerHTML = `<rh-cnee-tooltip></rh-cnee-tooltip>`;
  // template.innerHTML = `<rh-tooltip></rh-tooltip>`;
  const clone = template.content.cloneNode(true);
  target.parentNode?.appendChild(clone);
  const newEl = target.parentNode?.querySelector('rh-cnee-tooltip');
  newEl?.appendChild(target);
  console.log(newEl);
}
