import request from 'utils/request'

const headers = {
  'Content-Type': 'application/json'
}

describe('request', () => {
  describe('success', () => {
    beforeEach(() => {
      sinon.stub(window, 'fetch')
      window.fetch
        // .withArgs(...)
        .returns(Promise.resolve(new window.Response('{"hello":"world"}', {
          status: 200,
          headers
        })))
    })

    afterEach(() => {
      window.fetch.restore()
    })

    it('200', done => {
      request({
        url: ''
      }).then(json => {
        expect(json.hello).to.equal('world')
        done()
      })
    })
  })

  describe('failure', () => {
    beforeEach(() => {
      sinon.stub(window, 'fetch')
    })

    afterEach(() => {
      window.fetch.restore()
    })

    it('404', done => {
      window.fetch
        // .withArgs(...)
        .returns(Promise.resolve(new window.Response('Not Found', {
          status: 404,
          statusText: 'Not Found'
        })))
      request({
        url: ''
      }).catch(err => {
        expect(err).to.equal('Not Found')
        done()
      })
    })

    it('404 with json', done => {
      window.fetch
        // .withArgs(...)
        .returns(Promise.resolve(new window.Response('{"hello":"world"}', {
          status: 404,
          headers
        })))
      request({
        url: ''
      }).catch(err => {
        expect(err.hello).to.equal('world')
        done()
      })
    })

    it('403 with json', done => {
      window.fetch
        // .withArgs(...)
        .returns(Promise.resolve(new window.Response('{"hello":"world"}', {
          status: 403,
          headers
        })))
      request({
        url: ''
      }).catch(err => {
        expect(err.hello).to.equal('world')
        done()
      })
    })
  })

  describe('basic', () => {
    beforeEach(() => {
      sinon.stub(window, 'fetch')
      window.fetch
        // .withArgs(...)
        .returns(Promise.resolve(new window.Response('{"hello":"world"}', {
          status: 200,
          headers
        })))
    })

    afterEach(() => {
      window.fetch.restore()
    })

    it('should NOT ok', () => {
      expect(request()).to.equal(undefined)
      expect(request('a', 'b')).to.equal(undefined)
      expect(request(false)).to.equal(undefined)
    })

    it('should ok', done => {
      request('a').then(json => {
        expect(json.hello).to.equal('world')
        done()
      })
    })

    it('should promisify options', done => {
      request('a', {
        mutate (options) {
          return options
        }
      }).finally(done)
    })

    it('should promisify options 2', done => {
      request('a', {
        mutate () {
          return true
        }
      }).finally(done)
    })

    it('should promisify options 3', done => {
      request('a', {
        mutate () {
          return false
        }
      }).finally(done)
    })

    it('should translate arguments', done => {
      let url
      request('a', {
        mutate (options) {
          url = options.url
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('a')
        done()
      })
    })

    it('should NOT has question mark', done => {
      let url
      request({
        url: 'a',
        query: {},
        mutate (options) {
          url = options.url
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('a')
        done()
      })
    })

    it('should add query to url', done => {
      let url
      request({
        url: 'a',
        query: {
          x: 1
        },
        mutate (options) {
          url = options.url
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('a?x=1')
        done()
      })
    })

    it('should add query to url 2', done => {
      let url
      request({
        url: 'a?x=1',
        query: {
          x: 1
        },
        mutate (options) {
          url = options.url
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('a?x=1&x=1')
        done()
      })
    })

    it('should replace url with params', done => {
      let url
      request({
        url: '{y}a{x}b{{x}}',
        params: {
          x: 1
        },
        mutate (options) {
          url = options.url
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('a1b{x}')
        done()
      })
    })

    it('should serialize body', done => {
      let url
      let body
      request({
        body: {
          x: 1
        },
        mutate (options) {
          url = options.url
          body = options.body
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('?x=1')
        expect(body).to.equal(undefined)
        done()
      })
    })

    it('should serialize body 2', done => {
      let url
      let body
      request({
        url: '?a=2',
        body: {
          x: 1
        },
        mutate (options) {
          url = options.url
          body = options.body
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(url).to.equal('?a=2&x=1')
        expect(body).to.equal(undefined)
        done()
      })
    })

    it('should serialize body 3', done => {
      let body
      request({
        method: 'POST',
        body: {
          x: 1
        },
        mutate (options) {
          body = options.body
          return Promise.resolve({})
        }
      }).finally(() => {
        expect(body).to.equal('{"x":1}')
        done()
      })
    })
  })
})
