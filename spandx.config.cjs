const fs = require('fs');
const path = require('path');
const { cwd } = require('process');

/**
 * @param {import('node:http').ClientRequest} _req
 * @param {import('node:http').ServerResponse} res
 * @param {() => void} next
 */
async function injectLocalSources(_req, res, next) {
  try {
    const { write: origWrite } = res;

    res.write = function (chunk, ...rest) {
      if (res.getHeader('Content-Type').includes('text/html')) {
        if (chunk instanceof Buffer) {
          chunk = chunk.toString();
        }
        chunk = chunk
          .replace('</head>', `
<link href="/src/lightdom.css" rel="stylesheet">
<script type="module" src="/src/entrypoint.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/themes/light.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.83/dist/shoelace.js"></script>
`);
      }
      origWrite.apply(this, [chunk, ...rest]);
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  } finally {
    next();
  }
}

module.exports = {
  host: {
    local: 'localhost',
  },
  port: 'auto',
  open: !true,
  startPath: '/',
  verbose: false,
  routes: {
    '/node_modules/': './node_modules/',
    '/en/node_modules/': './node_modules/',
    '/en/src/': './src/',
    '/en': {
      host: 'https://www.redhat.com'
    },
    '/': {
      host: 'https://www.redhat.com'
    },
  },
  bs: {
    proxy: {
      target: 'https://redhat.com/',
      middleware: [
        injectLocalSources,
      ],
    },
  },
};

