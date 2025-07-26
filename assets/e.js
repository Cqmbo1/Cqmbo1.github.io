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
