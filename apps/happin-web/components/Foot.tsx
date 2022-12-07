import Link from 'next/link';

export default function Footer({ whiteLabelLogo }: { whiteLabelLogo?: any }) {
  return (
    <footer className="bg-gray-900">
      {!whiteLabelLogo ? (
        <div className="container divide-y divide-white divide-opacity-20 bg-gray-900">
          <div className="flex flex-col sm:justify-between flex-wrap sm:flex-row pt-10">
            {/*           <div className="w-52 mb-8 sm:mb-10">
            <h3 className="tracking-wide uppercase font-bold text-sm text-white">Product</h3>
            <ul className="foot-menu">
              <li>
                <a href="https://livestream.happin.app/download" target="_blank" rel="noreferrer">Download</a>
              </li>
            </ul>
          </div> */}
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm text-gray-50">
                Happin
              </h3>
              <ul className="foot-menu">
                <li>
                  <a href="mailto:partnership@happin.app">Partnership</a>
                </li>
                <li>
                  <Link href="/ambassador">Ambassador</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm text-gray-50">
                Resources
              </h3>
              <ul className="foot-menu">
                <li>
                  <Link href="/news-list">News</Link>
                </li>
                <li>
                  <a href="mailto:admin@happin.app">Contact Us</a>
                </li>
                <li>
                  <Link href="/terms">Terms Of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm text-gray-50">
                Socials
              </h3>
              <ul className="foot-menu">
                <li>
                  <a
                    href="https://www.facebook.com/HappinEventApp"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/AppHappin"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/happin.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm text-gray-50">
                Apps Download
              </h3>
              <div className="mt-4">
                <a
                  target="_blank"
                  href="https://apps.apple.com/app/id1527348429"
                  rel="noreferrer"
                >
                  <img
                    className="h-10 hover:opacity-90 transition"
                    src="/images/app-store-white.svg"
                    alt="app-store"
                  />
                </a>
              </div>
              <div className="mt-4">
                <a
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=app.happin.prod"
                  rel="noreferrer"
                >
                  <img
                    className="h-10 hover:opacity-90 transition"
                    src="/images/google-play-white.svg"
                    alt="app-store"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="py-6 text-sm text-gray-400">
            © 2021 Happin. All rights reserved.
          </div>
        </div>
      ) : (
        <>
          <div
            className="container flex justify-center"
            style={{ height: '100px', alignItems: 'center' }}
          >
            <h1 className="text-gray-50 text-center">POWERED BY Happin</h1>
          </div>
        </>
      )}
    </footer>
  );
}
