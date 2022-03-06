import path from 'path';

export const getCoverageDir = (): string | undefined => {
  const fileName = require.main?.filename;
  const projectDir = fileName?.split('/node_modules/')[0];
  const coverageDir = projectDir && path.join(projectDir, 'coverage');

  return coverageDir;
}
