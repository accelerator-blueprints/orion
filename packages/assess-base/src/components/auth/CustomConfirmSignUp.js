import React from 'react'
import { ConfirmSignUp } from 'aws-amplify-react'
import RegisterConfirm from './RegisterConfirm'

export default class CustomConfirmSignUp extends ConfirmSignUp {
  constructor(props) {
    super(props)
    this._validAuthStates = ['confirmSignUp']
  }

  showComponent() {
    return (
      <RegisterConfirm
        goToSignIn={() => super.changeState('signIn')}
        confirm={event => super.confirm(event)}
        resend={event => super.resend(event)}
        handleInput={this.handleInputChange}
        username={this.usernameFromAuthData()}
      />
    )
  }
}