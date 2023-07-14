// path: src/pages/Content/index.js

// Create a button element
const button = document.createElement('div');
button.style.position = 'fixed';
button.style.top = '50%';
button.style.right = '0';
button.style.transform = 'translateY(-50%)';
button.style.backgroundColor = 'violet';
button.style.width = '50px';
button.style.height = '50px';
button.style.borderRadius = '50%';
button.style.zIndex = '9999';
button.style.transition = 'width 0.3s'; // Add transition effect for smooth expansion
button.style.display = 'flex'; // Use flex to center the text inside the button
button.style.justifyContent = 'center';
button.style.alignItems = 'center';
button.style.overflow = 'hidden'; // Make sure the text is hidden until the button is expanded

// Append the button to the body
document.body.appendChild(button);

// Add click event listener to the button
button.addEventListener('click', expandButton);

// Function to expand the button
function expandButton() {
  button.style.width = '200px'; // Adjust as needed to fit your text
  button.innerHTML = '<span style="color:white">Generate Cover Letter</span>'; // Add your text
}

// Listen for changes in the URL
const observer = new MutationObserver(() => {
  const linkedinLink = document.querySelector(
    'a[href^="https://www.linkedin.com"]'
  );

  // Display or hide the button based on the presence of a LinkedIn link
  if (linkedinLink) {
    button.style.display = 'block';
  } else {
    button.style.display = 'none';
  }
});

// Observe changes to the document
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
