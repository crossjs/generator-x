// sync from: https://github.com/crossjs/plato-request

import 'whatwg-fetch'
import Promise from 'nuo'
import qs from 'query-string'
import template from 'string-template'
import isPlainObj from 'lodash.isplainobject'

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: 'GET',
  // 强制返回的结果按 JSON 处理，用于 File 协议的请求
  forceJSON: false
}

/**
 * request
 *
 *   request({
 *     url: 'path',
 *     query: { ... },
 *     params: { ... },
 *     body: { ... }
 *     headers: { ... }
 *   })
 *   request('path')
 *   request('path', { ... })
 *
 * @param  {String|Object} options   Options
 * @return {Promise}                 Promise
 */
export default function request (...args) {
  if (args.length === 0) {
    console.warn('URL or Options is Required!')
    return
  }

  if (typeof args[0] === 'string') {
    if (args[1] === undefined) {
      args[1] = {}
    } else if (!isPlainObj(args[1])) {
      console.warn('Options MUST be Object!')
      return
    }
    args[1].url = args[0]
    args[0] = args[1]
  }

  if (!isPlainObj(args[0])) {
    console.warn('Options MUST be Object!')
    return
  }
  return new Promise((resolve, reject) => {
    promisify(parseOptions(merge({}, defaultOptions, args[0])))
    .then(({ url, ...options }) => fetch(url, options))
    .then(res => {
      if (res && (isHttpOk(res) || isFileOk(res))) {
        getBody(res, args[0].forceJSON).then(resolve, reject)
      } else {
        getBody(res, args[0].forceJSON).then(reject)
      }
    })
    .catch(reject)
  })
}

function merge (src, ...args) {
  args.forEach(arg => {
    Object.keys(arg).forEach(key => {
      if (isPlainObj(arg[key])) {
        if (!src.hasOwnProperty(key)) {
          src[key] = {}
        }
        Object.assign(src[key], arg[key])
      } else {
        src[key] = arg[key]
      }
    })
  })
  return src
}

function isHttpOk (res) {
  return res.status >= 200 && res.status < 400
}

function isFileOk (res) {
  return res.status === 0 && (res.url.indexOf('file://') === 0 || res.url === '')
}

function getBody (res, forceJSON) {
  const type = res.headers.get('Content-Type')
  return (forceJSON || (type && type.indexOf('json') !== -1)) ? res.json() : res.text()
}

function parseOptions ({ url = '', query, params, body, mutate, ...options }) {
  if (body) {
    if (typeof body === 'object') {
      if (/^(POST|PUT|PATCH)$/i.test(options.method)) {
        body = JSON.stringify(body)
      } else {
        url += ((url.indexOf('?') !== -1) ? '&' : '?') + qs.stringify(body)
        body = null
      }
    }
    if (body) {
      options.body = body
    }
  }

  if (query) {
    if (typeof query === 'object') {
      query = qs.stringify(query)
    }

    if (query) {
      url += ((url.indexOf('?') !== -1) ? '&' : '?') + query
    }
  }

  // 替换地址中的宏变量：{xyz}
  if (params) {
    url = template(url, params)
  }

  options.url = url

  // mutate must be a function and could return a promise
  // useful for add authorization
  return mutate ? mutate(options) : options
}

function promisify (val) {
  if (val && val.then && typeof val.then === 'function') {
    return val
  }
  return Promise.resolve(val)
}
