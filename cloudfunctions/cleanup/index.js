// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 清理30天前的已完成记录
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const result = await db.collection('items')
      .where({
        status: 'completed',
        updateTime: _.lt(thirtyDaysAgo)
      })
      .remove()
    
    return {
      success: true,
      deletedCount: result.stats.removed,
      message: `清理了 ${result.stats.removed} 条过期记录`
    }
  } catch (err) {
    console.error('清理失败:', err)
    return {
      success: false,
      message: '清理失败: ' + err.message
    }
  }
}