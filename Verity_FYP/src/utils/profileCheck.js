export const isProfileComplete = (user) => {
  if (!user) return false
  const hasAvatar = !!(user.profile_info?.avatar || user.avatar)
  const hasBio = !!(user.profile_info?.bio || user.bio)
  return hasAvatar && hasBio
}

// alias kept for backward compatibility
export const hasCompletedProfile = isProfileComplete
