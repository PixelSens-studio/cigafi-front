// helpers.js
exports.decorLinkFormat = function (decorName) {
    return decorName
      .toLowerCase()                          // Convert to lowercase
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, '-')                   // Replace spaces with hyphens
      .replace(/[^a-z0-9\-]/g, '');           // Remove non-alphanumeric characters except hyphens
  };