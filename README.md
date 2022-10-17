# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

> 개발모드 npm run dev

From your terminal:

```sh
npm run dev
```

`app/root.tsx` 파일에 `<LiveReload/>` 컴포넌트 필요

```jsx
import { LiveReload } from "@remix-run/react";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
      </head>
      <body>
        Hello world
        <LiveReload />
      </body>
    </html>
  );
}
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

### 라우팅 설명

#### 디렉터리 기반 라우팅

- 디렉터리랑 똑같은 파일 이름 => 해당 경로로 가면 열림
- 디렉터리랑 똑같은 폴더 이름 => 해당 파일의 Outlet에 렌더링 됨
- ex jokes.tsx는 jokes.tsx 아울렛 안에 jokes/index.tsx를 렌더링함

#### 변수를 이용한 라우팅

`/jokes/$jokeId`처럼 달러 이용
매개변수화된 경로를 만들기 위해 파일 이름에 $ 문자를 사용합니다.
[컨벤션](https://remix.run/docs/en/v1/api/conventions#route-file-conventions)

#### CSS 적용

root 컴포넌트의 `<Link/>`  
컴포넌트 별 link 펑션을 이용해 경로별 스타일 적용

```tsx
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};
```

링크 컴포넌트에 미디어 쿼리 적용 가능  
많은 Remix 사용자가 Tailwind에 매우 만족하며 이 접근 방식을 권장합니다.  
기본적으로 URL(또는 URL을 가져오기 위해 가져올 수 있는 CSS 파일)을 제공할 수 있는 경우  
Remix가 캐싱 및 로드/언로드를 위해 브라우저 플랫폼을 활용할 수 있기 때문에 일반적으로 좋은 접근 방식입니다.
