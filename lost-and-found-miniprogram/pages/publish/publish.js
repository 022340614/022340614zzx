// pages/publish/publish.js
const app = getApp();

Page({
  data: {
    formData: {
      type: 'found',
      name: '',
      category: '',
      time: '',
      location: '',
      customLocation: '',
      description: '',
      images: [],
      contact: ''
    },
    categories: ['证件', '电子产品', '书籍', '服饰', '水杯', '其他'],
    locations: [],
    categoryIndex: 0,
    locationIndex: 0,
    showCustomLocation: false,
    submitting: false,
    canSubmit: false
  },

  onLoad: function () {
    // 获取学校预设地点
    const locations = app.globalData.schoolConfig.locations;
    this.setData({
      locations: locations
    });
    
    // 设置默认时间为今天
    const today = new Date().toISOString().split('T')[0];
    this.setData({
      'formData.time': today
    });
  },

  // 选择类型
  selectType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      'formData.type': type
    });
    this.checkForm();
  },

  // 输入框变化
  onInput: function(e) {
    const field = e.currentTarget.dataset.field || e.currentTarget.dataset.name;
    const value = e.detail.value;
    this.setData({
      [`formData.${field}`]: value
    });
    this.checkForm();
  },

  // 分类选择
  onCategoryChange: function(e) {
    const index = parseInt(e.detail.value);
    const category = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': category
    });
    this.checkForm();
  },

  // 时间选择
  onTimeChange: function(e) {
    this.setData({
      'formData.time': e.detail.value
    });
    this.checkForm();
  },

  // 地点选择
  onLocationChange: function(e) {
    const index = parseInt(e.detail.value);
    const location = this.data.locations[index];
    this.setData({
      locationIndex: index,
      'formData.location': location,
      showCustomLocation: false
    });
    this.checkForm();
  },

  // 切换自定义地点
  toggleCustomLocation: function() {
    this.setData({
      showCustomLocation: !this.data.showCustomLocation,
      'formData.location': ''
    });
    this.checkForm();
  },

  // 选择图片
  chooseImage: function() {
    const that = this;
    wx.chooseMedia({
      count: 3 - that.data.formData.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: function(res) {
        const tempFiles = res.tempFiles;
        const images = that.data.formData.images;
        
        // 上传图片到云存储
        that.uploadImages(tempFiles, images);
      }
    });
  },

  // 上传图片
  uploadImages: function(tempFiles, existingImages) {
    const that = this;
    const uploadTasks = tempFiles.map(file => {
      return new Promise((resolve, reject) => {
        const filePath = file.tempFilePath;
        const cloudPath = 'images/' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '.jpg';
        
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
          success: res => {
            resolve(res.fileID);
          },
          fail: err => {
            reject(err);
          }
        });
      });
    });

    Promise.all(uploadTasks).then(fileIDs => {
      const newImages = [...existingImages, ...fileIDs];
      that.setData({
        'formData.images': newImages
      });
      that.checkForm();
    }).catch(err => {
      console.error('图片上传失败:', err);
      wx.showToast({
        title: '图片上传失败',
        icon: 'none'
      });
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.formData.images;
    images.splice(index, 1);
    this.setData({
      'formData.images': images
    });
    this.checkForm();
  },

  // 检查表单是否可提交
  checkForm: function() {
    const formData = this.data.formData;
    const canSubmit = formData.name && 
                     formData.category && 
                     formData.time && 
                     (formData.location || formData.customLocation) &&
                     formData.description &&
                     formData.contact;
    
    this.setData({
      canSubmit: canSubmit
    });
  },

  // 表单提交
  onSubmit: function(e) {
    if (!this.data.canSubmit || this.data.submitting) {
      return;
    }

    this.setData({ submitting: true });

    const formData = this.data.formData;
    const userInfo = app.globalData.userInfo;
    const openid = app.globalData.openid;

    // 准备提交数据
    const itemData = {
      type: formData.type,
      name: formData.name,
      category: formData.category,
      time: formData.time,
      location: formData.customLocation || formData.location,
      description: formData.description,
      images: formData.images,
      contact: formData.contact,
      contactDisplay: this.maskContact(formData.contact),
      publisher: {
        openid: openid,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl
      },
      status: 'active',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    };

    // 检查是否使用模拟数据
    if (app.globalData.useMockData) {
      // 使用模拟数据
      console.log('使用模拟数据发布');
      try {
        const newItem = app.mockApi.addItem(itemData);
        console.log('模拟发布成功:', newItem._id);
        
        app.showSuccess('发布成功（模拟模式）');
        
        // 重置表单
        setTimeout(() => {
          this.resetForm();
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } catch (error) {
        console.error('模拟发布失败:', error);
        app.showError('发布失败', '模拟数据保存失败');
        this.setData({ submitting: false });
      }
    } else {
      // 使用云开发
      const db = wx.cloud.database();
      
      // 保存到数据库
      db.collection('items').add({
        data: itemData,
        success: res => {
          console.log('发布成功:', res._id);
          app.showSuccess('发布成功');
          
          // 重置表单
          setTimeout(() => {
            this.resetForm();
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 1500);
        },
        fail: err => {
          console.error('发布失败:', err);
          app.showError('发布失败', '请检查网络连接或云开发配置');
          this.setData({ submitting: false });
        }
      });
    }
  },

  // 重置表单
  resetForm: function() {
    const today = new Date().toISOString().split('T')[0];
    this.setData({
      formData: {
        type: 'found',
        name: '',
        category: '',
        time: today,
        location: '',
        customLocation: '',
        description: '',
        images: [],
        contact: ''
      },
      categoryIndex: 0,
      locationIndex: 0,
      showCustomLocation: false,
      submitting: false,
      canSubmit: false
    });
  },

  // 联系方式脱敏
  maskContact: function(contact) {
    if (!contact) return '';
    
    if (/^1[3-9]\d{9}$/.test(contact)) { // 手机号
      return contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    } else if (contact.includes('@')) { // 邮箱
      const parts = contact.split('@');
      const username = parts[0];
      if (username.length <= 2) {
        return '*'.repeat(username.length) + '@' + parts[1];
      } else {
        return username.substring(0, 2) + '***@' + parts[1];
      }
    } else { // 微信号等其他联系方式
      if (contact.length <= 3) {
        return '*'.repeat(contact.length);
      } else {
        return contact.substring(0, 2) + '***' + contact.substring(contact.length - 2);
      }
    }
  }
})