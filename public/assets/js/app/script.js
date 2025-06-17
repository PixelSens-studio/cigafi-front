

  document.addEventListener('DOMContentLoaded', function () {
    const villeSelect = document.getElementById('ville');
    const quartierSelect = document.getElementById('quartier');
    const defaultQuartiers = quartierSelect.innerHTML; // Save the original options

    villeSelect.addEventListener('change', function () {
      const selectedVille = this.value.trim();

      if (selectedVille.toLowerCase() !== 'lomé') {
        quartierSelect.innerHTML = '<option value="" disabled selected> Tous </option>';
      } else {
        quartierSelect.innerHTML = defaultQuartiers;
      }
    });
  });
  