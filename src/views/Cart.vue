<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <div>
          <h1 class="cart-title">我的购物车</h1>
          <p class="cart-subtitle">共 <span>{{ cartItems.length }}</span> 件商品</p>
        </div>
        <router-link to="/mall" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> 返回商城
        </router-link>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p class="empty-cart-text">购物车是空的</p>
        <router-link to="/mall" class="continue-shopping">
          <i class="fas fa-arrow-left"></i> 返回商城
        </router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <!-- 全选 -->
          <div class="select-all-container">
            <input 
              type="checkbox" 
              id="selectAll" 
              class="item-checkbox"
              v-model="selectAll"
              @change="toggleSelectAll"
            />
            <label for="selectAll" class="select-all-label">全选</label>
          </div>

          <!-- 购物车商品列表 -->
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="cart-item"
          >
            <input 
              type="checkbox" 
              class="item-checkbox"
              v-model="item.isSelected"
              @change="updateSummary"
            />
            <div class="item-image">
              <img :src="item.imagePath" :alt="item.productName" />
            </div>
            <div class="item-info">
              <div class="item-name">{{ item.productName }}</div>
              <div class="item-price">
                ¥{{ item.price?.toFixed(2) || '0.00' }}
                <span class="item-original-price">¥{{ item.originalPrice?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="item-quantity">
                <button class="quantity-btn" @click="updateQuantity(item, -1)">-</button>
                <input 
                  type="number" 
                  class="quantity-input" 
                  v-model.number="item.quantity"
                  @change="updateQuantity(item, 0)"
                  min="1"
                />
                <button class="quantity-btn" @click="updateQuantity(item, 1)">+</button>
              </div>
              <div class="item-actions">
                <span 
                  class="action-btn favorite-btn"
                  :class="{ active: item.isFavorite }"
                  @click="toggleFavorite(item.productId)"
                >
                  <i class="fas fa-heart"></i>{{ item.isFavorite ? '取消收藏' : '收藏' }}
                </span>
                <span class="action-btn" @click="removeItem(item.id)">
                  <i class="fas fa-trash"></i>删除
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单摘要 -->
        <div class="cart-summary">
          <h2 class="cart-summary-title">订单摘要</h2>
          <div class="summary-item">
            <span>商品总价</span>
            <span>¥{{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span>运费</span>
            <span>¥{{ shipping.toFixed(2) }}</span>
          </div>
          <div class="summary-total">
            <span>应付总额</span>
            <span>¥{{ total.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn" @click="checkout">立即结算</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { cartApi, favoriteApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'Cart',
  setup() {
    const router = useRouter()
    const cartItems = ref([])
    const loading = ref(false)
    const selectAll = ref(true)
    const subtotal = ref(0)
    const shipping = ref(0)
    const total = ref(0)
    
    // 获取购物车数据
    const fetchCartItems = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        router.push('/login')
        return
      }
      
      loading.value = true
      try {
        const response = await cartApi.getCart(userName)
        const processedData = processProductImages(response.data)
        cartItems.value = processedData.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          imagePath: item.imagePath,
          isSelected: true,
          isFavorite: item.isFavorite || false
        }))
        updateSummary()
      } catch (error) {
        console.error('获取购物车数据失败:', error)
        alert('获取购物车数据失败')
      } finally {
        loading.value = false
      }
    }
    
    // 更新商品数量
    const updateQuantity = async (item, change) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      let quantity = item.quantity
      if (change) {
        quantity += change
      }
      quantity = Math.max(1, quantity)
      
      try {
        await cartApi.updateCart(item.id, userName, quantity)
        item.quantity = quantity
        updateSummary()
      } catch (error) {
        console.error('更新数量失败:', error)
        alert('更新数量失败，请稍后重试')
      }
    }
    
    // 全选/取消全选
    const toggleSelectAll = () => {
      cartItems.value.forEach(item => {
        item.isSelected = selectAll.value
      })
      updateSummary()
    }
    
    // 更新订单摘要
    const updateSummary = () => {
      const selectedItems = cartItems.value.filter(item => item.isSelected)
      subtotal.value = selectedItems.reduce((sum, item) => {
        return sum + (item.price || 0) * item.quantity
      }, 0)
      
      shipping.value = subtotal.value > 0 ? 0 : 0 // 免运费
      total.value = subtotal.value + shipping.value
      
      // 更新全选状态
      selectAll.value = cartItems.value.length > 0 && 
                        cartItems.value.every(item => item.isSelected)
    }
    
    // 切换收藏
    const toggleFavorite = async (productId) => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      const item = cartItems.value.find(i => i.productId === productId)
      if (!item) return
      
      try {
        if (item.isFavorite) {
          await favoriteApi.removeFavorite(userName, productId)
          item.isFavorite = false
          alert('已取消收藏')
        } else {
          await favoriteApi.addFavorite(userName, productId)
          item.isFavorite = true
          alert('已加入收藏')
        }
      } catch (error) {
        console.error('操作收藏失败:', error)
        alert('操作收藏失败，请稍后重试')
      }
    }
    
    // 删除商品
    const removeItem = async (id) => {
      if (!confirm('确定要删除该商品吗？')) return
      
      try {
        await cartApi.removeFromCart(id)
        cartItems.value = cartItems.value.filter(item => item.id !== id)
        updateSummary()
        alert('删除成功')
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败，请稍后重试')
      }
    }
    
    // 结算
    const checkout = async () => {
      const userName = localStorage.getItem('username')
      if (!userName) {
        alert('请先登录')
        return
      }
      
      const selectedItems = cartItems.value.filter(item => item.isSelected)
      if (selectedItems.length === 0) {
        alert('请选择要结算的商品')
        return
      }
      
      try {
        const response = await cartApi.checkout(userName, selectedItems)
        if (response.data.success) {
          alert('结算成功！')
          fetchCartItems()
        } else {
          alert(response.data.message || '结算失败')
        }
      } catch (error) {
        console.error('结算失败:', error)
        alert('结算失败，请稍后重试')
      }
    }
    
    onMounted(() => {
      fetchCartItems()
    })
    
    return {
      cartItems,
      loading,
      selectAll,
      subtotal,
      shipping,
      total,
      toggleSelectAll,
      updateQuantity,
      updateSummary,
      toggleFavorite,
      removeItem,
      checkout
    }
  }
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.cart-header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.cart-subtitle {
  color: #666;
  margin-top: 5px;
}

.continue-shopping {
  display: inline-flex;
  align-items: center;
  color: #ff0036;
  text-decoration: none;
  font-size: 14px;
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
  font-size: 16px;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-cart i {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-cart-text {
  font-size: 18px;
  color: #999;
  margin-bottom: 30px;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-items {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
}

.select-all-container {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.select-all-label {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.item-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  margin: 0 15px;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.item-price {
  font-size: 18px;
  color: #ff0036;
  font-weight: bold;
  margin-bottom: 10px;
}

.item-original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-left: 10px;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.quantity-btn:hover {
  border-color: #ff0036;
  color: #ff0036;
}

.quantity-input {
  width: 60px;
  height: 30px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.item-actions {
  display: flex;
  gap: 15px;
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

.cart-summary {
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  height: fit-content;
}

.cart-summary-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #ff0036;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background-color: #ff0036;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background-color: #e6002f;
}

@media (max-width: 768px) {
  .cart-content {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
  }
}
</style>

