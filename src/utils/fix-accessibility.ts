/**
 * Simple utility to fix accessibility issues with hidden input elements
 * This targets the specific issue found by Lighthouse
 */

export const fixHiddenInputAccessibility = () => {
  // Find all hidden input elements with the slate-shadow-input class
  const hiddenInputs = document.querySelectorAll('.slate-shadow-input');
  
  hiddenInputs.forEach((input) => {
    if (input instanceof HTMLInputElement) {
      // Add proper accessibility attributes to fix Lighthouse issues
      input.setAttribute('aria-hidden', 'true');
      input.setAttribute('tabindex', '-1');
      input.setAttribute('role', 'presentation');
    }
  });
};

// Auto-fix when DOM changes (for dynamically added elements)
if (typeof window !== 'undefined') {
  // Run immediately
  fixHiddenInputAccessibility();
  
  // Set up a simple observer for new elements
  const observer = new MutationObserver(() => {
    fixHiddenInputAccessibility();
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
