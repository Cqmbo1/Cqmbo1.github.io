/**
 * @name  Cqmbo Deobfuscator
 * @description  Powerful JS Deobfuscator and Unpacker with Format Support
 * @author  Cqmbo
 * @version  2.0.0
 * @license  MIT
 */


/* globals ClipboardJS */

(function () {
  // https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // https://stackoverflow.com/a/28318964
  function parseFile(file, chunk, done) {
    var fileSize = file.size,
      chunkSize = 64 * 1024,
      offset = 0,
      chunkReaderBlock = null,
      readEventHandler = function (evt) {
        if (evt.target.error == null) {
          chunk(evt.target.result);
        } else {
          return;
        }
        if (offset >= fileSize) {
          done();
          return;
        }
        offset += chunkSize;
        chunkReaderBlock(offset, chunkSize, file);
      };

    chunkReaderBlock = function (_offset, length, _file) {
      var r = new FileReader();
      var blob = _file.slice(_offset, length + _offset);
      r.onload = readEventHandler;
      r.readAsText(blob);
    };

    chunkReaderBlock(offset, chunkSize, file);
  }

  function updateOnlineStatus() {
    if (navigator.onLine) {
      title.classList.remove('offline');
      urlRemove.disabled = false;
      submitRemove.disabled = false;
    } else {
      title.classList.add('offline');
      urlRemove.disabled = true;
      submitRemove.disabled = true;
    }
  }

  var wrapper = document.getElementById('main_content'),
    input = document.getElementById('input'),
    file = document.getElementById('file'),
    fileName = document.getElementById('fileName'),
    contentLocal = document.getElementById('contentLocal'),
    renderLocal = document.getElementById('renderLocal'),
    formRemove = document.getElementById('formRemove'),
    urlRemove = document.getElementById('urlRemove'),
    submitRemove = document.getElementById('submitRemove'),
    renderRemove = document.getElementById('renderRemove'),
    view = document.getElementById('view'),
    encode = document.getElementsByName('encode'),
    options,
    none = document.getElementById('none'),
    readable = document.getElementById('readable'),
    form = document.de4js,
    packer = form.encode.value,
    temp = '',
    disableAll = function (check) {
      for (var i = 0; i < encode.length; i++) {
        if (encode[i].value === 'nicify') continue;
        encode[i].disabled = check;
      }
    },
    clear = document.getElementById('clear'),
    autoBtn = document.getElementById('auto'),
    isAuto = false,
    preview = document.getElementById('preview'),
    download = document.getElementById('download'),
    clipboard = new ClipboardJS('#copyjs', {
      target: function () {
        return view;
      },
    }),
    title = document.getElementById('title'),
    startEffect = function () {
      view.textContent = '';
      view.classList.add('waiting');
      clear.disabled = true;
      autoBtn.disabled = true;
      disableAll(true);

      options = Array.from(document.querySelectorAll('.de4js-option')).reduce((obj, e) => {
        obj[e.name] = e.checked;
        return obj;
      }, {});
    },
    stopEffect = function () {
      isAuto = false;
      view.classList.remove('waiting');
      clear.disabled = false;
      autoBtn.disabled = false;
      setTimeout(function () {
        disableAll(false);
      }, 0);
    },
    resetCopy = function (trigger) {
      if (!trigger.classList.contains('copied')) return;
      trigger.classList.remove('copied');
    },
    timeReset = function (trigger) {
      setTimeout(function () {
        resetCopy(trigger);
      }, 800);
    },
    externalStyle =
      '*{margin:0;padding:0}html{line-height:1em;background:#1d1f21;color:#c5c8c6}pre{white-space:pre-wrap;word-wrap:break-word;word-break:break-all}.hljs-comment,.hljs-quote{color:#969896}.hljs-variable,.hljs-template-variable,.hljs-tag,.hljs-name,.hljs-selector-id,.hljs-selector-class,.hljs-regexp,.hljs-deletion{color:#d54e53}.hljs-number,.hljs-built_in,.hljs-builtin-name,.hljs-literal,.hljs-type,.hljs-params,.hljs-meta,.hljs-link{color:#e78c45}.hljs-attribute{color:#e7c547}.hljs-string,.hljs-symbol,.hljs-bullet,.hljs-addition{color:#b9ca4a}.hljs-title,.hljs-section{color:#7aa6da}.hljs-keyword,.hljs-selector-tag{color:#c397d8}.hljs{display:block;overflow-x:auto;background:black;color:#eaeaea;padding:.5em}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}pre{counter-reset:line-numbers;padding:.5em .5em .5em 5em;border-left:1px solid #1d1f21}pre.hljs{padding-left:.5em;border-left:0 none}code::before{counter-increment:line-numbers;content:counter(line-numbers);display:block;position:absolute;left:-3.5em;top:0;width:3em;text-align:right;color:#60686f;white-space:pre;direction:rtl}code{display:block;position:relative;margin-left:3em;padding-left:.5em;min-height:1em;border-left:1px solid #32363b}code::after{content:".";visibility:hidden}html,body,.hljs{background:#030303}',
    externalUrl,
    externalPreview = function (source) {
      if (externalUrl) URL.revokeObjectURL(externalUrl);

      source =
        '<html><head><meta charset="utf-8"><link rel="shortcut icon" type="image/png" href="https://lelinhtinh.github.io/de4js/favicon.png"><title>de4js | Preview</title><style>' +
        externalStyle +
        '</style></head><body><pre class="hljs">' +
        source +
        '</pre></body></html>';

      externalUrl = new Blob([source], {
        type: 'text/html',
      });
      externalUrl = URL.createObjectURL(externalUrl);

      preview.classList.add('show');
      preview.href = externalUrl;
    },
    downloadUrl,
    downloadResult = function (source) {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);

      downloadUrl = new Blob([source], {
        type: 'text/javascript',
      });
      downloadUrl = URL.createObjectURL(downloadUrl);

      download.classList.add('show');
      download.href = downloadUrl;
    },
    workerFormat,
    workerDecode,
    workerError = (err) => {
      stopEffect();
      view.innerHTML = `<span class="hljs-variable">${err.message}</span>`;
    },
    format = debounce(function () {
      if (temp === '') return;

      if (!workerFormat) {
        workerFormat = new Worker('https://Cqmbo1.github.io/assets/deobfuscate/worker/format.js');
        workerFormat.addEventListener('message', function (e) {
          if (!e.data.highlight) {
            downloadResult(e.data.result);
            return;
          }

          view.innerHTML = e.data.result;
          externalPreview(e.data.result);

          stopEffect();
        });
      }

      startEffect();
      workerFormat.postMessage({
        source: temp,
        options: options,
      });
      workerFormat.addEventListener('error', workerError);
    }, 250),
    isObfuscatorIO = function (source) {
  let score = 0;
  if (/\bfunction\s+\w+\(\w+,\s*\w+\)\s*\{[\s\S]+?\w+=function\(\w+,\s*\w+\)\s*\{[\s\S]+?return\s+\w+;/.test(source)) score++;
  if (/\bfunction\s+(\w+)\s*\(\)\s*\{\s*var\s+\w+\s*=\s*\[[^\]]+\];\s*\1\s*=\s*function\s*\(\)\s*\{\s*return\s+\w+;\s*\};\s*return\s+\1\(\);\s*\}/.test(source)) score++;
  if (/\bwhile\s*\(\s*!!\[\]\s*\)/.test(source)) score++;
  if (/\w+\[['"]push['"]]\(\w+\[['"]shift['"]]\(\)\)/.test(source)) score++;
  return score >= 3;
},
    detect = function (source, forceDetect = false) {
      console.log('detect: source=', source);
      const selectedRadioId = localStorage.getItem('selectedRadio');
      if (!forceDetect && selectedRadioId && document.getElementById(selectedRadioId)) {
        console.log('detect: using localStorage radio=', selectedRadioId);
        return document.getElementById(selectedRadioId).value;
      }

      var type = '';
      if (/^var\s_\d{4};[\s\n]*var\s_\d{4}\s?=/.test(source)) {
        type = '_numberencode';
      } else if (source.indexOf("/｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_'];") !== -1) {
        type = 'aaencode';
      } else if (source.indexOf('$={___:++$,$$$$:(![]+"")[$]') !== -1) {
        type = 'jjencode';
      } else if (source.replace(/[[\]()!+]/gm, '').trim() === '') {
        type = 'jsfuck';
      } else if (
        /%[0-9A-Fa-f]{2}/.test(source) && (source.indexOf(' ') === -1 || source.includes('%20'))
      ) {
        type = 'urlencode';
} else if (isObfuscatorIO(source)) {
  type = 'obfuscatorio';
} else if (/^var\s+((?![^_a-zA-Z$])[\w$]*)\s*=\s*\[.*?\];/.test(source)) {
        type = 'arrayencode';
      } else if (
        source.startsWith('//Protected by WiseLoop PHP JavaScript Obfuscator') ||
        source.includes(';eval(function(w,i,s,e)')
      ) {
        type = 'wisefunction';
      } else if (source.indexOf('eval(') !== -1) {
        if (/\b(window|document|console)\.\b/i.test(source)) {
          type = '';
        } else {
          type = 'evalencode';
        }
      }

      console.log('detect: type=', type);
            console.log('Test match 1 (lookup function):', /\bfunction\s+\w+\(\w+,\s*\w+\)\s*\{[^}]*?return\s+\w+\(\w+,\s*\w+\);?\s*\}/.test(source));
console.log('Test match 2 (array-returning closure):', /\bfunction\s+\w+\(\)\s*\{\s*var\s+\w+=\[[^\]]+\];\s*\w+=function\s*\(\)\s*\{\s*return\s+\w+;\s*\};\s*return\s+\w+\(\);\s*\}/.test(source));
console.log('Test match 3 (while true):', /\bwhile\s*\(\s*!!\[\]\s*\)/.test(source));
console.log('Test match 4 (shift loop):', /\w+\[['"]push['"]]\(\w+\[['"]shift['"]]\(\)\)/.test(source));

      document.querySelector('.magic-radio:checked').checked = false;
      const radioToCheck = document.querySelector('.magic-radio[value="' + type + '"]');
      if (radioToCheck) {
        radioToCheck.checked = true;
      }

      return type;
    },
    decode = debounce(function (forceDetect = false, e) {
      if (temp === '') {
        rawInput = input.value.trim(); // Store raw input
        temp = rawInput;
      }
      temp = temp.replace(/\/\*(?!\s*@de4js)[\s\S]*?\*\/|^[\s\t]*\/\/.*/gm, '');
      if (temp === '') return;
      let isAuto2 = e || isAuto; 

      console.log('decode: rawInput=', rawInput, 'temp=', temp, 'isAuto=', isAuto2, 'forceDetect=', forceDetect);
      // Use rawInput for detection to avoid decoded output
      packer = isAuto2 ? detect(rawInput, forceDetect) : form.encode.value;
console.log(packer)
      if (packer === 'nicify') return;
      if (packer === '') {
        format();
        return;
      }

      if (!workerDecode) {
        workerDecode = new Worker('https://Cqmbo1.github.io/assets/deobfuscate/worker/decode.js');
  // Ensure dependencies are loaded in the worker
  workerDecode.postMessage({
    dependencies: [
      'https://unpkg.com/acorn',
      'https://unpkg.com/acorn-walk',
      'https://unpkg.com/astring',
    ],
  });
        workerDecode.addEventListener('message', function (e) {
          if (e.data !== temp) {
            temp = e.data; // Update temp with decoded output
            format(); // Format the decoded output
          }
        });
        workerDecode.addEventListener('error', workerError);
      }

      startEffect();
      if (!packer) {
  console.error('packer is undefined or empty, cannot decode');
  return; // or handle gracefully
}
      console.log(packer)
      workerDecode.postMessage({
        source: temp,
        packer: packer,
        options: options,
      });
    }, 250),
    changeEncode = function (e) {
      var _this = e.target;
      if (_this.name !== 'encode') return;
    },
    dragEnd = function () {
      contentLocal.classList.remove('drop-zone', 'drop-enter');
    },
    uploadFile = function (fileObj) {
      if (!fileObj) return;
      var fragment = new DocumentFragment();
      fileName.textContent = fileObj.name;
      if (!/((text|application)\/(ecmascript|(x-)?javascript)|text\/plain)/.test(fileObj.type)) {
        renderLocal.textContent = 'Invalid file type';
        return;
      }
      temp = '';
      rawInput = ''; // Reset rawInput
      renderLocal.textContent = '';
      parseFile(
        fileObj,
        function (data) {
          temp += data;
          rawInput += data; // Store raw input
          var txt = document.createTextNode(data);
          fragment.appendChild(txt);
        },
        function () {
          decode();
          renderLocal.appendChild(fragment);
          file.value = '';
        }
      );
    };

  input.oninput = function () {
    rawInput = input.value.trim(); // Update rawInput on input change
    temp = rawInput;
    decode(true, false);
  };

form.addEventListener('change', function(e) {
      rawInput = input.value.trim(); // Ensure rawInput is up-to-date
    temp = rawInput;
  changeEncode(e);
  decode(true,false);
});

form.addEventListener('click', function(e) {
      rawInput = input.value.trim(); // Ensure rawInput is up-to-date
    temp = rawInput;
  changeEncode(e);
  decode(true, false);
});


  autoBtn.onclick = function () {
    isAuto = true;
    rawInput = input.value.trim(); // Ensure rawInput is up-to-date
    temp = rawInput;
    decode(true);
  };

  clipboard.on('success', function (e) {
    e.trigger.classList.add('copied');
    e.clearSelection();
    timeReset(e.trigger);
  });
  clipboard.on('error', function (e) {
    e.trigger.classList.add('selected');
    timeReset(e.trigger);
  });

  clear.onclick = function () {
    view.textContent = '';
    file.value = '';
    renderLocal.textContent = '';
    dragEnd();
    fileName.textContent = '';
    renderRemove.textContent = '';
    urlRemove.value = '';
    none.click();
    temp = '';
    rawInput = ''; // Reset rawInput
    stopEffect();
    if (workerDecode) {
      workerDecode.terminate();
      workerDecode = undefined;
    }
    if (workerFormat) {
      workerFormat.terminate();
      workerFormat = undefined;
    }
    preview.classList.remove('show');
  };


  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // Tabs control
  wrapper.addEventListener('click', function (e) {
    var _this = e.target;
    if (!_this.classList.contains('tab')) return;

    clear.click();

    wrapper.querySelector('.tab.active').classList.remove('active');
    _this.classList.add('active');

    wrapper.querySelector('.tab-content.show').classList.remove('show');
    wrapper.querySelector('#content' + _this.dataset.target).classList.add('show');
  });

  file.onchange = function () {
    uploadFile(this.files[0]);
  };

  file.onfocus = function () {
    this.classList.add('has-focus');
  };

  file.onblur = function () {
    this.classList.remove('has-focus');
  };

  document.ondrop = function (e) {
    e.preventDefault();

    dragEnd();
    if (e.target.id !== 'contentLocal') return;

    uploadFile(e.dataTransfer.files[0]);
  };

  document.ondragover = function (e) {
    e.preventDefault();
    contentLocal.classList.add('drop-zone');
  };

  document.ondragend = function (e) {
    e.preventDefault();
    dragEnd();
  };

  document.onkeyup = function (e) {
    if (e.keyCode !== 27) return;
    dragEnd();
  };

  contentLocal.onclick = function () {
    if (!contentLocal.classList.contains('drop-zone')) return;
    dragEnd();
  };

  contentLocal.ondragenter = function (e) {
    e.preventDefault();
    this.classList.add('drop-enter');
  };

  contentLocal.ondragleave = function (e) {
    e.preventDefault();
    this.classList.remove('drop-enter');
  };

  formRemove.onsubmit = function (e) {
    e.preventDefault();
    var fragment = new DocumentFragment(),
      url = urlRemove.value;

    temp = '';
    renderRemove.textContent = '';

    fetch(url)
      .then(function (res) {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        if (
          res.headers.get('content-type').search(/((text|application)\/(ecmascript|(x-)?javascript)|text\/plain)/i) ===
          -1
        ) {
          throw Error('Invalid file type');
        }
        return res.text();
      })
      .then(function (data) {
        temp = data;
        decode();

        var txt = document.createTextNode(data);
        fragment.appendChild(txt);
        renderRemove.appendChild(fragment);
      })
      .catch(function (err) {
        renderRemove.innerHTML = `<span class="hljs-variable">${err.message}</span>`;
      });
  };

  readable.onchange = function () {
    temp = readable.value;
    format();
  };
})();
