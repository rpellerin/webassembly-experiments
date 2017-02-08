# asm.js & WebAssembly examples

> Various simple examples of asm.js / WebAssembly. The code implemented is a function finding the number of prime integers between 2 and N (N is to be given by the user, otherwise a default value of 400,000 is used).

## Configure Firefox for WebAssembly (>= 54.0)

Type the url `about:config`, click 'I accept the risk', then change the two following configuration flags:

- javascript.options.wasm: true
- javascript.options.wasm_baselinejit: true

<img src="https://github.com/rpellerin/webassembly-experiments/blob/master/public/ff-wasm-activate.png" alt="Screenshot" width="600" />


## Configure Chrome for WebAssembly (>= 56.0)

Type the url `chrome://flags/`, enable the following flags:

- Experimental Validate asm.js and convert to WebAssembly when valid
- WebAssembly structured cloning support
- Experimental JavaScript Compilation Pipeline

<img src="https://github.com/rpellerin/webassembly-experiments/blob/master/public/chrome-wasm-activate.png" alt="Screenshot" width="700" />


## Run the examples

To serve the benchmark:
```bash
$ npm i
$ npm run serve
```


It runs a web server accessible at [http://localhost:8080](http://localhost:8080). On this page, you can find 3 different Javascript benchmarks:

- Plain Javascript
- AMS.js (C function compiled into asm.js)
- WebAssembly (C function compiled into WebAssembly)


You can also find a native C version as well for baseline comparison.

## Results

On a 2015 Macbook Pro (64-bit) running macOS Sierra 10.12.3. For each method tested, we performed 10 tests and calculated the average time run.

| Method               | Average run time in ms |
| -------------------- |:-------------:| -----:|
| Native C             | 1236                  |
| Native C optimized   | 1181                  |
| Plain JS Firefox     | 1056                  |
| asm.js Firefox       | 1056                  |
| WebAssembly Firefox  | 1056                  |
| Plain JS Chrome     | 1056                  |
| asm.js Chrome        | 1056                  |
| WebAssembly Chrome   | 1056                  |

TODO: screenshot
![Screenshot](https://github.com/rpellerin/webassembly-experiments/blob/master/public/data/assets/screenshot.gif)

## Build from source

The build process should work fine on any platform with `emscripten`.

### C program

To build the C program:

```bash
$ npm run build-c
$ npm run build-c-o3
```

Those two commands compile the C program into `build/` (non-optimized and optimized with the -O3 flag).

To execute both C / native examples:

```bash
$ npm run c <number>
$ npm run c-o3 <number>
```

`<number>` is optional. Default value is 400,000.

### ams.js and WebAssembly files

To build ams.js and WebAssembly files, first install `emscripten`:

```bash
$ git clone https://github.com/juj/emsdk.git
$ cd emsdk
$ ./emsdk install sdk-incoming-64bit binaryen-master-64bit
$ ./emsdk activate sdk-incoming-64bit binaryen-master-64bit
$ source ./emsdk_env.sh
```

Then, build the actual files:

```bash
$ npm run build-asm
$ npm run build-wasm
```

They will be output in `build/`, overwriting any previously existing file.

## License

This software is  maintained with love by [Inovia Team](https://inovia-team.com).
Made in San Francisco.

[MIT](http://vjpr.mit-license.org)
