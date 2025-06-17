/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/mainPages/*.ejs",
    "./views/mainPages/partials/*.ejs",

    "./views/userDashboard/*.ejs", 
    "./views/userDashboard/*.ejs",

    "./views/agentDashboard/*.ejs", 
    "./views/agentDashboard/*.ejs",

    "./views/adminDashboard/*.ejs",
    "./views/adminDashboard/partials/*.ejs"],
  theme: {
    extend: {
      gridTemplateColumns: {
        18: 'repeat(18, minmax(0, 1fr))',
      },
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};



