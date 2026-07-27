export const isProfileComplete = (user) => {
  if (!user) return false
  // Admin doesn't need profile completion
  if (user.role === 'Admin') return true
  const hasAvatar = !!(user.profile_info?.avatar || user.avatar)
  const hasBio = !!(user.profile_info?.bio || user.bio)
  return hasAvatar && hasBio
}

// alias kept for backward compatibility
export const hasCompletedProfile = isProfileComplete
