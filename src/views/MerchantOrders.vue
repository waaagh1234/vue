<template>
  <div class="merchant-orders">
    <div class="dashboard-container">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>商家管理后台</h2>
          <p>当前用户: <span>{{ merchantName }}</span></p>
        </div>
        <div class="sidebar-menu">
          <div class="menu-item" @click="$router.push('/merchant-dashboard')">
            <i class="fas fa-box"></i>
            <span>商品管理</span>
          </div>
          <div class="menu-item active">
            <i class="fas fa-shopping-cart"></i>
            <span>订单管理</span>
          </div>
          <div class="menu-item" @click="$router.push('/merchant-statistics')">
            <i class="fas fa-chart-bar"></i>
            <span>销售统计</span>
          </div>
          <div class="menu-item" @click="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>退出登录</span>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <div class="content-header">
          <h1>订单管理</h1>
        </div>

        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>

        <div v-else class="orders-container">
          <table class="orders-table">
            <thead>
              <tr>
                <th>订单号</th>
                <th>商品名称</th>
                <th>用户名</th>
                <th>金额</th>
                <th>状态</th>
                <th>下单时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ order.orderId }}</td>
                <td>{{ order.productName }}</td>
                <td>{{ order.userName }}</td>
                <td>¥{{ order.amount }}</td>
                <td>
                  <span :class="'status-' + order.status">{{ getStatusText(order.status) }}</span>
                </td>
                <td>{{ formatDate(order.createTime) }}</td>
                <td>
                  <select 
                    v-model="order.status" 
                    @change="updateOrderStatus(order.orderId, order.status)"
                    class="status-select"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { merchantApi } from '../api'

export default {
  name: 'MerchantOrders',
  setup() {
    const router = useRouter()
    const merchantName = ref('')
    const orders = ref([])
    const loading = ref(false)
    
    const checkAuth = () => {
      const name = localStorage.getItem('merchantName')
      if (!name) {
        alert('请先登录')
        router.push('/merchant-login')
        return false
      }
      merchantName.value = name
      return true
    }
    
    const fetchOrders = async () => {
      if (!checkAuth()) return

      loading.value = true
      try {
        const name = localStorage.getItem('merchantName') // 获取商家名称
        const response = await merchantApi.getOrders(name) // 传递商家名称
        orders.value = response.data.orders || [] // 修复：使用 response.data.orders
      } catch (error) {
        console.error('获取订单列表失败:', error)
        alert('获取订单列表失败')
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
    
    const updateOrderStatus = async (orderId, status) => {
      try {
        await merchantApi.updateOrderStatus(orderId, status)
        alert('状态更新成功')
      } catch (error) {
        console.error('更新订单状态失败:', error)
        alert('更新订单状态失败')
      }
    }
    
    const logout = () => {
      localStorage.removeItem('merchantId')
      localStorage.removeItem('merchantName')
      router.push('/merchant-login')
    }
    
    onMounted(() => {
      if (checkAuth()) {
        fetchOrders()
      }
    })
    
    return {
      merchantName,
      orders,
      loading,
      formatDate,
      getStatusText,
      updateOrderStatus,
      logout
    }
  }
}
</script>

<style scoped>
.merchant-orders {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.sidebar-header p {
  font-size: 14px;
  color: #bdc3c7;
}

.sidebar-menu {
  padding: 20px 0;
}

.menu-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-item:hover,
.menu-item.active {
  background-color: #34495e;
}

.menu-item i {
  width: 20px;
}

.main-content {
  flex: 1;
  padding: 30px;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  font-size: 24px;
  color: #333;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.orders-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.status-pending {
  color: #856404;
}

.status-processing {
  color: #004085;
}

.status-completed {
  color: #155724;
}

.status-cancelled {
  color: #721c24;
}

.status-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
</style>

