import { Auth } from './amplify'

export default async function getCloudinarySignatureFromAuth() {
  // We can force amplify to refresh the token with this command
  // In theory, it won't be necessary since the idToken should expire
  // after an hour, the same amount of time that the cloudinary signature
  // is valid for.
  // TODO: if there are problems signing in to cloudinary, uncomment this line
  // await Auth.currentAuthenticatedUser({ bypassCache: true })

  const session = await Auth.currentSession()
  const idToken = session.getIdToken()
  const jwtClaims = idToken.payload
  const cloudinaryClaims = jwtClaims['X-Cloudinary-Claims']
  return JSON.parse(cloudinaryClaims)
}
