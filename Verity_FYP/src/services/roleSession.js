const AUTH_KEYS = {
  activeSession: 'verity_active_session',
  activeRole: 'verity_active_role',
  rememberMe: 'rememberMe',
  rememberEmail: 'rememberEmail',
}

const getRoleScopedStorageKey = (role, kind) => `verity_${String(role || 'user').toLowerCase()}_${kind}`

const parseJson = (value) => {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export const getStoredAuth = () => {
  const activeSession = sessionStorage.getItem(AUTH_KEYS.activeSession)
  if (activeSession) {
    const parsed = parseJson(activeSession)
    if (parsed?.token) {
      return parsed
    }
  }

  const activeRole = localStorage.getItem(AUTH_KEYS.activeRole)
  if (activeRole) {
    const tokenKey = getRoleScopedStorageKey(activeRole, 'token')
    const userKey = getRoleScopedStorageKey(activeRole, 'user')
    const token = localStorage.getItem(tokenKey)
    const user = parseJson(localStorage.getItem(userKey))
    if (token) {
      return { role: activeRole, token, user }
    }
  }

  const roleKeys = ['User', 'Reviewer', 'Business', 'Admin']
  for (const role of roleKeys) {
    const tokenKey = getRoleScopedStorageKey(role, 'token')
    const userKey = getRoleScopedStorageKey(role, 'user')
    const token = localStorage.getItem(tokenKey)
    const user = parseJson(localStorage.getItem(userKey))
    if (token) {
      return { role, token, user }
    }
  }

  return { role: null, token: null, user: null }
}

export const saveAuthSession = (role, token, user) => {
  const normalizedRole = String(role || 'User')
  const sessionPayload = { role: normalizedRole, token, user }

  sessionStorage.setItem(AUTH_KEYS.activeSession, JSON.stringify(sessionPayload))
  localStorage.setItem(AUTH_KEYS.activeRole, normalizedRole)
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem(getRoleScopedStorageKey(normalizedRole, 'token'), token)
  localStorage.setItem(getRoleScopedStorageKey(normalizedRole, 'user'), JSON.stringify(user))
}

export const clearAuthSession = () => {
  sessionStorage.removeItem(AUTH_KEYS.activeSession)
  localStorage.removeItem(AUTH_KEYS.activeRole)
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ;['User', 'Reviewer', 'Business', 'Admin'].forEach((role) => {
    localStorage.removeItem(getRoleScopedStorageKey(role, 'token'))
    localStorage.removeItem(getRoleScopedStorageKey(role, 'user'))
  })
}

export const getActiveRole = () => getStoredAuth().role

export const getActiveToken = () => getStoredAuth().token

export const getActiveUser = () => getStoredAuth().user
