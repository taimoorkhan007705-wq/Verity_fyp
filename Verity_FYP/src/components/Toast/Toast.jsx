import styled, { keyframes } from 'styled-components'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const slideIn = keyframes`
  from {
    transform: translateY(-120%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-120%);
    opacity: 0;
  }
`

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
  width: calc(100% - 40px);
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const ToastItem = styled.div`
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 24px ${props => props.theme.colors.shadowMedium};
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${props => props.$isExiting ? slideOut : slideIn} 0.35s ease;
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success
      case 'error': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      default: return props.theme.colors.info
    }
  }};
`

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success
      case 'error': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      default: return props.theme.colors.info
    }
  }};
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 4px;
`

const Message = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
`

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textTertiary};
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success
      case 'error': return props.theme.colors.error
      case 'warning': return props.theme.colors.warning
      default: return props.theme.colors.info
    }
  }};
  opacity: 0.35;
  transform-origin: left;
  animation: shrink ${props => props.$duration}ms linear;

  @keyframes shrink {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }
`

const getIcon = (type) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={24} />
    case 'error':
      return <AlertCircle size={24} />
    case 'warning':
      return <AlertTriangle size={24} />
    default:
      return <Info size={24} />
  }
}

function Toast({ toasts, removeToast }) {
  return (
    <ToastContainer>
      {toasts.map(toast => (
        <ToastItem key={toast.id} $type={toast.type} $isExiting={toast.isExiting}>
          <IconWrapper $type={toast.type}>
            {getIcon(toast.type)}
          </IconWrapper>
          <Content>
            {toast.title && <Title>{toast.title}</Title>}
            <Message>{toast.message}</Message>
          </Content>
          <CloseButton onClick={() => removeToast(toast.id)}>
            <X size={20} />
          </CloseButton>
          {toast.duration && <ProgressBar $type={toast.type} $duration={toast.duration} />}
        </ToastItem>
      ))}
    </ToastContainer>
  )
}

export default Toast

