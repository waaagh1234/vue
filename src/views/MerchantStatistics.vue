<template>
  <div class="merchant-statistics">
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
          <div class="menu-item" @click="$router.push('/merchant-orders')">
            <i class="fas fa-shopping-cart"></i>
            <span>订单管理</span>
          </div>
          <div class="menu-item active">
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
          <h1>销售统计</h1>
        </div>

        <div class="statistics-cards">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ totalRevenue.toFixed(2) }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalProducts }}</div>
              <div class="stat-label">商品总数</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalCustomers }}</div>
              <div class="stat-label">客户总数</div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h2>销售趋势</h2>
          <canvas ref="salesChart"></canvas>
        </div>

        <div class="chart-container" style="margin-top: 20px;">
          <h2>商品销量排行</h2>
          <canvas ref="productChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'

// 注册Chart.js组件
Chart.register(...registerables)

export default {
  name: 'MerchantStatistics',
  setup() {
    const router = useRouter()
    const merchantName = ref('')
    const totalOrders = ref(0)
    const totalRevenue = ref(0)
    const totalProducts = ref(0)
    const totalCustomers = ref(0)
    const salesChart = ref(null)
    const productChart = ref(null)
    let salesChartInstance = null
    let productChartInstance = null
    
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
    
    const fetchStatistics = async () => {
      // 这里应该调用API获取统计数据
      // 暂时使用模拟数据
      totalOrders.value = 156
      totalRevenue.value = 45678.90
      totalProducts.value = 45
      totalCustomers.value = 89
    }

    const initCharts = () => {
      // 销售趋势图
      if (salesChart.value) {
        const ctx = salesChart.value.getContext('2d')

        // 销毁旧图表
        if (salesChartInstance) {
          salesChartInstance.destroy()
        }

        salesChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [{
              label: '销售额 (元)',
              data: [3200, 4100, 3800, 5200, 4800, 6100, 5800, 6500, 7200, 6800, 7500, 8200],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              title: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '¥' + value
                  }
                }
              }
            }
          }
        })
      }

      // 商品销量排行图
      if (productChart.value) {
        const ctx = productChart.value.getContext('2d')

        // 销毁旧图表
        if (productChartInstance) {
          productChartInstance.destroy()
        }

        productChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['商品A', '商品B', '商品C', '商品D', '商品E', '商品F', '商品G', '商品H'],
            datasets: [{
              label: '销量',
              data: [65, 59, 80, 81, 56, 55, 40, 35],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10
                }
              }
            }
          }
        })
      }
    }
    
    const logout = () => {
      localStorage.removeItem('merchantId')
      localStorage.removeItem('merchantName')
      router.push('/merchant-login')
    }
    
    onMounted(() => {
      if (checkAuth()) {
        fetchStatistics()
        // 等待DOM渲染完成后初始化图表
        setTimeout(() => {
          initCharts()
        }, 100)
      }
    })

    return {
      merchantName,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      salesChart,
      productChart,
      logout
    }
  }
}
</script>

<style scoped>
.merchant-statistics {
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

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-container h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
}

.chart-container canvas {
  max-height: 400px;
}
</style>

