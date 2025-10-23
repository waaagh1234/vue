# API路径对比检查报告

## 📋 检查范围

检查所有提交评论、提交订单相关的API路径，确保Vue代码与原始HTML一致。

---

## ✅ 用户端API检查

### 1. 提交评论 (Records.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | records.html | src/api/index.js |  |
| **API路径** | `/reviews/add` | `/api/submit-review` | ❌ **不一致** |
| **方法** | POST | POST | ✅ |
| **Content-Type** | application/json | application/json | ✅ |

**原始HTML代码** (records.html 第928行):
```javascript
const response = await fetch('http://localhost:8080/reviews/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userName: userName,
        productId: parseInt(productId),
        commentText: commentText,
        rating: parseInt(rating),
        isAnonymous: isAnonymous
    })
});
```

**Vue代码** (src/api/index.js 第164行):
```javascript
submitReview(userName, productId, rating, commentText, isAnonymous) {
  return api.post('/api/submit-review', {
    userName,
    productId,
    rating,
    commentText,
    isAnonymous
  })
}
```

**问题**: ❌ 路径不一致
- HTML使用: `/reviews/add`
- Vue使用: `/api/submit-review`

**需要修复**: ✅ 是

---

### 2. 购物车结算 (Cart.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | cart.html | src/api/index.js |  |
| **API路径** | `/cart/checkout` | `/cart/checkout` | ✅ 一致 |
| **方法** | POST | POST | ✅ |
| **Content-Type** | application/json | application/json | ✅ |

**原始HTML代码** (cart.html 第741行):
```javascript
const response = await fetch('http://localhost:8080/cart/checkout', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userName: userName,
        items: selectedItems
    })
});
```

**Vue代码** (src/api/index.js 第122行):
```javascript
checkout(userName, selectedItems) {
  return api.post('/cart/checkout', {
    userName,
    selectedItems
  })
}
```

**状态**: ✅ 路径一致，但参数名不同
- HTML使用: `items`
- Vue使用: `selectedItems`

**需要修复**: ⚠️ 需要检查后端接受哪个参数名

---

### 3. 提交收件人信息 (Cart.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | cart.html | src/api/index.js |  |
| **API路径** | `/api/shipping` | `/direct-purchase/submit-shipping-info` | ❌ **不一致** |
| **方法** | POST | POST | ✅ |
| **Content-Type** | multipart/form-data | application/json | ❌ **不一致** |

**原始HTML代码** (cart.html 第873行):
```javascript
const response = await fetch('http://localhost:8080/api/shipping', {
    method: 'POST',
    body: formData  // FormData对象
});
```

**Vue代码** (src/api/index.js 第198行):
```javascript
submitShippingInfo(orderId, recipientName, recipientPhone, recipientAddress) {
  return api.post('/direct-purchase/submit-shipping-info', {
    orderId,
    recipientName,
    recipientPhone,
    recipientAddress
  })
}
```

**问题**: ❌ 路径和Content-Type都不一致
- HTML使用: `/api/shipping` + FormData
- Vue使用: `/direct-purchase/submit-shipping-info` + JSON

**需要修复**: ✅ 是

---

### 4. 删除评论 (MyReviews.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | my-reviews.html | src/api/index.js |  |
| **API路径** | `/reviews/${reviewId}` | `/reviews/${reviewId}` | ✅ 一致 |
| **方法** | DELETE | DELETE | ✅ |

**状态**: ✅ 已修复（之前已经修复过）

---

## ✅ 商家端API检查

### 5. 获取商家订单 (MerchantOrders.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | merchant-orders.html | src/api/index.js |  |
| **API路径** | `/api/merchant/orders/${merchantName}` | `/merchant/orders` | ❌ **不一致** |
| **方法** | GET | GET | ✅ |

**原始HTML代码** (merchant-orders.html 第333行):
```javascript
const response = await fetch(`http://localhost:8080/api/merchant/orders/${merchantName}`);
```

**Vue代码** (src/api/index.js 第244行):
```javascript
getOrders() {
  return api.get('/merchant/orders')
}
```

**问题**: ❌ 路径不一致，且缺少merchantName参数
- HTML使用: `/api/merchant/orders/${merchantName}`
- Vue使用: `/merchant/orders`

**需要修复**: ✅ 是

---

### 6. 更新订单状态 (MerchantOrders.vue)

| 项目 | 原始HTML | Vue代码 | 状态 |
|------|---------|---------|------|
| **文件** | merchant-orders.html | src/api/index.js |  |
| **API路径** | `/api/orders/${orderId}/status?status=${status}` | `/merchant/orders/update-status` | ❌ **不一致** |
| **方法** | PUT | POST | ❌ **不一致** |

**原始HTML代码** (merchant-orders.html 第469-475行):
```javascript
const url = `http://localhost:8080/api/orders/${orderIdStr}/status?status=${encodeURIComponent(status)}`;
const response = await fetch(url, {
    method: 'PUT',
    headers: {
        'Accept': 'application/json'
    }
});
```

**Vue代码** (src/api/index.js 第248行):
```javascript
updateOrderStatus(orderId, status) {
  return api.post('/merchant/orders/update-status', {
    orderId,
    status
  })
}
```

**问题**: ❌ 路径和方法都不一致
- HTML使用: `/api/orders/${orderId}/status?status=${status}` + PUT
- Vue使用: `/merchant/orders/update-status` + POST + JSON body

**需要修复**: ✅ 是

---

## 📊 检查总结

| API功能 | 状态 | 需要修复 |
|---------|------|---------|
| 提交评论 | ❌ 路径不一致 | ✅ 是 |
| 购物车结算 | ⚠️ 参数名不同 | ⚠️ 待确认 |
| 提交收件人信息 | ❌ 路径和格式不一致 | ✅ 是 |
| 删除评论 | ✅ 已修复 | ❌ 否 |
| 获取商家订单 | ❌ 路径不一致 | ✅ 是 |
| 更新订单状态 | ❌ 路径和方法不一致 | ✅ 是 |

**需要修复的API**: 4-5个

---

## 🔧 修复建议

### 修复1: 提交评论API

**文件**: `src/api/index.js` 第164行

**修改前**:
```javascript
submitReview(userName, productId, rating, commentText, isAnonymous) {
  return api.post('/api/submit-review', {
    userName,
    productId,
    rating,
    commentText,
    isAnonymous
  })
}
```

**修改后**:
```javascript
submitReview(userName, productId, rating, commentText, isAnonymous) {
  return api.post('/reviews/add', {
    userName,
    productId,
    rating,
    commentText,
    isAnonymous
  })
}
```

---

### 修复2: 购物车结算参数

**文件**: `src/api/index.js` 第122行

**需要确认**: 后端接受的参数名是 `items` 还是 `selectedItems`

**如果后端使用 `items`，修改为**:
```javascript
checkout(userName, selectedItems) {
  return api.post('/cart/checkout', {
    userName,
    items: selectedItems  // 改为 items
  })
}
```

---

### 修复3: 提交收件人信息

**文件**: `src/api/index.js` 第198行

**修改前**:
```javascript
submitShippingInfo(orderId, recipientName, recipientPhone, recipientAddress) {
  return api.post('/direct-purchase/submit-shipping-info', {
    orderId,
    recipientName,
    recipientPhone,
    recipientAddress
  })
}
```

**修改后**:
```javascript
submitShippingInfo(orderId, recipientName, recipientPhone, recipientAddress) {
  const formData = new FormData()
  formData.append('orderId', orderId)
  formData.append('name', recipientName)
  formData.append('phone', recipientPhone)
  formData.append('address', recipientAddress)
  
  return api.post('/api/shipping', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

---

### 修复4: 获取商家订单

**文件**: `src/api/index.js` 第244行

**修改前**:
```javascript
getOrders() {
  return api.get('/merchant/orders')
}
```

**修改后**:
```javascript
getOrders(merchantName) {
  return api.get(`/api/merchant/orders/${merchantName}`)
}
```

**同时需要修改调用处**: `src/views/MerchantOrders.vue`
```javascript
// 获取merchantName并传递
const merchantName = localStorage.getItem('merchantName')
const response = await merchantApi.getOrders(merchantName)
```

---

### 修复5: 更新订单状态

**文件**: `src/api/index.js` 第248行

**修改前**:
```javascript
updateOrderStatus(orderId, status) {
  return api.post('/merchant/orders/update-status', {
    orderId,
    status
  })
}
```

**修改后**:
```javascript
updateOrderStatus(orderId, status) {
  return api.put(`/api/orders/${orderId}/status?status=${encodeURIComponent(status)}`)
}
```

---

## ✅ 验收标准

修复后需要测试：

- [ ] 提交评论功能正常
- [ ] 购物车结算功能正常
- [ ] 提交收件人信息功能正常
- [ ] 商家查看订单列表正常
- [ ] 商家更新订单状态正常
- [ ] 所有API不再返回404错误

---

**检查时间**: 2025-10-15
**检查状态**: ✅ 已完成
**发现问题**: 4-5个API路径不一致
**优先级**: 🔴 高（影响核心功能）

