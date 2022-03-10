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

function CustomApp(Props: CustomAppProps) {
  return Props.Component.disableLayout ? (
    <Props.Component {...Props.pageProps} />
  ) : (
    <StyledPage {...Props} />
  )
}

const StyledPage = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <div className='stylized-bg min-h-screen bg-neutral-100'>
      <Component {...pageProps} />
    </div>
  )
}

export default CustomApp
