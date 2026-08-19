// ==UserScript==
// @name         Cqmbo Client for YT! 1.0.4
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Anti - Adblocker Removal, Download Video, Auto Like & More!
// @author       Cqmbo__
// @match        https://www.youtube.com/*
// @icon         https://cqmbo1.github.io/assets/cqmbo__32x32.png
// @grant        none
// ==/UserScript==

// URL of the script you want to fetch
const scriptUrl = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo__-s-Scripts/refs/heads/main/Working%20Scripts/Injection%20(The%20main%20code%20of%20the%20scripts%20in%20Main)/YT%20Injection';

// Fetch the script
fetch(scriptUrl)
    .then(response => response.text())
    .then(scriptContent => {
        // Execute the fetched script
        eval(scriptContent);
    })
    .catch(error => console.error('Error fetching the script:', error));
