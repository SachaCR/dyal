const common = [
  'features/**/*.feature', // Specify our feature files
  '--require-module ts-node/register', // Load TypeScript module
  '--require features/step_definitions/**/*.ts', // Load step definitions
  '--publish-quiet',
].join(' ');

module.exports = {
  default: common,
};
