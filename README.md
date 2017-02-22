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
|chrome 56|3840|2160|Windows 10|143.93|384.08|11.99|
|chrome 56|3840|2160|Mac 10.12|227.12|734.56|16.75|
|chrome dev|3840|2160|Windows 10|168.01|374.99|8.99|
|chrome dev|3840|2160|Mac 10.12|173.15|506.39|6.03|
|chrome beta|3840|2160|Windows 10|162.98|388.03|11.99|
|chrome beta|3840|2160|Mac 10.12|138.56|363.33|34.54|
|firefox 45|3840|2160|Linux|130.16|95.23|12.19|
|firefox 51|3840|2160|Windows 10|156.73|117.28|20.8|
|firefox 51|3840|2160|Mac 10.12|282.26|295.76|20.13|
|firefox dev|3840|2160|Windows 10|167.73|117.14|28.07|
|firefox dev|3840|2160|Mac 10.12|206.24|171.75|23.6|
|firefox beta|3840|2160|Windows 10|171.69|117.27|21.23|
|firefox beta|3840|2160|Mac 10.12|170.97|175.65|11.44|

#### Build from source

First follow the instructions given for the first test, above. Then:

```bash
$ npm run build-lodash
```

## License

This software is  maintained with love by [Inovia Team](https://inovia-team.com).
Made in San Francisco.

[MIT](http://vjpr.mit-license.org)
