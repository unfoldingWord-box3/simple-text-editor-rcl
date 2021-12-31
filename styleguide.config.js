
const path = require('path');
module.exports = {
  usageMode: 'expand',
  exampleMode: 'expand',
  moduleAliases: { 'simple-text-editor-rcl': path.resolve(__dirname, 'src') },
  getComponentPathLine: componentPath => {
    const name = path.basename(componentPath, '.js');
    return `import { ${name} } from 'simple-text-editor-rcl';`;
  },
};