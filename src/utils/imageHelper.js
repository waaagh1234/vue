/**
 * 图片路径处理工具
 * 用于处理后端返回的图片路径
 */

// 本地图片映射表
const localImages = {
  '1.jpg': new URL('../assets/images/1.jpg', import.meta.url).href,
  '2ed5e0d4b82e9675597f89042ab28360~480x480.jpg': new URL('../assets/images/2ed5e0d4b82e9675597f89042ab28360~480x480.jpg', import.meta.url).href,
  '6a3b351d572e05336ddd94e9506df233.jpg': new URL('../assets/images/6a3b351d572e05336ddd94e9506df233.jpg', import.meta.url).href,
  'OIP.jpg': new URL('../assets/images/OIP.jpg', import.meta.url).href,
  'applemac.jpg': new URL('../assets/images/applemac.jpg', import.meta.url).href,
  'bowl.jpg': new URL('../assets/images/bowl.jpg', import.meta.url).href,
  'img_1.png': new URL('../assets/images/img_1.png', import.meta.url).href,
  'invidagpu.jpg': new URL('../assets/images/invidagpu.jpg', import.meta.url).href,
  'laptop.jpg': new URL('../assets/images/laptop.jpg', import.meta.url).href,
  'lunchbox.jpg': new URL('../assets/images/lunchbox.jpg', import.meta.url).href,
  'opener.jpg': new URL('../assets/images/opener.jpg', import.meta.url).href,
  'samsung.jpg': new URL('../assets/images/samsung.jpg', import.meta.url).href
}

/**
 * 获取图片URL
 * @param {string} imagePath - 后端返回的图片路径
 * @returns {string} - 处理后的图片URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) {
    // 返回默认占位图
    return 'https://via.placeholder.com/300x300?text=No+Image'
  }

  // 如果是完整的HTTP/HTTPS URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // 如果已经包含 /templates/ 前缀，直接返回
  if (imagePath.startsWith('/templates/')) {
    return imagePath
  }

  // 提取文件名
  const fileName = imagePath.split('/').pop()

  // 如果本地有这个图片，使用本地图片
  if (localImages[fileName]) {
    return localImages[fileName]
  }

  // 后端返回的路径格式通常是: images/xxx.jpg
  // 需要添加 /templates/ 前缀来访问（参考原始HTML）
  if (imagePath.startsWith('images/')) {
    return `/templates/${imagePath}`
  }

  // 如果是相对路径，添加 /templates/ 前缀
  if (!imagePath.startsWith('/')) {
    return `/templates/${imagePath}`
  }

  // 如果是绝对路径，直接返回
  return imagePath
}

/**
 * 批量处理商品列表的图片路径
 * @param {Array} products - 商品列表
 * @returns {Array} - 处理后的商品列表
 */
export function processProductImages(products) {
  if (!Array.isArray(products)) {
    return products
  }

  return products.map(product => ({
    ...product,
    imagePath: getImageUrl(product.imagePath)
  }))
}

/**
 * 处理单个商品的图片路径
 * @param {Object} product - 商品对象
 * @returns {Object} - 处理后的商品对象
 */
export function processProductImage(product) {
  if (!product) {
    return product
  }

  return {
    ...product,
    imagePath: getImageUrl(product.imagePath)
  }
}

export default {
  getImageUrl,
  processProductImages,
  processProductImage
}

