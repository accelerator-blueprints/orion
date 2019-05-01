import graphql from '../graphql'
import createUser from './graphql/create-user.graphql'
import getDefaultRole from './graphql/get-default-role.graphql'

export const handler = async event => {
  const { role } = await graphql(getDefaultRole)

  console.log('found role', role)

  if (!role.length) {
    throw new Error('no default role found')
  }

  console.log('creating user', event, role)

  const user = await graphql(createUser, {
    cognitoId: event.request.userAttributes.sub,
    email: event.request.userAttributes.email,
    roleId: role[0].id,
    signupRequest: event.request,
  })

  console.log('created user', JSON.stringify(user))

  return event
}
