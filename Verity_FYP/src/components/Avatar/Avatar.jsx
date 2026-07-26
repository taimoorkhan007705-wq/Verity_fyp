import { useMemo, useState } from 'react'
import styled from 'styled-components'

const AvatarShell = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 700;
  text-transform: uppercase;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 2px solid ${props => props.theme.colors.surface};
`

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const Initials = styled.span`
  font-size: ${props => Math.max(props.size / 3.5, 12)}px;
  line-height: 1;
`

function getInitials(name) {
  if (!name) return 'U'
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

export default function Avatar({ src, alt, name, size = 48, className, style, ...props }) {
  const [hasError, setHasError] = useState(false)
  const initials = useMemo(() => getInitials(name || alt || ''), [name, alt])
  const shouldShowFallback = !src || hasError
  return (
    <AvatarShell
      className={className}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {!shouldShowFallback ? (
        <AvatarImage
          src={src}
          alt={alt || name || 'User avatar'}
          onError={() => setHasError(true)}
        />
      ) : (
        <Initials size={size}>{initials}</Initials>
      )}
    </AvatarShell>
  )
}

