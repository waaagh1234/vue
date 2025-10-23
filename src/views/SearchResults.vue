<template>
  <div class="search-results-page">
    <div class="container">
      <div class="search-header">
        <h1>搜索结果</h1>
        <p>关键词: <span class="search-term">{{ searchTerm }}</span></p>
        <p>找到 <span class="results-count">{{ products.length }}</span> 个商品</p>
        <router-link to="/mall" class="back-link">
          <i class="fas fa-arrow-left"></i> 返回商城
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <p>未找到相关商品</p>
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
                <i class="fas fa-heart"></i>
                <i class="fas fa-shopping-cart"></i>
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
import { useRoute, useRouter } from 'vue-router'
import { productApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'SearchResults',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const products = ref([])
    const loading = ref(false)
    const searchTerm = ref('')

    const getSearchResults = async () => {
      searchTerm.value = route.query.q || ''
      if (!searchTerm.value) {
        router.push('/mall')
        return
      }
      
      loading.value = true
      try {
        const response = await productApi.search(searchTerm.value)
        products.value = processProductImages(response.data)
      } catch (error) {
        console.error('搜索请求出错:', error)
        alert('搜索请求出现错误，请稍后重试')
      } finally {
        loading.value = false
      }
    }
    
    const goToProductDetail = (id) => {
      router.push(`/product-detail/${id}`)
    }
    
    onMounted(() => {
      getSearchResults()
    })
    
    return {
      products,
      loading,
      searchTerm,
      goToProductDetail
    }
  }
}
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.search-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.search-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.search-term {
  color: #ff0036;
  font-weight: bold;
}

.results-count {
  color: #ff0036;
  font-weight: bold;
}

.back-link {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #ff0036;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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
}

.sales {
  color: #999;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions i {
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.actions i:hover {
  color: #ff0036;
}
</style>

