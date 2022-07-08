import { resolve } from 'path';
import { normalizePath } from 'vite';

const excludeRegx = /node_modules/;
function createPlugin() {
  const maps = new Map();
  const srcDir = normalizePath(resolve('./src/'));
  return {
    name: 'vite-plugin-less-copy',
    enforce: 'pre',
    apply: 'build',
    transform(code, id) {
      if (!id.endsWith('.less') || excludeRegx.test(id)) {
        return;
      }
      maps.set(id, code);
      return code;
    },
    generateBundle() {
      maps.forEach((code, file) => {
        const filename = file.replace(srcDir, '').substring(1);
        this.emitFile({
          type: 'asset',
          fileName: filename,
          source: code
        });
      });
    }
  };
}

export { createPlugin as default };
