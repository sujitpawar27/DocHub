// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      customForms: {
        'input': {
          width: '420px',
          height: '50px',
          borderRadius: '5px',
          border: '1px solid #D1D5DB',
          padding: ['13px', '16px'],
          // Add more styles as needed
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-transforms'),
    // Add other plugins if needed
  ],
};
