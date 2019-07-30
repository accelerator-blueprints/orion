import { handler } from './'
import graphql from '../graphql'

import createUser from './graphql/create-user.graphql'
jest.mock('../graphql')

const originalEvent = {
  version: '1',
  region: 'eu-west-1',
  userPoolId: 'eu-west-1_QeZSaIzBc',
  firstname: 'Simone',
  lastname: 'Busoli',
  userName: 'simone3',
  callerContext: {
    awsSdkVersion: 'aws-sdk-unknown-unknown',
    clientId: '2sdk5rf1kuk8ma9mn5e4mtklqf',
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: {
    userAttributes: {
      sub: '331fea42-48f4-4235-bd6f-70c7fdc46f27',
      'cognito:user_status': 'CONFIRMED',
      email_verified: 'true',
      phone_number_verified: 'false',
      phone_number: '+11132123234',
      email: 'simone.busoli+3@gmail.com',
    },
  },
  response: {},
}

describe('signup-hook', () => {
  it('it should create the user with the attributes coming from the request', async () => {
    await handler(originalEvent)

    expect(graphql).toBeCalledWith(createUser, {
      cognitoId: originalEvent.request.userAttributes.sub,
      email: originalEvent.request.userAttributes.email,
      firstName: originalEvent.request.userAttributes.firstname,
      lastName: originalEvent.request.userAttributes.lastname,
      signupRequest: originalEvent.request,
      title: 'EFQM Member',
    })
  })

  it('it should ignore the cognito any event where triggerSource is not "PostConfirmation_ConfirmSignUp"', async () => {
    await handler({
      ...originalEvent,
      triggerSource: 'PostConfirmation_ConfirmForgotPassword',
    })

    expect(graphql).not.toBeCalled()
  })
})
