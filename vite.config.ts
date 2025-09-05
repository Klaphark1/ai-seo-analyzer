import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.AIzaSyDw4nmwCUQDRq-Amrxek0fLgszQ9-T3b0Y),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.AIzaSyDw4nmwCUQDRq-Amrxek0fLgszQ9-T3b0Y)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
