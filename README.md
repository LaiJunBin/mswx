# mswx

English｜[繁體中文](https://github.com/LaiJunBin/mswx/blob/main/README.zh-tw.md#mswx)

> The package is extension to msw(Mock Service Worker).

Currently, provide the following two features:
* [API_PREFIX](#api_prefix)
* [Middleware](#middleware)

## Install
```
$ npm i mswx
```

## API_PREFIX

Set API prefix, default is `http://localhost:5173`, if you want to disable it, can set empty string to it.

## Middleware

Define middleware.

### Basic usage
```js
import { rest } from 'mswx'


const AuthTokenMiddleware = rest.middleware((req, res, ctx, next) => {
  const authorization = req.headers.get('Authorization')
  if (authorization === 'Bearer token') {
    // Must call next(), it will continue execute.
    return next()
  }
  return res(ctx.status(401), ctx.json({ message: 'Unauthorized.' }))
})

// The following is the original usage of msw handler.
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

### Apply multiple middlewares

You can apply multiple middleware as follows:
```js
handlers.map(MiddlewareA).map(MiddlewareB)
```
Note: execute order is B then A... so on.

For more examples can refer to the [test code](https://github.com/LaiJunBin/mswx/blob/main/src/tests) on GitHub.
