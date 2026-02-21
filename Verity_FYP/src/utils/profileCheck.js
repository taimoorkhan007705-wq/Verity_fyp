// Check if user has completed their profile
export const hasCompletedProfile = (user) => {
  if (!user) return false
  
  // Check if user has essential profile information
  const hasFullName = !!(user.user_info?.fullName || user.fullName)
  const hasAvatar = !!(user.profile_info?.avatar || user.avatar)
  const hasBio = !!(user.profile_info?.bio || user.bio)
  
  // User must have at least full name and avatar to be considered "complete"
  return hasFullName && hasAvatar
}

// Show alert and redirect to profile edit
export const promptProfileCompletion = (navigate) => {
  const shouldRedirect = window.confirm(
    'Please complete your profile first!\n\nYou need to add a profile picture and other details before you can interact with posts, create content, or connect with others.\n\nWould you like to go to your profile now?'
  )
  
  if (shouldRedirect && navigate) {
    navigate('/profile/edit')
  }
  
  return shouldRedirect
}
