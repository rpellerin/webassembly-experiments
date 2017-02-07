# ASM.js and WebAssembly benchmarks

> Various benchmarks of ASM.js and WebAssembly (with comparison to the original C program). These benchmark use a function which finds the number of prime number between 2 and N (N is to be given by the user, otherwise a default value of 400000 is used).

## Install

```bash
npm i
```

or

```bash
yarn install
```

# Configuration

## Firefox Nightly (>= 54.0a1)

In `about:config`, enable the following flags:

- javascript.options.wasm
- javascript.options.wasm_baselinejit

## Chrome Canary (>= 58.0.3005.2)

In `chrome://flags/`, enable the following flags:

- Experimental Validate Asm.js and convert to WebAssembly when valid
- WebAssembly structured cloning support
- Experimental JavaScript Compilation Pipeline

## Usage

```bash
npm run build-c
npm run build-c-optimized-o3
npm run c-all <number>

npm run build-asm
npm run build-wasm

npm run server
```

The first two commands compile the C program into `build/` (non-optimized and optimized with the -O3 flag).

Then, the third command run the two compiled C program. An optional custom number can be specified (default 400,000).

The forth and fith command build ASM.js and WebAssembly files from the C function.

The last command run a web server accessible at [http://localhost:8080](http://localhost:8080). On this page, you can run three different Javascript benchmarks:

- Plain Javascript (same function as the one in C, but written in plain old Javascript)
- AMS.js (C function compiled into ASM.js)
- WebAssembly (C function compiled into WebAssembly)

This project should work fine on any platform with `gcc`, `node` and running a modern web browser which supports asm.js and WebAssembly.

# Results

We reached these numbers on a 2015 Macbook Pro (64-bit) running macOS Sierra 10.12.3. For each method tested, we performed 10 tests and calculated the average time run.

| Method               | Average run time in ms |
| -------------------- |:-------------:| -----:|
| Native C             | 1236                  |
| Native C optimized   | 1181                  |
| Plain JS Firefox     | 1056                  |
| ASM.js Firefox       | 1056                  |
| WebAssembly Firefox  | 1056                  |
| Plain JS Chrom e     | 1056                  |
| ASM.js Chrome        | 1056                  |
| WebAssembly Chrome   | 1056                  |

TODO: screenshot
![Screenshot](https://github.com/rpellerin/webassembly-experiments/blob/master/public/data/assets/screenshot.gif)

## License

This software is  maintained with love by [Inovia Team](https://inovia-team.com).
Made in San Francisco.

[MIT](http://vjpr.mit-license.org)
