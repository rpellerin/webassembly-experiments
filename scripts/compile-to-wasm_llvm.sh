#!/bin/sh

# Requires llvm and clang installed with WebAssembly support
# svn co http://llvm.org/svn/llvm-project/llvm/trunk llvm
# svn co http://llvm.org/svn/llvm-project/cfe/trunk llvm/tools/clang
# svn co http://llvm.org/svn/llvm-project/clang-tools-extra/trunk llvm/tools/clang/tools/extra
# svn co http://llvm.org/svn/llvm-project/compiler-rt/trunk llvm/projects/compiler-rt
# svn co http://llvm.org/svn/llvm-project/libcxx/trunk llvm/projects/libcxx
# mkdir llvm-install && cd llvm-install && INSTALLDIR=`pwd` && cd ..
# mkdir llvm-build && cd llvm-build
# cmake -G "Unix Makefiles" -DCMAKE_INSTALL_PREFIX=$INSTALLDIR -DLLVM_EXPERIMENTAL_TARGETS_TO_BUILD=WebAssembly -DCMAKE_BUILD_TYPE=Debug ../llvm
# make -j 8 && make install

# Helpful resources about Emscripten:
# - Using WebAssembly in LLVM: https://gist.github.com/yurydelendik/4eeff8248aeb14ce763e
# - LLVM Backend (“Fastcomp”): https://kripken.github.io/emscripten-site/docs/building_from_source/LLVM-Backend.html
# - Manually building Fastcomp from source: https://kripken.github.io/emscripten-site/docs/building_from_source/building_fastcomp_manually_from_source.html#llvm-update-compiler-configuration-file

if [ -z "$LLVM_ROOT" ] || [ -z "$BINARYEN_ROOT" ]; then
    echo 'Please set $LLVM_ROOT and $BINARYEN_ROOT correctly.'
    exit 1
fi

$LLVM_ROOT/clang -emit-llvm --target=wasm32 -O3 "$1" -c -o "$1.bc"
$LLVM_ROOT/llc -asm-verbose=false -o "$1.s" "$1.bc"
$BINARYEN_ROOT/bin/s2wasm "$1.s" > "$1.wast"
$BINARYEN_ROOT/bin/wasm-as "$1.wast" -o "$1.wasm"
