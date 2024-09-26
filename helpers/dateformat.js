// helpers.js
exports.formatDate = function (date) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const [day, month, year] = date.split('-');
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  };

  exports.formatFullDate = function (isoDate) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
  
    // Create a Date object from the ISO string
    const date = new Date(isoDate);
  
    // Extract day, month, and year
    const day = ('0' + date.getDate()).slice(-2); // Add leading 0 for day
    const month = months[date.getMonth()];        // Get month name
    const year = date.getFullYear();
  
    // Extract hours and minutes
    const hours = ('0' + date.getHours()).slice(-2);   // Add leading 0 for hours
    const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading 0 for minutes
  
    // Return the formatted string
    return `${day} ${month} ${year} à ${hours}h:${minutes}`;
  };
  