import {
  Context,
  ContextPlugin,
  enableContextDevTools,
  enableDebugConsoleLogDrain,
  ManifestV2,
} from '@uniformdev/context';
import { NextCookieTransitionDataStore } from '@uniformdev/context-next';
import { NextPageContext } from 'next';

import manifest from './manifest.json';

export default function createUniformContext(serverContext?: NextPageContext): Context {
  const plugins: ContextPlugin[] = [enableContextDevTools(), enableDebugConsoleLogDrain('debug')];
  const context = new Context({
    defaultConsent: true,
    manifest: manifest as ManifestV2,
    transitionStore: new NextCookieTransitionDataStore({
      serverContext,
      experimental_quirksEnabled: true,
    }),
    plugins: plugins,
  });
  return context;
}
