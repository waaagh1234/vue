<template>
  <div class="product-detail-page">
    <!-- 顶部导航 -->
    <div class="site-nav">
      <div class="container">
        <div class="nav-left">
          <router-link to="/mall">返回商城</router-link>
        </div>
        <div class="nav-right">
          <router-link to="/cart">购物车</router-link>
          <router-link to="/favorites">收藏</router-link>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
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
      </div>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> 加载中...
    </div>

    <div v-else class="container">
      <!-- 商品详情区 -->
      <div class="product-detail-container">
        <div class="product-header">
          <div class="product-gallery">
            <img :src="product.imagePath" :alt="product.productName" class="main-image" />
          </div>
          <div class="product-info">
            <h1 class="product-title">{{ product.productName }}</h1>
            <div class="product-meta">
              <span><i class="fas fa-tag"></i> 品牌：{{ product.brand }}</span>
              <span><i class="fas fa-th-large"></i> 分类：{{ product.category }}</span>
              <span><i class="fas fa-chart-line"></i> 销量：{{ product.salesCount }}件</span>
            </div>
            <div class="price-section">
              <span class="current-price">¥{{ product.nowPrice }}</span>
              <span class="original-price">¥{{ product.originalPrice }}</span>
              <span class="discount">{{ discount }}%折扣</span>
            </div>
            <div class="shipping-info">
              <i class="fas fa-truck"></i> 发货地：{{ product.shippingAddress }}
            </div>
            <div class="action-buttons">
              <button class="btn-add-cart" @click="handleAddToCart">
                <i class="fas fa-shopping-cart"></i> 加入购物车
              </button>
              <button class="btn-buy-now" @click="handleBuyNow">
                <i class="fas fa-bolt"></i> 立即购买
              </button>
            </div>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="product-description">
          <h2>商品描述</h2>
          <p>{{ product.productDesc }}</p>
        </div>

        <!-- 商品评论 -->
        <div class="product-reviews">
          <h2>商品评价 <span id="reviewCount">({{ reviewStats.totalCount }})</span></h2>
          
          <!-- 评分统计 -->
          <div class="rating-summary">
            <div class="rating-score">
              <div class="score-number">{{ reviewStats.averageRating?.toFixed(1) || '0.0' }}</div>
              <div class="stars">
                <i v-for="n in 5" :key="n" 
                   :class="n <= Math.round(reviewStats.averageRating) ? 'fas fa-star' : 'far fa-star'">
                </i>
              </div>
              <div class="total-reviews">共 {{ reviewStats.totalCount }} 条评价</div>
            </div>
            
            <div class="rating-distribution">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="rating-bar">
                <span class="star-label">{{ star }}星</span>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: getStarPercentage(star) + '%' }"></div>
                </div>
                <span class="star-count">{{ reviewStats.distribution?.[star] || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="review-list">
            <div v-if="reviews.length === 0" class="no-reviews">
              <p>暂无评价</p>
            </div>
            <div v-else>
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <span class="reviewer-name">{{ review.isAnonymous ? '匿名用户' : review.userName }}</span>
                    <div class="review-stars">
                      <i v-for="n in 5" :key="n" 
                         :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'">
                      </i>
                    </div>
                  </div>
                  <span class="review-date">{{ formatDate(review.createTime) }}</span>
                </div>
                <div class="review-content">{{ review.commentText }}</div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="changePage(currentPage - 1)" 
              :disabled="currentPage === 0"
            >
              上一页
            </button>
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="changePage(page - 1)"
              :class="{ active: currentPage === page - 1 }"
            >
              {{ page }}
            </button>
            <button 
              @click="changePage(currentPage + 1)" 
              :disabled="currentPage === totalPages - 1"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 收件人信息模态框 -->
    <div v-if="showShippingModal" class="modal-overlay" @click.self="closeShippingModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">填写收件人信息</h3>
          <button class="modal-close" @click="closeShippingModal">&times;</button>
        </div>
        <form @submit.prevent="submitShippingInfo">
          <div class="form-group">
            <label class="form-label">收件人姓名</label>
            <input type="text" v-model="shippingForm.recipientName" required />
          </div>
          <div class="form-group">
            <label class="form-label">联系电话</label>
            <input type="tel" v-model="shippingForm.recipientPhone" required />
          </div>
          <div class="form-group">
            <label class="form-label">收货地址</label>
            <textarea v-model="shippingForm.recipientAddress" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">确认提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productApi, cartApi, purchaseApi } from '../api'
import { processProductImage } from '../utils/imageHelper'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const product = ref({})
    const loading = ref(false)
    const searchKeyword = ref('')
    const reviews = ref([])
    const reviewStats = ref({
      totalCount: 0,
      averageRating: 0,
      distribution: {}
    })
    const currentPage = ref(0)
    const totalPages = ref(0)
    const showShippingModal = ref(false)
    const shippingForm = ref({
      orderId: '',
      recipientName: '',
      recipientPhone: '',
      recipientAddress: ''
    })
    
    const productId = computed(() => route.params.id)
    
    const discount = computed(() => {
      if (product.value.nowPrice && product.value.originalPrice) {
        return Math.round((1 - product.value.nowPrice / product.value.originalPrice) * 100)
      }
      return 0
    })
    
    // 获取商品详情
    const getProductDetail = async () => {
      loading.value = true
      try {
        const response = await productApi.getProductDetail(productId.value)
        product.value = processProductImage(response.data)
      } catch (error) {
        console.error('获取商品详情出错:', error)
        alert('获取商品详情失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
    
    // 获取商品评论
    const getProductReviews = async (page = 0) => {
      try {
        const response = await productApi.getProductReviews(productId.value, page, 5)
        if (response.data.success) {
          reviewStats.value = response.data.ratingStats || {
            totalCount: 0,
            averageRating: 0,
            distribution: {}
          }
          reviews.value = response.data.reviews || []
          currentPage.value = response.data.currentPage || 0
          totalPages.value = response.data.totalPages || 0
        }
      } catch (error) {
        console.error('获取商品评论失败:', error)
      }
    }
    
    // 获取星级百分比
    const getStarPercentage = (star) => {
      if (!reviewStats.value.totalCount) return 0
      const count = reviewStats.value.distribution?.[star] || 0
      return (count / reviewStats.value.totalCount) * 100
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    // 切换页码
    const changePage = (page) => {
      if (page >= 0 && page < totalPages.value) {
        getProductReviews(page)
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
    
    // 加入购物车
    const handleAddToCart = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }
      
      try {
        await cartApi.addToCart(userName, productId.value)
        alert('已加入购物车')
      } catch (error) {
        console.error('加入购物车失败:', error)
        alert('加入购物车失败，请稍后重试')
      }
    }
    
    // 立即购买
    const handleBuyNow = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }
      
      try {
        const response = await purchaseApi.directBuy(userName, parseInt(productId.value))
        if (response.data.success) {
          shippingForm.value.orderId = response.data.orderId
          showShippingModal.value = true
        } else {
          alert(response.data.message || '购买失败')
        }
      } catch (error) {
        console.error('购买失败:', error)
        alert('购买失败: ' + error.message)
      }
    }
    
    // 提交收件人信息
    const submitShippingInfo = async () => {
      try {
        const response = await purchaseApi.submitShippingInfo(
          shippingForm.value.orderId,
          shippingForm.value.recipientName,
          shippingForm.value.recipientPhone,
          shippingForm.value.recipientAddress
        )
        
        if (response.data.success) {
          alert('购买成功！')
          closeShippingModal()
          router.push('/records')
        } else {
          alert(response.data.message || '提交失败')
        }
      } catch (error) {
        console.error('提交收件人信息失败:', error)
        alert('提交失败，请稍后重试')
      }
    }
    
    // 关闭模态框
    const closeShippingModal = () => {
      showShippingModal.value = false
      shippingForm.value = {
        orderId: '',
        recipientName: '',
        recipientPhone: '',
        recipientAddress: ''
      }
    }
    
    onMounted(() => {
      getProductDetail()
      getProductReviews()
    })
    
    return {
      product,
      loading,
      searchKeyword,
      reviews,
      reviewStats,
      currentPage,
      totalPages,
      discount,
      showShippingModal,
      shippingForm,
      getStarPercentage,
      formatDate,
      changePage,
      handleSearch,
      handleAddToCart,
      handleBuyNow,
      submitShippingInfo,
      closeShippingModal
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

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
  gap: 15px;
}

.nav-left a,
.nav-right a {
  color: #666;
  text-decoration: none;
}

.nav-left a:hover,
.nav-right a:hover {
  color: #ff0036;
}

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

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.product-detail-container {
  margin-top: 20px;
}

.product-header {
  display: flex;
  gap: 30px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-gallery {
  width: 400px;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.product-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.product-meta i {
  margin-right: 5px;
  color: #ff0036;
}

.price-section {
  background-color: #fff5f7;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-price {
  font-size: 32px;
  color: #ff0036;
  font-weight: bold;
  margin-right: 15px;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
  margin-right: 15px;
}

.discount {
  display: inline-block;
  background-color: #ff0036;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.shipping-info {
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.shipping-info i {
  color: #ff0036;
  margin-right: 5px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-add-cart,
.btn-buy-now {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-cart {
  background-color: #fff;
  color: #ff0036;
  border: 2px solid #ff0036;
}

.btn-add-cart:hover {
  background-color: #fff5f7;
}

.btn-buy-now {
  background-color: #ff0036;
  color: white;
}

.btn-buy-now:hover {
  background-color: #e6002f;
}

.btn-add-cart i,
.btn-buy-now i {
  margin-right: 5px;
}

.product-description,
.product-reviews {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.product-description h2,
.product-reviews h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff0036;
}

.product-description p {
  color: #666;
  line-height: 1.8;
}

.rating-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.rating-score {
  text-align: center;
}

.score-number {
  font-size: 48px;
  color: #ff0036;
  font-weight: bold;
}

.stars {
  margin: 10px 0;
}

.stars i {
  color: #ffd700;
  font-size: 18px;
}

.total-reviews {
  color: #666;
  font-size: 14px;
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.star-label {
  width: 40px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #ffd700;
  transition: width 0.3s;
}

.star-count {
  width: 40px;
  text-align: right;
  font-size: 14px;
  color: #666;
}

.review-list {
  margin-top: 20px;
}

.no-reviews {
  text-align: center;
  padding: 40px;
  color: #999;
}

.review-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.reviewer-name {
  font-weight: 600;
  color: #333;
}

.review-stars i {
  color: #ffd700;
  font-size: 14px;
}

.review-date {
  color: #999;
  font-size: 12px;
}

.review-content {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
  }

  .product-gallery {
    width: 100%;
  }

  .rating-summary {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>

