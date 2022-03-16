/* eslint-disable @next/next/no-sync-scripts */
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <meta charSet='UTF-8' />
          <script src='https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
