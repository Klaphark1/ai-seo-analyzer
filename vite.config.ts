import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.AIzaSyDmLsHsAeXUTNI73BDnOLJP86CgNEUBbr4),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.AIzaSyDmLsHsAeXUTNI73BDnOLJP86CgNEUBbr4)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
