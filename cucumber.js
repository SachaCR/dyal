const common = [
  './**/features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require ./**/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
].join(' ');

const html = [
  './**/features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require ./**/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
  '--format html',
].join(' ');

module.exports = {
  default: common,
  html,
};
