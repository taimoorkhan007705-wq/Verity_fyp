import styled from 'styled-components'

const BadgeWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

const BadgeCircle = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid ${props => props.theme.colors.surface};
  z-index: 1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`


function NotificationBadge({ count, children, max = 9, feedMode = false }) {
  let showBadge = false
  let displayCount = ''

  if (feedMode) {
    if (count >= 3) {
      showBadge = true
      displayCount = count > 3 ? '3+' : '3'
    }
  } else if (count && count > 0) {
    showBadge = true
    displayCount = count > max ? `${max}+` : count.toString()
  }

  if (!showBadge) {
    return <BadgeWrapper>{children}</BadgeWrapper>
  }

  return (
    <BadgeWrapper>
      {children}
      <BadgeCircle>{displayCount}</BadgeCircle>
    </BadgeWrapper>
  )
}

export default NotificationBadge

