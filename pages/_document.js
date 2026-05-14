// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="es-AR">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A0A0A" />
      </Head>
      <body className="bg-brand-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
