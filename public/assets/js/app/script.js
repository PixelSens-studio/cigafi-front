// assets/js/main.js (or consolidate into individual files as appropriate)

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle Logic ---
    const menuButton = document.getElementById('menu-button');
    const navbar = document.getElementById('navbar');
    const body = document.body;

    if (menuButton && navbar && body) {
        menuButton.addEventListener('click', () => {
            navbar.classList.toggle('menu-opened');
            body.classList.toggle('menu-opened'); // Prevents body scroll when menu is open
        });
    } else {
        console.warn("Menu script: One or more required elements (menu-button, navbar) were not found.");
    }


// --- Image Slider Logic ---
    const imageGrid = document.querySelector('.grid.grid-rows-2.gap-5.my-6');
    const imageSlider = document.getElementById('imageSlider');
    const sliderImage = document.getElementById('slider');
    const sliderCount = document.getElementById('sliderCount');
    const closeSliderBtn = document.getElementById('closeSlider');
    const prevImageBtn = document.getElementById('prevImage');
    const nextImageBtn = document.getElementById('nextImage');
    const moreImagesOverlay = document.getElementById('moreImagesOverlay'); // Get the new overlay element

    let currentImageIndex = 0;
    const allImagePaths = window.allSliderImages || []; 

    if (imageSlider && sliderImage && sliderCount && closeSliderBtn && prevImageBtn && nextImageBtn) {
        /**
         * Updates the image and counter in the slider.
         */
        const updateSlider = () => {
            if (allImagePaths.length === 0) {
                console.warn("Image slider: No image paths available.");
                return;
            }

            // Loop back to start/end if index goes out of bounds
            if (currentImageIndex < 0) {
                currentImageIndex = allImagePaths.length - 1;
            } else if (currentImageIndex >= allImagePaths.length) {
                currentImageIndex = 0;
            }

            sliderImage.src = allImagePaths[currentImageIndex];
            sliderCount.textContent = `${currentImageIndex + 1} / ${allImagePaths.length}`;
        };

        /**
         * Opens the image slider to a specific image.
         * @param {string} clickedImageSrc - The src of the image that was clicked.
         * @param {number} [startIndex] - Optional. The index to start the slider at directly.
         */
        const openSlider = (clickedImageSrc, startIndex = -1) => {
            let initialIndex;

            if (startIndex !== -1) {
                initialIndex = startIndex; // Use provided start index
            } else {
                // Find the index of the clicked image
                initialIndex = allImagePaths.indexOf(clickedImageSrc);

                // If direct src match fails (e.g., due to relative vs. absolute paths), try by filename
                if (initialIndex === -1 && clickedImageSrc) {
                    const clickedFilename = clickedImageSrc.split('/').pop();
                    initialIndex = allImagePaths.findIndex(path => path.endsWith(clickedFilename));
                }
            }

            currentImageIndex = initialIndex !== -1 ? initialIndex : 0; // Default to first if not found

            updateSlider();
            imageSlider.classList.remove('hidden');
            body.classList.add('overflow-hidden'); // Prevent body scroll
        };

        /**
         * Closes the image slider.
         */
        const closeSlider = () => {
            imageSlider.classList.add('hidden');
            body.classList.remove('overflow-hidden'); // Allow body scroll
        };

        // Event listener for opening the slider from individual images in the grid
        if (imageGrid) {
            imageGrid.addEventListener('click', (event) => {
                const clickedImg = event.target.closest('img');
                // Check if the clicked element is an image AND NOT inside the special overlay
                // This ensures the general image click handler doesn't conflict with the overlay's
                if (clickedImg && !event.target.closest('#moreImagesOverlay')) {
                    openSlider(clickedImg.src);
                }
            });
        }

        // Event listener for the new 'more images' overlay
        if (moreImagesOverlay) {
            moreImagesOverlay.addEventListener('click', () => {
                // When the overlay is clicked, open the slider on the 5th image (index 4)
                // This assumes allImagePaths includes the thumbnail at index 0,
                // and then property.media.photos[0] at index 1, etc.
                // So, property.media.photos[3] is actually the 5th image in the combined list (index 4).
                // Let's confirm the mapping based on your EJS setup for allSliderImages:
                // Thumbnail (index 0)
                // photo[0] (index 1)
                // photo[1] (index 2)
                // photo[2] (index 3)
                // photo[3] (index 4) <-- This is the image under the overlay
                openSlider(null, 4); // We don't need clickedImageSrc, just the starting index
            });
        }


        // Event listeners for slider controls
        closeSliderBtn.addEventListener('click', closeSlider);
        prevImageBtn.addEventListener('click', () => {
            currentImageIndex--;
            updateSlider();
        });
        nextImageBtn.addEventListener('click', () => {
            currentImageIndex++;
            updateSlider();
        });

        // Keyboard navigation for slider
        document.addEventListener('keydown', (event) => {
            if (!imageSlider.classList.contains('hidden')) {
                if (event.key === 'ArrowLeft') {
                    currentImageIndex--;
                    updateSlider();
                } else if (event.key === 'ArrowRight') {
                    currentImageIndex++;
                    updateSlider();
                } else if (event.key === 'Escape') {
                    closeSlider();
                }
            }
        });
    } else {
        console.warn("Image slider script: One or more required elements were not found.");
    }

    // --- City/Neighborhood (Ville/Quartier) Dropdown Logic ---
    const villeSelect = document.getElementById('ville');
    const quartierSelect = document.getElementById('quartier');

    // Only proceed if both elements exist
    if (villeSelect && quartierSelect) {
        // Save the original quartier options when the page loads
        // This assumes 'quartier' has initial options that are relevant for 'Lomé'.
        const defaultQuartiers = quartierSelect.innerHTML;

        villeSelect.addEventListener('change', function () {
            const selectedVille = this.value.trim().toLowerCase(); // Normalize for comparison

            // If selected city is not 'lomé', reset quartier to a default "Tous" option
            if (selectedVille !== 'lomé') {
                quartierSelect.innerHTML = '<option value="" disabled selected>Tous</option>';
            } else {
                // Otherwise, restore the original quartier options
                quartierSelect.innerHTML = defaultQuartiers;
            }
        });
    } else {
        console.warn("City/Neighborhood script: Could not find 'ville' or 'quartier' select elements.");
    }
});