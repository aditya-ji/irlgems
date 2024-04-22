

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/*.{ejs,js}", // This will scan EJS and JS files in the views directory
    "./node_modules/flowbite/**/*.js" // This will also include Flowbite plugin JS files
  ],
  theme: {
    extend: {
      darkmode: 'class'
    }, // Add any theme extensions if needed
  },
  plugins: ['flowbite/plugin'], // Include the Flowbite plugin
}
