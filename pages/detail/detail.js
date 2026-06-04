// pages/detail/detail.js
const app = getApp();

Page({
  data: {
    itemId: '',
    item: null,
    loading: true,
    error: '',
    isOwner: false
  },

  onLoad: function (options) {
    if (options.id) {
      this.setData({
        itemId: options.id
      });
      this.loadItem();
    } else {
      this.setData({
        error: '信息不存在',
        loading: false
      });
    }
  },

  // 加载物品详情
  loadItem: function() {
    this.setData({ loading: true, error: '' });
    
    const db = wx.cloud.database();
    const _id = this.data.itemId;
    const openid = app.globalData.openid;
    
    db.collection('items').doc(_id).get({
      success: res => {
        const item = res.data;
        
        // 格式化时间
        item.createTime = this.formatTime(item.createTime);
        
        // 检查是否是发布者
        const isOwner = item.publisher.openid === openid;
        
        this.setData({
          item: item,
          isOwner: isOwner,
          loading: false
        });
      },
      fail: err => {
        console.error('加载失败:', err);
        this.setData({
          error: '加载失败，请重试',
          loading: false
        });
      }
    });
  },

  // 预览图片
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.item.images;
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  // 复制联系方式
  copyContact: function(e) {
    const contact = e.currentTarget.dataset.contact;
    
    wx.setClipboardData({
      data: contact,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换状态（已解决/重新发布）
  toggleStatus: function() {
    const item = this.data.item;
    const newStatus = item.status === 'active' ? 'completed' : 'active';
    const newStatusText = newStatus === 'active' ? '重新发布' : '标记为已解决';
    
    wx.showModal({
      title: '确认操作',
      content: `确定要${newStatusText}吗？`,
      success: res => {
        if (res.confirm) {
          this.updateItemStatus(newStatus);
        }
      }
    });
  },

  // 更新物品状态
  updateItemStatus: function(newStatus) {
    const db = wx.cloud.database();
    const _id = this.data.itemId;
    
    db.collection('items').doc(_id).update({
      data: {
        status: newStatus,
        updateTime: db.serverDate()
      },
      success: () => {
        // 更新本地数据
        const item = this.data.item;
        item.status = newStatus;
        
        this.setData({
          item: item
        });
        
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('更新失败:', err);
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    });
  },

  // 删除物品
  deleteItem: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条信息吗？删除后不可恢复',
      success: res => {
        if (res.confirm) {
          this.deleteItemFromDB();
        }
      }
    });
  },

  // 从数据库删除
  deleteItemFromDB: function() {
    const db = wx.cloud.database();
    const _id = this.data.itemId;
    
    db.collection('items').doc(_id).remove({
      success: () => {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        });
        
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      },
      fail: err => {
        console.error('删除失败:', err);
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
    });
  },

  // 格式化时间
  formatTime: function(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) { // 1天内
      return Math.floor(diff / 3600000) + '小时前';
    } else if (diff < 604800000) { // 1周内
      return Math.floor(diff / 86400000) + '天前';
    } else {
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
  }
})