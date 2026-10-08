import Token from '../models/Token.js'
import isExpired from '../utils/isExpired.js'

const response = (entry) => ({
  id: entry.id,
  created: entry.created,
  updated: entry.updated,
})

export const add = async () => {
  const enhance = (entry) => {
    return entry == null ? entry : response(entry)
  }

  return enhance(await Token.create({}))
}

export const get = async (id) => {
  const enhance = (entry) => {
    return entry == null ? entry : response(entry)
  }

  return enhance(await Token.findOne({ id }))
}

export const update = async (id) => {
  const enhance = (entry) => {
    return entry == null ? entry : response(entry)
  }

  return enhance(
    await Token.findOneAndUpdate(
      {
        id,
      },
      {
        $set: {
          updated: Date.now(),
        },
      },
      {
        returnDocument: 'after',
      },
    ),
  )
}

export const findActive = async (id, ttl) => {
  const entry = await Token.findOne({ id })

  // Token not in database
  if (entry == null) return null

  // Remove tokens that haven't been used for too long
  if (isExpired(entry.updated, ttl) === true) {
    await Token.findOneAndDelete({ id })
    return null
  }

  return update(id)
}

export const del = (id) => {
  return Token.findOneAndDelete({
    id,
  })
}
