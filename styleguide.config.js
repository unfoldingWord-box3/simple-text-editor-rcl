
const path = require('path');
module.exports = {
  usageMode: 'expand',
  exampleMode: 'expand',
  moduleAliases: { 'worlds-dumbest-usfm-editor': path.resolve(__dirname, 'src') },
  getComponentPathLine: componentPath => {
    const name = path.basename(componentPath, '.jsx');
    return `import { ${name} } from 'worlds-dumbest-usfm-editor';`;
  },
};