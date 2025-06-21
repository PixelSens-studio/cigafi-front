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
    prixNonMeuble: document.getElementById('prix_nonMeuble'),
    prixBienMeuble: document.getElementById('prix_bienMeuble'),
    prixTerrain: document.getElementById('prix_terrain'),
    caracteristiquesHabitations: document.getElementById('caracteristiques_habitations'),
    caracteristiquesTerrain: document.getElementById('caracteristiques_terrain'),
    commoditesHabitations: document.getElementById('commodites_habitations'),
    commoditesTerrain: document.getElementById('commodites_terrain'),
    rules: document.getElementById('rules'),
    categorieSelect: document.getElementById('categorie_annonce_select'),
    usageType: document.getElementById('usage_type'),
    villeSelect: document.getElementById('ville_select'),
    quartierWrapper: document.getElementById('quartier'),
  };

  // --- 1. Dynamic Inputs Display ---
  const updateDynamicFields = () => {
    const { 
      categorieSelect, 
      typeBienSelect, 
      typeBienDiv, 
      prixNonMeuble, 
      prixBienMeuble, 
      prixTerrain, 
      caracteristiquesHabitations, 
      caracteristiquesTerrain, 
      commoditesHabitations, 
      commoditesTerrain, 
      rules, 
      usageType
    } = elements;
    
    const cat = categorieSelect.value;
    const typeBien = typeBienSelect.value.toLowerCase();
    const usage = usageType.querySelector('#usage_type_select').value;

    // Default visibility
    const visibility = {
      typeBienDiv: true,
      prixNonMeuble: true,
      prixBienMeuble: false,
      prixTerrain: false,
      caracteristiquesHabitations: true,
      caracteristiquesTerrain: false,
      commoditesHabitations: true,
      commoditesTerrain: false,
      rules: true, 
      usageType: true
    };

    if (cat === 'terrains-urbain' || cat === 'terrains-ruraux') {
      Object.assign(visibility, {
        typeBienDiv: false,
        prixNonMeuble: false,
        prixBienMeuble: false,
        prixTerrain: true,
        caracteristiquesHabitations: false,
        commoditesHabitations: false,
        rules: false,
        caracteristiquesTerrain: true,
        commoditesTerrain: true, 
        usageType: false
      });
    } else if (usage === 'Appartement meublé') {
      Object.assign(visibility, {
        prixNonMeuble: false,
        prixBienMeuble: true,
        prixTerrain: false,
        usageType: true
      });
    } else if (cat === 'habitations-bureaux') {
      visibility.usageType = true;
      visibility.prixNonMeuble = true;
      visibility.prixBienMeuble = false;
      visibility.prixTerrain = false;
    } else {
      visibility.commoditesTerrain = false;
      visibility.caracteristiquesTerrain = false;
      visibility.prixTerrain = false; 
      visibility.prixNonMeuble = true;
      visibility.prixBienMeuble = false;
      usageType: true;
    }

    Object.entries(visibility).forEach(([key, isVisible]) => {
      elements[key].classList.toggle('hidden', !isVisible);
    });
  };

  elements.categorieSelect.addEventListener('change', updateDynamicFields);
  elements.typeBienSelect.addEventListener('change', updateDynamicFields);
  elements.usageType.querySelector('#usage_type_select').addEventListener('change', updateDynamicFields);

  // Call once on page load to set initial state
  updateDynamicFields();

  // --- 2. Step 1 Validation ---
  const showError = (input, message, groupWrap = false) => {
    const inCaracteristiques = input.closest('#caracteristiques_terrain, #caracteristiques_habitations');
    const inPrixGroup = input.closest('#prix_terrain, #prix_bienMeuble, #prix_nonMeuble');
    const inCommoditesGroup = input.closest('#commodites_terrain, #commodites_habitations');

    if (inCommoditesGroup) {
      const wrap = input.closest('.input-wraper');
      if (wrap && !wrap.querySelector('.error-message')) {
        wrap.insertAdjacentHTML('beforeend', `<div class="error-message text-red-500 text-xs mt-1">${message}</div>`);
      }
      return;
    }

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
      if (!isVisible(input) || input.closest('#rules') || (input.type === 'checkbox' && input.closest('#commodites_terrain, #commodites_habitations'))) return;
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

  // --- 3. Rules Input Group ---
  const rulesGrid = elements.rules?.querySelector('.grid');
  if (rulesGrid) {
    elements.rules.querySelector('button').addEventListener('click', e => {
      e.preventDefault();
      let allFilled = true;
      const inputs = Array.from(rulesGrid.querySelectorAll('input'));
      inputs.forEach(input => {
        input.parentElement.querySelector('.error-message')?.remove();
        input.classList.remove('border-red-500');
        if (!input.value.trim()) {
          showError(input, 'Veuillez remplir cette règle avant d\'en ajouter une nouvelle');
          allFilled = false;
        }
      });
      if (allFilled) {
        const lastInputDiv = inputs[inputs.length - 1].parentElement;
        const newDiv = document.createElement('div');
        newDiv.className = 'flex flex-col w-full';
        newDiv.innerHTML = `<input class="input w-full" name="regle_propriete[]" placeholder="Ex: Animaux interdits" type="text" />`;
        lastInputDiv.insertAdjacentElement('afterend', newDiv);
      }
    });
  }

  // --- 4. Step Navigation ---
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

  // --- 5. Step 2 Image Upload Logic ---
  const mainImageInput = document.getElementById('mainImage');
  const otherImagesInput = document.getElementById('otherImages');
  const mainImageInputState = mainImageInput?.closest('.input-group')?.querySelector('.input-state');
  const otherImagesInputState = otherImagesInput?.closest('.input-group')?.querySelector('.input-state');

  function switchState(inputState, state) {
    inputState.querySelectorAll('.default-state, .progress-state, .preview-state, .error-state').forEach(el => {
      el.classList.add('hidden');
    });
    const el = inputState.querySelector(`.${state}-state`);
    if (el) el.classList.remove('hidden');
  }

  function showPreview(inputState, file, isMultiple = false) {
    const preview = inputState.querySelector('.preview-state');
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
      
      img1.classList.add('hidden');
      img2.classList.add('hidden');
      placeholder.classList.add('hidden');
      
      if (file.length === 1) {
        img1.src = URL.createObjectURL(file[0]);
        img1.classList.remove('hidden');
      } else if (file.length === 2) {
        img1.src = URL.createObjectURL(file[0]);
        img2.src = URL.createObjectURL(file[1]);
        img1.classList.remove('hidden');
        img2.classList.remove('hidden');
      } else if (file.length > 2) {
        img1.src = URL.createObjectURL(file[0]);
        img2.src = URL.createObjectURL(file[1]);
        img1.classList.remove('hidden');
        img2.classList.remove('hidden');
        placeholder.classList.remove('hidden');
        placeholder.textContent = `+${file.length - 2}`;
      }

      fileName.textContent = `${file.length} Images ajoutées`;
      preview.querySelector('.file-size').textContent = '';
    } else {
      const img = preview.querySelector('.preview-image');
      const fileName = preview.querySelector('.file-name');
      const fileSize = preview.querySelector('.file-size');
      img.src = URL.createObjectURL(file);
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
    }
    
    switchState(inputState, 'preview');
  }

  function showErrorState(inputState, message) {
    const error = inputState.querySelector('.error-state');
    const msg = error.querySelector('.error-message');
    msg.textContent = message;
    switchState(inputState, 'error');
  }

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
      }, 400);
    });
    mainImageInputState.querySelector('.delete-file')?.addEventListener('click', (e) => {
      e.preventDefault();
      mainImageInput.value = '';
      switchState(mainImageInputState, 'default');
    });
    mainImageInputState.querySelector('.close-error')?.addEventListener('click', (e) => {
      e.preventDefault();
      mainImageInput.value = '';
      switchState(mainImageInputState, 'default');
    });
  }

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
      }, 400);
    });
    otherImagesInputState.querySelector('.delete-file')?.addEventListener('click', (e) => {
      e.preventDefault();
      otherImagesInput.value = '';
      switchState(otherImagesInputState, 'default');
    });
    otherImagesInputState.querySelector('.close-error')?.addEventListener('click', (e) => {
      e.preventDefault();
      otherImagesInput.value = '';
      switchState(otherImagesInputState, 'default');
    });
  }

  // --- 6. Form Submission (with image validation) ---
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const clearImageErrors = () => {
      const mainImageError = mainImageInput.closest('.input-group').querySelector('.image-error-message');
      const otherImagesError = otherImagesInput.closest('.input-group').querySelector('.image-error-message');
      if (mainImageError) mainImageError.remove();
      if (otherImagesError) otherImagesError.remove();
    };

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

    if (!mainImageInput.files.length) {
      showImageError(mainImageInput, "Veuillez sélectionner une image principale.");
      valid = false;
    }

    if (!otherImagesInput.files.length || otherImagesInput.files.length < 2) {
      showImageError(otherImagesInput, "Veuillez sélectionner au moins 2 autres images.");
      valid = false;
    }

    if (!valid) {
      window.scrollTo({ top: mainImageInput.closest('.input-group').offsetTop - 100, behavior: 'smooth' });
      return;
    }

    const submitButton = elements.btnSubmit;
    submitButton.disabled = true;
    submitButton.querySelector('.form-spinner')?.remove();
    const spinner = document.createElement("img");
    spinner.src = "../../../assets/media/illustrations/spinner.svg";
    spinner.alt = "Chargement...";
    spinner.className = "h-[1.5rem] w-[1.5rem] ml-2 form-spinner";
    submitButton.appendChild(spinner);

    const formData = new FormData(form);

    try {
      const res = await fetch('/admin/add-new-location', { method: 'POST', body: formData });
      const data = await res.json().catch(() => null);
      console.log('Server response:', data);

      const modalId = res.ok ? 'submission_succes' : 'submission_error';
      showModal(modalId);

      submitButton.disabled = false;
      submitButton.querySelector('.form-spinner')?.remove();

      const modal = document.getElementById(modalId);
      if (modal && res.ok) {
        const closeBtn = modal.querySelector('.close-modal');
        const redirectBtn = modal.querySelector('.redirect-modal');

        if (closeBtn) {
            closeBtn.onclick = () => {
            window.location.reload();
            };
        }

        if (redirectBtn) {
          redirectBtn.onclick = () => {
            window.location.href = '/admin/liste-annonces';
          };
        }
      } else if (modal) {
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

  function showModal(modalId) {
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
      elements.quartierWrapper.classList.toggle('hidden', selectedVille !== 'Lomé');
      
      if (selectedVille !== 'Lomé') {
        document.getElementById('quartier_select').value = '';
      }
    }
  };

  elements.villeSelect.addEventListener('change', handleVilleChange);

  handleVilleChange();
});