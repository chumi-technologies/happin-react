import { Global } from "@emotion/react"

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: MDPrimer;
        font-weight: 300;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Light.woff2") format("woff2"),
        url("/fonts/MDPrimer-Light.woff") format("woff"),
        url('/fonts/MDPrimer-Light.otf') format('opentype')
      }
      @font-face {
        font-family: MDPrimer;
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Regular.woff2") format("woff2"),
        url("/fonts/MDPrimer-Regular.woff") format("woff"),
        url('/fonts/MDPrimer-Regular.otf') format('opentype')
      }
      @font-face {
        font-family: MDPrimer;
        font-weight: 500;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Medium.woff2") format("woff2"),
        url("/fonts/MDPrimer-Medium.woff") format("woff"),
        url('/fonts/MDPrimer-Medium.otf') format('opentype')
      }
      @font-face {
        font-family: MDPrimer;
        font-weight: 600;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Semibold.woff2") format("woff2"),
        url("/fonts/MDPrimer-Semibold.woff") format("woff"),
        url('/fonts/MDPrimer-Semibold.otf') format('opentype')
      }
      @font-face {
        font-family: MDPrimer;
        font-weight: 700;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Bold.woff2") format("woff2"),
        url("/fonts/MDPrimer-Bold.woff") format("woff"),
        url('/fonts/MDPrimer-Bold.otf') format('opentype')
      }
      @font-face {
        font-family: MDPrimer;
        font-weight: 800;
        font-style: normal;
        font-display: swap;
        src: url("/fonts/MDPrimer-Black.woff2") format("woff2"),
        url("/fonts/MDPrimer-Black.woff") format("woff"),
        url('/fonts/MDPrimer-Black.otf') format('opentype')
      }
      `}
  />
)

export default Fonts
