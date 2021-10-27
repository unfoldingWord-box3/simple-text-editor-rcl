
const path = require('path');
module.exports = {
  usageMode: 'expand',
  exampleMode: 'expand',
  moduleAliases: { 'simple-text-editor': path.resolve(__dirname, 'src') },
  getComponentPathLine: componentPath => {
    const name = path.basename(componentPath, '.jsx');
    return `import { ${name} } from 'simple-text-editor';`;
  },
};