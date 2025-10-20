import { defineConfig, presetUno, presetAttributify, presetIcons, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetIcons()
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    colors: {
      brand: {
        DEFAULT: '#3c82f6'
      }
    },
    fontFamily: {
      sans: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
    },
    borderRadius: {
      xl: '12px'
    }
  },
  safelist: [
    'container',
    'mx-auto',
    'px-4',
    'sm:px-6',
    'md:px-8',
    'text-sm',
    'md:text-base'
  ]
})