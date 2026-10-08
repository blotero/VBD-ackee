import * as permanentTokens from '../database/permanentTokens.js'
import * as tokens from '../database/tokens.js'
import KnownError from './KnownError.js'
import isExpired from './isExpired.js'

const readToken = (headers) => {
  const authorization = headers['authorization']

  // Scripts and integrations may send the token without a scheme
  if (authorization == null) {
    return headers['x-ackee-token']
  }

  const key = authorization.split(' ')[0]
  const token = authorization.split(' ')[1]

  return key === 'Bearer' ? token : undefined
}

export default async (headers, ttl) => {
  const token = readToken(headers)

  // Token not in request
  if (token == null || token === '') {
    return new KnownError('Token missing')
  }

  const tokenEntry = await tokens.get(token)
  const permanentTokenEntry = await permanentTokens.get(token)

  if (tokenEntry != null) {
    // Tokens can expire
    const valid = isExpired(tokenEntry.updated, ttl) === false

    // Token too old
    if (valid === false) {
      return new KnownError('Token invalid')
    }

    // Update token to ensure that the token stays valid
    await tokens.update(token)

    return true
  }

  if (permanentTokenEntry != null) {
    // Update token to indicate the last time it was used
    await permanentTokens.update(token, {
      title: permanentTokenEntry.title,
    })

    return true
  }

  // Token not in database
  return new KnownError('Token invalid')
}
