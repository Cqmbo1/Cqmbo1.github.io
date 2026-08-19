// ==UserScript==
// @name         Kirka gun fire rate increase toggleable, Speed hack, Fast Reload, AutoDodge, AutoJump, & AutoSwitch.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click X/x to toggle fire rate, B/b to toggle AutoDodge, K/k to toggle AutoWalk, G/g to toggle AutoJump, N/n to toggle KillAura/AutoShoot, L/l to toggle AutoCrouch, M/m to toggle AutoSwitch
// @author       Cqmbo__
// @match        https://kirka.io/
// @match        https://kirka.io/games
// @icon         https://cqmbo1.github.io/assets/cqmbo__32x32.png
// @license MIT
// @grant        none
// ==/UserScript==
    // URL of the script you want to fetch
    const scriptUrl = 'https://raw.githubusercontent.com/Cqmbo1/Cqmbo__-s-Scripts/refs/heads/main/Working%20Scripts/Injection%20(The%20main%20code%20of%20the%20scripts%20in%20Main)/Kirka';

    // Fetch the script
    fetch(scriptUrl)
        .then(response => response.text())
        .then(scriptContent => {
            // Execute the fetched script
            eval(scriptContent);
        })
        .catch(error => console.error('Error fetching the script:', error));
