/**
 * @name  JavaScript Deobfuscator Worker
 * @description  Worker for decoding various JS obfuscation formats
 * @author  Cqmbo__
 * @version  1.0.0
 * @license  MIT
 */

/* globals EvalDecode, ArrayDecode, _NumberDecode, JSFuckDecode, ObfuscatorIO, CleanSource, AADecode, JJdecode, Urlencoded, P_A_C_K_E_R, JavascriptObfuscator, MyObfuscate, Wise_EvalDecode, Wise_FunctionalDecode, acorn, acornWalk, astring */
/* eslint-disable no-console */

self.addEventListener('message', (e) => {
  const base = 'https://Cqmbo1.github.io/assets/deobfuscate/';
  self.importScripts(base + 'third_party/mathjs/math.min.js');
  self.importScripts(base + 'lib/utils.js');

  let source = e.data.source;
  const packer = e.data.packer;
  const options = e.data.options;

  const methods = {
    evalencode: () => {
      self.importScripts(base + 'lib/evaldecode.js');
      return EvalDecode(source);
    },
    _numberencode: () => {
      self.importScripts(base + 'lib/numberdecode.js');
      return _NumberDecode(source);
    },
    arrayencode: () => {
      self.importScripts(base + 'lib/arraydecode.js');
      return ArrayDecode(source, options);
    },
    jsfuck: () => {
      self.importScripts(base + 'lib/jsfuckdecode.js');
      return JSFuckDecode(source);
    },
obfuscatorio: () => {
  try {
self.importScripts(
  'https://unpkg.com/acorn@8.10.0/dist/acorn.js',
  'https://cqmbo1.github.io/assets/deobfuscate/acorn-walk.umd.min.js',
  'https://unpkg.com/astring@1.8.6/dist/astring.min.js',
  'https://cqmbo1.github.io/assets/deobfuscate/lib/obfuscatorio.js' // ✅ full path
);

    console.log("ObfuscatorIO:", typeof ObfuscatorIO);
    if (typeof ObfuscatorIO !== 'function') {
      throw new Error("ObfuscatorIO not loaded correctly");
    }
    return ObfuscatorIO(source, options);
  } catch (err) {
    console.error("Failed to run ObfuscatorIO:", err);
    throw err;
  }
},
cleansource: () => {
      self.importScripts(base + 'lib/cleansource.js');
      return CleanSource(source, options);
    },
    aaencode: () => {
      self.importScripts(base + 'third_party/cat-in-136/aadecode.js');
      return AADecode.decode(source);
    },
    jjencode: () => {
      self.importScripts(base + 'third_party/decoder-jjencode/jjdecode.js');
      return JJdecode.decode(source);
    },
    urlencode: () => {
      self.importScripts(base + 'third_party/js-beautify/unpackers/urlencode_unpacker.js');
      if (Urlencoded.detect(source)) return Urlencoded.unpack(source);
      throw 'Not matched';
    },
    p_a_c_k_e_r: () => {
      self.importScripts(base + 'third_party/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js');
      if (P_A_C_K_E_R.detect(source)) return P_A_C_K_E_R.unpack(source);
      throw 'Not matched';
    },
    javascriptobfuscator: () => {
      self.importScripts(base + 'third_party/js-beautify/unpackers/javascriptobfuscator_unpacker.js');
      if (JavascriptObfuscator.detect(source)) return JavascriptObfuscator.unpack(source);
      throw 'Not matched';
    },
    myobfuscate: () => {
      self.importScripts(base + 'third_party/js-beautify/unpackers/myobfuscate_unpacker.js');
      if (MyObfuscate.detect(source)) return MyObfuscate.unpack(source);
      throw 'Not matched';
    },
    wiseeval: () => {
      self.importScripts(base + 'third_party/NotSoWise/unpacker.js');
      return Wise_EvalDecode(source);
    },
    wisefunction: () => {
      self.importScripts(base + 'third_party/NotSoWise/unpacker.js');
      return Wise_FunctionalDecode(source);
    },
  };
console.log(methods[packer])
  if (typeof methods[packer] !== 'function') {
  console.error("decode called with packer:", packer);

    throw new Error(`Unsupported packer: ${packer}`);
}


  try {
    source = methods[packer]();
  } catch (err) {
    throw new Error(err);
  }

  self.postMessage(source);
});