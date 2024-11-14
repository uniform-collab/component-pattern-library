import createUniformContext from '@/context/createUniformContext';
import { enableNextSsr } from '@uniformdev/context-next';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';

import { ReactElement } from 'react';

type CustomDocumentProps = DocumentInitialProps;

function getDeviceType(userAgent: string) {
  let deviceType;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      userAgent
    )
  ) {
    deviceType = 'mobile';
  } else {
    deviceType = 'desktop';
  }

  return deviceType;
}
class AppDocument extends Document<CustomDocumentProps> {
  // Docs: https://docs.uniform.app/docs/guides/personalization/activate-personalization#server-side
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const serverTracker = createUniformContext(ctx);
    const device = getDeviceType(ctx?.req?.headers['user-agent'] || '');
    console.log('device: ', device);
    enableNextSsr(ctx, serverTracker);
    serverTracker.update({
      quirks: {
        province: 'QC',
        viewport: serverTracker.quirks.viewport ?? device,
      },
    });
    return await Document.getInitialProps(ctx);
  }

  render(): ReactElement {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
