import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import axios from 'axios'
import { rest } from '../'

axios.defaults.baseURL = rest.API_PREFIX

const server = setupServer(...handlers)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('test middleware', () => {
  describe('auth token middleware', () => {
    test('failed without header', async () => {
      await axios.get('/token').catch(err => {
        expect(err.response.status).toBe(401)
      })
    })

    test('failed with wrong token', async () => {
      await axios.get('/token', {
        headers: {
          Authorization: 'Bearer wrong'
        }
      }).catch(err => {
        expect(err.response.status).toBe(401)
      })
    })

    test('success', async () => {
      await axios.get('/token', {
        headers: {
          Authorization: 'Bearer token'
        }
      }).then(res => {
        expect(res.status).toBe(200)
      })
    })
  })

  describe('auth referer middleware', () => {
    test('failed without header', async () => {
      await axios.get('/referer').catch(err => {
        expect(err.response.status).toBe(403)
      })
    })

    test('failed with wrong referer', async () => {
      await axios.get('/token', {
        headers: {
          Referer: 'http://localhost:5174'
        }
      }).catch(err => {
        expect(err.response.status).toBe(401)
      })
    })

    test('success', async () => {
      await axios.get('/referer', {
        headers: {
          Referer: 'http://localhost:5173'
        }
      }).then(res => {
        expect(res.status).toBe(200)
      })
    })
  })

  describe('auth token and referer middleware', () => {
    test('first failed with referer', async () => {
      await axios.get('/token-referer').catch(err => {
        expect(err.response.status).toBe(403)
      })
    })

    test('second failed with token', async () => {
      await axios.get('/token-referer', {
        headers: {
          Referer: 'http://localhost:5173'
        }
      }).catch(err => {
        expect(err.response.status).toBe(401)
      })
    })

    test('success', async () => {
      await axios.get('/token-referer', {
        headers: {
          Authorization: 'Bearer token',
          Referer: 'http://localhost:5173'
        }
      }).catch(err => {
        expect(err.response.status).toBe(401)
      })
    })
  })

  describe('public middleware', () => {
    test('login failed', async () => {
      await axios.post('/login', {
        username: 'admin',
        password: '123'
      }).catch(err => {
        expect(err.response.status).toBe(400)
      })
    })

    test('login success', async () => {
      await axios.post('/login', {
        username: 'admin',
        password: '1234'
      }).then(res => {
        expect(res.status).toBe(200)
      })
    })
  })
})