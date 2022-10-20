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

### CSS 적용

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

### DataBase

#### Set up Prisma

In this tutorial we're going to use our own SQLite database. Essentially, it's a database that lives in a file on your computer, is surprisingly capable, and best of all it's supported by Prisma, our favorite database ORM! It's a great place to start if you're not sure what database to use.

There are two packages that we need to get started:

prisma for interacting with our database and schema during development.  
@prisma/client for making queries to our database during runtime.

> 💿 Install the prisma packages:

```bash
npm install --save-dev prisma
npm install @prisma/client
```

> 💿 Now we can initialize prisma with sqlite:

```bash
npx prisma init --datasource-provider sqlite
```

> @see [schema](./prisma/schema.prisma)

```bash
 npx prisma db push
```

데이터베이스가 엉망이라면 언제든지 prisma/dev.db 파일을 삭제하고
npx prisma db push를 다시 실행할 수 있습니다.
또한 npm run dev로 개발 서버를 다시 시작하는 것을 잊지 마세요.

다음으로 테스트 데이터를 시드할 코드를 작성합니다.

> @see [seed.ts](./prisma/seed.ts)

아래 코드를 packaje.json에 추가하면, 프리즈마 db가 리세될 때마다 해당 코드를 실행합니다.

```ts
  "prisma": {
    "seed": "node --require esbuild-register prisma/seed.ts"
  },

```

#### Connect to database

개발 모드에서 커넥션 모자라지 않게 하기

개발 중에 서버 측 변경을 수행할 때마다 서버를 닫고 완전히 다시 시작하고 싶지 않을 것입니다.
@remix-run/serve는 코드를 다시 빌드하고, 코드를 다시 실행합니다.
문제는 코드를 변경할 때마다 데이터베이스에 새로운 연결을 만들면 결국에는 커넥션이 부족해집니다.

> @see [db.server.ts](./app/utils/db.server.ts)

파일 이름에 .server를 추가하는 것은 브라우저를 위해 번들링할 때
이 모듈이나 해당 모듈의 가져오기를 신경쓰지 않도록 하는
컴파일러에 대한 힌트입니다.
.server는 컴파일러에 대한 일종의 경계 역할을 합니다.

#### Remix loader에서 데이터 읽기

Remix에서 각 라우트 모듈은 자체 데이터를 가져오는 역할을 합니다.
따라서 /jokes 경로에 대한 데이터가 필요한 경우 app/routes/jokes.tsx 파일을 업데이트합니다.

Remix 경로 모듈에서 데이터를 로드하려면 로더를 사용합니다.
로더는 단순히 export된 비동기 함수입니다.
이것은 응답을 반환하며, useLoaderData 훅을 통해 컴포넌트에서 액세스할 수 있습니다.
다음은 간단한 예입니다.

```ts
// this is just an example. No need to copy/paste this 😄
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Sandwich } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { sandwiches: Array<Sandwich> };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    sandwiches: await db.sandwich.findMany(),
  };
  return json(data);
};

export default function Sandwiches() {
  const data = useLoaderData<LoaderData>();
  return (
    <ul>
      {data.sandwiches.map((sandwich) => (
        <li key={sandwich.id}>{sandwich.name}</li>
      ))}
    </ul>
  );
}
```
