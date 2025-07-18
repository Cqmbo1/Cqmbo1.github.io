/* global utils, acorn, acornWalk, astring */
function ObfuscatorIO(source, options = {}) {
  const detectPattern = /\b([\w$]+)\s*\(\s*(?:(['"])(0x[a-fA-F\d]+|\\x(?:[a-fA-F\d]{2}\\?)*)\2|0x[a-fA-F\d]+)(?:\s*,\s*(['"]).+?\4)?\s*\)/g;

  let detectMatch = source.match(detectPattern);
  if (!detectMatch) throw 'Not matched';

  detectMatch = detectMatch.map((i) => i.replace(/\(.+?\)$/, ''));
  detectMatch = detectMatch.filter((i, pos) => detectMatch.indexOf(i) === pos && i !== '');

  return decode(splitMultiVar(detectMatch, source), options, detectMatch);
}

function evaluateNumberExpressions(ast, options) {
  acornWalk.simple(ast, {
    UnaryExpression(node) {
      if (node.operator !== '-' || node.argument.type !== 'Literal' || typeof node.argument.value !== 'number') return;
      console.log('Evaluating unary expression:', astring.generate(node));
      node.type = 'Literal';
      node.value = -node.argument.value;
      node.raw = String(-node.argument.value);
    },
    BinaryExpression(node) {
      if (!['+', '-', '/', '%', '*', '**', '&', '|', '>>', '>>>', '<<', '^'].includes(node.operator)) return;
      if (node.left.type !== 'Literal' || node.right.type !== 'Literal') return;
      if (typeof node.left.value !== 'number' || typeof node.right.value !== 'number') return;
      try {
        console.log('Evaluating binary expression:', astring.generate(node));
        const value = eval(`${node.left.value} ${node.operator} ${node.right.value}`);
        if (typeof value !== 'number' || !Number.isFinite(value)) return;
        if (node.operator === '/' && !Number.isInteger(value)) return;
        node.type = 'Literal';
        node.value = value;
        node.raw = String(value);
      } catch (e) {
        console.warn('⚠️ Failed to evaluate binary expression:', astring.generate(node), e);
      }
    },
  });
}

function mangleIdentifiers(ast, options) {
  const usedNames = new Set();
  let uidCounter = 0;

  function generateUid(prefix) {
    let newName;
    do {
      newName = `${prefix}${uidCounter++}`;
    } while (usedNames.has(newName) || isReservedWord(newName));
    usedNames.add(newName);
    return newName;
  }

  function isReservedWord(name) {
    const reserved = ['var', 'let', 'const', 'function', 'return', 'if', 'else', 'for', 'while', 'break', 'continue', 'true', 'false', 'null', 'undefined'];
    return reserved.includes(name);
  }

  function titleCase(str) {
    return str
      .replace(/(?:^|\s)([a-z])/g, (_, m) => m.toUpperCase())
      .replace(/[^a-zA-Z0-9$_]/g, '');
  }

  function inferName(node, scope) {
    if (node.type === 'Identifier' && node.parent && node.parent.type === 'VariableDeclarator') {
      const init = node.parent.init;
      if (init && init.type === 'ArrayExpression') {
        return generateUid('A');
      } else if (init && init.type === 'FunctionExpression') {
        return generateUid('f');
      } else {
        return generateUid('v');
      }
    } else if (node.type === 'Identifier' && node.parent && (node.parent.type === 'FunctionDeclaration' || node.parent.type === 'FunctionExpression')) {
      return generateUid('f');
    } else if (node.type === 'Identifier' && node.key === 'params') {
      return generateUid('p');
    } else if (node.type === 'Identifier' && node.parent && node.parent.type === 'CatchClause') {
      return generateUid('e');
    } else {
      return generateUid('v');
    }
  }

  const bindings = new Map();
  acornWalk.ancestor(ast, {
    VariableDeclarator(node, ancestors) {
      if (node.id.type === 'Identifier') {
        const scope = ancestors[ancestors.length - 2];
        bindings.set(node.id.name, { node: node.id, scope });
      }
    },
    FunctionDeclaration(node, ancestors) {
      if (node.id) {
        const scope = ancestors[ancestors.length - 2];
        bindings.set(node.id.name, { node: node.id, scope });
      }
      node.params.forEach(param => {
        if (param.type === 'Identifier') {
          bindings.set(param.name, { node: param, scope: node });
        }
      });
    },
    FunctionExpression(node, ancestors) {
      if (node.id) {
        const scope = ancestors[ancestors.length - 2];
        bindings.set(node.id.name, { node: node.id, scope });
      }
      node.params.forEach(param => {
        if (param.type === 'Identifier') {
          bindings.set(param.name, { node: param, scope: node });
        }
      });
    },
  });

  for (const [name, { node, scope }] of bindings) {
    if (isReservedWord(name)) continue;
    let isExported = false;
    acornWalk.simple(ast, {
      ExportNamedDeclaration(n) {
        if (n.declaration && n.declaration.id && n.declaration.id.name === name) {
          isExported = true;
        }
      },
      Property(n) {
        if (n.key && n.key.type === 'Identifier' && n.key.name === name) {
          isExported = true;
        }
      },
    });
    if (isExported) continue;

    const newName = inferName(node, scope);
    console.log(`Mangling ${name} to ${newName}`);
    bindings.set(name, { node, scope, newName });

    acornWalk.ancestor(ast, {
      Identifier(n, ancestors) {
        if (n.name !== name) return;
        if (ancestors.some(a => a.type === 'Property' && a.key === n)) return;
        n.name = newName;
      },
    });
  }
}

function simplifyComputedProperties(ast, options, lookupMap) {
  function isIdentifierName(str) {
    return /^[a-zA-Z_$][\w$]*$/.test(str);
  }

  acornWalk.simple(ast, {
    MemberExpression(node) {
      if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string' && isIdentifierName(node.property.value)) {
        console.log('Simplifying computed property:', node.property.value);
        node.computed = false;
        node.property = { type: 'Identifier', name: node.property.value };
      } else if (node.computed && node.property.type === 'CallExpression' && lookupMap[node.property.callee.name]) {
        try {
          const arg = node.property.arguments[0];
          const index = arg.type === 'Literal' ? arg.value : parseInt(astring.generate(arg), 10);
          const resolved = lookupMap[node.property.callee.name](index);
          if (typeof resolved === 'string' && isIdentifierName(resolved)) {
            console.log('Simplifying computed property via lookup:', resolved);
            node.computed = false;
            node.property = { type: 'Identifier', name: resolved };
          }
        } catch (e) {
          console.warn('⚠️ Failed to resolve computed property:', astring.generate(node.property), e);
        }
      }
    },
  });
}

function convertBlockStatements(ast, options) {
  acornWalk.simple(ast, {
    IfStatement(node) {
      if (node.consequent.type !== 'BlockStatement' && node.consequent.type !== 'EmptyStatement') {
        console.log('Wrapping if consequent in block:', astring.generate(node.consequent));
        node.consequent = { type: 'BlockStatement', body: [node.consequent] };
      }
      if (node.alternate && node.alternate.type !== 'BlockStatement' && node.alternate.type !== 'EmptyStatement') {
        console.log('Wrapping if alternate in block:', astring.generate(node.alternate));
        node.alternate = { type: 'BlockStatement', body: [node.alternate] };
      }
    },
    WhileStatement(node) {
      if (node.body.type !== 'BlockStatement' && node.body.type !== 'EmptyStatement') {
        console.log('Wrapping while body in block:', astring.generate(node.body));
        node.body = { type: 'BlockStatement', body: [node.body] };
      }
    },
  });
}

function decode({ headCode, mainCode }, options, detectMatch) {
  headCode = headCode.replace(/\b(const|let)(\s*(?![^_a-zA-Z$])[\w$]*=)/gi, 'var $2');
  let lookupMap = {};
  let arrayValues = [];

  // Parse headCode to extract array and build lookupMap
  try {
    const headAst = acorn.parse(headCode, { ecmaVersion: 'latest', sourceType: 'script' });
    acornWalk.simple(headAst, {
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' && node.init && node.init.type === 'ArrayExpression') {
          arrayValues = node.init.elements.map(el => el.type === 'Literal' ? el.value : null);
        }
      },
      AssignmentExpression(node) {
        if (node.left.type === 'Identifier' && node.right.type === 'FunctionExpression') {
          const returnStmt = node.right.body.body.find(stmt => stmt.type === 'ReturnStatement');
          if (returnStmt && returnStmt.argument && returnStmt.argument.type === 'Identifier') {
            lookupMap[node.left.name] = index => arrayValues[index - 264] || null;
          }
        }
      },
      FunctionDeclaration(node) {
        if (node.id && node.body.body.some(stmt => stmt.type === 'ReturnStatement' && stmt.argument && stmt.argument.type === 'Identifier')) {
          lookupMap[node.id.name] = index => arrayValues[index - 264] || null;
        }
      },
    });

    // Evaluate headCode in a controlled scope
    const evalScope = {};
    (function() {
      eval(headCode);
      detectMatch.forEach(key => {
        if (typeof this[key] === 'function') {
          lookupMap[key] = this[key];
        }
      });
    }).call(evalScope);
    console.log('lookupMap:', Object.keys(lookupMap));
  } catch (e) {
    console.warn('⚠️ Eval failed for headCode:', e);
  }

  // Parse mainCode
  let ast;
  try {
    ast = acorn.parse(mainCode, { ecmaVersion: 'latest', sourceType: 'script' });
  } catch (e) {
    console.warn('⚠️ Failed to parse mainCode:', e);
    return mainCode;
  }

  // Pre-resolve CallExpressions for lookup functions
  acornWalk.simple(ast, {
    CallExpression(node) {
      if (node.callee.name in lookupMap && node.arguments[0].type === 'Literal') {
        try {
          const value = lookupMap[node.callee.name](node.arguments[0].value);
          if (typeof value === 'string') {
            console.log(`Replacing ${node.callee.name}(${node.arguments[0].value}) with "${value}"`);
            node.type = 'Literal';
            node.value = value;
            node.raw = JSON.stringify(value);
          }
        } catch (e) {
          console.warn(`⚠️ Failed to resolve ${node.callee.name}(${node.arguments[0].value}):`, e);
        }
      }
    },
  });

  // Apply transforms
  if (options.calc) evaluateNumberExpressions(ast, options);
  if (options.mangle) mangleIdentifiers(ast, options);
  if (options.computedProperties) simplifyComputedProperties(ast, options, lookupMap);
  if (options.blockStatements) convertBlockStatements(ast, options);

  // Generate final code
  try {
    mainCode = astring.generate(ast);
  } catch (e) {
    console.warn('⚠️ Failed to generate code:', e);
    return mainCode;
  }

  if (options.strMerge) mainCode = utils.strMerge(mainCode);
  if (options.calc) mainCode = utils.calcNumber(mainCode);
  if (options.methodChain) mainCode = utils.methodChain(mainCode);

  return headCode + mainCode;
}

function funcDefinerPattern(key, flags = 'i') {
  return new RegExp('\\b(var|const|let)\\s+' + key + '\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{', flags);
}

function splitMultiVar(detectMatch, source) {
  let keyStore = [];

  for (const key of detectMatch) {
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
    bodyVar += obj.code + ';\n';
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

function getFuncDefiner(key, source) {
  const funcGroupPattern = funcDefinerPattern(key, 'gi');
  let keyFunc = [];
  let sourceFunc = source;

  try {
    while (funcGroupPattern.test(source)) {
      const varIndex = source.search(funcDefinerPattern(key));
      if (varIndex === -1) break;

      let pos = varIndex,
        bo = 0,
        bc = 0,
        sourceSize = source.length;

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