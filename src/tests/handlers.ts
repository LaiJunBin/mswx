import { rest } from '../index'

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

const authRefererHandlers = [
  rest.get('/referer', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'referer'
      })
    )
  })
]

const authTokenAndRefererHanders = [
  rest.get('/token-referer', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'token-referer'
      })
    )
  })
]

const publicHandlers = [
  rest.post('/login', async (req, res, ctx) => {
    const { username, password } = await req.json()
    if (username !== 'admin' || password !== '1234') {
      return res(
        ctx.status(400)
      )
    }

    return res(
      ctx.status(200),
      ctx.json({
        data: 'token'
      })
    )
  })
]

const defineHandlers = [
  rest.define('get', '/define', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'get'
      })
    )
  }),
  rest.define('post', '/define', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'post'
      })
    )
  }),
  rest.define('GET', '/define-upper', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: 'get upper'
      })
    )
  })
]

const AuthTokenMiddleware = rest.middleware((req, res, ctx, next) => {
  const authorization = req.headers.get('Authorization')
  if (authorization === 'Bearer token') {
    return next()
  }
  return res(ctx.status(401), ctx.json({ message: 'Unauthorized.' }))
})

const AuthRefererMiddleware = rest.middleware((req, res, ctx, next) => {
  const referer = req.headers.get('Referer')
  if (referer === 'http://localhost:5173') {
    return next()
  }
  return res(ctx.status(403), ctx.json({ message: 'Forbidden.' }))
})

export const handlers = [
  ...authTokenHandlers.map(AuthTokenMiddleware),
  ...authRefererHandlers.map(AuthRefererMiddleware),
  ...authTokenAndRefererHanders.map(AuthTokenMiddleware).map(AuthRefererMiddleware),
  ...publicHandlers,
  ...defineHandlers
]
