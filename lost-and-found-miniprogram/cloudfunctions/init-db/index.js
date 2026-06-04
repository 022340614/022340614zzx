// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 检查数据库是否已初始化
    const collections = await db.listCollections()
    const collectionNames = collections.collections.map(col => col.name)
    
    // 如果items集合不存在，创建它
    if (!collectionNames.includes('items')) {
      // 创建items集合
      await db.createCollection('items')
      
      // 添加索引
      await db.collection('items').createIndex({
        name: 'type_status_time',
        unique: false
      }, {
        type: 1,
        status: 1,
        createTime: -1
      })
      
      // 添加搜索索引
      await db.collection('items').createIndex({
        name: 'search_index',
        unique: false
      }, {
        name: 'text',
        description: 'text',
        location: 'text'
      })
    }
    
    return {
      success: true,
      message: '数据库初始化完成',
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  } catch (err) {
    console.error('数据库初始化失败:', err)
    return {
      success: false,
      message: '数据库初始化失败: ' + err.message
    }
  }
}