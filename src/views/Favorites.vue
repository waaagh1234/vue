<template>
  <div class="favorites-page">
    <div class="container">
      <div class="favorites-header">
        <div>
          <h1 class="favorites-title">我的收藏</h1>
          <p class="favorites-subtitle">共 <span>{{ favorites.length }}</span> 件商品</p>
        </div>
        <router-link to="/mall" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> 返回商城
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else-if="favorites.length === 0" class="empty-state">
        <i class="fas fa-heart"></i>
        <p>暂无收藏商品</p>
        <router-link to="/mall" class="btn btn-primary">去逛逛</router-link>
      </div>

      <div v-else class="product-grid">
        <div
          v-for="item in favorites"
          :key="item.id"
          class="product-card"
        >
          <div class="product-image" @click="goToProductDetail(item.id)">
            <img :src="item.imagePath" :alt="item.productName" />
          </div>
          <div class="product-info">
            <div class="product-name" @click="goToProductDetail(item.id)">
              {{ item.productName }}
            </div>
            <div class="product-price">
              <span class="price-now">¥{{ item.nowPrice }}</span>
              <span class="price-original">¥{{ item.originalPrice }}</span>
            </div>
            <div class="product-actions">
              <button class="btn-add-cart" @click="addToCart(item.id)">
                <i class="fas fa-shopping-cart"></i> 加入购物车
              </button>
              <button class="btn-remove" @click="removeFavorite(item.id)">
                <i class="fas fa-trash"></i> 移除
              </button>
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
import { favoriteApi, cartApi, productApi } from '../api' // 添加 productApi
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'Favorites',
  setup() {
    const router = useRouter()
    const favorites = ref([])
    const loading = ref(false)

    const fetchFavorites = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }

      loading.value = true
      try {
        // 1. 获取收藏的商品ID列表
        const response = await favoriteApi.getFavorites(userName)
        const productIds = response.data

        if (!productIds || productIds.length === 0) {
          favorites.value = []
          return
        }

        // 2. 逐个获取商品详情
        const productDetails = []
        for (const productId of productIds) {
          try {
            const productResponse = await productApi.getProductDetail(productId)
            productDetails.push(productResponse.data)
          } catch (error) {
            console.error(`获取商品详情失败，商品ID: ${productId}`, error)
          }
        }

        // 3. 处理图片路径
        favorites.value = processProductImages(productDetails)
      } catch (error) {
        console.error('获取收藏列表失败:', error)
        alert('获取收藏列表失败')
      } finally {
        loading.value = false
      }
    }
    
    const goToProductDetail = (id) => {
      router.push(`/product-detail/${id}`)
    }
    
    const addToCart = async (productId) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      try {
        await cartApi.addToCart(userName, productId)
        alert('已加入购物车')
      } catch (error) {
        console.error('加入购物车失败:', error)
        alert('加入购物车失败，请稍后重试')
      }
    }
    
    const removeFavorite = async (productId) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      if (!confirm('确定要移除该收藏吗？')) return
      
      try {
        await favoriteApi.removeFavorite(userName, productId)
        favorites.value = favorites.value.filter(item => item.productId !== productId)
        alert('已移除收藏')
      } catch (error) {
        console.error('移除收藏失败:', error)
        alert('移除收藏失败，请稍后重试')
      }
    }
    
    onMounted(() => {
      fetchFavorites()
    })
    
    return {
      favorites,
      loading,
      goToProductDetail,
      addToCart,
      removeFavorite
    }
  }
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.favorites-header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorites-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.favorites-subtitle {
  color: #666;
  margin-top: 5px;
}

.continue-shopping {
  display: inline-flex;
  align-items: center;
  color: #ff0036;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.continue-shopping:hover {
  background-color: #f5f5f5;
}

.continue-shopping i {
  margin-right: 5px;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  color: #999;
  margin-bottom: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  cursor: pointer;
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
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-name:hover {
  color: #ff0036;
}

.product-price {
  margin-bottom: 15px;
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

.product-actions {
  display: flex;
  gap: 10px;
}

.btn-add-cart,
.btn-remove {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-cart {
  background-color: #ff0036;
  color: white;
}

.btn-add-cart:hover {
  background-color: #e6002f;
}

.btn-remove {
  background-color: #f5f5f5;
  color: #666;
}

.btn-remove:hover {
  background-color: #e0e0e0;
}
</style>

