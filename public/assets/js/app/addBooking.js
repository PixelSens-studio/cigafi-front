document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const bookingForm = document.getElementById('booking-form');
    const formStep1 = document.getElementById('form-step-1');
    const formStep2 = document.getElementById('form-step-2');
    const bookingInfosSubmission = document.getElementById('bookingInfosSubmission');
    const bookingSubmission = document.getElementById('bookingSubmission');
    const backButton = formStep2.querySelector('button:not(#bookingSubmission)');
    const navStepper = document.getElementById('nav-stepper');
    const stepTabs = navStepper.querySelectorAll('.nav-tab');
    const body = document.body;

    // Validation functions
    function validateDate(date) {
        return date && new Date(date) instanceof Date && !isNaN(new Date(date));
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\+?\d{8,}$/.test(phone.replace(/\s/g, ''));
    }

    function showError(input, message, customContainer) {
        let container = customContainer || input.parentElement;
        let errorElement = container.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.className = 'error-message text-red-500 text-sm mt-2';
            container.appendChild(errorElement);
        }
        errorElement.textContent = message; 
        errorElement.classList.remove('hidden');
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.classList.add('hidden');
        });
    }

    function setLoadingState(button) {
        button.disabled = true;
        const originalContent = button.innerHTML;
        button.setAttribute('data-original-content', originalContent);
        
        const spinner = document.createElement('img');
        spinner.src = "../../../assets/media/illustrations/spinner.svg";
        spinner.alt = "Chargement...";
        spinner.className = "h-[1.5rem] w-[1.5rem]";
        
        button.textContent = 'Chargement ';
        button.appendChild(spinner);
    }

    function resetButton(button) {
        button.disabled = false;
        const originalContent = button.getAttribute('data-original-content');
        button.innerHTML = originalContent;
    }

    function updateStepperState(currentStep) {
        stepTabs.forEach((tab, index) => {
            tab.classList.remove('active', 'done');
            if (index < currentStep) {
                tab.classList.add('done');
            } else if (index === currentStep) {
                tab.classList.add('active');
            }
        });
    }

    // Handle step 1 submission
    bookingInfosSubmission.addEventListener('click', function(e) {
        e.preventDefault();
        clearErrors();

        // Get step 1 inputs
        const arrivalDate = formStep1.querySelector('input[name="arrivalDate"]');
        const departureDate = formStep1.querySelector('input[name="departureDate"]');
        const firstName = formStep1.querySelector('input[name="firstName"]');
        const lastName = formStep1.querySelector('input[name="lastName"]');
        const phone = formStep1.querySelector('input[name="phone"]');
        const email = formStep1.querySelector('input[name="email"]');
        const address = formStep1.querySelector('input[name="address"]');

        let isValid = true;

        // Validate dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        if (!validateDate(arrivalDate.value)) {
            showError(arrivalDate, 'Veuillez entrer une date d\'arrivée valide');
            isValid = false;
        } else if (new Date(arrivalDate.value) < today) {
            showError(arrivalDate, 'La date d\'arrivée ne peut pas être dans le passé');
            isValid = false;
        }

        if (!validateDate(departureDate.value)) {
            showError(departureDate, 'Veuillez entrer une date de départ valide');
            isValid = false;
        } else if (new Date(departureDate.value) < today) {
            showError(departureDate, 'La date de départ ne peut pas être dans le passé');
            isValid = false;
        } else {
            const arrival = new Date(arrivalDate.value);
            const departure = new Date(departureDate.value);
            arrival.setHours(0, 0, 0, 0);
            departure.setHours(0, 0, 0, 0);

            if (arrival.getTime() === departure.getTime()) {
                showError(departureDate, 'La date d\'arrivée et la date de départ ne peuvent pas être identiques');
                isValid = false;
            } else if (departure <= arrival) {
                showError(departureDate, 'La date de départ doit être après la date d\'arrivée');
                isValid = false;
            }
        }

        // Validate personal info
        if (!firstName.value.trim()) {
            showError(firstName, 'Veuillez entrer votre prénom');
            isValid = false;
        }

        if (!lastName.value.trim()) {
            showError(lastName, 'Veuillez entrer votre nom de famille');
            isValid = false;
        }

        if (!validatePhone(phone.value)) {
            showError(phone, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        }

        if (!validateEmail(email.value)) {
            showError(email, 'Veuillez entrer une adresse email valide');
            isValid = false;
        }

        if (!address.value.trim()) {
            showError(address, 'Veuillez entrer votre adresse');
            isValid = false;
        }

        if (isValid) {
            formStep1.classList.add('hidden');
            formStep2.classList.remove('hidden');
            updateStepperState(1);
        }
    });

    // Handle back button
    backButton.addEventListener('click', function(e) {
        e.preventDefault();
        formStep2.classList.add('hidden');
        formStep1.classList.remove('hidden');
        updateStepperState(0);
    });

    // Handle payment method selection
    function updatePaymentMethodVisibility(value) {
        const mobileMoneyInputs = document.getElementById('mobileMoneyInputs');
        const cardPaymentInputs = document.getElementById('cardPaymentInputs');
        
        clearErrors();
        
        if (value === 'Mobile money') {
            mobileMoneyInputs.classList.remove('hidden');
            cardPaymentInputs.classList.add('hidden');
        } else if (value === 'Carte bancaire') {
            mobileMoneyInputs.classList.add('hidden');
            cardPaymentInputs.classList.remove('hidden');
        } else {
            mobileMoneyInputs.classList.add('hidden');
            cardPaymentInputs.classList.add('hidden');
        }
    }

    updatePaymentMethodVisibility(null);

    formStep2.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updatePaymentMethodVisibility(this.value);
        });
    });

    // Handle final form submission
    bookingSubmission.addEventListener('click', async function(e) {
        e.preventDefault();
        clearErrors();

        const paymentMethod = formStep2.querySelector('input[name="paymentMethod"]:checked');
        const mobileMoneyNumber = formStep2.querySelector('input[name="mobileMoneyNumber"]');
        const mobileMoneyService = formStep2.querySelector('select[name="mobileMoneyService"]');
        const cardNumber = formStep2.querySelector('input[name="cardNumber"]');
        const cardHolderName = formStep2.querySelector('input[name="cardHolderName"]');
        const expirationDate = formStep2.querySelector('input[name="expirationDate"]');
        const cvv = formStep2.querySelector('input[name="CVV"]');

        const cartTotal = window.cartTotalValue;
        const propertyId = window.propertyIdValue;
        const listingOwnerModel = window.listingOwnerModelValue;
        const listingOwner = window.listingOwnerValue; 
        const listingTitle = window.listingTitleValue;

        let isValid = true;

        const submitErrorsGroup = formStep2.querySelector('.submission-errors');

        // Validate payment method
        if (!paymentMethod) {
            const paymentMethodContainer = formStep2.querySelector('.payment-methods');
            showError(paymentMethodContainer, 'Veuillez sélectionner un mode de paiement', formStep2.querySelector('.payment-methods'));
            isValid = false;
        }

        if (paymentMethod?.value === 'Mobile money') {
            const mobileMoneyContainer = document.getElementById('mobileMoneyInputsWrapper');
            
            if (!mobileMoneyService.value) {
                showError(mobileMoneyService, 'Veuillez sélectionner un service Mobile Money', mobileMoneyContainer);
                isValid = false;
            }
            
            if (!mobileMoneyNumber.value || !validatePhone(mobileMoneyNumber.value)) {
                showError(mobileMoneyNumber, 'Veuillez entrer un numéro Mobile Money valide', mobileMoneyContainer);
                isValid = false;
            }
        } else if (paymentMethod?.value === 'Carte bancaire') {
            showError(submitErrorsGroup, 'La methode paiement choisie n\'est pas disponible ', submitErrorsGroup);
            isValid = false;

              // Card number validation
            // if (!cardNumber.value.trim() || !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
            //     showError(cardNumber, 'Veuillez entrer un numéro de carte valide');
            //     isValid = false;
            // }

            // // Card holder name validation
            // if (!cardHolderName.value.trim()) {
            //     showError(cardHolderName, 'Veuillez entrer le nom du propriétaire de la carte');
            //     isValid = false;
            // }

            // // Add event listeners for real-time formatting
            // const formatExpirationDate = (value) => {
            //     let cleaned = value.replace(/\D/g, '');
            //     if (cleaned.length >= 2) {
            //         cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
            //     }
            //     return cleaned;
            // };

            // if (!expirationDate.hasEventListener) {
            //     expirationDate.addEventListener('input', (e) => {
            //         e.target.value = formatExpirationDate(e.target.value);
            //     });
            //     expirationDate.hasEventListener = true;
            // }

            // // Expiration date validation (MM/AA format)
            // const expirationPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            // if (!expirationDate.value || !expirationPattern.test(expirationDate.value)) {
            //     showError(expirationDate, 'Veuillez entrer une date d\'expiration valide (MM/AA)');
            //     isValid = false;
            // } else {
            //     const [month, year] = expirationDate.value.split('/');
            //     const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            //     if (expDate < new Date()) {
            //         showError(expirationDate, 'La date d\'expiration ne peut pas être dans le passé');
            //         isValid = false;
            //     }
            // }

            // // Format CVV on input
            // const cvvPattern = /^\d{3,4}$/;
            // if (!cvv.hasEventListener) {
            //     cvv.addEventListener('input', (e) => {
            //         e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
            //     });
            //     cvv.hasEventListener = true;
            // }

            // // CVV validation
            // if (!cvv.value || !cvvPattern.test(cvv.value)) {
            //     showError(cvv, 'Veuillez entrer un code CVV valide (3 ou 4 chiffres)');
            //     isValid = false;
            // }
        }

        

        if (cartTotal <= 0) {
            showError(submitErrorsGroup, 'Le total du panier doit être un montant valide', submitErrorsGroup);
            isValid = false;
        }

        if (!propertyId) {
            showError(submitErrorsGroup, 'L\'ID de la propriété est requis', submitErrorsGroup);
            isValid = false;
        }
        
        if (!listingOwnerModel) {
            showError(submitErrorsGroup, 'L\'ID de l\'annonce est requis', submitErrorsGroup);
            isValid = false;
        }
        
        if (!listingOwner) {
            showError(submitErrorsGroup, 'L\'ID du propriétaire est requis', submitErrorsGroup);
            isValid = false;
        }

        if (isValid) {
            setLoadingState(bookingSubmission);
            showModal('submission_pending');

            try {
                // Create FormData object
                const formData = new FormData();
                
                // Add booking details
                formData.append('arrivalDate', formStep1.querySelector('input[name="arrivalDate"]').value);
                formData.append('departureDate', formStep1.querySelector('input[name="departureDate"]').value);
                formData.append('firstName', formStep1.querySelector('input[name="firstName"]').value);
                formData.append('lastName', formStep1.querySelector('input[name="lastName"]').value);
                formData.append('phone', formStep1.querySelector('input[name="phone"]').value);
                formData.append('email', formStep1.querySelector('input[name="email"]').value);
                formData.append('address', formStep1.querySelector('input[name="address"]').value);
                formData.append('cartTotal', cartTotal);
                formData.append('listingOwnerModel', listingOwnerModel);
                formData.append('propertyId', propertyId);
                formData.append('listingOwner', listingOwner);
                formData.append('listingTitle', listingTitle);
                
                // Add payment method
                formData.append('paymentMethod', paymentMethod.value);
                
                // Add payment details based on method
                if (paymentMethod.value === 'Mobile money') {
                    formData.append('mobileMoneyNumber', mobileMoneyNumber.value);
                    formData.append('mobileMoneyService', mobileMoneyService.value);
                } else {
                    const lastFourDigits = cardNumber.value.replace(/\s/g, '').slice(-4);
                    formData.append('cardNumberLast4', lastFourDigits);
                    formData.append('cardHolderName', cardHolderName.value);
                    formData.append('cardExpirationDate', expirationDate.value);
                }

                const formDataObject = Object.fromEntries(formData.entries());
                const payload = JSON.stringify(formDataObject);
                const res = await fetch('/user/reservation', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                });

                const data = await res.json().catch(() => null); 
                console.log(data);

                // Hide pending modal
                document.getElementById('submission_pending')?.classList.remove('open');

                const modalId = data.success ? 'submission_success' : 'submission_error';
                showModal(modalId);
                
                const modal = document.getElementById(modalId);

                if (modal && data.success) {
                    const backBtn = modal.querySelector('.back-btn');
                    const redirectBtn = modal.querySelector('.redirect-btn');

                    if (backBtn) {
                        backBtn.onclick = () => {
                            window.location.href = '/a-louer';
                        };
                    }

                    if (redirectBtn) {
                        redirectBtn.onclick = () => {
                            window.location.href = '/user/reservations';
                        };
                    }
                } else if (modal) {
                    const btn = modal.querySelector('.close-btn');
                    if (btn) {
                        btn.onclick = () => {
                            window.location.reload();
                        };
                    }
                }
                
            } catch (err) { 
                resetButton(bookingSubmission);
                document.getElementById('submission_pending')?.classList.remove('open');
                showModal('submission_error');
            }
        }
    });

    function showModal(modalId) {
        // Close all modals first
        document.getElementById('submission_success')?.classList.remove('open');
        document.getElementById('submission_error')?.classList.remove('open');
        document.getElementById('submission_pending')?.classList.remove('open');
        body.classList.remove('overflow-hidden');

        if (modalId === 'submission_success') {
            document.getElementById('submission_success')?.classList.add('open');
            body.classList.add('overflow-hidden');  
        } else if (modalId === 'submission_error') {
            document.getElementById('submission_error')?.classList.add('open');
            body.classList.add('overflow-hidden'); 
        } else if (modalId === 'submission_pending') {
            document.getElementById('submission_pending')?.classList.add('open');
            body.classList.add('overflow-hidden'); 
        }
    }
});