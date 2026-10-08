import { getClientIp } from 'request-ip'

import config from './config.js'
import createDate from './createDate.js'
import { isSet } from './ignoreCookie.js'
import isAuthenticated from './isAuthenticated.js'

const authentications = new Map()

const authenticate = async (authorization) => {
  const validUntil = authentications.get(authorization)

  if (validUntil != null && validUntil > Date.now()) {
    return true
  }

  const result = await isAuthenticated(authorization, config.ttl)

  if (result === true) {
    authentications.set(authorization, Date.now() + Number(config.ttl))
  }

  return result
}

export const createServerlessContext = (request) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip')
  const headers = Object.fromEntries(request.headers)
  return createContext(ip, headers)
}

export const createExpressContext = ({ req }) => {
  return createContext(getClientIp(req), req.headers)
}

const createContext = async (ip, headers) => {
  return {
    isDemoMode: config.isDemoMode,
    isAuthenticated: await authenticate(headers['authorization']),
    isIgnored: isSet(headers['cookie']),
    dateDetails: createDate(headers['time-zone']),
    userAgent: headers['user-agent'],
    ip,
    // Variables used by to set and read cookies and headers
    setCookies: [],
    setHeaders: [],
  }
}
