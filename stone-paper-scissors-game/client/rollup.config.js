import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js'
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // extract CSS into a separate file (recommended)
      css: css => {
        css.write('public/bundle.css');
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    // In dev mode, call `serve` to serve the app
    !production && serve({
      open: true,
      contentBase: 'public'
    }),
    // Watch the `public` directory and refresh the browser on changes
    !production && livereload('public'),
    // Minify the bundle in production mode
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};