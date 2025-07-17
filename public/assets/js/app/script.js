  // document.addEventListener('DOMContentLoaded', function () {
  //   console.log('hello')
  //   const btn = document.getElementById('menu-button');
  //   const bar1 = btn.querySelector('.bar1');
  //   const bar2 = btn.querySelector('.bar2');
  //   const label = btn.querySelector('.label');
  //   let open = false;

  //   btn.addEventListener('click', () => {
  //     open = !open;
  //     if (open) {
  //       bar1.classList.add('rotate-45', 'translate-y-[6px]');
  //       bar2.classList.add('-rotate-45', '-translate-y-[6px]');
  //       label.classList.add('opacity-0');
  //     } else {
  //       bar1.classList.remove('rotate-45', 'translate-y-[6px]');
  //       bar2.classList.remove('-rotate-45', '-translate-y-[6px]');
  //       label.classList.remove('opacity-0');
  //     }
  //   });
  // });



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
  