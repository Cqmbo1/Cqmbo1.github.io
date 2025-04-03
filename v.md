---
layout: default
title: Videos
permalink: /v/
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
    transform: rotate(50deg);
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

.specialbtn {
    background-color: #8ED6F0; /* Brighter button color */
    border: none;
    color: white;
    padding: 10px; /* Reduced padding */
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
    transition: all 0.2s ease, visibility 0s;
    border: 0px solid rgb(174, 99, 63);
    border-radius: 200px;
background: url("/assets/paradisebg.png") no-repeat padding-box border-box;
background-position: 46% 53%;
background-size: cover;
background-attachment: scroll;
}


  /* Container to hold buttons and define their relative positions */
  .video-buttons-container {
    position: relative;
    height: 500px; /* Adjust as necessary */
    width: 100%;
    max-width: 100%;
    margin: 0 auto; /* Center container */
  }

  /* Position each button */
  .fbtn1 { top: 0%; left: 40%; }     /* Centered in the top row */
  .fbtn2 { top: 20%; left: 23%; }
  .fbtn3 { top: 20%; left: 42%; }
  .fbtn4 { top: 20%; left: 61%; }
  .fbtn8 { top: 40%; left: 0%; }
  .fbtn5 { top: 40%; left: 23%; }
  .fbtn6 { top: 40%; left: 42%; }
  .fbtn7 { top: 40%; left: 61%; }
  .fbtn9 { top: 40%; left: 80%; }
  .fbtn10 { top: 60%; left: 33%; }
  .fbtn11 { top: 60%; left: 50%; }
  .fbtn12 { top: 80%; left: 30%; }
</style>

<a href="https://cqmbo1.github.io/" class="hbutton">Welcome</a>
<a href="https://cqmbo1.github.io/about" class="hbutton">About Me</a>
<a href="https://cqmbo1.github.io/v" class="hbutton">Videos</a>
<a href="https://cqmbo1.github.io/educlient" class="hbutton">Edu Client</a>
<a href="https://cqmbo1.github.io/hacks" class="hbutton">FREE HACKS</a>
<a href="https://cqmbo1.github.io/tools" class="hbutton">Tools</a>

<br><br>

<div class="video-buttons-container">
    <a href="https://www.youtube.com/watch?v=tWroaQshK2I&t=60s&ab_channel=Cqmbo__" class="button fbtn1 medium" style="top: 0%; left: 40%;">Voxiom.io Hacking</a> 
    <a href="https://www.youtube.com/watch?v=Jn1FEdjbK5I" class="button fbtn2 small" style="top: 20%; left: 23%;">Bedwars Part 1</a>
    <a href="https://www.youtube.com/watch?v=irbPBG8V6Cc" class="button fbtn3 small" style="top: 20%; left: 42%;">Bedwars Part 2</a>
    <a href="https://youtu.be/fNBrKrac_-4" class="button fbtn4 small" style="top: 20%; left: 61%;">Bedwars Part 3</a>
    <a href="https://www.youtube.com/watch?v=HhtsgdajEzE" class="button fbtn5 small" style="top: 40%; left: 23%;">Bedwars Part 4</a>
    <a href="https://www.youtube.com/watch?v=3_mCvJ50yVs" class="button fbtn6 small" style="top: 40%; left: 42%;">Bedwars Part 5</a>
    <a href="https://www.youtube.com/watch?v=djNsquMsbXM" class="button fbtn7 small" style="top: 40%; left: 61%;">Bedwars Part 6</a>
    <a href="https://www.youtube.com/watch?v=O2S06ThtXTQ" class="button fbtn8 medium" style="top: 40%; left: 0%;">Bloxd.io PvP</a>
    <a href="https://www.youtube.com/watch?v=VYgxebO5tC0&ab_channel=Cqmbo__" class="button fbtn9 medium" style="top: 40%; left: 80%;">Hacking in Miniblox</a>
    <a href="https://www.youtube.com/watch?v=s8v2Uv_8zTk&t=53s&ab_channel=Cqmbo__" class="button fbtn10 small" style="top: 60%; left: 33%;">Kirka.io Hacking</a>
    <a href="https://www.youtube.com/watch?v=9Z06RLEvoJQ&ab_channel=Cqmbo__" class="button fbtn11 small" style="top: 60%; left: 50%;">Surf Curse Music</a>
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



