import { useState, useRef } from 'react'
import styled from 'styled-components'
import { ZoomIn, ZoomOut, RotateCcw, Check, X } from 'lucide-react'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const Content = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    max-width: 95vw;
    padding: 1rem;
    max-height: 95vh;
  }
`

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const PreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-height: 400px;

  @media (max-width: 640px) {
    max-height: 300px;
  }
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  transform: scale(${props => props.$scale}) rotate(${props => props.$rotate}deg);
  transition: transform 0.2s ease;
  object-fit: contain;
`

const CropGuide = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.$aspectRatio > 1 ? '100%' : 'auto'};
  height: ${props => props.$aspectRatio > 1 ? 'auto' : '100%'};
  aspect-ratio: ${props => props.$aspectRatio};
  border: 2px solid rgba(20, 184, 166, 0.5);
  border-radius: 0.5rem;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
  pointer-events: none;
`

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`

const Slider = styled.input`
  width: 150px;
  height: 4px;
  border-radius: 2px;
  background: ${props => props.theme.colors.border};
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
  }

  @media (max-width: 640px) {
    width: 100px;
  }
`

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 40px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 0.625rem 1rem;
  }
`

const CancelButton = styled(Button)`
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textSecondary};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.borderLight};
  }
`

const ConfirmButton = styled(Button)`
  background: ${props => props.theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`

/**
 * ImageCropper Component
 * Provides Instagram-like image cropping functionality
 * 
 * @param {Object} props
 * @param {string} props.image - Base64 or URL of image to crop
 * @param {Function} props.onCrop - Callback when crop is confirmed (receives cropped image)
 * @param {Function} props.onCancel - Callback when crop is cancelled
 * @param {number} props.aspectRatio - Aspect ratio for crop (default: 1 for square)
 * @param {string} props.title - Title of the cropper dialog
 */
function ImageCropper({ 
  image, 
  onCrop, 
  onCancel, 
  aspectRatio = 1,
  title = 'Crop Image'
}) {
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 1))
  const handleRotate = () => setRotate(prev => (prev + 90) % 360)
  const handleReset = () => {
    setScale(1)
    setRotate(0)
  }

  const handleCrop = async () => {
    const img = imageRef.current
    if (!img || !canvasRef.current) {
      console.error('Image or canvas ref is missing')
      return
    }

    // Wait for image to be fully loaded
    if (!img.complete || img.naturalWidth === 0) {
      console.error('Image is not fully loaded')
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      console.error('Could not get canvas context')
      return
    }
    
    // Set canvas size based on crop area
    const cropSize = Math.min(img.naturalWidth, img.naturalHeight) / scale
    canvas.width = cropSize
    canvas.height = cropSize / aspectRatio

    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Save context
    ctx.save()

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Rotate
    ctx.rotate((rotate * Math.PI) / 180)

    // Scale
    ctx.scale(scale, scale)

    // Draw image centered
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2)

    // Restore context
    ctx.restore()

    // Get cropped image
    canvas.toBlob(
      blob => {
        if (!blob) {
          console.error('Canvas.toBlob returned null')
          return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            onCrop(reader.result)
          } else {
            console.error('FileReader result is null')
          }
        }
        reader.onerror = () => {
          console.error('FileReader error:', reader.error)
        }
        reader.readAsDataURL(blob)
      },
      'image/jpeg',
      0.95
    )
  }

  return (
    <Container onClick={e => e.target === e.currentTarget && onCancel()}>
      <Content>
        <Title>{title}</Title>

        <PreviewContainer>
          <ImageWrapper>
            <Image
              ref={imageRef}
              src={image}
              alt="Crop preview"
              $scale={scale}
              $rotate={rotate}
              onLoad={e => {
                // Ensure image loads with correct natural dimensions
                e.target.style.width = 'auto'
                e.target.style.height = 'auto'
                console.log('Image loaded:', {
                  naturalWidth: e.target.naturalWidth,
                  naturalHeight: e.target.naturalHeight,
                  complete: e.target.complete
                })
              }}
              onError={e => {
                console.error('Image failed to load:', e)
              }}
            />
            <CropGuide $aspectRatio={aspectRatio} />
          </ImageWrapper>
        </PreviewContainer>

        <Controls>
          <ControlButton onClick={handleZoomOut} title="Zoom out">
            <ZoomOut />
          </ControlButton>
          <Slider
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
          />
          <ControlButton onClick={handleZoomIn} title="Zoom in">
            <ZoomIn />
          </ControlButton>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }} />

          <ControlButton onClick={handleRotate} title="Rotate 90°">
            <RotateCcw />
          </ControlButton>
          <ControlButton onClick={handleReset} title="Reset">
            Reset
          </ControlButton>
        </Controls>

        <ActionButtons>
          <CancelButton onClick={onCancel}>
            <X size={18} />
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleCrop}>
            <Check size={18} />
            Crop & Use
          </ConfirmButton>
        </ActionButtons>
      </Content>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Container>
  )
}

export default ImageCropper
