// pages/profile/profile.js
const app = getApp();

Page({
  data: {
    userInfo: {},
    stats: {
      total: 0,
      active: 0,
      completed: 0
    }
  },

  onLoad: function () {
    this.loadUserInfo();
    this.loadStats();
  },

  onShow: function () {
    // 刷新统计数据
    this.loadStats();
  },

  // 加载用户信息
  loadUserInfo: function() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo: userInfo });
    } else {
      // 如果没有用户信息，跳转到首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  // 加载统计数据
  loadStats: function() {
    const openid = app.globalData.openid;
    if (!openid) {
      console.log('未获取到openid，使用模拟数据');
      this.loadMockStats();
      return;
    }

    // 检查是否使用模拟数据
    if (app.globalData.useMockData) {
      this.loadMockStats();
      return;
    }

    // 使用云开发
    const db = wx.cloud.database();
    const _ = db.command;
    
    // 查询用户的所有发布
    db.collection('items').where({
      'publisher.openid': openid
    }).get({
      success: res => {
        console.log('加载统计数据成功:', res.data.length, '条记录');
        const items = res.data;
        const stats = {
          total: items.length,
          active: items.filter(item => item.status === 'active').length,
          completed: items.filter(item => item.status === 'completed').length
        };
        
        this.setData({ stats: stats });
      },
      fail: err => {
        console.error('加载统计数据失败，使用模拟数据:', err);
        this.loadMockStats();
      }
    });
  },

  // 加载模拟统计数据
  loadMockStats: function() {
    try {
      const items = app.mockApi.getItems();
      const userItems = items.filter(item => 
        item.publisher && item.publisher.openid === app.globalData.openid
      );
      
      const stats = {
        total: userItems.length,
        active: userItems.filter(item => item.status === 'active').length,
        completed: userItems.filter(item => item.status === 'completed').length
      };
      
      console.log('模拟统计数据:', stats);
      this.setData({ stats: stats });
    } catch (error) {
      console.error('加载模拟统计数据失败:', error);
      // 设置默认统计数据
      this.setData({ 
        stats: {
          total: 0,
          active: 0,
          completed: 0
        }
      });
    }
  },

  // 导航到列表页面
  navigateToList: function(e) {
    const type = e.currentTarget.dataset.type;
    
    // 跳转到首页并传递过滤参数
    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        // 通过全局数据传递过滤参数
        app.globalData.filterType = type;
        app.globalData.filterUserOnly = true;
        
        // 显示提示信息
        setTimeout(() => {
          wx.showToast({
            title: `显示${this.getTypeText(type)}发布`,
            icon: 'none',
            duration: 1500
          });
        }, 500);
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取类型文本
  getTypeText: function(type) {
    const typeMap = {
      'all': '全部',
      'active': '进行中',
      'completed': '已解决'
    };
    return typeMap[type] || '全部';
  },

  // 清除缓存
  clearCache: function() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: res => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title: '缓存已清除',
                icon: 'success'
              });
              
              // 重新获取用户信息
              app.getUserInfo();
              setTimeout(() => {
                this.loadUserInfo();
              }, 1000);
            },
            fail: () => {
              wx.showToast({
                title: '清除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 显示关于信息
  showAbout: function() {
    wx.showModal({
      title: '关于校园失物招领',
      content: '本小程序旨在帮助校园师生更方便地发布和查找失物招领信息。\n\n版本：v1.0.0\n开发者：校园服务团队\n技术支持：微信云开发',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 联系我们
  contactUs: function() {
    wx.showModal({
      title: '联系我们',
      content: '如有问题或建议，请联系：\n\n邮箱：support@campus.com\n电话：400-123-4567\n工作时间：周一至周五 9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 编辑资料
  editProfile: function() {
    const userInfo = this.data.userInfo;
    
    wx.showModal({
      title: '编辑资料',
      content: '当前昵称: ' + (userInfo.nickName || '未设置') + '\n\n此功能正在开发中，即将推出...',
      showCancel: true,
      cancelText: '取消',
      confirmText: '重新授权',
      success: res => {
        if (res.confirm) {
          // 重新获取用户信息
          wx.showLoading({
            title: '重新授权中...',
          });
          
          // 清除旧的用户信息
          wx.removeStorageSync('userInfo');
          app.globalData.userInfo = null;
          
          // 重新获取用户信息
          app.getUserInfo();
          
          setTimeout(() => {
            wx.hideLoading();
            if (app.globalData.userInfo) {
              this.setData({
                userInfo: app.globalData.userInfo
              });
              wx.showToast({
                title: '授权成功',
                icon: 'success'
              });
            } else {
              wx.showToast({
                title: '授权失败',
                icon: 'none'
              });
            }
          }, 1500);
        }
      }
    });
  },

  // 使用帮助
  showHelp: function() {
    const helpContent = `📱 校园失物招领小程序使用指南

1. 发布物品
   • 点击底部"发布"按钮
   • 选择拾到/丢失类型
   • 填写物品信息并上传图片
   • 提交发布

2. 查找物品
   • 在首页浏览最新发布
   • 使用搜索功能查找特定物品
   • 按分类筛选物品

3. 我的发布
   • 查看自己发布的所有物品
   • 管理进行中和已解决的发布

4. 个人资料
   • 查看发布统计
   • 编辑个人信息
   • 清除缓存数据

如有问题，请联系客服：
📧 support@campus.com
📞 400-123-4567`;
    
    wx.showModal({
      title: '使用帮助',
      content: helpContent,
      showCancel: false,
      confirmText: '知道了'
    });
  }
})