  // Create a link element
  var favicon = document.createElement('link');
  favicon.rel = 'icon';                // Set rel attribute for favicon
  favicon.type = 'image/png';           // Set type attribute
  favicon.href = '/assets/cqmbo__32x32.png'; // Set the URL for the favicon

  // Append the link element to the head
  document.head.appendChild(favicon);

if (location.hostname !== "cqmbo1.github.io") {
  window.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = "Unauthorized mirror detected.";
                    setTimeout(() => {
          document.body.innerHTML = "Unauthorized mirror detected. Redirecting in 3.";
                    setTimeout(() => {
          document.body.innerHTML = "Unauthorized mirror detected. Redirecting in 2.";
                                setTimeout(() => {
          document.body.innerHTML = "Unauthorized mirror detected. Redirecting in 1.";
                                            setTimeout(() => {
location.href = 'https://cqmbo1.github.io'
        },1000);
        },1000);
        },1000);
        },1000);
  });
  throw new Error("Unauthorized use.");

  fetch("https://webhook-sender.cqmbo.workers.dev/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ msg: `Skidded Website Detected ${location.hostname + location.href}` })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
}


  // Create a link element
  var favicon = document.createElement('link');
  favicon.rel = 'icon';                // Set rel attribute for favicon
  favicon.type = 'image/png';           // Set type attribute
  favicon.href = '/assets/cqmbo__32x32.png'; // Set the URL for the favicon

  // Append the link element to the head
  document.head.appendChild(favicon);

if (location.hostname !== "cqmbo1.github.io") {
  window.addEventListener("DOMContentLoaded", () => {
    document.body.innerHTML = "Unauthorized mirror detected.";
  });
  throw new Error("Unauthorized use.");
}


(function () {
  let previouslyOpen = false;
  const threshold = 160;
  let timeoutIds = [];

  function clearAllTimeouts() {
    for (const id of timeoutIds) clearTimeout(id);
    timeoutIds = [];
  }

  function startRedirectCountdown() {
    clearAllTimeouts();
    timeoutIds.push(setTimeout(() => {
      document.body.innerHTML = "Developer tools detected. Execution halted. Redirecting in 3.";
      timeoutIds.push(setTimeout(() => {
        document.body.innerHTML = "Developer tools detected. Execution halted. Redirecting in 2.";
        timeoutIds.push(setTimeout(() => {
          document.body.innerHTML = "Developer tools detected. Execution halted. Redirecting in 1.";
          timeoutIds.push(setTimeout(() => {
            location.href = 'https://cqmbo1.github.io';
          }, 1000));
        }, 1000));
      }, 1000));
    }, 1000));
  }

  function detectDevToolsBySize(forceCheck = false) {
    const horizontalDiff = window.outerWidth - window.innerWidth;
    const verticalDiff = window.outerHeight - window.innerHeight;
    const isOpen = horizontalDiff > threshold || verticalDiff > threshold;

    if ((isOpen && !previouslyOpen) || (forceCheck && isOpen)) {
      previouslyOpen = true;
      console.warn("DevTools detected (opened or already open).");
      startRedirectCountdown();
      throw new Error("DevTools not allowed");
    } else if (!isOpen && previouslyOpen) {
      previouslyOpen = false;
      clearAllTimeouts();
      document.body.innerHTML = "Developer tools closed. Redirect canceled. Good BOYYYYYYYY.";
    }
  }

  // Detect console using toString tampering
  function detectConsoleToString() {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get() {
        document.body.innerHTML = "DevTools detected via console access.";
        throw new Error("Console inspection not allowed.");
      }
    });
    console.log(element); // Triggers getter if console is open
  }

  // Detect DevTools via timing lag (performance.now + requestAnimationFrame)
  function detectTimingLag() {
    let start = performance.now();
    requestAnimationFrame(() => {
      let end = performance.now();
      if (end - start > 100) {
        document.body.innerHTML = "DevTools detected via event loop lag.";
        throw new Error("DevTools interference detected.");
      }
    });
  }

    function debuggerTrap() {
      /*
    if (previouslyOpen) {
      let trap = function () {
        debugger;
        trap();
      };
      trap();
    }
    */
  }

  function detectConsoleTampering() {
    /*
    const logFn = console.log;
    console.log = function () {
      document.body.innerHTML = "Console tampering detected.";
      throw new Error("Console disabled");
    };
    setTimeout(() => {
      console.log = logFn;
    }, 5000);
    */
  }

  window.addEventListener("load", () => {
    detectConsoleTampering();
    detectDevToolsBySize(true);     // check immediately
    detectConsoleToString();        // check console open
    detectTimingLag();              // check event loop lag
  });

  setInterval(() => {
    detectDevToolsBySize();
    detectConsoleToString();
    detectTimingLag();
    debuggerTrap();
  }, 1000);
})();
