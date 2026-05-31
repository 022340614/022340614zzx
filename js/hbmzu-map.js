// 湖北民族大学校园地图数据
class HBMZUMap {
    constructor() {
        // 湖北民族大学主要校区坐标（恩施市）
        this.campusCenter = {
            lat: 30.2833,  // 纬度
            lng: 109.4833, // 经度
            zoom: 15       // 缩放级别
        };

        // 校园主要建筑和地点
        this.campusLocations = {
            // 教学区
            '主教学楼': { lat: 30.2835, lng: 109.4830, type: 'teaching', description: '主要教学区域' },
            '图书馆': { lat: 30.2830, lng: 109.4835, type: 'library', description: '学校图书馆' },
            '实验楼': { lat: 30.2840, lng: 109.4825, type: 'lab', description: '实验室和科研中心' },
            
            // 生活区
            '学生宿舍1栋': { lat: 30.2825, lng: 109.4840, type: 'dorm', description: '学生宿舍区' },
            '学生宿舍2栋': { lat: 30.2820, lng: 109.4845, type: 'dorm', description: '学生宿舍区' },
            '学生食堂': { lat: 30.2828, lng: 109.4838, type: 'canteen', description: '学生食堂' },
            
            // 运动区
            '体育馆': { lat: 30.2845, lng: 109.4820, type: 'sports', description: '室内体育馆' },
            '操场': { lat: 30.2840, lng: 109.4815, type: 'sports', description: '田径运动场' },
            '篮球场': { lat: 30.2835, lng: 109.4810, type: 'sports', description: '室外篮球场' },
            
            // 行政办公
            '行政楼': { lat: 30.2832, lng: 109.4845, type: 'admin', description: '学校行政办公楼' },
            '学生处': { lat: 30.2830, lng: 109.4848, type: 'admin', description: '学生事务办公室' },
            
            // 其他重要地点
            '校医院': { lat: 30.2820, lng: 109.4830, type: 'medical', description: '校园医疗中心' },
            '校门口': { lat: 30.2815, lng: 109.4850, type: 'gate', description: '学校主入口' },
            '停车场': { lat: 30.2810, lng: 109.4855, type: 'parking', description: '校园停车场' },
            '快递点': { lat: 30.2825, lng: 109.4850, type: 'service', description: '快递收发中心' }
        };

        // 校园地图图片
        this.mapImage = 'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=湖北民族大学校园地图';
        
        // 初始化地图
        this.init();
    }

    init() {
        console.log('湖北民族大学地图初始化...');
        this.createMapUI();
    }

    createMapUI() {
        // 创建地图容器
        const mapHTML = `
            <div id="hbmzuMapModal" class="modal">
                <div class="modal-content campus-map-modal">
                    <span class="close" onclick="hbmzuMap.closeMap()">&times;</span>
                    <h3>🗺️ 湖北民族大学校园地图</h3>
                    
                    <div class="campus-map-container">
                        <!-- 地图显示区域 -->
                        <div id="campusMapDisplay" class="campus-map-display">
                            <div class="map-overlay">
                                <div class="map-grid">
                                    <!-- 动态生成地图网格 -->
                                </div>
                                <div class="map-markers">
                                    <!-- 动态生成地点标记 -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- 地图控制面板 -->
                        <div class="map-controls-panel">
                            <div class="search-box">
                                <input type="text" id="campusSearch" placeholder="搜索校园地点...">
                                <button onclick="hbmzuMap.searchCampusLocation()">搜索</button>
                            </div>
                            
                            <div class="location-categories">
                                <h4>地点分类</h4>
                                <div class="category-filters">
                                    <button class="category-btn active" data-category="all" onclick="hbmzuMap.filterLocations('all')">全部</button>
                                    <button class="category-btn" data-category="teaching" onclick="hbmzuMap.filterLocations('teaching')">教学区</button>
                                    <button class="category-btn" data-category="dorm" onclick="hbmzuMap.filterLocations('dorm')">生活区</button>
                                    <button class="category-btn" data-category="sports" onclick="hbmzuMap.filterLocations('sports')">运动区</button>
                                    <button class="category-btn" data-category="admin" onclick="hbmzuMap.filterLocations('admin')">行政办公</button>
                                    <button class="category-btn" data-category="service" onclick="hbmzuMap.filterLocations('service')">服务设施</button>
                                </div>
                            </div>
                            
                            <div class="location-list">
                                <h4>校园地点</h4>
                                <div id="campusLocationsList" class="locations-list">
                                    <!-- 动态生成地点列表 -->
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="map-info">
                        <p><strong>湖北民族大学</strong> - 湖北省恩施市学院路39号</p>
                        <p>坐标: 北纬30.2833°, 东经109.4833°</p>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        if (!document.getElementById('hbmzuMapModal')) {
            document.body.insertAdjacentHTML('beforeend', mapHTML);
            this.renderMap();
            this.renderLocationList();
        }
    }

    renderMap() {
        const mapDisplay = document.getElementById('campusMapDisplay');
        if (!mapDisplay) return;

        // 创建地图网格（模拟）
        const gridHTML = Array(10).fill().map((_, row) => 
            Array(15).fill().map((_, col) => 
                `<div class="grid-cell" data-row="${row}" data-col="${col}"></div>`
            ).join('')
        ).join('');

        // 创建地点标记
        const markersHTML = Object.entries(this.campusLocations).map(([name, location]) => {
            // 计算在网格中的位置（简化版）
            const row = Math.floor((location.lat - 30.2810) * 1000) % 10;
            const col = Math.floor((location.lng - 109.4810) * 1000) % 15;
            
            return `
                <div class="map-marker ${location.type}" 
                     style="top: ${row * 10}%; left: ${col * 6.66}%;"
                     data-location="${name}"
                     onclick="hbmzuMap.showLocationInfo('${name}')">
                    <div class="marker-icon">${this.getLocationIcon(location.type)}</div>
                    <div class="marker-label">${name}</div>
                </div>
            `;
        }).join('');

        mapDisplay.querySelector('.map-grid').innerHTML = gridHTML;
        mapDisplay.querySelector('.map-markers').innerHTML = markersHTML;
    }

    getLocationIcon(type) {
        const icons = {
            'teaching': '🏫',
            'library': '📚',
            'lab': '🔬',
            'dorm': '🏠',
            'canteen': '🍽️',
            'sports': '⚽',
            'admin': '🏢',
            'medical': '🏥',
            'gate': '🚪',
            'parking': '🅿️',
            'service': '📦'
        };
        return icons[type] || '📍';
    }

    renderLocationList() {
        const listContainer = document.getElementById('campusLocationsList');
        if (!listContainer) return;

        const locationsHTML = Object.entries(this.campusLocations).map(([name, location]) => `
            <div class="location-item ${location.type}" onclick="hbmzuMap.showLocationInfo('${name}')">
                <div class="location-icon">${this.getLocationIcon(location.type)}</div>
                <div class="location-info">
                    <div class="location-name">${name}</div>
                    <div class="location-desc">${location.description}</div>
                </div>
                <div class="location-coords">
                    ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = locationsHTML;
    }

    showLocationInfo(locationName) {
        const location = this.campusLocations[locationName];
        if (!location) return;

        const infoHTML = `
            <div class="location-detail">
                <h4>${locationName}</h4>
                <p><strong>类型:</strong> ${this.getLocationTypeName(location.type)}</p>
                <p><strong>描述:</strong> ${location.description}</p>
                <p><strong>坐标:</strong> 北纬${location.lat.toFixed(4)}°, 东经${location.lng.toFixed(4)}°</p>
                <p><strong>地址:</strong> 湖北民族大学校园内</p>
                
                <div class="location-actions">
                    <button onclick="hbmzuMap.navigateToLocation('${locationName}')">🚶‍♂️ 导航到此</button>
                    <button onclick="hbmzuMap.setAsLostLocation('${locationName}')">📝 设为丢失地点</button>
                    <button onclick="hbmzuMap.shareLocation('${locationName}')">📤 分享位置</button>
                </div>
            </div>
        `;

        // 显示详情模态框
        this.showModal('校园地点详情', infoHTML);
        
        // 高亮显示地图标记
        this.highlightLocation(locationName);
    }

    getLocationTypeName(type) {
        const typeNames = {
            'teaching': '教学区',
            'library': '图书馆',
            'lab': '实验室',
            'dorm': '宿舍区',
            'canteen': '食堂',
            'sports': '运动区',
            'admin': '行政办公',
            'medical': '医疗服务',
            'gate': '出入口',
            'parking': '停车场',
            'service': '服务设施'
        };
        return typeNames[type] || '其他';
    }

    highlightLocation(locationName) {
        // 移除所有高亮
        document.querySelectorAll('.map-marker').forEach(marker => {
            marker.classList.remove('highlighted');
        });
        
        // 添加高亮
        const marker = document.querySelector(`.map-marker[data-location="${locationName}"]`);
        if (marker) {
            marker.classList.add('highlighted');
            
            // 滚动到可见区域
            marker.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }

    navigateToLocation(locationName) {
        const location = this.campusLocations[locationName];
        if (!location) return;

        const navigationHTML = `
            <div class="navigation-guide">
                <h4>🚶‍♂️ 导航到 ${locationName}</h4>
                <p><strong>起点:</strong> 当前位置</p>
                <p><strong>终点:</strong> ${locationName}</p>
                <p><strong>距离:</strong> 约 ${(Math.random() * 500 + 100).toFixed(0)} 米</p>
                <p><strong>预计时间:</strong> ${(Math.random() * 5 + 3).toFixed(0)} 分钟步行</p>
                
                <div class="navigation-steps">
                    <h5>路线指引:</h5>
                    <ol>
                        <li>从当前位置出发</li>
                        <li>沿主路向北步行约200米</li>
                        <li>在第一个路口右转</li>
                        <li>继续步行约150米到达目的地</li>
                    </ol>
                </div>
                
                <div class="navigation-tips">
                    <p><strong>提示:</strong> 校园内有清晰的指示牌，可参照指引前往。</p>
                </div>
            </div>
        `;

        this.showModal('导航指引', navigationHTML);
    }

    setAsLostLocation(locationName) {
        // 设置为物品丢失地点
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = `湖北民族大学 ${locationName}`;
            alert(`已设置为丢失地点: ${locationName}`);
            this.closeMap();
        } else {
            alert(`地点已复制: ${locationName}\n可在发布信息时使用`);
        }
    }

    shareLocation(locationName) {
        const location = this.campusLocations[locationName];
        if (!location) return;

        const shareText = `湖北民族大学 ${locationName}\n坐标: 北纬${location.lat.toFixed(4)}°, 东经${location.lng.toFixed(4)}°\n描述: ${location.description}`;
        
        if (navigator.share) {
            navigator.share({
                title: `湖北民族大学 - ${locationName}`,
                text: shareText,
                url: window.location.href
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareText).then(() => {
                alert('位置信息已复制到剪贴板！');
            });
        }
    }

    searchCampusLocation() {
        const searchInput = document.getElementById('campusSearch');
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            this.renderLocationList();
            return;
        }

        // 筛选地点
        const filteredLocations = Object.entries(this.campusLocations)
            .filter(([name, location]) => 
                name.toLowerCase().includes(searchTerm) ||
                location.description.toLowerCase().includes(searchTerm) ||
                this.getLocationTypeName(location.type).toLowerCase().includes(searchTerm)
            );

        const listContainer = document.getElementById('campusLocationsList');
        if (filteredLocations.length === 0) {
            listContainer.innerHTML = '<div class="no-results">未找到匹配的地点</div>';
            return;
        }

        const locationsHTML = filteredLocations.map(([name, location]) => `
            <div class="location-item ${location.type}" onclick="hbmzuMap.showLocationInfo('${name}')">
                <div class="location-icon">${this.getLocationIcon(location.type)}</div>
                <div class="location-info">
                    <div class="location-name">${name}</div>
                    <div class="location-desc">${location.description}</div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = locationsHTML;
        
        // 高亮第一个匹配项
        if (filteredLocations.length > 0) {
            this.highlightLocation(filteredLocations[0][0]);
        }
    }

    filterLocations(category) {
        // 更新分类按钮状态
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const listContainer = document.getElementById('campusLocationsList');
        
        if (category === 'all') {
            this.renderLocationList();
            return;
        }

        // 筛选指定分类的地点
        const filteredLocations = Object.entries(this.campusLocations)
            .filter(([name, location]) => location.type === category);

        if (filteredLocations.length === 0) {
            listContainer.innerHTML = '<div class="no-results">该分类下暂无地点</div>';
            return;
        }

        const locationsHTML = filteredLocations.map(([name, location]) => `
            <div class="location-item ${location.type}" onclick="hbmzuMap.showLocationInfo('${name}')">
                <div class="location-icon">${this.getLocationIcon(location.type)}</div>
                <div class="location-info">
                    <div class="location-name">${name}</div>
                    <div class="location-desc">${location.description}</div>
                </div>
            </div>
        `).join('');

        listContainer.innerHTML = locationsHTML;
    }

    showMap() {
        document.getElementById('hbmzuMapModal').style.display = 'block';
        this.renderMap();
    }

    closeMap() {
        document.getElementById('hbmzuMapModal').style.display = 'none';
    }

    showModal(title, content) {
        const modalHTML = `
            <div id="locationModal" class="modal active">
                <div class="modal-content">
                    <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                    <h3>${title}</h3>
                    ${content}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 集成到现有应用
    integrateWithApp() {
        // 替换原有的地图功能
        if (typeof advancedFeatures !== 'undefined') {
            // 保存原有方法
            const originalShowMap = advancedFeatures.showMap;
            const originalCloseMap = advancedFeatures.closeMap;
            
            // 替换为校园地图
            advancedFeatures.showMap = (location) => {
                this.showMap();
                if (location) {
                    setTimeout(() => this.searchCampusLocationByName(location), 100);
                }
            };
            
            advancedFeatures.closeMap = () => {
                this.closeMap();
            };
            
            // 添加校园地点搜索
            advancedFeatures.searchCampusLocationByName = (name) => {
                const searchInput = document.getElementById('campusSearch');
                if (searchInput) {
                    searchInput.value = name;
                    this.searchCampusLocation();
                }
            };
        }
    }

    searchCampusLocationByName(name) {
        const searchInput = document.getElementById('campusSearch');
        if (searchInput) {
            searchInput.value = name;
            this.searchCampusLocation();
        }
    }
}

// 全局实例
const hbmzuMap = new HBMZUMap();

// 页面加载完成后集成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        hbmzuMap.integrateWithApp();
    });
} else {
    hbmzuMap.integrateWithApp();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HBMZUMap;
}