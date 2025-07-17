/* global utils */
// eslint-disable-next-line no-unused-vars
function ObfuscatorIO(source, options = {}) {
  const detectPattern = /\b([\w$]+)\s*\(\s*(0x[a-fA-F\d]+|(['"])(?:\\x[a-fA-F\d]{2}|0x[a-fA-F\d]+)\3)\s*\)/g;


  let detectMatch = source.match(detectPattern);

  if (!detectMatch) throw 'Not matched';

  detectMatch = detectMatch.map((i) => i.replace(/\(.+?\)$/, ''));
  detectMatch = detectMatch.filter((i, pos) => detectMatch.indexOf(i) === pos && i !== '');

  if (detectMatch.length === 1) {
    const varIndex = source.search(funcDefinerPattern(detectMatch[0]));
    let { headVar, mainCode } = getHeadVar(varIndex, source);

    if (funcDefinerPattern(detectMatch[0]).test(headVar)) {
      return decode(
        {
          headCode: headVar,
          mainCode,
        },
        options,
        detectPattern,
      );
    }
  }

  return decode(splitMultiVar(detectMatch, source), options, detectPattern);
}

function decode({ headCode, mainCode }, options, detectPattern) {
  headCode = headCode.replace(/\b(const|let)(\s*(?![^_a-zA-Z$])[\w$]*=)/gi, 'var $2');
  if (headCode.trim()) {
    try {
      eval(headCode);
    } catch (e) {
      console.warn('⚠️ Eval failed:', e);
    }
  }

  mainCode = mainCode.split(';');
  mainCode = mainCode.map((piece) => {
    piece = piece.replace(detectPattern, (key) => {
      try {
        const item = eval(key),
          q = utils.strWrap(item);
        return q + utils.escapeRegExp(item, q) + q;
      } catch (e) {
        console.warn('⚠️ Eval failed on key:', key);
        return key;
      }
    });

    if (options.calc) piece = utils.calcHex(piece);
    if (options._unescape) piece = utils._unescape(piece);
    piece = utils.toBool(piece);
    piece = utils.propArr(piece);

    return piece;
  });

  mainCode = mainCode.join(';');

  if (options.strMerge) mainCode = utils.strMerge(mainCode);
  if (options.calc) mainCode = utils.calcNumber(mainCode);
  if (options.methodChain) mainCode = utils.methodChain(mainCode);

  return mainCode;
}

function funcDefinerPattern(key, flags = 'i') {
  return new RegExp('\\b(var|const|let)\\s+' + key + '\\s*=\\s*function\\s*\\(.*?\\)\\s*', flags);
}

function splitMultiVar(detectMatch, source) {
  let keyStore = [];

  for (const key of detectMatch) {
    const { sourceVar, keyVar } = getVarDefiner(key, source);
    source = sourceVar;
    keyStore = keyStore.concat(keyVar);

    const { sourceFunc, keyFunc } = getFuncDefiner(key, source);
    source = sourceFunc;
    keyStore = keyStore.concat(keyFunc);
  }

  if (!keyStore.length) {
    console.warn('⚠️ No decryptor key definitions found — falling back to partial decoding.');
    return {
      headCode: '',
      mainCode: source,
    };
  }

  let bodyVar = '';
  let headVarStore = {};

  for (const obj of keyStore) {
    bodyVar += obj.code;
    const returnIndex = source.search(funcDefinerPattern(obj.return));
    if (returnIndex !== -1) {
      headVarStore[obj.return] = returnIndex;
    }
  }

  if (Object.keys(headVarStore).length === 0) {
    console.warn('⚠️ No function return mappings found — using all collected bodies.');
    return {
      headCode: bodyVar,
      mainCode: source,
    };
  }

  const bestMatch = Object.entries(headVarStore).sort((a, b) => a[1] - b[1])[0][0];
  const { headVar, mainCode } = getHeadVar(headVarStore[bestMatch], source);

  return {
    headCode: headVar + bodyVar,
    mainCode,
  };
}

function getHeadVar(pos, source) {
  let bo = 0,
    bc = 0,
    sourceSize = source.length,
    headVar = '',
    mainCode = '';

  const splitSource = (pos) => {
    headVar = source.slice(0, pos);
    mainCode = source.slice(pos);
  };

  while (pos < sourceSize) {
    if (source.charAt(pos) === '{') bo++;
    if (source.charAt(pos) === '}') bc++;
    if (bc === bo && bo !== 0) {
      splitSource(pos + 2);
      break;
    }
    pos++;
  }

  if (!mainCode) {
    console.warn('⚠️ Could not split head and body — fallback to full source');
    headVar = '';
    mainCode = source;
  }

  return { headVar, mainCode };
}

function getVarDefiner(key, source) {
  const varPattern = '\\b(var|const|let)\\s+' + key + '\\s*=\\s*((?!\\d)[a-z\\d_$]*?)(;|,)';
  const varGroupPattern = new RegExp(varPattern, 'gi');

  let keyVar = [];
  let sourceVar = source;

  try {
    if (varGroupPattern.test(source)) {
      sourceVar = source.replace(varGroupPattern, (m) => {
        const varMatch = m.match(new RegExp(varPattern, 'i'));
        if (!varMatch) return m;

        keyVar.push({
          key,
          return: varMatch[2],
          code: varMatch[0].replace(/,$/, ';'),
        });

        return m.slice(-1) === ';' ? '' : varMatch[1] + ' ';
      });
    }
  } catch (err) {
    console.warn(`⚠️ Error in getVarDefiner for key "${key}":`, err);
  }

  return { sourceVar, keyVar };
}

function getFuncDefiner(key, source) {
  const funcGroupPattern = funcDefinerPattern(key, 'gi');

  let keyFunc = [];
  let sourceFunc = source;

  try {
    while (funcGroupPattern.test(source)) {
      const varIndex = source.search(funcDefinerPattern(key));
      const sourceSize = source.length;

      if (varIndex === -1) break;

      let pos = varIndex,
        bo = 0,
        bc = 0;

      const splitSource = (pos) => {
        sourceFunc = source.slice(0, varIndex) + source.slice(pos);
        const varFunc = source.slice(varIndex, pos);
        const returnMatch = varFunc.match(/return\s+([\w$]+)/i);
        if (!returnMatch) return;

        keyFunc.push({
          key,
          return: returnMatch[1],
          code: varFunc,
        });

        source = sourceFunc;
      };

      while (pos < sourceSize) {
        if (source.charAt(pos) === '{') bo++;
        if (source.charAt(pos) === '}') bc++;
        if (bo !== 0 && bo === bc) {
          splitSource(pos + 1);
          break;
        }
        pos++;
      }
    }
  } catch (err) {
    console.warn(`⚠️ Error in getFuncDefiner for key "${key}":`, err);
  }

  return { sourceFunc, keyFunc };
}
self.ObfuscatorIO = ObfuscatorIO;

