document.addEventListener('DOMContentLoaded', function() {
    const uri = window.location.origin;
    // Get form elements
    const signinForm = document.getElementById('signin-form');
    const submitButton = document.getElementById("submit_btn");

    function validateInput(inputElement, regex, errorMessage) {
        const errorMessageElement = inputElement.parentElement.querySelector('.error-message');
        if (!regex.test(inputElement.value.trim())) {
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.classList.remove('hidden');
            return false;
        } else {
            errorMessageElement.classList.add('hidden');
            return true;
        }
    }


// Sign-in form validation
async function handleSigninValidation(event) {
    event.preventDefault();

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    // Clear any previous server errors
    const errorDiv = document.getElementById('server-error');
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';

    // Disable the submit button during the request
    const submitButton = event.target.querySelector('button');
    submitButton.disabled = true;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateInput(email, emailRegex, 'L\'email n\'est pas valide')) {
        isValid = false;
    }

    // Validate password
    if (password.value.trim() === '') {
        // If password is empty
        password.parentElement.querySelector('.error-message').textContent = 'Le mot de passe est requis';
        password.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        // If password is valid
        password.parentElement.querySelector('.error-message').classList.add('hidden');
    }

    if (isValid) {
       // Disable button and show loading spinner
       submitButton.disabled = true;
       const spinner = document.createElement("img");
       spinner.src = "../../../assets/media/illustrations/spinner.svg";
       spinner.alt = "Chargement...";
       spinner.className = "h-[1.5rem] w-[1.5rem]";
       submitButton.appendChild(spinner);

        try {
            // Call the validation API
            const response = await fetch(`${uri}/admin/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value, password: password.value })
            });



            const data = await response.json();
            if (data.success) {
                window.location.href = '/admin/dashboard';
            } else {
                showServerError(data.message || 'Erreur lors de la validation');
            }
        } catch (error) {
            showServerError(error.message);
        } finally {

            submitButton.disabled = false;
            submitButton.removeChild(spinner);
        }
    } else {
        submitButton.disabled = false;
    }
}

   // Show server error
   function showServerError(message) {
    const errorDiv = document.getElementById('server-error');
    errorDiv.classList.remove('hidden');
    errorDiv.textContent = message;
}
    if (signinForm) {
        signinForm.addEventListener('submit', handleSigninValidation);
    }
});
