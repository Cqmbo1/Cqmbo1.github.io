// ==UserScript==
// @name         Calculator
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Advanced Calculator with Keybinds, Negative Numbers, Decimals, Parentheses, Exponents, Unit Converter, Factorials, Square Root and Fractions
// @author       Cqmbo__
// @match        *://*/*
// @exclude      *https://orteil.dashnet.org/cookieclicker/*
// @exclude      *https://accounts.google.com/*
// @exclude      *https://google.com*
// @exclude      *https://login.live.com*
// @exclude      *https://www.bing.com*
// @require      https://gist.githubusercontent.com/Cqmbo1/77f8253fae3486b1e159eb731566424d/raw/3d1a320e54cec5023b52229141b322472b5674d4/gistfile1.txt
// @icon         https://cqmbo1.github.io/assets/cqmbo__32x32.png
// @grant        none
// ==/UserScript==

// exclude all websites that turn white due to this script (you should add "*" in front and behind URL). The reason is due to security / anti-cheat reasons the website will not load because of document.insertAdjacentHTML
// (in this case which is completly safe) which trigger false positives.

// URL of the script you want to fetch
const scriptUrl = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo__-s-Scripts/refs/heads/main/Working%20Scripts/Injection%20(The%20main%20code%20of%20the%20scripts%20in%20Main)/Calculator';

// Fetch the script
fetch(scriptUrl)
    .then(response => response.text())
    .then(scriptContent => {
        // Execute the fetched script
        eval(scriptContent);
    })
    .catch(error => console.error('Error fetching the script:', error));
