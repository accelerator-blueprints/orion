import React, { createContext, useState } from 'react'
import T from 'prop-types'
import { Auth } from 'aws-amplify'
import { find, get } from 'lodash'

const isBrowser = typeof window !== 'undefined'
const HASURA_CLAIMS_NAMESPACE = 'https://hasura.io/jwt/claims'
const CUSTOM_CLAIMS_NAMESPACE = 'x-raw-salmon-claims'
const CUSTOM_CLAIMS_CONTRIBUTOR_KEY = 'x-assess-base-contributor'
const CUSTOM_CLAIMS_ASSESSOR_KEY = 'x-assess-base-assessor'
const HASURA_DEFAULT_ROLE_KEY = 'x-hasura-default-role'
const HASURA_USER_ID = 'x-hasura-user-id'
const HASURA_GROUP_ID = 'x-hasura-group-id'
const ROLES_PERMISSIONS = {
  public: 0,
  'non-member': 0,
  user: 1,
  member: 1,
  'company-admin': 3,
  'partner-admin': 7,
  'platform-admin': 15,
  admin: 31,
}

export const AuthContext = createContext({ isAuthInitialized: false })

const isAuthenticatedSync = () => isBrowser && Boolean(Auth.user)

const extractTokenPayload = dataKey => {
  if (!Auth.user) {
    return null
  }

  const tokenPayload = get(Auth, 'user.signInUserSession.idToken.payload')

  if (!tokenPayload) {
    return null
  }

  const claims =
    CUSTOM_CLAIMS_NAMESPACE in tokenPayload
      ? {
          ...JSON.parse(tokenPayload[HASURA_CLAIMS_NAMESPACE]),
          ...JSON.parse(tokenPayload[CUSTOM_CLAIMS_NAMESPACE]),
        }
      : {
          ...JSON.parse(tokenPayload[HASURA_CLAIMS_NAMESPACE]),
        }

  return claims[dataKey] || null
}

function AuthWrapper({
  isAuthInitialized,
  allowNoParentGroups = false,
  children,
}) {
  const [userGroups, setUserGroups] = useState([])

  /**
   * Returns an object detailing a user's permissions
   *
   * @return {object} The current user's permissions
   */
  const getUserTokenData = () => {
    const data = {
      isAuthenticated: Boolean(isAuthenticatedSync()),
      isUser: hasPermissions('user'),
      isAdmin: hasPermissions('company-admin'),
      isPlatformGroup: hasPermissions('platform-admin'),
      isContributor:
        extractTokenPayload(CUSTOM_CLAIMS_CONTRIBUTOR_KEY) || false,
      isAssessor: extractTokenPayload(CUSTOM_CLAIMS_ASSESSOR_KEY) || false,
      userId: extractTokenPayload(HASURA_USER_ID),
      groupId: extractTokenPayload(HASURA_GROUP_ID),
      role: getUserRole(),
    }

    return data
  }

  /**
   * Checks a user's role against the minimum role level required
   *
   * @param {string} reqRole The minimum role-level at which the permission check is allowed to return true
   * @return {boolean} Whether or not the current user qualifies for the permission-role checked
   */
  const getUserAuth = reqRole => {
    if (!isAuthenticatedSync()) return false
    if (!reqRole || reqRole === undefined) return true

    switch (reqRole.toLowerCase()) {
      case 'contributor':
        return extractTokenPayload(CUSTOM_CLAIMS_CONTRIBUTOR_KEY)
      case 'assessor':
        return extractTokenPayload(CUSTOM_CLAIMS_ASSESSOR_KEY)
      default:
        return hasPermissions(reqRole.toLowerCase())
    }
  }

  /**
   * Finds the current user's role and appends the group to the role if necessary
   *
   * @return {string} The user's role, with appended group if necessary
   */
  const getUserRole = () => {
    if (!isAuthenticatedSync()) return 'public'
    const baseRole = getUserBaseRole()
    const group = getUserGroup()
    return group !== undefined && baseRole === 'admin'
      ? `${group.type}-${baseRole}`
      : baseRole
  }

  /**
   * Get the base user role from the Hasura JWT Token
   *
   * @return {string} The user's role, without appended group
   */
  const getUserBaseRole = () => {
    try {
      return extractTokenPayload(HASURA_DEFAULT_ROLE_KEY)
    } catch (_error) {
      return 'public'
    }
  }

  /**
   * Get the default user group
   *
   * @return {object} The user's group: {id, type, name}
   */
  const getUserGroup = () => {
    try {
      const taxonomyQueryResult = userGroups
      const groupId = extractTokenPayload(HASURA_GROUP_ID)
      return find(taxonomyQueryResult.raw_salmon.group, { id: groupId })
    } catch (_error) {
      return undefined
    }
  }

  /**
   * Checks permission level of user against required permission level
   *
   * @param {string} reqRole The permission level required
   * @return {boolean} Whether or not the user has the required permission level
   */
  const hasPermissions = reqRole => {
    const role = getUserRole()
    return (
      (ROLES_PERMISSIONS[role] & ROLES_PERMISSIONS[reqRole]) ===
      ROLES_PERMISSIONS[reqRole]
    )
  }

  const auth = {
    isAuthInitialized,
    getUserTokenData,
    getUserAuth,
    getUserRole,
    hasPermissions,
    isAuthenticatedSync,
    setUserGroups,
    allowNoParentGroups,
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

AuthWrapper.propTypes = {
  isAuthInitialized: T.bool,
  allowNoParentGroups: T.bool,
  children: T.node,
}

export default AuthWrapper
