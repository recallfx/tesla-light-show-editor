const { serve, build } = require('esbuild');
const fs = require('fs-extra');
const postCssPlugin = require('esbuild-plugin-postcss2');

const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV !== 'production';
const log = (text) => {
  console.log(`\u001b[1;32m${text}\x1b[0m`);
};

/**
 * ESBuild Params
 * @link https://esbuild.github.io/api/#build-api
 */
const buildParams = {
  color: true,
  entryPoints: ['src/index.tsx'],
  loader: { '.ts': 'tsx', '.fseq': 'binary', '.zip': 'binary' },
  plugins: [
    postCssPlugin.default({
      plugins: [tailwindcss, autoprefixer],
    }),
  ],
  outdir: 'dist',
  minify: !isDev,
  format: 'esm',
  target: 'es2020',
  bundle: true,
  sourcemap: true,
  logLevel: 'info',
  incremental: true,
  treeShaking: true,
  metafile: true,
  mainFields: ['module', 'main', 'browser'],
};

(async () => {
  fs.removeSync('dist');
  fs.copySync('public', 'dist');

  let serveResult;

  try {
    await build(buildParams);

    serveResult = await serve(
      {
        servedir: 'dist',
        port: 8181,
      },
      buildParams,
    );

    log(`  ✔︎ Server running on: http://localhost:${serveResult.port}`);
  } catch (error) {
    console.error(error.message);
  }
})();
