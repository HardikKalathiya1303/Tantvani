/**
 * Helper to get Ultra-HD version of images for deep zooming and detail inspection
 * Automatically upgrades Unsplash & Cloudinary URLs to 2600px+ High Resolution
 */
export function getHdImageUrl(url, width = 2600, quality = 95) {
  if (!url || typeof url !== 'string') return url;

  // Unsplash HD transformation
  if (url.includes('images.unsplash.com')) {
    let hdUrl = url;
    // Replace width
    if (hdUrl.includes('w=')) {
      hdUrl = hdUrl.replace(/w=\d+/, `w=${width}`);
    } else {
      hdUrl += `${hdUrl.includes('?') ? '&' : '?'}w=${width}`;
    }
    // Replace quality
    if (hdUrl.includes('q=')) {
      hdUrl = hdUrl.replace(/q=\d+/, `q=${quality}`);
    } else {
      hdUrl += `&q=${quality}`;
    }
    // Ensure auto=format and fit=crop/max
    if (!hdUrl.includes('auto=format')) {
      hdUrl += '&auto=format';
    }
    return hdUrl;
  }

  // Cloudinary HD transformation
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/q_auto:best,f_auto,w_${width}/`);
  }

  return url;
}

/**
 * Preload high-resolution image to browser cache for instantaneous zoom sharpness
 */
export function preloadHdImage(url) {
  if (!url) return;
  const hdUrl = getHdImageUrl(url);
  const img = new Image();
  img.src = hdUrl;
}
