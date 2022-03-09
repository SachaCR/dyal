const common = [
  'features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require features/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
].join(' ');

const html = [
  'features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require features/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
  '--format html',
].join(' ');

const pretty = [
  'features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require features/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
  '--format @cucumber/pretty-formatter',
].join(' ');

module.exports = {
  default: common,
  html,
  pretty,
};
