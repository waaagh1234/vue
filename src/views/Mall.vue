<template>
  <div class="mall-page">
    <!-- 顶部导航 -->
    <div class="site-nav">
      <div class="container">
        <div class="nav-left">
          <span>优品商城，正品低价、品质保障、配送及时、轻松购物！</span>
        </div>
        <div class="nav-right">
          <a v-if="!isLoggedIn" href="#" @click.prevent="$router.push('/login')">请登录</a>
          <div v-else class="user-info">
            <span>欢迎，{{ username }}</span>
            <a href="#" @click.prevent="logout">退出</a>
          </div>
          <a href="#" @click.prevent="$router.push('/help')">帮助中心</a>
        </div>
      </div>
    </div>

    <!-- 头部搜索区 -->
    <div class="header">
      <div class="container">
        <div class="logo">
          <h1>优品商城</h1>
        </div>
        <div class="search-box">
          <div class="search-input">
            <input 
              type="text" 
              v-model="searchKeyword"
              placeholder="搜索商品..."
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <div class="cart-box">
          <router-link to="/cart" class="cart-link">
            <i class="fas fa-shopping-cart"></i>
            <span>购物车</span>
          </router-link>
          <router-link to="/favorites" class="cart-link">
            <i class="fas fa-heart"></i>
            <span>收藏</span>
          </router-link>
          <router-link to="/records" class="cart-link">
            <i class="fas fa-list"></i>
            <span>订单</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主导航 -->
    <div class="main-nav">
      <div class="container">
        <nav class="nav-links">
          <a href="#" @click.prevent="getAllProducts" :class="{ active: activeNav === 'all' }">首页</a>
          <a href="#" @click.prevent="searchByStatus('秒杀')" :class="{ active: activeNav === '秒杀' }">秒杀</a>
          <a href="#" @click.prevent="searchByStatus('特惠')" :class="{ active: activeNav === '特惠' }">特惠</a>
          <a href="#" @click.prevent="searchByStatus('新品')" :class="{ active: activeNav === '新品' }">新品</a>
          <a href="#" @click.prevent="searchByStatus('热销')" :class="{ active: activeNav === '热销' }">热销</a>
          <a href="#" @click.prevent="searchByStatus('品牌')" :class="{ active: activeNav === '品牌' }">品牌</a>
        </nav>
      </div>
    </div>

    <!-- 商品展示区 -->
    <div class="container">
      <div class="featured-section">
        <div class="section-header">
          <h2>特色商品</h2>
          <a href="#" class="more">查看更多 <i class="fas fa-angle-right"></i></a>
        </div>
        
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>
        
        <div v-else class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-card"
            @click="goToProductDetail(product.id)"
          >
            <div class="product-image">
              <img :src="product.imagePath" :alt="product.productName" />
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.productName }}</div>
              <div class="product-price">
                <span class="price-now">¥{{ product.nowPrice }}</span>
                <span class="price-original">¥{{ product.originalPrice }}</span>
              </div>
              <div class="product-footer">
                <span class="sales">已售{{ product.salesCount }}件</span>
                <div class="actions">
                  <span 
                    class="action-btn favorite-btn"
                    :class="{ active: favoriteProducts.includes(product.id) }"
                    @click.stop="toggleFavorite(product.id)"
                  >
                    <i class="fas fa-heart"></i>
                    {{ favoriteProducts.includes(product.id) ? '取消收藏' : '收藏' }}
                  </span>
                  <span class="action-btn" @click.stop="addToCart(product.id)">
                    <i class="fas fa-shopping-cart"></i>加入购物车
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productApi, cartApi, favoriteApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'Mall',
  setup() {
    const router = useRouter()
    const products = ref([])
    const loading = ref(false)
    const isLoggedIn = ref(false)
    const username = ref('')
    const searchKeyword = ref('')
    const activeNav = ref('all')
    const favoriteProducts = ref([])
    
    // 检查登录状态
    const checkLoginStatus = () => {
      const user = localStorage.getItem('username')
      if (user) {
        isLoggedIn.value = true
        username.value = user
      }
    }
    
    // 退出登录
    const logout = () => {
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      isLoggedIn.value = false
      username.value = ''
    }
    
    // 获取所有商品
    const getAllProducts = async () => {
      loading.value = true
      activeNav.value = 'all'
      try {
        const response = await productApi.getAllProducts()
        products.value = processProductImages(response.data)
        await fetchFavoriteItems()
      } catch (error) {
        console.error('获取商品列表出错:', error)
        alert('获取商品列表出现错误，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 根据状态搜索商品
    const searchByStatus = async (status) => {
      loading.value = true
      activeNav.value = status
      try {
        const response = await productApi.searchByStatus(status)
        products.value = processProductImages(response.data)
        await fetchFavoriteItems()
      } catch (error) {
        console.error('获取商品列表出错:', error)
        alert('获取商品列表出现错误，请稍后重试')
      } finally {
        loading.value = false
      }
    }
    
    // 搜索功能
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({
          name: 'SearchResults',
          query: { q: searchKeyword.value }
        })
      }
    }
    
    // 跳转到商品详情
    const goToProductDetail = (id) => {
      router.push(`/product-detail/${id}`)
    }
    
    // 获取收藏列表
    const fetchFavoriteItems = async () => {
      const user = localStorage.getItem('username')
      if (!user) return
      
      try {
        const response = await favoriteApi.getFavorites(user)
        favoriteProducts.value = response.data.map(item => item.productId)
      } catch (error) {
        console.error('获取收藏列表失败:', error)
      }
    }
    
    // 切换收藏状态
    const toggleFavorite = async (productId) => {
      const user = localStorage.getItem('username')
      if (!user) {
        alert('请先登录')
        return
      }
      
      try {
        const isFavorite = favoriteProducts.value.includes(productId)
        
        if (isFavorite) {
          await favoriteApi.removeFavorite(user, productId)
          favoriteProducts.value = favoriteProducts.value.filter(id => id !== productId)
          alert('已取消收藏')
        } else {
          await favoriteApi.addFavorite(user, productId)
          favoriteProducts.value.push(productId)
          alert('已加入收藏')
        }
      } catch (error) {
        console.error('操作收藏失败:', error)
        alert('操作收藏失败，请稍后重试')
      }
    }
    
    // 加入购物车
    const addToCart = async (productId) => {
      const user = localStorage.getItem('username')
      if (!user) {
        alert('请先登录')
        return
      }
      
      try {
        await cartApi.addToCart(user, productId)
        alert('已加入购物车')
      } catch (error) {
        console.error('加入购物车失败:', error)
        alert('加入购物车失败，请稍后重试')
      }
    }
    
    onMounted(() => {
      checkLoginStatus()
      getAllProducts()
    })
    
    return {
      products,
      loading,
      isLoggedIn,
      username,
      searchKeyword,
      activeNav,
      favoriteProducts,
      logout,
      getAllProducts,
      searchByStatus,
      handleSearch,
      goToProductDetail,
      toggleFavorite,
      addToCart
    }
  }
}
</script>

<style scoped>
/* 顶部导航 */
.site-nav {
  background-color: #f2f2f2;
  border-bottom: 1px solid #e5e5e5;
  font-size: 12px;
  color: #666;
}

.site-nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-right a {
  color: #666;
  text-decoration: none;
}

.nav-right a:hover {
  color: #ff0036;
}

.user-info {
  display: flex;
  gap: 10px;
}

/* 头部搜索区 */
.header {
  background-color: #fff;
  padding: 20px 0;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  color: #ff0036;
  font-size: 30px;
  font-weight: bold;
}

.search-box {
  width: 550px;
}

.search-input {
  display: flex;
  border: 2px solid #ff0036;
  border-radius: 4px;
  overflow: hidden;
}

.search-input input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-btn {
  width: 90px;
  background-color: #ff0036;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.search-btn:hover {
  background-color: #e6002f;
}

.cart-box {
  display: flex;
  gap: 20px;
}

.cart-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.cart-link:hover {
  color: #ff0036;
}

.cart-link i {
  font-size: 24px;
  margin-bottom: 5px;
}

/* 主导航 */
.main-nav {
  background-color: #ff0036;
  padding: 0;
}

.nav-links {
  display: flex;
  gap: 0;
}

.nav-links a {
  padding: 15px 30px;
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: #e6002f;
}

/* 商品展示区 */
.featured-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
}

.more {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.more:hover {
  color: #ff0036;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  margin-bottom: 10px;
}

.price-now {
  color: #ff0036;
  font-size: 20px;
  font-weight: bold;
  margin-right: 10px;
}

.price-original {
  color: #999;
  font-size: 14px;
  text-decoration: line-through;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.sales {
  color: #999;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 5px 10px;
  font-size: 12px;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  color: #ff0036;
  border-color: #ff0036;
}

.favorite-btn.active {
  color: #ff0036;
  border-color: #ff0036;
  background-color: #fff5f7;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.loading i {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
  }

  .search-box {
    width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
}
</style>

