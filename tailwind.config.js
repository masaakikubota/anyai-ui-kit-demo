/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2B6AF3', 600: '#1F5AE6' },
        cyan: '#16B6FF', orange: '#FF7A3D', amber: '#FFC24A',
        ink: '#0F172A', border: '#E5E7EB', muted: '#6B7280',
      },
      borderRadius: { md: '12px', lg: '16px' },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)',
        popover: '0 8px 24px rgba(0,0,0,.12)',
      },
      maxWidth: { container: '1200px' }
    }
  }
}