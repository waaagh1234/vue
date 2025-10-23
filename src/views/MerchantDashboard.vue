<template>
  <div class="merchant-dashboard">
    <div class="dashboard-container">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>商家管理后台</h2>
          <p>当前用户: <span>{{ merchantName }}</span></p>
        </div>
        <div class="sidebar-menu">
          <div class="menu-item active">
            <i class="fas fa-box"></i>
            <span>商品管理</span>
          </div>
          <div class="menu-item" @click="$router.push('/merchant-orders')">
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
          <h1>商品管理</h1>
          <button class="btn btn-primary" @click="showAddModal = true">
            <i class="fas fa-plus"></i> 添加商品
          </button>
        </div>

        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>

        <div v-else class="products-container">
          <table class="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>图片</th>
                <th>商品名称</th>
                <th>价格</th>
                <th>分类</th>
                <th>销量</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="products.length === 0">
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                  您还没有上传商品，请点击"添加商品"按钮添加商品
                </td>
              </tr>
              <tr v-for="product in products" :key="product.id" v-else>
                <td>{{ product.id }}</td>
                <td>
                  <img :src="product.imagePath" :alt="product.productName" class="product-thumb" />
                </td>
                <td>{{ product.productName }}</td>
                <td>
                  ¥{{ product.nowPrice }}
                  <del style="color: #999; font-size: 12px; margin-left: 5px;">¥{{ product.originalPrice }}</del>
                </td>
                <td>{{ product.category }}</td>
                <td>{{ product.salesCount }}</td>
                <td>
                  <span :class="product.status === '在售' ? 'status-active' : 'status-inactive'" class="status-badge">
                    {{ product.status }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" @click="editProduct(product)">编辑</button>
                  <button class="btn-delete" @click="deleteProduct(product.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
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

    <!-- 添加/编辑商品模态框 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ showEditModal ? '编辑商品' : '添加商品' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <form @submit.prevent="submitProduct">
          <div class="form-group">
            <label class="form-label">商品名称</label>
            <input type="text" v-model="productForm.productName" required />
          </div>
          <div class="form-group">
            <label class="form-label">商品描述</label>
            <textarea v-model="productForm.productDesc" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">现价</label>
            <input type="number" step="0.01" v-model="productForm.nowPrice" required />
          </div>
          <div class="form-group">
            <label class="form-label">原价</label>
            <input type="number" step="0.01" v-model="productForm.originalPrice" required />
          </div>
          <div class="form-group">
            <label class="form-label">品牌</label>
            <input type="text" v-model="productForm.brand" required />
          </div>
          <div class="form-group">
            <label class="form-label">分类</label>
            <input type="text" v-model="productForm.category" required />
          </div>
          <div class="form-group">
            <label class="form-label">发货地址</label>
            <input type="text" v-model="productForm.shippingAddress" />
          </div>
          <div class="form-group">
            <label class="form-label">状态</label>
            <select v-model="productForm.status" required class="form-control">
              <option value="在售">在售</option>
              <option value="下架">下架</option>
            </select>
          </div>
          <div class="form-group full-width">
            <label class="form-label">
              商品图片 <span style="color: red;">*</span>
            </label>
            <input
              type="file"
              ref="productImageInput"
              @change="handleImageChange"
              accept="image/*"
              class="form-control"
            />
            <small class="form-text">
              {{ showEditModal ? '可选。如果不选择新图片，将保留原有图片。' : '添加商品时必选。' }}
            </small>
            <div class="image-preview" ref="imagePreview">
              <div v-if="!imagePreviewUrl" class="image-preview-placeholder">
                <i class="fas fa-image"></i>
                <p>选择图片预览</p>
              </div>
              <img v-else :src="imagePreviewUrl" alt="商品图片预览" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">提交</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { merchantApi } from '../api'
import { processProductImages } from '../utils/imageHelper'

export default {
  name: 'MerchantDashboard',
  setup() {
    const router = useRouter()
    const merchantName = ref('')
    const products = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(0)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const productImageInput = ref(null)
    const imagePreview = ref(null)
    const imagePreviewUrl = ref('')
    const selectedImageFile = ref(null)
    const productForm = ref({
      id: null,
      productName: '',
      productDesc: '',
      nowPrice: 0,
      originalPrice: 0,
      brand: '',
      category: '',
      imagePath: '',
      shippingAddress: '',
      status: '在售'
    })
    
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
    
    const fetchProducts = async (page = 1) => {
      if (!checkAuth()) return

      loading.value = true
      try {
        console.log(`正在获取商家 ${merchantName.value} 的商品列表`)

        const response = await merchantApi.getProducts(merchantName.value, page, 10)
        console.log('商家商品列表响应:', response.data)

        const data = response.data

        if (data.success) {
          // 如果有商品记录，则处理商品数据
          if (data.records && data.records.length > 0) {
            console.log('有商品记录，处理商品列表')

            // 将 records 转换为商品对象格式（参考原始HTML）
            const productList = data.records.map(record => ({
              id: record.productId,
              productName: record.productName || '未知商品',
              productDesc: record.productDesc || '',
              imagePath: record.productImagePath || '',  // 保持原始路径，让processProductImages处理
              nowPrice: record.productPrice || 0,
              originalPrice: record.productPrice ? (record.productPrice * 1.2).toFixed(2) : 0,
              brand: record.brand || '',
              category: record.category || '-',
              salesCount: record.salesCount || 0,
              status: record.status || '在售',
              shippingAddress: record.shippingAddress || '',
              createTime: record.createTime || new Date().toISOString()
            }))

            console.log('处理后的商品列表:', productList)
            products.value = processProductImages(productList)
            totalPages.value = data.totalPages || 0
            currentPage.value = page
          } else {
            console.log('没有商品记录，显示空状态')
            products.value = []
            totalPages.value = 0
            currentPage.value = 1
          }
        } else {
          alert('获取商家商品列表失败：' + data.message)
          products.value = []
        }
      } catch (error) {
        console.error('获取商品列表失败:', error)
        alert('获取商家商品列表失败，请稍后重试')
        products.value = []
      } finally {
        loading.value = false
      }
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        fetchProducts(page)
      }
    }

    // 处理图片选择
    const handleImageChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedImageFile.value = file

        // 使用FileReader预览图片
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreviewUrl.value = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        resetImagePreview()
      }
    }

    // 重置图片预览
    const resetImagePreview = () => {
      imagePreviewUrl.value = ''
      selectedImageFile.value = null
      if (productImageInput.value) {
        productImageInput.value.value = ''
      }
    }
    
    const editProduct = (product) => {
      productForm.value = { ...product }

      // 显示当前商品图片
      if (product.imagePath) {
        imagePreviewUrl.value = product.imagePath
      }

      showEditModal.value = true
    }
    
    const deleteProduct = async (productId) => {
      if (!confirm(`确定要删除 ID 为 ${productId} 的商品吗？此操作不可撤销。`)) return

      try {
        console.log('当前商家:', merchantName.value)
        console.log('正在删除商品，请稍候...')

        // 先检查商家记录
        const checkResponse = await api.get(`/api/merchant-records/check?userName=${merchantName.value}&productId=${productId}`)
        const checkResult = checkResponse.data

        if (checkResult.success && checkResult.hasRecord) {
          // 如果有商家记录，先删除记录
          console.log(`删除商家 ${merchantName.value} 的商品 ${productId} 记录`)

          try {
            const deleteRecordResponse = await api.delete(`/api/merchant-records/delete-by-user-product?userName=${merchantName.value}&productId=${productId}`)
            const deleteRecordResult = deleteRecordResponse.data
            console.log('删除商家记录结果:', deleteRecordResult)

            if (!deleteRecordResult.success) {
              console.warn('删除商家记录失败，但将继续删除商品')
            }
          } catch (recordError) {
            console.error('删除商家记录出错:', recordError)
            console.warn('将继续删除商品')
          }
        }

        // 然后删除商品
        console.log(`开始删除商品 ID: ${productId}`)
        const response = await merchantApi.deleteProduct(productId)
        const data = response.data
        console.log('删除商品响应:', data)

        if (data.success) {
          console.log('商品删除成功')
          alert('商品删除成功！')
          // 重新加载商家商品列表
          fetchProducts(currentPage.value)
        } else {
          console.error('删除商品失败:', data.message)
          alert('删除商品失败：' + data.message)
        }
      } catch (error) {
        console.error('删除商品过程中发生错误:', error)
        alert('删除商品失败，请稍后重试')
      }
    }
    
    const submitProduct = async () => {
      try {
        if (showEditModal.value) {
          // 更新商品
          console.log('更新商品:', productForm.value)
          const productId = productForm.value.id

          // 创建FormData
          const formData = new FormData()
          formData.append('productName', productForm.value.productName)
          formData.append('productDesc', productForm.value.productDesc || '')
          formData.append('nowPrice', productForm.value.nowPrice)
          formData.append('originalPrice', productForm.value.originalPrice)
          formData.append('brand', productForm.value.brand || '')
          formData.append('category', productForm.value.category || '')
          formData.append('status', productForm.value.status || '在售')
          formData.append('shippingAddress', productForm.value.shippingAddress || '')

          // 如果选择了新图片，则添加到表单数据中
          if (selectedImageFile.value) {
            formData.append('image', selectedImageFile.value)
            console.log('添加新图片到表单')
          }

          const response = await merchantApi.updateProduct(productId, formData)

          if (response.data.success) {
            alert('商品更新成功！')
            closeModal()
            fetchProducts(currentPage.value)
          } else {
            alert('更新商品失败：' + response.data.message)
          }
        } else {
          // 添加商品
          console.log('添加商品:', productForm.value)

          // 验证必须选择图片
          if (!selectedImageFile.value) {
            alert('请选择商品图片！')
            return
          }

          // 创建FormData
          const formData = new FormData()
          formData.append('productName', productForm.value.productName)
          formData.append('productDesc', productForm.value.productDesc || '')
          formData.append('nowPrice', productForm.value.nowPrice)
          formData.append('originalPrice', productForm.value.originalPrice)
          formData.append('brand', productForm.value.brand || '')
          formData.append('category', productForm.value.category || '')
          formData.append('status', productForm.value.status || '在售')
          formData.append('shippingAddress', productForm.value.shippingAddress || '')

          // 添加图片文件
          formData.append('image', selectedImageFile.value)

          // 添加商家用户名
          formData.append('userName', merchantName.value)
          console.log('添加商家用户名到表单:', merchantName.value)

          const response = await merchantApi.addProduct(formData)

          if (response.data.success) {
            console.log('商品添加成功，ID:', response.data.product.id)
            console.log('商品详情:', response.data.product)
            alert('商品添加成功！')
            closeModal()
            fetchProducts(currentPage.value)
          } else {
            alert('添加商品失败：' + response.data.message)
          }
        }
      } catch (error) {
        console.error('提交失败:', error)
        alert('提交失败：' + (error.response?.data?.message || error.message))
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      resetImagePreview()
      productForm.value = {
        id: null,
        productName: '',
        productDesc: '',
        nowPrice: 0,
        originalPrice: 0,
        brand: '',
        category: '',
        imagePath: '',
        shippingAddress: '',
        status: '在售'
      }
    }
    
    const logout = () => {
      localStorage.removeItem('merchantId')
      localStorage.removeItem('merchantName')
      router.push('/merchant-login')
    }
    
    onMounted(() => {
      if (checkAuth()) {
        fetchProducts()
      }
    })
    
    return {
      merchantName,
      products,
      loading,
      currentPage,
      totalPages,
      showAddModal,
      showEditModal,
      productForm,
      productImageInput,
      imagePreview,
      imagePreviewUrl,
      handleImageChange,
      changePage,
      editProduct,
      deleteProduct,
      submitProduct,
      closeModal,
      logout
    }
  }
}
</script>

<style scoped>
.merchant-dashboard {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.products-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.products-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 5px;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #28a745;
  color: white;
}

.btn-edit:hover {
  background-color: #218838;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}

/* 图片上传和预览样式 */
.form-group.full-width {
  grid-column: 1 / -1;
}

.form-control[type="file"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.form-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

.image-preview {
  margin-top: 15px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  overflow: hidden;
}

.image-preview-placeholder {
  text-align: center;
  color: #999;
}

.image-preview-placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.image-preview-placeholder p {
  margin: 0;
  font-size: 14px;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>

