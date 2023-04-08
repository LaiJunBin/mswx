import { rest } from 'msw'
import type {
  DefaultBodyType,
  PathParams,
  RestRequest,
  RestContext,
  RestHandler,
  MockedRequest,
  ResponseComposition
} from 'msw'

const config = {
  API_PREFIX: 'http://localhost:5173'
}

type Method = keyof typeof rest

type defineResolverType = (
  req: RestRequest<DefaultBodyType, PathParams<string>>,
  res: ResponseComposition<DefaultBodyType>,
  ctx: RestContext
) => any
function define (meta: { method: string, path: string }, resolver: defineResolverType): RestHandler<MockedRequest<DefaultBodyType>>;
function define (method: string, path: string, resolver: defineResolverType): RestHandler<MockedRequest<DefaultBodyType>>;
function define (...args: any[]): RestHandler<MockedRequest<DefaultBodyType>> {
  const [method, path, resolver] = args.length === 2 ? [args[0].method, args[0].path, args[1]] : args
  return rest[method.toLowerCase() as Method](config.API_PREFIX + path, resolver)
}

const customRest = {
  ...rest,
  config,
  middleware: (
    resolver: (
      req: RestRequest<DefaultBodyType, PathParams<string>>,
      res: ResponseComposition<DefaultBodyType>,
      ctx: RestContext,
      next: () => RestHandler<MockedRequest<DefaultBodyType>>
    ) => any
  ) : (handler: RestHandler<MockedRequest<DefaultBodyType>>) => RestHandler<MockedRequest<DefaultBodyType>> => {
    return (
      handler: RestHandler<MockedRequest<DefaultBodyType>>
    ): RestHandler<MockedRequest<DefaultBodyType>> => {
      const method: Method = handler.info.method.toString().toLowerCase() as Method
      return rest[method](handler.info.path, (req, res, ctx) => {
        return resolver(req, res, ctx, () =>
          // @ts-ignore
          handler.resolver(req, res, ctx)
        )
      })
    }
  },
  define
}

const methods: Method[] = ['get', 'post', 'put', 'delete', 'patch']
methods.forEach((method) => {
  customRest[method] = (() => {
    const fn = customRest[method]
    return (path, resolver) => {
      return fn(config.API_PREFIX + path, resolver)
    }
  })()
})

export { customRest as rest }
