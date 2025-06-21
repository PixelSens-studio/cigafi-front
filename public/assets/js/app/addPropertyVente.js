document.addEventListener('DOMContentLoaded', () => {

  // --- Elements ---
  const form = document.getElementById('add-property-form');
  const elements = {
    step1: document.getElementById('step-1'),
    step2: document.getElementById('step-2'),
    btnNext: document.getElementById('btnNext'),
    btnPrevious: document.getElementById('previous'),
    btnSubmit: document.getElementById('submit'),
    typeBienDiv: document.getElementById('type_bien'),
    typeBienSelect: document.getElementById('type_bien_select'),
    prix: document.getElementById('prix'),
    caracteristiquesHabitations: document.getElementById('caracteristiques_habitations'),
    caracteristiquesTerrain: document.getElementById('caracteristiques_terrain'),
    commoditesHabitations: document.getElementById('commodites_habitations'),
    commoditesTerrain: document.getElementById('commodites_terrain'),
    categorieSelect: document.getElementById('categorie_annonce_select'),
    villeSelect: document.getElementById('ville_select'),
    quartierWrapper: document.getElementById('quartier'),
  };

  // --- 1. Dynamic Inputs Display ---
  const updateDynamicFields = () => {
    const { 
      categorieSelect,  
      caracteristiquesHabitations, 
      caracteristiquesTerrain, 
      commoditesHabitations, 
      commoditesTerrain, 
      typeBienDiv,
    } = elements;
    
    const cat = categorieSelect.value;

    // Default visibility
    const visibility = {   
      caracteristiquesHabitations: true,
      caracteristiquesTerrain: false,
      commoditesHabitations: true,
      commoditesTerrain: false,
      typeBienDiv: false, // Hide by default
    };

    if (cat === 'Terrain rural' || cat === 'Terrain urbain') {
      Object.assign(visibility, {  
        caracteristiquesHabitations: false,
        commoditesHabitations: false,
        caracteristiquesTerrain: true,
        commoditesTerrain: true,
        typeBienDiv: false,
      });
    } else if (cat === 'Villas et autres constructions') {
      Object.assign(visibility, {
        typeBienDiv: true, // Show only for this category
      });
    }

    Object.entries(visibility).forEach(([key, isVisible]) => {
      elements[key].classList.toggle('hidden', !isVisible);
    });
  };

  elements.categorieSelect.addEventListener('change', updateDynamicFields);
  elements.typeBienSelect.addEventListener('change', updateDynamicFields);

  // Call once on page load to set initial state
  updateDynamicFields();

  // --- 2. Step 1 Validation ---
  const showError = (input, message, groupWrap = false) => {
    const inCaracteristiques = input.closest('#caracteristiques_terrain, #caracteristiques_habitations');
    const inPrixGroup = input.closest('#prix');
    const inCommoditesGroup = input.closest('#commodites_terrain, #commodites_habitations');

    if (inCommoditesGroup) {
      const wrap = input.closest('.input-wraper');
      if (wrap && !wrap.querySelector('.error-message')) {
        wrap.insertAdjacentHTML('beforeend', `<div class="error-message text-red-500 text-xs mt-1">${message}</div>`);
      }
      return;
    }

    // Always place error directly under the input for caracteristiques
    let errorContainer;
    if (inCaracteristiques) {
      errorContainer = input.parentElement;
    } else if (groupWrap || inPrixGroup) {
      errorContainer = input.closest('.input-wraper') || input.parentElement;
    } else {
      errorContainer = input.parentElement;
    }
    if (!errorContainer.querySelector('.error-message')) {
      errorContainer.insertAdjacentHTML('beforeend', `<div class="error-message text-red-500 text-xs mt-1">${message}</div>`);
    }
    input.classList.add('border-red-500');
  };

  const clearErrors = () => {
    elements.step1.querySelectorAll('.error-message').forEach(e => e.remove());
    elements.step1.querySelectorAll('.border-red-500').forEach(e => e.classList.remove('border-red-500'));
  };

  const isVisible = el => el.offsetParent !== null && !el.classList.contains('hidden');

  const validateStep1 = () => {
    clearErrors();
    let valid = true;

    elements.step1.querySelectorAll('input, select, textarea').forEach(input => {
      if (!isVisible(input) || (input.type === 'checkbox' && input.closest('#commodites_terrain, #commodites_habitations'))) return;
      if ((input.type === 'checkbox' && !input.checked) || (input.type !== 'checkbox' && !input.value.trim())) {
        showError(input, 'Ce champ est requis');
        valid = false;
      }
    });

    [elements.commoditesHabitations, elements.commoditesTerrain].forEach(group => {
      if (isVisible(group) && !group.querySelectorAll('input[type="checkbox"]:checked').length) {
        showError(group.querySelector('input[type="checkbox"]'), 'Veuillez sélectionner au moins une commodité');
        valid = false;
      }
    });

    return valid;
  };

  // --- 3. Step Navigation ---
  elements.btnNext.addEventListener('click', e => {
    e.preventDefault();
    if (validateStep1()) {
      elements.step1.classList.add('hidden');
      elements.step2.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  elements.btnPrevious.addEventListener('click', e => {
    e.preventDefault();
    elements.step2.classList.add('hidden');
    elements.step1.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- 4. Step 2 Image Upload Logic ---
  const mainImageInput = document.getElementById('mainImage');
  const otherImagesInput = document.getElementById('otherImages');
  const mainImageInputState = mainImageInput?.closest('.input-group')?.querySelector('.input-state');
  const otherImagesInputState = otherImagesInput?.closest('.input-group')?.querySelector('.input-state');

  // Helper to switch state
  function switchState(inputState, state) {
    inputState.querySelectorAll('.default-state, .progress-state, .preview-state, .error-state').forEach(el => {
      el.classList.add('hidden');
    });
    const el = inputState.querySelector(`.${state}-state`);
    if (el) el.classList.remove('hidden');
  }

  // Helper to show preview
  function showPreview(inputState, file, isMultiple = false) {
    const preview = inputState.querySelector('.preview-state');
    
    // Helper function to format file size
    const formatFileSize = (bytes) => {
      if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
      return `${(bytes / 1024).toFixed(1)} KB`;
    };
    
    if (isMultiple && Array.isArray(file)) {
      const img1 = preview.querySelector('img:first-of-type');
      const img2 = preview.querySelector('img:nth-of-type(2)');
      const placeholder = preview.querySelector('.placeholder');
      const fileName = preview.querySelector('.file-name');
      
      // Reset all elements
      img1.classList.add('hidden');
      img2.classList.add('hidden');
      placeholder.classList.add('hidden');
      
      if (file.length === 1) {
        // Show only first image
        img1.src = URL.createObjectURL(file[0]);
        img1.classList.remove('hidden');
      } else if (file.length === 2) {
        // Show both images
        img1.src = URL.createObjectURL(file[0]);
        img2.src = URL.createObjectURL(file[1]);
        img1.classList.remove('hidden');
        img2.classList.remove('hidden');
      } else if (file.length > 2) {
        // Show first two images and placeholder with remaining count
        img1.src = URL.createObjectURL(file[0]);
        img2.src = URL.createObjectURL(file[1]);
        img1.classList.remove('hidden');
        img2.classList.remove('hidden');
        
        // Only show placeholder when there are more than 2 images
        placeholder.classList.remove('hidden');
        placeholder.textContent = `+${file.length - 2}`; // Display number of remaining images
      }

      fileName.textContent = `${file.length} Images ajoutées`;
      preview.querySelector('.file-size').textContent = ''; // Clear file size text
    } else {
      // Single image preview logic
      const img = preview.querySelector('.preview-image');
      const fileName = preview.querySelector('.file-name');
      const fileSize = preview.querySelector('.file-size');
      img.src = URL.createObjectURL(file);
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
    }
    
    switchState(inputState, 'preview');
  }

  // Helper to show error
  function showErrorState(inputState, message) {
    const error = inputState.querySelector('.error-state');
    const msg = error.querySelector('.error-message');
    msg.textContent = message;
    switchState(inputState, 'error');
  }

  // Main Image Handler
  if (mainImageInput && mainImageInputState) {
    mainImageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) {
        switchState(mainImageInputState, 'default');
        return;
      }
      switchState(mainImageInputState, 'progress');
      setTimeout(() => {
        if (!file.type.startsWith('image/')) {
          showErrorState(mainImageInputState, "Le fichier n'est pas une image.");
          return;
        }
        showPreview(mainImageInputState, file);
      }, 400); // Simulate upload
    });
    // Delete file
    mainImageInputState.querySelector('.delete-file')?.addEventListener('click', (e) => {
      e.preventDefault();
      mainImageInput.value = '';
      switchState(mainImageInputState, 'default');
    });
    // Close error
    mainImageInputState.querySelector('.close-error')?.addEventListener('click', (e) => {
      e.preventDefault();
      mainImageInput.value = '';
      switchState(mainImageInputState, 'default');
    });
  }

  // Other Images Handler
  if (otherImagesInput && otherImagesInputState) {
    otherImagesInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) {
        switchState(otherImagesInputState, 'default');
        return;
      }
      switchState(otherImagesInputState, 'progress');
      setTimeout(() => {
        if (files.some(f => !f.type.startsWith('image/'))) {
          showErrorState(otherImagesInputState, "Tous les fichiers doivent être des images.");
          return;
        }
        if (files.length > 9) {
          showErrorState(otherImagesInputState, "Vous pouvez sélectionner jusqu'à 9 images.");
          return;
        }
        showPreview(otherImagesInputState, files, true);
      }, 400); // Simulate upload
    });
    // Delete files
    otherImagesInputState.querySelector('.delete-file')?.addEventListener('click', (e) => {
      e.preventDefault();
      otherImagesInput.value = '';
      switchState(otherImagesInputState, 'default');
    });
    // Close error
    otherImagesInputState.querySelector('.close-error')?.addEventListener('click', (e) => {
      e.preventDefault();
      otherImagesInput.value = '';
      switchState(otherImagesInputState, 'default');
    });
  }

  // --- 5. Form Submission (with image validation) ---
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Clear any existing error messages
    const clearImageErrors = () => {
      const mainImageError = mainImageInput.closest('.input-group').querySelector('.image-error-message');
      const otherImagesError = otherImagesInput.closest('.input-group').querySelector('.image-error-message');
      if (mainImageError) mainImageError.remove();
      if (otherImagesError) otherImagesError.remove();
    };

    // Add error message under input
    const showImageError = (input, message) => {
      const inputGroup = input.closest('.input-group');
      const existingError = inputGroup.querySelector('.image-error-message');
      if (existingError) existingError.remove();
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'image-error-message text-red-500 text-xs mt-2';
      errorDiv.textContent = message;
      inputGroup.appendChild(errorDiv);
    };

    clearImageErrors();
    let valid = true;

    // Main image validation
    if (!mainImageInput.files.length) {
      showImageError(mainImageInput, "Veuillez sélectionner une image principale.");
      valid = false;
    }

    // Other images validation
    if (!otherImagesInput.files.length || otherImagesInput.files.length < 2) {
      showImageError(otherImagesInput, "Veuillez sélectionner au moins 2 autres images.");
      valid = false;
    }

    if (!valid) {
      window.scrollTo({ top: mainImageInput.closest('.input-group').offsetTop - 100, behavior: 'smooth' });
      return;
    }

    // --- Disable button and show loading spinner ---
    const submitButton = elements.btnSubmit;
    submitButton.disabled = true;
    submitButton.querySelector('.form-spinner')?.remove();
    const spinner = document.createElement("img");
    spinner.src = "../../../assets/media/illustrations/spinner.svg";
    spinner.alt = "Chargement...";
    spinner.className = "h-[1.5rem] w-[1.5rem] ml-2 form-spinner";
    submitButton.appendChild(spinner);

    // Prepare FormData
    const formData = new FormData(form);

    try {
      const res = await fetch('/admin/add-new-vente', { method: 'POST', body: formData });
      const data = await res.json().catch(() => null);
      console.log('Server response:', data);

      // Show success or error modal
      const modalId = res.ok ? 'submission_succes' : 'submission_error';
      showModal(modalId);

      // Reset submit button state
      submitButton.disabled = false;
      submitButton.querySelector('.form-spinner')?.remove();

      // Handle modal buttons
      const modal = document.getElementById(modalId);
      if (modal && res.ok) {
        // For success modal with two buttons
        const closeBtn = modal.querySelector('.close-modal');
        const redirectBtn = modal.querySelector('.redirect-modal');

        if (closeBtn) {
          closeBtn.onclick = () => {
            window.location.reload();
          };
        }

        if (redirectBtn) {
          redirectBtn.onclick = () => {
            window.location.href = '/admin/liste-annonces?createdBy=Admin&listingGroup=vente';
          };
        }
      } else if (modal) {
        // For error modal
        const btn = modal.querySelector('button');
        if (btn) {
          btn.onclick = () => {
            window.location.reload();
          };
        }
      }

    } catch (err) {
      console.error('Submission error:', err);
      showModal('submission_error');
      
      // Reset submit button state
      submitButton.disabled = false;
      submitButton.querySelector('.form-spinner')?.remove();

      const modal = document.getElementById('submission_error');
      const btn = modal?.querySelector('button');
      if (btn) {
        btn.onclick = () => {
          window.location.reload();
        };
      }
    }
  });

  // Add this function to your JS
  function showModal(modalId) {
    // Find the corresponding hidden button and trigger a click
    if (modalId === 'submission_succes') {
      document.getElementById('open-success-modal')?.click();
    } else if (modalId === 'submission_error') {
      document.getElementById('open-error-modal')?.click();
    }
  }

  // --- Ville and Quartier Logic ---
  const handleVilleChange = () => {
    const selectedVille = elements.villeSelect.value;
    
    if (elements.quartierWrapper) {
      // Hide quartier section if ville is not Lomé
      elements.quartierWrapper.classList.toggle('hidden', selectedVille !== 'Lomé');
      
      // Reset quartier selection when hiding
      if (selectedVille !== 'Lomé') {
        document.getElementById('quartier_select').value = '';
      }
    }
  };

  elements.villeSelect.addEventListener('change', handleVilleChange);

  // Initialize quartier visibility on page load
  handleVilleChange();
});