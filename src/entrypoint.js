//@ts-check
import { EasterEgg } from './easterEgg.js';
import { JobsBoard } from './jobsBoard.js'

// @ts-ignore
const easterEgg = new EasterEgg();
// @ts-ignore
window.easterEgg = easterEgg;

const pathname = window.location.pathname;
if (pathname === '/en/jobs') {
  const jobsBoard = new JobsBoard();
}