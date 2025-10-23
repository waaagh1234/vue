<template>
  <div class="records-page">
    <div class="container">
      <div class="records-header">
        <div>
          <h1 class="records-title">我的购买记录</h1>
          <p class="records-subtitle">共 <span>{{ totalRecords }}</span> 条记录</p>
        </div>
        <div style="display: flex; gap: 15px;">
          <router-link to="/my-reviews" class="continue-shopping" style="background-color: #f5f5f5;">
            <i class="fas fa-comment"></i> 我的评论
          </router-link>
          <router-link to="/mall" class="continue-shopping">
            <i class="fas fa-arrow-left"></i> 返回商城
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else-if="records.length === 0" class="empty-state">
        <i class="fas fa-list"></i>
        <p>暂无购买记录</p>
        <router-link to="/mall" class="btn btn-primary">去购物</router-link>
      </div>

      <div v-else class="records-content">
        <div class="records-list">
          <div v-for="record in records" :key="record.id" class="record-item">
            <div class="record-image">
              <img :src="record.imagePath" :alt="record.productName" />
            </div>
            <div class="record-info">
              <div class="record-name">{{ record.productName }}</div>
              <div class="record-price">
                ¥{{ record.price?.toFixed(2) }}
                <span class="record-original-price">¥{{ record.originalPrice?.toFixed(2) }}</span>
              </div>
              <div class="record-time">购买时间: {{ formatDate(record.purchaseTime) }}</div>
              <div class="record-order-id">订单号: {{ record.orderId || '无订单号' }}</div>
              <div v-if="record.completionTime" class="record-time">
                完成时间: {{ formatDate(record.completionTime) }}
              </div>
              <div class="record-status">
                <span :class="'status-' + record.status">{{ getStatusText(record.status) }}</span>
              </div>
              <div class="record-actions">
                <button class="btn-view" @click="viewProductDetail(record.productId)">
                  查看商品
                </button>
                <button class="btn-add-cart" @click="addToCart(record.productId)">
                  再次购买
                </button>
                <button 
                  v-if="!record.hasReviewed" 
                  class="btn-review" 
                  @click="openReviewModal(record)"
                >
                  评价
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

    <!-- 评价模态框 -->
    <div v-if="showReviewModal" class="modal-overlay" @click.self="closeReviewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">评价商品</h3>
          <button class="modal-close" @click="closeReviewModal">&times;</button>
        </div>
        <div class="review-product-info">
          <img :src="reviewForm.productImage" :alt="reviewForm.productName" />
          <span>{{ reviewForm.productName }}</span>
        </div>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label class="form-label">评分</label>
            <div class="rating-input">
              <i 
                v-for="n in 5" 
                :key="n"
                :class="n <= reviewForm.rating ? 'fas fa-star' : 'far fa-star'"
                @click="reviewForm.rating = n"
              ></i>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">评价内容</label>
            <textarea 
              v-model="reviewForm.commentText" 
              rows="4" 
              placeholder="请输入您的评价..."
              required
            ></textarea>
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="reviewForm.isAnonymous" />
              匿名评价
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-block">提交评价</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { recordApi, cartApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'Records',
  setup() {
    const router = useRouter()
    const records = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(0)
    const totalRecords = ref(0)
    const showReviewModal = ref(false)
    const reviewForm = ref({
      productId: null,
      productName: '',
      productImage: '',
      rating: 5,
      commentText: '',
      isAnonymous: false
    })
    
    const fetchPurchaseRecords = async (page = 1) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }
      
      loading.value = true
      try {
        const response = await recordApi.getPurchaseRecords(userName, page, 10)
        records.value = processProductImages(response.data.records || [])
        totalPages.value = response.data.totalPages || 0
        totalRecords.value = response.data.records?.length || 0
        currentPage.value = page
      } catch (error) {
        console.error('获取购买记录失败:', error)
        alert('获取购买记录失败')
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
    
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || status
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchPurchaseRecords(page)
      }
    }
    
    const viewProductDetail = (productId) => {
      router.push(`/product-detail/${productId}`)
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
    
    const openReviewModal = (record) => {
      reviewForm.value = {
        productId: record.productId,
        productName: record.productName,
        productImage: record.imagePath || record.productImage, // 使用已处理的图片路径
        rating: 5,
        commentText: '',
        isAnonymous: false
      }
      showReviewModal.value = true
    }
    
    const closeReviewModal = () => {
      showReviewModal.value = false
      reviewForm.value = {
        productId: null,
        productName: '',
        productImage: '',
        rating: 5,
        commentText: '',
        isAnonymous: false
      }
    }
    
    const submitReview = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      try {
        const response = await recordApi.submitReview(
          userName,
          reviewForm.value.productId,
          reviewForm.value.rating,
          reviewForm.value.commentText,
          reviewForm.value.isAnonymous
        )
        
        if (response.data.success) {
          alert('评价提交成功！')
          closeReviewModal()
          fetchPurchaseRecords(currentPage.value)
        } else {
          alert(response.data.message || '评价提交失败，请稍后重试')
        }
      } catch (error) {
        console.error('提交评价失败:', error)
        alert('提交评价失败，请稍后重试')
      }
    }
    
    onMounted(() => {
      fetchPurchaseRecords()
    })
    
    return {
      records,
      loading,
      currentPage,
      totalPages,
      totalRecords,
      showReviewModal,
      reviewForm,
      formatDate,
      getStatusText,
      changePage,
      viewProductDetail,
      addToCart,
      openReviewModal,
      closeReviewModal,
      submitReview
    }
  }
}
</script>

<style scoped>
.records-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.records-header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.records-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.records-subtitle {
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

.records-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.record-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.record-item:last-child {
  border-bottom: none;
}

.record-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.record-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.record-info {
  flex: 1;
}

.record-name {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}

.record-price {
  font-size: 18px;
  color: #ff0036;
  font-weight: bold;
  margin-bottom: 10px;
}

.record-original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.record-time,
.record-order-id {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.record-status {
  margin: 10px 0;
}

.record-status span {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.record-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-view,
.btn-add-cart,
.btn-review {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view {
  background-color: #f5f5f5;
  color: #333;
}

.btn-view:hover {
  background-color: #e0e0e0;
}

.btn-add-cart {
  background-color: #ff0036;
  color: white;
}

.btn-add-cart:hover {
  background-color: #e6002f;
}

.btn-review {
  background-color: #28a745;
  color: white;
}

.btn-review:hover {
  background-color: #218838;
}

.review-product-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.review-product-info img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.rating-input {
  display: flex;
  gap: 5px;
}

.rating-input i {
  font-size: 24px;
  color: #ffd700;
  cursor: pointer;
  transition: transform 0.2s;
}

.rating-input i:hover {
  transform: scale(1.2);
}

.rating-input i.far {
  color: #ddd;
}
</style>

