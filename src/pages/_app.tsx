import '@fontsource/inter/variable.css'
import '../style/globals.css'

import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Script from 'next/script'

type CustomAppProps = AppProps & {
  Component: NextPage & {
    disableLayout?: boolean
  }
}

function CustomApp({ Component, pageProps }: CustomAppProps) {
  return Component.disableLayout ? (
    <Component {...pageProps} />
  ) : (
    <div className='bg-gray-100 min-h-screen'>
      <Component {...pageProps} />
      <Script
        src='https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js'
        strategy='beforeInteractive'
      />
    </div>
  )
}

export default CustomApp
