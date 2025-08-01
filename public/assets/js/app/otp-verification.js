document.addEventListener("DOMContentLoaded", function () {
    const uri = window.location.origin;
    const form = document.getElementById("otp-verification");
    const inputs = form.querySelectorAll("input[maxlength='1']");
    const inputErrorDiv = document.getElementById("input-error");
    const serverErrorDiv = document.getElementById("server-error");
    const submitButton = form.querySelector("button");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission at the start
        
        let isValid = true;
        const digitRegex = /^[0-9]$/; 
        const verificationCode = Array.from(inputs).map(input => input.value.trim()).join("");

        // Reset previous errors
       serverErrorDiv.classList.add("hidden");
        serverErrorDiv.textContent = ""; 
       inputErrorDiv.classList.add("hidden");
        inputErrorDiv.textContent = "";

        inputs.forEach(input => input.classList.remove("border-red-500"));

        // Validate each input field
        inputs.forEach(input => {
            if (!digitRegex.test(input.value.trim())) {
                isValid = false;
                input.classList.add("border-red-500");
            }
        });

        if (!isValid) {
           inputErrorDiv.textContent = "Veuillez forunir un code valide.";
            inputErrorDiv.classList.remove("hidden");
            return;
        }

        // Disable button and show loading spinner
        submitButton.disabled = true;
        const spinner = document.createElement("img");
        spinner.src = "../../../assets/media/illustrations/spinner.svg";
        spinner.alt = "Chargement...";
        spinner.className = "h-[1.5rem] w-[1.5rem]";
        submitButton.appendChild(spinner);

        try {
            const response = await fetch(`${uri}/auth/registration-validation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ verificationCode: parseInt(verificationCode) })
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = "/user/reservations"; // Redirect on success
            } else {
                serverErrorDiv.textContent = data.message || "Code incorrect ou expiré.";
                serverErrorDiv.classList.remove("hidden");
            }
        } catch (error) {
            serverErrorDiv.textContent = "Une erreur est survenue. Veuillez réessayer.";
            serverErrorDiv.classList.remove("hidden");
        } finally {
            // Enable button and remove spinner
            submitButton.disabled = false;
            submitButton.removeChild(spinner);
        }
    });
});
