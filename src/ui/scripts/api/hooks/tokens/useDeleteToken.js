import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

export const MUTATION = gql`
  mutation deleteToken($id: ID!) {
    deleteToken(id: $id) {
      success
    }
  }
`

export default () => {
  const [mutate, { loading, error }] = useMutation(MUTATION)

  return {
    mutate,
    loading,
    error,
  }
}
