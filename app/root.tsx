import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Outlet } from "@remix-run/react";

import globalLargeStylesUrl from "./styles/global-large.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalStylesUrl from "./styles/global.css";
// Did you know that <link /> tags can use media queries? Check out the MDN page for <link />.
export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
