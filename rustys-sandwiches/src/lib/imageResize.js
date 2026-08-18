// Uploads are scaled down in the browser before they are sent: it keeps the
// upload quick on a phone connection, and keeps what visitors download to a
// sensible size. The result is a JPEG Blob, posted as-is to /api/media.
//
// Re-encoding to JPEG drops alpha, which suits photography; a logo needing
// transparency would want a different path.

export function resizeImageFile(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('could not read that file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('that file could not be read as an image'))
      img.onload = () => {
        const longestEdge = Math.max(img.width, img.height)
        const scale = Math.min(1, maxDimension / longestEdge)
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('could not process that image'))),
          'image/jpeg',
          quality
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
