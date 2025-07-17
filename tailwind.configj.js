// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export const content = [
  "./views/**/*.ejs",
  "./src/**/*.js",
  "./src/dashboardPages/core/plugins/plugin.js",
  "./src/dashboardPages/core/plugins/components/theme.js",
  "./src/dashboardPages/core/plugins/components/breakpoints.js",
  "./src/dashboardPages/core/plugins/components/typography.js",
  "./src/dashboardPages/core/plugins/components/menu.js",
  "./src/dashboardPages/core/plugins/components/dropdown.js",
  "./src/dashboardPages/core/plugins/components/accordion.js",
  "./src/dashboardPages/core/plugins/components/input.js"
];
export const theme = {
  extend: {},
};
export const plugins = [];