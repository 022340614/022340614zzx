// app.js - 修复版
App({
  onLaunch: function () {
    console.log('小程序初始化...');
    
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 初始化云开发（带错误处理）
    try {
      wx.cloud.init({
        env: 'cloud1-9g8z7y7y12345678', // 示例环境ID，需要替换为实际ID
        traceUser: true
      });
      console.log('云开发初始化成功');
    } catch (error) {
      console.warn('云开发初始化失败，使用模拟模式:', error);
      this.globalData.useMockData = true;
    }

    // 获取用户信息
    this.getUserInfo();
    
    // 获取用户openid（如果云开发可用）
    if (!this.globalData.useMockData) {
      this.getOpenid();
    } else {
      // 使用模拟openid
      this.globalData.openid = 'mock_openid_' + Date.now();
      console.log('使用模拟openid:', this.globalData.openid);
    }
  },

  // 获取用户信息（修复版）
  getUserInfo: function() {
    // 先从缓存获取
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      console.log('从缓存获取用户信息:', userInfo.nickName);
      return;
    }

    // 如果缓存中没有，尝试获取
    if (wx.getUserProfile) {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          console.log('获取用户信息成功:', res.userInfo.nickName);
          this.globalData.userInfo = res.userInfo;
          wx.setStorageSync('userInfo', res.userInfo);
          
          // 触发用户信息更新事件
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res.userInfo);
          }
        },
        fail: (err) => {
          console.log('用户拒绝授权或获取失败:', err);
          // 使用模拟用户信息
          this.useMockUserInfo();
        }
      });
    } else {
      console.log('getUserProfile接口不可用，使用模拟数据');
      this.useMockUserInfo();
    }
  },

  // 使用模拟用户信息
  useMockUserInfo: function() {
    const mockUserInfo = {
      nickName: '微信用户',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      gender: 0,
      country: '中国',
      province: '',
      city: '',
      language: 'zh_CN'
    };
    
    this.globalData.userInfo = mockUserInfo;
    wx.setStorageSync('userInfo', mockUserInfo);
    console.log('使用模拟用户信息:', mockUserInfo.nickName);
    
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(mockUserInfo);
    }
  },

  // 获取用户openid（带错误处理）
  getOpenid: function() {
    if (this.globalData.useMockData) {
      console.log('模拟模式，跳过云函数调用');
      return;
    }
    
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log('获取openid成功:', res.result.openid);
        this.globalData.openid = res.result.openid;
      },
      fail: err => {
        console.error('获取openid失败，使用模拟数据:', err);
        // 使用模拟openid
        this.globalData.openid = 'mock_openid_' + Date.now();
        this.globalData.useMockData = true;
      }
    });
  },

  // 学校配置
  schoolConfig: {
    name: '校园失物招领平台',
    locations: [
      '教学楼A区', '教学楼B区', '图书馆', '食堂', '操场', 
      '宿舍楼', '行政楼', '实验楼', '体育馆', '校门口'
    ],
    categories: [
      '证件卡片', '电子产品', '学习用品', '衣物配饰', 
      '生活用品', '书籍资料', '钥匙串', '其他物品'
    ]
  },

  // 全局数据
  globalData: {
    userInfo: null,
    openid: null,
    useMockData: false, // 是否使用模拟数据
    mockItems: [], // 模拟数据存储
    filterType: 'all', // 过滤类型：all/active/completed
    filterUserOnly: false // 是否只显示用户自己的发布
  },

  // 模拟数据API（当云开发不可用时）
  mockApi: {
    // 获取模拟物品列表
    getItems: function(type = 'all') {
      const items = wx.getStorageSync('mockItems') || [];
      if (type === 'all') return items;
      return items.filter(item => item.type === type);
    },

    // 添加模拟物品
    addItem: function(itemData) {
      const items = wx.getStorageSync('mockItems') || [];
      const newItem = {
        _id: 'mock_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        ...itemData,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      items.push(newItem);
      wx.setStorageSync('mockItems', items);
      return newItem;
    },

    // 更新物品状态
    updateItemStatus: function(itemId, status) {
      const items = wx.getStorageSync('mockItems') || [];
      const index = items.findIndex(item => item._id === itemId);
      if (index !== -1) {
        items[index].status = status;
        items[index].updateTime = new Date().toISOString();
        wx.setStorageSync('mockItems', items);
        return true;
      }
      return false;
    },

    // 获取用户发布的物品
    getUserItems: function(openid) {
      const items = wx.getStorageSync('mockItems') || [];
      return items.filter(item => item.publisher && item.publisher.openid === openid);
    },

    // 清除模拟数据
    clearMockData: function() {
      wx.removeStorageSync('mockItems');
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('logs');
    }
  },

  // 显示错误提示
  showError: function(title, content) {
    wx.showModal({
      title: title || '操作失败',
      content: content || '请检查网络连接或稍后重试',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 显示成功提示
  showSuccess: function(title) {
    wx.showToast({
      title: title || '操作成功',
      icon: 'success',
      duration: 2000
    });
  }
})