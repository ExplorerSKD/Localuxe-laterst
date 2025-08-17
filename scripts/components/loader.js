export async function loadComponent(selector, filePath = null) {
  const element = document.querySelector(selector);
  if (!element) return;

  const source = filePath || element.getAttribute('data-source');
  if (!source) return;

  try {
    // Use relative path instead of hardcoded preview URL
    const response = await fetch(source);

    if (!response.ok) throw new Error(`Failed to load ${source}`);
    const html = await response.text();
    element.innerHTML = html;

    // Initialize icons inside the loaded component
    if (window.lucide) {
      lucide.createIcons();
    }

    // Run navbar-specific JS if needed
    if (source.includes('navbar')) {
      initNavbar();
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

function initNavbar() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}
