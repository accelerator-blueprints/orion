import React, { useContext } from 'react'
import T from 'prop-types'
import { Redirect } from '@reach/router'

import { getUserTokenData, getUserAuth, AuthInitContext } from '../../auth'

export default function ProtectedRoute({
  allowedRole,
  requiresGroup,
  component: Component,
  ...props
}) {
  const isAuthInitialized = useContext(AuthInitContext)
  //skip rendering if auth is not yet initialized
  if (!isAuthInitialized) {
    return null
  }

  const { isAuthenticated, groupId } = getUserTokenData()

  if (requiresGroup) {
    if (!groupId) {
      return <Redirect to="/auth" noThrow />
    }
  }

  if (allowedRole) {
    if (!isAuthenticated || !getUserAuth(allowedRole)) {
      return <Redirect to="/auth" noThrow />
    }
  }

  return <Component {...props} />
}

ProtectedRoute.propTypes = {
  allowedRole: T.string,
  requiresGroup: T.bool,
  component: T.elementType.isRequired,
}
