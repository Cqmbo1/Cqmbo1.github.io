---
layout: default
title: Edu Client ID Dictionary
permalink: /idd/
---




<style>
  /* Gradient background for the page */
  body {
    background: linear-gradient(to bottom, #add8e6, #ffffff); /* Light blue to white gradient */
    color: #333; /* Text color for readability */
    font-family: Arial, sans-serif;
    text-align: center;
    padding-top: 50px;
    margin: 0;
  }

  /* Button styling */
  .hbutton {
    background-color: #8ED6F0; /* Brighter button color */
    border: none;
    color: white;
    padding: 10px; /* Reduced padding */
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 18px; /* Increased font size */
    margin: 10px 5px;
    cursor: pointer;
    border-radius: 5px;
    position: relative; /* For shine effect */
    overflow: hidden; /* To contain shine effect */
    transition: background-color 0.3s, width 0.3s;
    min-width: 15%;
  }

  .hbutton:hover {
    background-color: #0DC6D0;
  }

  .hbutton::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.5);
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0.5; /* Static shine effect */
  }
  
  .hbutton:hover::after {
    opacity: 1;
    animation: shine 1s infinite;
  }

  /* Button styling */
  .button {
    background-color: #8ED6F0; /* Brighter button color */
    border: none;
    color: white;
    padding: 6px; /* Reduced padding */
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 15px; /* Increased font size */
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s, width 0.3s;
    overflow: hidden;
    white-space: nowrap;
    position: absolute; /* Absolute positioning for button placement */
  }

  .button:hover {
    background-color: #0DC6D0;
  }
  
   .button::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.5);
    transform: rotate(45deg);
    transition: all 0.5s ease;
    opacity: 0.5; /* Static shine effect */
  }
  
    @keyframes shine {
    0% {
      left: -200%;
      top: 0;
    }
    100% {
      left: 200%;
      top: 0;
    }
  }
  
  .button:hover::after {
    opacity: 1;
    animation: shine 1.25s infinite;
  }

  /* Responsive width based on size classes */
  .large {
    
    width: 38%; /* Expand within its container */
    max-width: 38%; /* Limit to large size */
    font-size: 14px;
    min-width: 38%;
    min-width: 38%;
  }

  .medium {
    
    width: 20%; /* Expand within its container */
    max-width: 20%; /* Limit to medium size */
    font-size: 14px;
    min-width: 20%;
  }

  .small {
    
    width: 16%; /* Expand within its container */
    max-width: 16%; /* Limit to small size */
    min-width: 16%;
  }

  /* Container to hold buttons and define their relative positions */
  .video-buttons-container {
    position: relative;
    height: 500px; /* Adjust as necessary */
    width: 100%;
    max-width: 100%;
    margin: 0 auto; /* Center container */
  }
</style>

<a href="https://cqmbo1.github.io/" class="hbutton">Welcome</a>
<a href="https://cqmbo1.github.io/about" class="hbutton">About Me</a>
<a href="https://cqmbo1.github.io/v" class="hbutton">Videos</a>
<a href="https://cqmbo1.github.io/educlient" class="hbutton">Edu Client</a>
<a href="https://cqmbo1.github.io/free-hacks" class="hbutton">FREE HACKS</a>
<a href="https://cqmbo1.github.io/tools" class="hbutton">Tools</a>

<div id="main-text" style="z-index: 10000; text-align: left; width: 40%">
Potion Numerical Ids ([input] --> [effect output]) :
<br>
<br>
1 -> Speed
<br>
2 -> Slowness
<br>
3 -> Haste
<br>
4 -> Mining Fatigue
<br>
5 -> Strength
<br>
6 -> Instant Health
<br>
7 -> Instant Damage
<br>
8 -> Jump Boost
<br>
9 -> Nausea
<br>
10 -> Regeneration
<br>
11 -> Resistance
<br>
12 -> Fire Resistance
<br>
13 -> Water Breathing
<br>
14 -> Invisibility
<br>
15 -> Blindness
<br>
16 -> Night Vision
<br>
17 -> Hunger
<br>
18 -> Weakness
<br>
19 -> Poison
<br>
20 -> Wither
<br>
21 -> Health Boost
<br>
22 -> Absorption
<br>
23 -> Saturation
</div>

<div id="sub-text" style="z-index: 10000; width: 50%; height: 90%; text-align: right; right: 5%; position: absolute;">

Block, Item & Other IDS:

<a href="https://gist.github.com/jocopa3/f8c9f9158ede0e9d057781188ba440f5">https://gist.github.com/jocopa3/f8c9f9158ede0e9d057781188ba440f5</a>

</div>

<script>
  // Create a link element
  var favicon = document.createElement('link');
  favicon.rel = 'icon';                // Set rel attribute for favicon
  favicon.type = 'image/png';           // Set type attribute
  favicon.href = '/assets/cqmbo__32x32.png'; // Set the URL for the favicon

  // Append the link element to the head
  document.head.appendChild(favicon);
</script>