This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.

# SSO Usage
## window.parent.postMessage
### close sso
```{ action: 'close' }```

### redirect
```{ action: 'redirect', payload: { url: redirectURL } }```

## Query
### origin
string, `e.g. https://ticketing.happin.app`
### role
string, `Fan (default) | Organizer`
### mode
string, `sign-in (default) | sign-up`
