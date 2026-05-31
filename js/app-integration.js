// 湖北民族大学地图集成到主应用
function integrateHBMZUMap() {
    console.log('开始集成湖北民族大学地图...');
    
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initHBMZUIntegration();
        });
    } else {
        initHBMZUIntegration();
    }
    
    function initHBMZUIntegration() {
        // 1. 添加CSS样式
        addHBMZUStyles();
        
        // 2. 修改发布表单的地点输入
        enhanceLocationInput();
        
        // 3. 集成到搜索功能
        enhanceSearchFunction();
        
        // 4. 更新物品详情显示
        enhanceItemDetails();
        
        // 5. 添加校园地图快捷入口
        addCampusMapShortcut();
        
        console.log('湖北民族大学地图集成完成');
    }
    
    function addHBMZUStyles() {
        // 检查是否已添加样式
        if (!document.querySelector('link[href*="hbmzu-map.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'styles/hbmzu-map.css';
            document.head.appendChild(link);
        }
    }
    
    function enhanceLocationInput() {
        const locationInput = document.getElementById('location');
        if (!locationInput) return;
        
        // 添加校园地点选择器
        const locationWrapper = locationInput.parentElement;
        const campusSelector = document.createElement('div');
        campusSelector.className = 'campus-location-selector';
        campusSelector.innerHTML = `
            <div class="selector-header">
                <span>选择校园地点:</span>
                <button type="button" class="btn-select-campus" onclick="showCampusLocationPicker()">
                    🗺️ 从地图选择
                </button>
            </div>
            <div class="campus-location-suggestions">
                <div class="suggestion-item" onclick="selectCampusLocation('图书馆')">图书馆</div>
                <div class="suggestion-item" onclick="selectCampusLocation('主教学楼')">主教学楼</div>
                <div class="suggestion-item" onclick="selectCampusLocation('学生食堂')">学生食堂</div>
                <div class="suggestion-item" onclick="selectCampusLocation('操场')">操场</div>
                <div class="suggestion-item" onclick="selectCampusLocation('学生宿舍1栋')">学生宿舍1栋</div>
            </div>
        `;
        
        locationWrapper.appendChild(campusSelector);
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .campus-location-selector {
                margin-top: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 5px;
                border: 1px solid #ddd;
            }
            
            .selector-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .btn-select-campus {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.9rem;
            }
            
            .campus-location-suggestions {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .suggestion-item {
                background: white;
                border: 1px solid #ddd;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: all 0.3s;
            }
            
            .suggestion-item:hover {
                background: #4CAF50;
                color: white;
                border-color: #4CAF50;
            }
        `;
        document.head.appendChild(style);
    }
    
    function enhanceSearchFunction() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        // 添加校园地点搜索提示
        searchInput.setAttribute('placeholder', '搜索物品或校园地点...');
        
        // 修改搜索逻辑以支持校园地点
        const originalSearch = window.searchItems;
        if (originalSearch) {
            window.searchItems = function(keyword = '') {
                const searchTerm = keyword || searchInput.value;
                
                // 检查是否是校园地点
                if (isCampusLocation(searchTerm)) {
                    showCampusLocationResults(searchTerm);
                } else {
                    // 调用原始搜索函数
                    originalSearch(searchTerm);
                }
            };
        }
    }
    
    function isCampusLocation(searchTerm) {
        const campusKeywords = [
            '图书馆', '教学楼', '食堂', '宿舍', '操场', 
            '体育馆', '行政楼', '校医院', '校门口', '快递点'
        ];
        
        return campusKeywords.some(keyword => 
            searchTerm.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    function showCampusLocationResults(location) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = `
            <div class="campus-search-results">
                <h4>🏫 校园地点: ${location}</h4>
                <p>在湖北民族大学校园内搜索相关物品...</p>
                <div class="location-items">
                    <!-- 这里可以动态加载该地点的物品 -->
                    <div class="location-item-card">
                        <div class="item-type">寻物启事</div>
                        <div class="item-title">寻找学生证</div>
                        <div class="item-location">📍 图书馆三楼自习区</div>
                        <div class="item-time">发布时间: 今天 10:30</div>
                    </div>
                    <div class="location-item-card">
                        <div class="item-type">失物招领</div>
                        <div class="item-title">捡到黑色钱包</div>
                        <div class="item-location">📍 食堂门口</div>
                        <div class="item-time">发布时间: 昨天 18:45</div>
                    </div>
                </div>
                <button class="btn-view-on-map" onclick="hbmzuMap.showMap('${location}')">
                    🗺️ 在地图上查看此地点
                </button>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .campus-search-results {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .campus-search-results h4 {
                color: #4CAF50;
                margin-bottom: 10px;
            }
            
            .location-items {
                margin: 15px 0;
            }
            
            .location-item-card {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #4CAF50;
            }
            
            .item-type {
                display: inline-block;
                background: #4CAF50;
                color: white;
                padding: 2px 8px;
                border-radius: 3px;
                font-size: 0.8rem;
                margin-bottom: 5px;
            }
            
            .item-title {
                font-weight: bold;
                margin: 5px 0;
            }
            
            .item-location {
                color: #666;
                font-size: 0.9rem;
                margin: 5px 0;
            }
            
            .item-time {
                color: #999;
                font-size: 0.8rem;
            }
            
            .btn-view-on-map {
                background: #2196F3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }
    
    function enhanceItemDetails() {
        // 修改物品详情显示，添加校园地图链接
        const originalViewItemDetail = window.app?.viewItemDetail;
        if (originalViewItemDetail) {
            window.app.viewItemDetail = function(itemId) {
                const item = this.items.find(i => i.id === itemId);
                if (!item) return;
                
                // 调用原始函数
                originalViewItemDetail.call(this, itemId);
                
                // 添加校园地图链接
                setTimeout(() => {
                    addCampusMapLinkToDetail(item);
                }, 100);
            };
        }
    }
    
    function addCampusMapLinkToDetail(item) {
        const detailModal = document.getElementById('detailModal');
        if (!detailModal) return;
        
        const mapLink = document.createElement('div');
        mapLink.className = 'campus-map-link';
        mapLink.innerHTML = `
            <div class="map-link-content">
                <p><strong>校园位置:</strong> ${item.location}</p>
                <button onclick="hbmzuMap.showMap('${item.location}')" class="btn-campus-map">
                    🗺️ 在校园地图上查看
                </button>
            </div>
        `;
        
        const detailActions = detailModal.querySelector('.detail-actions');
        if (detailActions) {
            detailActions.appendChild(mapLink);
        }
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .campus-map-link {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #eee;
            }
            
            .map-link-content {
                text-align: center;
            }
            
            .btn-campus-map {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    function addCampusMapShortcut() {
        // 在导航栏添加校园地图快捷入口
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;
        
        const campusMapBtn = document.createElement('button');
        campusMapBtn.className = 'nav-campus-map';
        campusMapBtn.innerHTML = '🏫 校园地图';
        campusMapBtn.onclick = () => {
            if (typeof hbmzuMap !== 'undefined') {
                hbmzuMap.showMap();
            } else {
                alert('校园地图功能加载中...');
            }
        };
        
        // 添加到导航栏
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.insertBefore(campusMapBtn, navActions.firstChild);
        }
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .nav-campus-map {
                background: #2196F3;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-right: 10px;
                transition: all 0.3s;
            }
            
            .nav-campus-map:hover {
                background: #1976D2;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 全局函数供HTML调用
    window.showCampusLocationPicker = function() {
        if (typeof hbmzuMap !== 'undefined') {
            hbmzuMap.showMap();
        } else {
            alert('校园地图功能加载中...');
        }
    };
    
    window.selectCampusLocation = function(location) {
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = `湖北民族大学 ${location}`;
        }
    };
}

// 启动集成
integrateHBMZUMap();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = integrateHBMZUMap;
}