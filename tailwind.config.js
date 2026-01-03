/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'] },
            colors: {
                peach: {
                    50: '#fef5f1',
                    100: '#fdeae0',
                    200: '#fbd4c1',
                    300: '#f8b99c',
                    400: '#f59870',
                    500: '#f27a4f',
                    600: '#e85d30'
                }
            }
        },
    },
    plugins: [],
}
