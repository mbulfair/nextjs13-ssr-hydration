import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'stencil-components',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-hydrate-script', //This will cause the SOURCEMAP_ERROR warning, known issue by ionic/stencil
    },
    reactOutputTarget({
      includeDefineCustomElements: true,
      componentCorePackage: '@matt/stencil-components',
      proxiesFile: '../react-library/lib/components/stencil-generated/index.ts',
    }),
  ],
};
