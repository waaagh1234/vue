<template>
  <div class="help-page">
    <div class="container">
      <div class="help-header">
        <h1>帮助中心</h1>
        <router-link to="/mall" class="back-link">
          <i class="fas fa-arrow-left"></i> 返回商城
        </router-link>
      </div>

      <div class="help-content">
        <div class="help-section">
          <h2><i class="fas fa-question-circle"></i> 常见问题</h2>
          <div class="faq-list">
            <div class="faq-item">
              <h3>如何注册账号？</h3>
              <p>点击登录页面的"注册界面"按钮，填写用户名、密码和邮箱即可完成注册。</p>
            </div>
            <div class="faq-item">
              <h3>如何购买商品？</h3>
              <p>浏览商品后，可以选择"加入购物车"或"立即购买"。加入购物车后可以继续购物，最后统一结算；立即购买则直接进入支付流程。</p>
            </div>
            <div class="faq-item">
              <h3>如何查看订单？</h3>
              <p>登录后点击顶部导航的"订单"链接，即可查看您的所有购买记录。</p>
            </div>
            <div class="faq-item">
              <h3>如何收藏商品？</h3>
              <p>在商品卡片上点击"收藏"按钮，即可将商品加入收藏夹。您可以在"收藏"页面查看所有收藏的商品。</p>
            </div>
            <div class="faq-item">
              <h3>如何评价商品？</h3>
              <p>在购买记录页面，找到已完成的订单，点击"评价"按钮即可对商品进行评价。</p>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h2><i class="fas fa-shipping-fast"></i> 配送说明</h2>
          <p>我们提供全国配送服务，一般情况下3-7个工作日送达。部分偏远地区可能需要更长时间。</p>
        </div>

        <div class="help-section">
          <h2><i class="fas fa-undo"></i> 退换货政策</h2>
          <p>商品自签收之日起7天内，如有质量问题可申请退换货。请保持商品及包装完好。</p>
        </div>

        <div class="help-section">
          <h2><i class="fas fa-headset"></i> 联系我们</h2>
          <div class="contact-info">
            <p><i class="fas fa-phone"></i> 客服电话：400-123-4567</p>
            <p><i class="fas fa-envelope"></i> 客服邮箱：service@youpin.com</p>
            <p><i class="fas fa-clock"></i> 服务时间：周一至周日 9:00-21:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help'
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.help-header {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-header h1 {
  font-size: 24px;
  color: #333;
}

.back-link {
  color: #ff0036;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.help-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
}

.help-section {
  margin-bottom: 40px;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ff0036;
}

.help-section h2 i {
  margin-right: 10px;
  color: #ff0036;
}

.help-section p {
  color: #666;
  line-height: 1.8;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.faq-item h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.faq-item p {
  color: #666;
  line-height: 1.6;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
}

.contact-info i {
  color: #ff0036;
  width: 20px;
}
</style>

