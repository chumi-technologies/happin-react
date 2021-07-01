import { Global } from "@emotion/react"

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: proximanova;
        font-weight: 500;
        font-display: swap;
        src: url("/fonts/proximanova/proximanova-semibold-webfont.woff2") format("woff2"),
        url("/fonts/proximanova/proximanova-semibold-webfont.woff") format("woff")
      }
      @font-face {
        font-family: proximanova;
        font-weight: 600;
        font-display: swap;
        src: url("/fonts/proximanova/proximanova-bold-webfont.woff2") format("woff2"),
        url("/fonts/proximanova/proximanova-bold-webfont.woff") format("woff")
      }
      @font-face {
        font-family: proximanova;
        font-weight: 700;
        font-display: swap;
        src: url("/fonts/proximanova/proximanova-extrabold-webfont.woff2") format("woff2"),
        url("/fonts/proximanova/proximanova-extrabold-webfont.woff") format("woff")
      }
      @font-face {
        font-family: proximanova;
        font-weight: 800;
        font-display: swap;
        src: url("/fonts/proximanova/proximanova-black-webfont.woff2") format("woff2"),
        url("/fonts/proximanova/proximanova-black-webfont.woff") format("woff")
      }
      `}
  />
)

export default Fonts
