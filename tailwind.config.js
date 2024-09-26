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
    extend: {},
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {},
    },
  ],
};
