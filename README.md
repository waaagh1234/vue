# Vue商城项目

这是一个将原HTML页面完全转换为Vue 3组件的商城项目。

## 项目特点

- ✅ 完全使用Vue 3 Composition API
- ✅ 保持所有原有接口不变
- ✅ 保持传递给后端的数据格式不变
- ✅ 使用Vue Router进行路由管理
- ✅ 使用Axios进行HTTP请求
- ✅ 响应式设计，支持移动端
- ✅ 图片资源已完整迁移并自动处理

## 技术栈

- Vue 3
- Vue Router 4
- Axios
- Vite
- Font Awesome (图标库)

## 项目结构

```
├── index.html                 # 入口HTML文件
├── package.json              # 项目依赖配置
├── vite.config.js            # Vite配置文件
├── src/
│   ├── main.js              # 应用入口
│   ├── App.vue              # 根组件
│   ├── router/
│   │   └── index.js         # 路由配置
│   ├── api/
│   │   └── index.js         # API接口封装
│   ├── utils/
│   │   └── imageHelper.js   # 图片路径处理工具
│   ├── assets/
│   │   ├── images/          # 图片资源目录
│   │   └── styles/
│   │       └── global.css   # 全局样式
│   └── views/               # 页面组件
│       ├── Login.vue        # 登录/注册页面
│       ├── Mall.vue         # 商城首页
│       ├── Cart.vue         # 购物车
│       ├── ProductDetail.vue # 商品详情
│       ├── SearchResults.vue # 搜索结果
│       ├── Favorites.vue    # 收藏列表
│       ├── Records.vue      # 购买记录
│       ├── MyReviews.vue    # 我的评论
│       ├── ResetPassword.vue # 重置密码
│       ├── Help.vue         # 帮助中心
│       ├── MerchantLogin.vue # 商家登录
│       ├── MerchantDashboard.vue # 商家管理后台
│       ├── MerchantOrders.vue # 商家订单管理
│       └── MerchantStatistics.vue # 商家销售统计
```

## API接口说明

所有API接口都封装在 `src/api/index.js` 文件中，包括：

### 用户相关
- `userApi.login(username, password)` - 用户登录
- `userApi.register(username, password, email)` - 用户注册
- `userApi.resetPassword(username, email, newPassword)` - 重置密码

### 商品相关
- `productApi.getAllProducts()` - 获取所有商品
- `productApi.searchByStatus(status)` - 根据状态搜索商品
- `productApi.search(keyword)` - 搜索商品
- `productApi.getProductDetail(id)` - 获取商品详情
- `productApi.getProductReviews(productId, page, size)` - 获取商品评论

### 购物车相关
- `cartApi.getCart(userName)` - 获取购物车
- `cartApi.addToCart(userName, productId)` - 添加到购物车
- `cartApi.updateCart(id, userName, quantity)` - 更新购物车数量
- `cartApi.removeFromCart(id)` - 删除购物车商品
- `cartApi.checkout(userName, selectedItems)` - 结算

### 收藏相关
- `favoriteApi.getFavorites(userName)` - 获取收藏列表
- `favoriteApi.checkFavorite(userName, productId)` - 检查是否收藏
- `favoriteApi.addFavorite(userName, productId)` - 添加收藏
- `favoriteApi.removeFavorite(userName, productId)` - 取消收藏

### 购买记录相关
- `recordApi.getPurchaseRecords(userName, page, size)` - 获取购买记录
- `recordApi.submitReview(userName, productId, rating, commentText, isAnonymous)` - 提交评价

### 评论相关
- `reviewApi.getUserReviews(userName, page, size)` - 获取用户评论
- `reviewApi.deleteReview(reviewId)` - 删除评论

### 直接购买相关
- `purchaseApi.directBuy(userName, productId)` - 直接购买
- `purchaseApi.submitShippingInfo(orderId, recipientName, recipientPhone, recipientAddress)` - 提交收件人信息

### 商家相关
- `merchantApi.login(username, password)` - 商家登录
- `merchantApi.getProducts(page, size)` - 获取商家商品列表
- `merchantApi.addProduct(productData)` - 添加商品
- `merchantApi.updateProduct(productData)` - 更新商品
- `merchantApi.deleteProduct(id)` - 删除商品
- `merchantApi.getOrders()` - 获取订单列表
- `merchantApi.updateOrderStatus(orderId, status)` - 更新订单状态

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 运行

### 3. 构建生产版本

```bash
npm run build
```

构建后的文件将在 `dist` 目录中

### 4. 预览生产版本

```bash
npm run preview
```

## 后端API配置

后端API地址配置在 `src/api/index.js` 文件中：

```javascript
const API_BASE_URL = 'http://localhost:8080'
```

如果后端API地址不同，请修改此配置。

## 路由说明

- `/` - 重定向到登录页
- `/login` - 登录/注册页面
- `/mall` - 商城首页
- `/cart` - 购物车
- `/product-detail/:id` - 商品详情
- `/search-results` - 搜索结果
- `/favorites` - 收藏列表
- `/records` - 购买记录
- `/my-reviews` - 我的评论
- `/reset-password` - 重置密码
- `/help` - 帮助中心
- `/merchant-login` - 商家登录
- `/merchant-dashboard` - 商家管理后台
- `/merchant-orders` - 商家订单管理
- `/merchant-statistics` - 商家销售统计

## 图片资源

### 图片位置
所有图片资源已从 `resources/templates/images/` 迁移到 `src/assets/images/` 目录。

### 图片处理
项目使用 `src/utils/imageHelper.js` 自动处理图片路径：
- 支持完整URL（http://、https://）
- 支持本地图片资源
- 支持后端相对路径
- 自动回退到占位图

### 使用示例
```javascript
import { processProductImages } from '../utils/imageHelper'

// 处理商品列表图片
const response = await productApi.getAllProducts()
products.value = processProductImages(response.data)
```

详细说明请查看 `图片资源说明.md` 文件。

## 数据存储

项目使用 `localStorage` 存储用户信息：

- `username` - 用户名
- `userId` - 用户ID
- `merchantName` - 商家名称
- `merchantId` - 商家ID

## 注意事项

1. 确保后端服务已启动并运行在 `http://localhost:8080`
2. 所有API接口的请求和响应格式与原HTML版本完全一致
3. 图标使用Font Awesome，需要网络连接加载
4. 项目使用Vite作为构建工具，开发时支持热更新

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发建议

1. 使用Vue DevTools进行调试
2. 查看浏览器控制台了解API请求详情
3. 修改样式时可以直接在组件的`<style scoped>`中修改

## 常见问题

### Q: API请求失败怎么办？
A: 检查后端服务是否正常运行，以及API地址配置是否正确。

### Q: 如何修改端口？
A: 在 `vite.config.js` 中修改 `server.port` 配置。

### Q: 如何添加新页面？
A: 
1. 在 `src/views/` 目录下创建新的Vue组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在需要的地方使用 `<router-link>` 或 `router.push()` 进行导航

## 许可证

MIT

