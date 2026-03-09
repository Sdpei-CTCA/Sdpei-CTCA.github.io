/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./index.html"],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                darkBg: '#0b1121',
                cardBg: '#151e32'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
            }
        }
    }
}
