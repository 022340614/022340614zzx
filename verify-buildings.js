// 验证湖北民族大学校园地图建筑添加情况

const requiredBuildings = [
    // 19个学院
    '文学与传媒学院',
    '数学与统计学院',
    '智能科学与工程学院',
    '化学与环境工程学院',
    '经济与管理学院',
    '生物与食品工程学院',
    '外国语学院',
    '体育学院',
    '美术与设计学院',
    '音乐舞蹈学院',
    '法学院',
    '马克思主义学院',
    '教师教育学院',
    '民族学与社会学学院',
    '林学园艺学院',
    '医学部',
    '临床医学院',
    '国际教育学院',
    '继续教育学院',
    
    // 运动场馆
    '民族体育场',
    '五环体育场',
    '羽毛球场',
    
    // 宿舍片区（4个片区，每个4栋）
    '博学1栋', '博学2栋', '博学3栋', '博学4栋',
    '博爱1栋', '博爱2栋', '博爱3栋', '博爱4栋',
    '立人1栋', '立人2栋', '立人3栋', '立人4栋',
    '达人1栋', '达人2栋', '达人3栋', '达人4栋',
    
    // 食堂
    '东苑食堂',
    '西苑食堂',
    '北苑食堂',
    
    // 教学建筑
    '修远楼'
];

// 加载地图数据
const fs = require('fs');
const path = require('path');

try {
    const mapFilePath = path.join(__dirname, 'js', 'hbmzu-map.js');
    const mapContent = fs.readFileSync(mapFilePath, 'utf8');
    
    // 提取建筑数据
    const campusLocationsMatch = mapContent.match(/this\.campusLocations\s*=\s*{([\s\S]*?)};/);
    
    if (!campusLocationsMatch) {
        console.error('❌ 无法找到 campusLocations 数据');
        process.exit(1);
    }
    
    const locationsText = campusLocationsMatch[1];
    const foundBuildings = [];
    const missingBuildings = [];
    
    // 检查每个建筑是否存在
    for (const building of requiredBuildings) {
        const escapedBuilding = building.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`['"]${escapedBuilding}['"]\\s*:\\s*{`);
        
        if (regex.test(locationsText)) {
            foundBuildings.push(building);
        } else {
            missingBuildings.push(building);
        }
    }
    
    // 输出结果
    console.log('📋 湖北民族大学校园地图建筑验证结果');
    console.log('=' .repeat(50));
    console.log(`✅ 已找到建筑: ${foundBuildings.length}/${requiredBuildings.length}`);
    console.log(`❌ 缺失建筑: ${missingBuildings.length}`);
    
    if (foundBuildings.length > 0) {
        console.log('\n✅ 已包含的建筑:');
        foundBuildings.forEach((building, index) => {
            console.log(`  ${index + 1}. ${building}`);
        });
    }
    
    if (missingBuildings.length > 0) {
        console.log('\n❌ 缺失的建筑:');
        missingBuildings.forEach((building, index) => {
            console.log(`  ${index + 1}. ${building}`);
        });
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log(`🏆 完成度: ${((foundBuildings.length / requiredBuildings.length) * 100).toFixed(1)}%`);
    
    if (missingBuildings.length === 0) {
        console.log('🎉 所有建筑已成功添加到地图中！');
    } else {
        console.log('⚠️  部分建筑缺失，请检查地图文件。');
        process.exit(1);
    }
    
} catch (error) {
    console.error('❌ 验证过程中出错:', error.message);
    process.exit(1);
}