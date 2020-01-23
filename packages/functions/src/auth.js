import { useContext, createContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Auth } from 'aws-amplify'
import find from 'lodash/find'

const isBrowser = typeof window !== 'undefined'
const HASURA_CLAIMS_NAMESPACE = 'https://hasura.io/jwt/claims'
const CUSTOM_CLAIMS_NAMESPACE = 'x-orion-claims'
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

/**
 * Returns an object detailing a user's permissions
 *
 * @return {object} The current user's permissions
 */
export const getUserTokenData = () => {
  const data = {
    authenticated: false,
    user: false,
    admin: false,
    userId: null,
    groupId: null,
    role: 'public',
  }

  data.isAuthenticated = isAuthenticatedSync() ? true : false
  data.isUser = hasPermissions('user')
  data.isAdmin = hasPermissions('company-admin')
  data.userId = extractTokenPayload(HASURA_USER_ID)
  data.groupId = extractTokenPayload(HASURA_GROUP_ID)
  data.role = getUserRole()

  return data
}

/**
 * Checks a user's role against the minimum role level required
 *
 * @param {string} reqRole The minimum role-level at which the permission check is allowed to return true
 * @return {boolean} Whether or not the current user qualifies for the permission-role checked
 */
export const getUserAuth = reqRole => {
  if (!isAuthenticatedSync()) return false

  return hasPermissions(reqRole.toLowerCase())
}

/**
 * Finds the current user's role and appends the group to the role if necessary
 *
 * @return {string} The user's role, with appended group if necessary
 */
export const getUserRole = () => {
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
  } catch (err) {
    return 'public'
  }
}

/**
 * Get the default user group
 *
 * @return {object} The user's group: {id, type, name}
 */
const getUserGroup = () => {
  const taxonomyQueryResult = useStaticQuery(graphql`
    query {
      orion {
        group {
          id
          type
          name
        }
      }
    }
  `)

  try {
    const groupId = extractTokenPayload(HASURA_GROUP_ID)
    return find(taxonomyQueryResult.orion.group, { id: groupId })
  } catch (err) {
    return null
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
  return (ROLES_PERMISSIONS[role] & ROLES_PERMISSIONS[reqRole]) ===
    ROLES_PERMISSIONS[reqRole]
    ? true
    : false
}

export const AuthInitContext = createContext(false)

export const useIsAuthInitialized = () => {
  const context = useContext(AuthInitContext)
  if (context === undefined) {
    throw new Error(
      'useIsAuthInitialized must be used inside AuthInitContext.Provider'
    )
  }
  return context
}

export const isAuthenticatedSync = () => isBrowser && !!Auth.user

const extractTokenPayload = dataKey => {
  if (Auth.user) {
    const tokenPayload = Auth.user.signInUserSession.idToken.payload
    const claims = {
      ...JSON.parse(tokenPayload[HASURA_CLAIMS_NAMESPACE]),
      ...JSON.parse(tokenPayload[CUSTOM_CLAIMS_NAMESPACE]),
    }
    return claims[dataKey] || null
  } else {
    return null
  }
}
