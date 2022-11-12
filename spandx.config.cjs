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
`);
        // .replace('</body>', `${generateRhFooterTemplate()}</body>`);

        // res.setHeader('Content-Length', chunk.length);
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

