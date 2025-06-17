document.addEventListener('DOMContentLoaded', function() {
    const uri = window.location.origin;
    console.log(uri);
    // Get form elements
    const signupForm = document.getElementById('signup-form');
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


    // Sign-up form validation
// Sign-up form validation
async function handleSignupValidation(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    let isValid = true;

    // Clear any previous server errors
    const errorDiv = document.getElementById('server-error');
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';

    // Disable the submit button during the request
    const submitButton = event.target.querySelector('button');
    submitButton.disabled = true;

    // Validate first name
    if (firstName.value.trim() === '') {
        firstName.parentElement.querySelector('.error-message').textContent = 'Le prénom est requis';
        firstName.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        firstName.parentElement.querySelector('.error-message').classList.add('hidden');
    }

    // Validate last name
    if (lastName.value.trim() === '') {
        lastName.parentElement.querySelector('.error-message').textContent = 'Le nom est requis';
        lastName.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        lastName.parentElement.querySelector('.error-message').classList.add('hidden');
    }

    // Validate phone number
    if (phone.value.trim() === '') {
        phone.parentElement.querySelector('.error-message').textContent = 'Le numéro de téléphone est requis';
        phone.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        phone.parentElement.querySelector('.error-message').classList.add('hidden');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateInput(email, emailRegex, 'L\'email n\'est pas valide')) {
        isValid = false;
    }

    // Validate password
    if (password.value.trim() === '') {
        password.parentElement.querySelector('.error-message').textContent = 'Le mot de passe est requis';
        password.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else if (password.value.trim().length < 8) {
        password.parentElement.querySelector('.error-message').textContent = 'Le mot de passe doit contenir au moins 8 caractères';
        password.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        password.parentElement.querySelector('.error-message').classList.add('hidden');
    }

    // Validate confirm password
    if (confirmPassword.value.trim() !== password.value.trim()) {
        confirmPassword.parentElement.querySelector('.error-message').textContent = 'Les mots de passe ne correspondent pas';
        confirmPassword.parentElement.querySelector('.error-message').classList.remove('hidden');
        isValid = false;
    } else {
        confirmPassword.parentElement.querySelector('.error-message').classList.add('hidden');
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
            // Call the signup API
            const response = await fetch(`${uri}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.value,
                    lastName: lastName.value,
                    phone: phone.value,
                    email: email.value,
                    password: password.value
                })
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                window.location.href = '/auth/registration-validation';  // Redirect after successful signup
            } else {
                showServerError(data.message || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            showServerError(error.message);
        } finally {
            submitButton.removeChild(spinner);
            submitButton.disabled = false;
        }
    } else {
        submitButton.disabled = false;
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
        submitButton.disabled = true;
        const spinner = document.createElement("img");
        spinner.src = "../../../assets/media/illustrations/spinner.svg";
        spinner.alt = "Chargement...";
        spinner.className = "h-[1.5rem] w-[1.5rem]";
        submitButton.appendChild(spinner);

        try {
            // Call the validation API
            const response = await fetch(`${uri}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.value, password: password.value })
            });



            const data = await response.json();
            console.log(data);

            if (data.success) {
                window.location.href = '/user/reservations';
            } else {
                showServerError(data.message || 'Erreur lors de la validation');
            }
        } catch (error) {
            showServerError(error.message);
        } finally {
            submitButton.removeChild(spinner);
            submitButton.disabled = false;
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


    // Add event listeners for both forms
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupValidation);
    }
    if (signinForm) {
        signinForm.addEventListener('submit', handleSigninValidation);
    }
});
