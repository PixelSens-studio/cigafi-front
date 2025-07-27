document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const navbar = document.getElementById('navbar');
  const body = document.body;

  if (menuButton && navbar && body) { // Added a check to ensure elements exist
    menuButton.addEventListener('click', () => {
      navbar.classList.toggle('menu-opened');
      body.classList.toggle('menu-opened'); // Toggle class on body to prevent scroll
    });
  } else {
    console.warn("One or more required elements for the menu script were not found.");
  }
});