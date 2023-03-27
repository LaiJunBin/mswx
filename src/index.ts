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

type Method = keyof typeof rest
const customRest = {
  ...rest,
  API_PREFIX: 'http://localhost:5173',
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
  }
}

const methods: Method[] = ['get', 'post', 'put', 'delete', 'patch']
methods.forEach((method) => {
  customRest[method] = (() => {
    const fn = customRest[method]
    return (path, resolver) => {
      return fn(customRest.API_PREFIX + path, resolver)
    }
  })()
})

export { customRest as rest }
