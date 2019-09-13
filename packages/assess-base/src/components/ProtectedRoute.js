import React, { useContext } from 'react'
import T from 'prop-types'
import { Redirect } from '@reach/router'

import { isAuthenticatedSync, hasPermissions } from '../utils/auth'
import { AuthInitContext } from '../utils/auth'

export default function ProtectedRoute({
  allowedRole,
  component: Component,
  ...props
}) {
  // TODO: dedupe all this from KnowledgeBase

  const isAuthInitialized = useContext(AuthInitContext)
  //skip rendering if auth is not yet initialized
  if (!isAuthInitialized) {
    return null
  }

  if (!isAuthenticatedSync()) {
    return <Redirect to="/auth" noThrow />
  }

  if (allowedRole) {
    if (!hasPermissions(allowedRole)) {
      return <Redirect to="/auth" noThrow />
    }
  }

  return <Component {...props} />
}

ProtectedRoute.propTypes = {
  allowedRole: T.string,
  component: T.elementType.isRequired,
}
