const uri = window.location.origin;
const logoutButton = document.getElementById('logout');

function deleteCookie(name) {
  const expires = new Date();
  expires.setTime(expires.getTime() - 1);
  document.cookie = name + "=; expires=" + expires.toUTCString() + "; path=/; HttpOnly";
  console.log("Executive")
}


if (logoutButton) {
  logoutButton.addEventListener('click', async function(e) {
    e.preventDefault();
    logoutButton.disabled = true;
    // Create and append the spinner
    const spinner = document.createElement('img');
    spinner.src = '../../../assets/media/illustrations/spinner_dark.svg';
    spinner.alt = 'Loading...';
    spinner.className = 'h-[2rem] w-[2rem]';
    logoutButton.appendChild(spinner);

    try {
      const response = await fetch(`${uri}/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Clear the token cookie before redirecting
        deleteCookie('access_token');
        window.location.href = '/sign-in';
      } else {
        console.error('Erreur lors de la validation');
      }
    } catch (error) {
      console.error('error.message');
    } finally {
      logoutButton.removeChild(spinner);
      logoutButton.disabled = false;
    }
  });
} else {
  console.error('Logout button not found');
}
