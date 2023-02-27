import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: "json" };

export default [
  // browser-friendly
  {
    input: 'src/index.ts',
    output: {
      sourcemap: true,
      name: pkg.name,
      file: pkg.browser,
      // format: 'umd',
      interop: "auto"
    },
    plugins: [
      typescript({ 
        outputToFilesystem: false,
        tsconfig: './tsconfig.json' 
      }), // so Rollup can convert TypeScript to JavaScript
      json(),
    ],
    external: Object.keys(pkg.peerDependencies),
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.peerDependencies),
    plugins: [
      typescript({ 
        tsconfig: './tsconfig.json' 
      }), // so Rollup can convert TypeScript to JavaScript
      json(),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ]
  },
  // Type definitions
  {
    input: './dist/dts/index.d.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es'
      }],
    plugins: [dts()],
  }
];