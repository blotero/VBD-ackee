import Token from '../models/Token.js'

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

export const sessions = async () => {
  const enhance = (entries) => {
    return entries.map((entry) => ({
      id: entry._id.toString(),
      updated: entry.updated,
    }))
  }

  return enhance(await Token.find({}).sort({ updated: -1 }))
}

export const delSession = (id) => {
  return Token.findByIdAndDelete(id)
}

export const del = (id) => {
  return Token.findOneAndDelete({
    id,
  })
}
