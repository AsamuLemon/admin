import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { join } from 'path'
import { resolve } from 'path'

// function resolve(dir) {
//   return join(__dirname, dir)
// }

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, "src"),
      'assets': resolve(__dirname, "src/assets"),
      'pages': resolve(__dirname, "src/pages"),
      'components': resolve(__dirname, "src/components"),
      'utils': resolve(__dirname, 'src/utils'),
    }
  },

})
