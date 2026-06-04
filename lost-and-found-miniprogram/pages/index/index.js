// pages/index/index.js
Page({
  data: {
    items: [],
    loading: true,
    currentTab: 'all',
    searchText: ''
  },

  onLoad: function (options) {
    this.loadItems();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.loadItems();
  },

  // 加载物品列表
  loadItems: function() {
    this.setData({ loading: true });
    
    const db = wx.cloud.database();
    const _ = db.command;
    
    let query = db.collection('items').where({
      status: 'active'
    });
    
    // 根据当前标签筛选
    if (this.data.currentTab !== 'all') {
      query = query.where({
        type: this.data.currentTab
      });
    }
    
    // 根据搜索文本筛选
    if (this.data.searchText) {
      query = query.where(_.or([
        { name: db.RegExp({ regexp: this.data.searchText, options: 'i' }) },
        { location: db.RegExp({ regexp: this.data.searchText, options: 'i' }) }
      ]));
    }
    
    query.orderBy('createTime', 'desc').get({
      success: res => {
        // 格式化时间
        const items = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          };
        });
        
        this.setData({
          items: items,
          loading: false
        });
      },
      fail: err => {
        console.error('加载数据失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    this.loadItems();
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    });
    // 防抖搜索
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadItems();
    }, 500);
  },

  // 查看详情
  viewDetail: function(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${item._id}`
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
      return date.getMonth() + 1 + '月' + date.getDate() + '日';
    }
  }
})