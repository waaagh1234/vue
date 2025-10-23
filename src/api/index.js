import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

// 用户相关API
export const userApi = {
  // 登录
  login(username, password) {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    return api.post('/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  
  // 注册
  register(username, password, email) {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    params.append('email', email)
    return api.post('/register', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  
  // 重置密码
  resetPassword(username, email, newPassword) {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('email', email)
    params.append('newPassword', newPassword)
    return api.post('/reset-password', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }
}

// 商品相关API
export const productApi = {
  // 获取所有商品
  getAllProducts() {
    return api.post('/api/all-products', '', {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  
  // 根据状态搜索商品
  searchByStatus(status) {
    return api.post('/api/searchByStatus', status, {
      headers: {
        'Content-Type': 'text/plain'
      }
    })
  },
  
  // 搜索商品
  search(keyword) {
    return api.post('/search', JSON.stringify(keyword), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  
  // 获取商品详情
  getProductDetail(id) {
    return api.get(`/product/${id}`)
  },
  
  // 获取商品评论
  getProductReviews(productId, page = 0, size = 5) {
    return api.get(`/api/product-reviews/${productId}?page=${page}&size=${size}`)
  }
}

// 购物车相关API
export const cartApi = {
  // 获取购物车
  getCart(userName) {
    return api.get(`/cart/${userName}`)
  },
  
  // 添加到购物车
  addToCart(userName, productId) {
    return api.post('/cart/add', {
      userName,
      productId
    })
  },
  
  // 更新购物车数量
  updateCart(id, userName, quantity) {
    return api.post('/cart/update', {
      id,
      userName,
      quantity
    })
  },
  
  // 删除购物车商品
  removeFromCart(id) {
    return api.delete(`/cart/${id}`)
  },
  
  // 结算
  checkout(userName, selectedItems) {
    return api.post('/cart/checkout', {
      userName,
      items: selectedItems // 修复：改为 items 以匹配后端
    })
  }
}

// 收藏相关API
export const favoriteApi = {
  // 获取收藏列表
  getFavorites(userName) {
    return api.get(`/user-favorites/${userName}`)
  },
  
  // 检查是否收藏
  checkFavorite(userName, productId) {
    return api.get(`/user-favorites/${userName}/${productId}`)
  },
  
  // 添加收藏
  addFavorite(userName, productId) {
    return api.post('/user-favorites/add', {
      userName,
      productId
    })
  },
  
  // 取消收藏
  removeFavorite(userName, productId) {
    return api.delete(`/user-favorites/${userName}/${productId}`)
  }
}

// 购买记录相关API
export const recordApi = {
  // 获取购买记录
  getPurchaseRecords(userName, page = 1, size = 10) {
    return api.get(`/purchase-records/${userName}?page=${page}&size=${size}`)
  },

  // 提交评价
  submitReview(userName, productId, rating, commentText, isAnonymous) {
    return api.post('/reviews/add', { // 修复：改为 /reviews/add
      userName,
      productId,
      rating,
      commentText,
      isAnonymous
    })
  }
}

// 评论相关API
export const reviewApi = {
  // 获取用户评论
  getUserReviews(userName, page = 1, size = 10) {
    return api.get(`/api/user-reviews/${userName}?page=${page}&size=${size}`)
  },

  // 删除评论
  deleteReview(reviewId) {
    return api.delete(`/reviews/${reviewId}`) // 修复：移除 /api 前缀
  }
}

// 直接购买相关API
export const purchaseApi = {
  // 直接购买
  directBuy(userName, productId) {
    return api.post('/direct-purchase/buy', {
      userName,
      productId
    })
  },
  
  // 提交收件人信息
  submitShippingInfo(orderId, recipientName, recipientPhone, recipientAddress) {
    const formData = new FormData()
    formData.append('orderId', orderId)
    formData.append('recipientName', recipientName) // 修复：使用 recipientName
    formData.append('phoneNumber', recipientPhone) // 修复：使用 phoneNumber
    formData.append('address', recipientAddress)

    return api.post('/api/shipping', formData, { // 修复：改为 /api/shipping 并使用 FormData
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 商家相关API
export const merchantApi = {
  // 商家登录
  login(username, password) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    return api.post('/api/merchant/login', formData, { // 修复：改为 /api/merchant/login 并使用 FormData
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 获取商家商品列表
  getProducts(merchantName, page = 1, size = 10) {
    return api.get(`/api/merchant-records/user/${merchantName}?page=${page}&size=${size}`) // 修复：使用商家记录API
  },

  // 添加商品
  addProduct(productData) {
    return api.post('/api/products/add', productData) // 修复：改为 /api/products/add
  },

  // 更新商品
  updateProduct(productId, productData) {
    return api.put(`/api/products/${productId}`, productData) // 修复：改为 PUT 方法和 /api/products/${productId}
  },

  // 删除商品
  deleteProduct(id) {
    return api.delete(`/api/products/${id}`) // 修复：改为 /api/products/${id}
  },
  
  // 获取订单列表
  getOrders(merchantName) { // 修复：添加 merchantName 参数
    return api.get(`/api/merchant/orders/${merchantName}`) // 修复：改为 /api/merchant/orders/${merchantName}
  },

  // 更新订单状态
  updateOrderStatus(orderId, status) {
    return api.put(`/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`) // 修复：改为 PUT 方法和正确路径
  }
}

export default api

