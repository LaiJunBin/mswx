# mswx

[English](https://github.com/LaiJunBin/mswx#mswx)｜繁體中文

> 這個套件擴展了 msw(Mock Service Worker) 的功能

目前提供以下功能
* [API_PREFIX](#api_prefix)
* [Define](#define)
* [Middleware](#middleware)

## 安裝
```
$ npm i mswx
```

## API_PREFIX

設定 API 的前綴，預設值為 `http://localhost:5173`，如果不要這個功能可以直接設為空字串。

## Define

定義端點的語法糖，如下範例，兩者相等
```js
  rest.get('/url', (_, res, ctx) => {
    return res(ctx.status(200))
  })
  // 和
  rest.define('get', '/url', (_, res, ctx) => {
    return res(ctx.status(200))
  })
```

## Middleware

定義中介層(middleware)

### 基本使用
```js
import { rest } from 'mswx'


const AuthTokenMiddleware = rest.middleware((req, res, ctx, next) => {
  const authorization = req.headers.get('Authorization')
  if (authorization === 'Bearer token') {
    // 呼叫 next() 才會往下進行
    return next()
  }
  return res(ctx.status(401), ctx.json({ message: 'Unauthorized.' }))
})

// 以下為原本 msw handlers 的使用方式
const authTokenHandlers = [
  rest.get('/token', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'token'
      })
    )
  })
]

export const handlers = [
  ...authTokenHandlers.map(AuthTokenMiddleware),
]
```

### 套用多個 Middleware

可以像下面這樣套用多個 middleware
```js
handlers.map(MiddlewareA).map(MiddlewareB)
```
上面的執行順序會是先套用 MiddlewareB 再套用 MiddlewareA..依此類推

更多範例可以參考 Github 上的 [test code](https://github.com/LaiJunBin/mswx/blob/main/src/tests)
