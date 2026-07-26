/**
 * Image Upload Handler with Cropping
 * Handles image selection, preview, and cropping
 */

/**
 * Load image file and convert to base64
 * @param {File} file - Image file to load
 * @returns {Promise<string>} - Base64 string of image
 */
export const loadImageFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file'))
      return
    }

    // Max file size: 10MB
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      reject(new Error('Image file is too large. Maximum size is 10MB'))
      return
    }

    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Convert base64 to File blob
 * @param {string} base64 - Base64 string
 * @param {string} filename - Filename for the blob
 * @returns {File} - File object
 */
export const base64ToFile = (base64, filename) => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Compress image while maintaining quality
 * @param {string} base64 - Base64 image string
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} maxHeight - Maximum height in pixels
 * @returns {Promise<string>} - Compressed base64 image
 */
export const compressImage = (base64, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let width = img.width
      let height = img.height

      // Scale down if necessary
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => reject(new Error('Failed to process image'))
    img.src = base64
  })
}

/**
 * Validate image dimensions
 * @param {string} base64 - Base64 image string
 * @param {number} minWidth - Minimum width required
 * @param {number} minHeight - Minimum height required
 * @returns {Promise<boolean>} - True if valid dimensions
 */
export const validateImageDimensions = (base64, minWidth = 200, minHeight = 200) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (img.width < minWidth || img.height < minHeight) {
        reject(
          new Error(
            `Image dimensions must be at least ${minWidth}x${minHeight}px. Current: ${img.width}x${img.height}px`
          )
        )
      } else {
        resolve(true)
      }
    }
    img.onerror = () => reject(new Error('Failed to validate image'))
    img.src = base64
  })
}
