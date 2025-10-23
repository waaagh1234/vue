<template>
  <div class="my-reviews-page">
    <div class="container">
      <div class="reviews-header">
        <div>
          <h1 class="reviews-title">我的评论</h1>
          <p class="reviews-subtitle">共 <span>{{ totalReviews }}</span> 条评论</p>
        </div>
        <div style="display: flex; gap: 15px;">
          <router-link to="/records" class="back-link" style="background-color: #f5f5f5;">
            <i class="fas fa-list"></i> 购买记录
          </router-link>
          <router-link to="/mall" class="back-link">
            <i class="fas fa-arrow-left"></i> 返回商城
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else-if="reviews.length === 0" class="empty-state">
        <i class="fas fa-comment"></i>
        <p>暂无评论</p>
        <router-link to="/records" class="btn btn-primary">去评价</router-link>
      </div>

      <div v-else class="reviews-content">
        <div class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-product">
              <img :src="review.productImagePath" :alt="review.productName" />
              <div class="product-info">
                <div class="product-name">{{ review.productName }}</div>
                <div class="review-date">{{ formatDate(review.createTime) }}</div>
              </div>
            </div>
            <div class="review-content-section">
              <div class="review-rating">
                <i v-for="n in 5" :key="n" 
                   :class="n <= review.rating ? 'fas fa-star' : 'far fa-star'">
                </i>
              </div>
              <div class="review-text">{{ review.commentText }}</div>
              <div class="review-meta">
                <span v-if="review.isAnonymous" class="anonymous-badge">匿名</span>
                <span class="reviewer-name">{{ review.isAnonymous ? '匿名用户' : review.userName }}</span>
              </div>
              <div class="review-actions">
                <button class="btn-delete" @click="deleteReview(review.id)">
                  <i class="fas fa-trash"></i> 删除
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            上一页
          </button>
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
          <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { reviewApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'MyReviews',
  setup() {
    const router = useRouter()
    const reviews = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(0)
    const totalReviews = ref(0)
    
    const fetchUserReviews = async (page = 1) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }
      
      loading.value = true
      try {
        const response = await reviewApi.getUserReviews(userName, page, 10)
        reviews.value = processProductImages(response.data.reviews || [])
        totalPages.value = response.data.totalPages || 0
        totalReviews.value = response.data.totalReviews || 0
        currentPage.value = page
      } catch (error) {
        console.error('获取评论列表失败:', error)
        alert('获取评论列表失败')
      } finally {
        loading.value = false
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchUserReviews(page)
      }
    }
    
    const deleteReview = async (reviewId) => {
      if (!confirm('确定要删除这条评论吗？')) return
      
      try {
        await reviewApi.deleteReview(reviewId)
        alert('删除成功')
        fetchUserReviews(currentPage.value)
      } catch (error) {
        console.error('删除评论失败:', error)
        alert('删除评论失败，请稍后重试')
      }
    }
    
    onMounted(() => {
      fetchUserReviews()
    })
    
    return {
      reviews,
      loading,
      currentPage,
      totalPages,
      totalReviews,
      formatDate,
      changePage,
      deleteReview
    }
  }
}
</script>

<style scoped>
.my-reviews-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.reviews-header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reviews-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.reviews-subtitle {
  color: #666;
  margin-top: 5px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #ff0036;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #f5f5f5;
}

.back-link i {
  margin-right: 5px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.empty-state i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.reviews-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.review-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.review-item:last-child {
  border-bottom: none;
}

.review-product {
  display: flex;
  gap: 15px;
  width: 300px;
}

.review-product img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-content-section {
  flex: 1;
}

.review-rating {
  margin-bottom: 10px;
}

.review-rating i {
  color: #ffd700;
  font-size: 16px;
}

.review-rating i.far {
  color: #ddd;
}

.review-text {
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.anonymous-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
}

.reviewer-name {
  font-size: 14px;
  color: #666;
}

.btn-delete {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>

