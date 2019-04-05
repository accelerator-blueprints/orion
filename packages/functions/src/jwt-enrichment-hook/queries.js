exports.queryUserByCognitoId = `
query queryUser($cognitoId: String!) {
  user(
    limit: 1 
    where: { cognito_id: { _eq: $cognitoId } }
  ) {
    id
    name
    user_roles {
      role {
        name
      }
    }
  }
}
`
