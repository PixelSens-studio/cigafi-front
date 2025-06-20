document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    console.log('Form data:', Object.fromEntries(formData.entries()));

    const title = formData.get('title')?.trim();
    const price = formData.get('price')?.trim();
    const place = formData.get('place')?.trim();
    const mainImage = formData.get('mainImage');
    const otherImages = formData.getAll('otherImage');

    if (!title || !price || !place || !mainImage || otherImages.length < 2 || !otherImages[0] || !otherImages[1]) {
      alert('Veuillez remplir tous les champs et sélectionner les fichiers.');
      return;
    }

    try {
      const res = await fetch('/admin/add-new-location', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('Succès : Données envoyées.');
        form.reset();
      } else {
        alert('Erreur : ' + (data.error || 'Une erreur est survenue.'));
      }
    } catch (err) {
      alert('Erreur réseau ou serveur.');
    }
  });
});

console.log('Form test script loaded successfully.');