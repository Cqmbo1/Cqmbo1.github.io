// ==UserScript==
// @name         Cookie Grinder X
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Best AFK Grinder for Cookie Clicker
// @author       Cqmbo__
// @match        *://orteil.dashnet.org/cookieclicker/*
// @match        *://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license      MIT
// ==/UserScript==

    // URL of the script you want to fetch
    const scriptUrl = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo__-s-Scripts/refs/heads/main/Working%20Scripts/Injection%20(The%20main%20code%20of%20the%20scripts%20in%20Main)/Cookie%20Clicker';

    // Fetch the script
    fetch(scriptUrl)
        .then(response => response.text())
        .then(scriptContent => {
            // Execute the fetched script
            eval(scriptContent);
        })
        .catch(error => console.error('Error fetching the script:', error));
