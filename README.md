# asm.js & WebAssembly examples

> Various simple examples of asm.js / WebAssembly. 

## Configure Firefox for WebAssembly (>= 54.0)

Type the url `about:config`, click 'I accept the risk', then change the following configuration flag:

- javascript.options.wasm: true

<img src="https://github.com/rpellerin/webassembly-experiments/blob/master/public/assets/images/ff-wasm-activate.png" alt="Screenshot" width="600" />


## Configure Chrome for WebAssembly (>= 56.0)

Type the url `chrome://flags/`, enable the following flags:

- Experimental Validate asm.js and convert to WebAssembly when valid
- WebAssembly structured cloning support

<img src="https://github.com/rpellerin/webassembly-experiments/blob/master/public/assets/images/chrome-wasm-activate.png" alt="Screenshot" width="700" />


## Run the examples

### 1. Prime numbers

> The code implemented is a function finding the number of prime integers between 2 and N (N is to be given by the user, otherwise a default value of 400,000 is used).

To serve the benchmark:
```bash
$ npm i
$ npm run serve
```

It runs a web server accessible at [http://localhost:8080](http://localhost:8080). On this page, you can find 4 different Javascript benchmarks:

- Plain Javascript
- AMS.js (C function compiled into asm.js)
- WebAssembly (C function compiled into WebAssembly using `emcc`)
- WebAssembly imprecise (C function compiled into WebAssembly using `emcc` and the flag `-s BINARYEN_IMPRECISE=1`)

You can also find a native C version as well for baseline comparison.

#### Results

On a 2015 Macbook Pro (64-bit) running macOS Sierra 10.12.3. For each method tested, we performed 10 tests and calculated the average time run. We took 500,000 as an upper limit number.

| Method                           | Average run time in ms |
| -------------------------------- | ---------------------- |
| Native C                         | 11520.5                |
| Native C optimized               | 9140.9                 |
| Plain JS Firefox                 | 10391.1                |
| asm.js Firefox                   | 8948.4                 |
| WebAssembly (imprecise) Firefox  | 8999.3                 |
| Plain JS Chrome                  | 10541.8                |
| asm.js Chrome                    | 9728.2                 |
| WebAssembly (imprecise) Chrome   | 10298.1                |

#### Example of the program running

In this video, only WebAssembly imprecise was tested.

![Screenshot](https://github.com/rpellerin/webassembly-experiments/blob/master/public/assets/images/screenshot.gif)

#### Build from source

The build process should work fine on any platform with `emscripten`.

##### C program

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

##### ams.js and WebAssembly files

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
$ npm run build-wasm-imprecise
```

They will be output in `build/`, overwriting any previously existing file.

### 2. Identity function

> This test takes an array (size: 3840), initializes it, and calls a C function compiled into ASM.js. This function returns this array. Before the call, the array gets encoded in an `ArrayBuffer` since ASM.js can only deal with numbers. What the C function returns is an offset on the `ArrayBuffer`. From this offset, the array is decoded. Both input and output arrays are equal. In this experiment, we measured the encoding, running and decoding time.

To serve the benchmark:
```bash
$ npm i
$ npm run serve
```

It runs a web server accessible at [http://localhost:8080/automated-tests-saucelabs.html](http://localhost:8080/automated-tests-saucelabs.html).

#### Results

We used the plateform [SauceLabs](https://saucelabs.com/) to run the benchmark on a variety of browsers. The script we used can be found in `scripts/automated-tests-saucelabs.js`. All durations are expressed in milliseconds.

|Browser|Length of array|Number of loops|Plateform|Total encoding time|Total decoding time|Total running time|
|---|---|---|---|---|---|---|
|chrome 56|3840|2160|Windows 10|140.0200000000002|409.9999999999993|14.980000000000473|
|chrome 56|3840|2160|Mac 10.12|402.3300000000154|1066.514999999994|72.46999999999662|
|chrome dev|3840|2160|Windows 10|160.01000000000045|407.9850000000001|4.004999999999654|
|chrome dev|3840|2160|Mac 10.12|258.17000000001417|426.3249999999821|6.260000000000673|
|chrome beta|3840|2160|Windows 10|164.01000000000158|420.00499999999965|13.99499999999989|
|chrome beta|3840|2160|Mac 10.12|144.10999999999672|376.45500000000857|10.329999999994925|
|firefox 45|3840|2160|Linux|135.86999999999694|88.95999999999344|12.260000000009086|
|firefox 51|3840|2160|Windows 10|216.84499999999798|160.7050000000006|38.639999999999645|
|firefox 51|3840|2160|Mac 10.12|189.3450000000007|167.73000000001275|16.729999999990923|
|firefox dev|3840|2160|Windows 10|186.14000000000283|132.95500000000447|36.93499999999881|
|firefox dev|3840|2160|Mac 10.12|280.6199999999933|290.2950000000103|45.80999999999108|
|firefox beta|3840|2160|Windows 10|168.3599999999983|120.86499999999546|25.724999999995816|
|firefox beta|3840|2160|Mac 10.12|179.85500000001093|186.99000000001593|19.054999999988013|

#### Build from source

First follow the instructions given for the first test, above. Then:

```bash
$ npm run build-lodash
```

## License

This software is  maintained with love by [Inovia Team](https://inovia-team.com).
Made in San Francisco.

[MIT](http://vjpr.mit-license.org)
