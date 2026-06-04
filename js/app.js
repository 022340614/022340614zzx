// 主应用逻辑 - 集成高级功能
class LostFoundApp {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        // 初始化基础功能
        this.setupNavigation();
        this.setupEventListeners();
        this.loadHomePage();
        this.setupPWA();
        
        // 集成高级功能
        this.integrateAdvancedFeatures();
        
        // 确保按钮可点击
        this.ensureAllButtonsClickable();
        
        console.log('校园失物招领PWA应用初始化完成');
    }
    
    ensureAllButtonsClickable() {
        // 确保所有按钮可点击
        this.ensureNavButtonsClickable();
        this.ensureProfileButtonsClickable();
        this.ensureAdminButtonsClickable();
        this.ensureFormButtonsClickable();
        this.ensureHotspotCardsClickable();
        this.ensureSuggestionItemsClickable();
        
        console.log('所有按钮已确保可点击');
    }
    
    ensureButtonClickable(button) {
        if (!button) return;
        
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';
        button.style.webkitTapHighlightColor = 'transparent';
        button.disabled = false;
        
        // 移除可能阻止点击的样式
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.display = '';
        
        // 确保有点击反馈
        if (!button.hasAttribute('data-click-fixed')) {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = '';
            });
            
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
            
            button.setAttribute('data-click-fixed', 'true');
        }
    }
    
    ensureNavButtonsClickable() {
        // 确保导航按钮可点击
        document.querySelectorAll('.nav-actions button').forEach(button => {
            this.ensureButtonClickable(button);
        });
    }
    
    ensureProfileButtonsClickable() {
        // 确保个人中心按钮可点击
        const profileButtons = document.querySelectorAll('.profile-actions button');
        profileButtons.forEach(button => {
            this.ensureButtonClickable(button);
            
            // 确保有点击事件
            if (!button.onclick) {
                const buttonText = button.textContent.trim();
                if (buttonText.includes('我的发布')) {
                    button.onclick = () => this.showMyPosts();
                } else if (buttonText.includes('编辑资料')) {
                    button.onclick = () => this.editProfile();
                } else if (buttonText.includes('使用帮助')) {
                    button.onclick = () => this.showHelp();
                }
            }
        });
    }
    
    ensureAdminButtonsClickable() {
        // 确保管理员按钮可点击
        const adminButtons = document.querySelectorAll('.admin-actions button');
        adminButtons.forEach(button => {
            this.ensureButtonClickable(button);
            
            // 确保有点击事件
            if (!button.onclick) {
                const buttonText = button.textContent.trim();
                if (buttonText.includes('物品管理')) {
                    button.onclick = () => this.manageItems();
                } else if (buttonText.includes('用户管理')) {
                    button.onclick = () => this.manageUsers();
                } else if (buttonText.includes('数据分析')) {
                    button.onclick = () => this.viewAnalytics();
                } else if (buttonText.includes('系统设置')) {
                    button.onclick = () => this.systemSettings();
                }
            }
        });
    }
    
    ensureFormButtonsClickable() {
        // 确保表单按钮可点击
        const formButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .search-input-group button');
        formButtons.forEach(button => {
            this.ensureButtonClickable(button);
        });
    }
    
    ensureHotspotCardsClickable() {
        // 确保热点区域卡片可点击
        document.querySelectorAll('.hotspot-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.style.pointerEvents = 'auto';
            card.style.userSelect = 'none';
            card.style.webkitTapHighlightColor = 'transparent';
        });
    }
    
    ensureSuggestionItemsClickable() {
        // 确保建议项可点击
        document.querySelectorAll('.suggestion-item').forEach(item => {
            this.ensureButtonClickable(item);
        });
    }
    
    // 个人中心按钮功能
    showMyPosts() {
        alert('我的发布功能');
    }
    
    editProfile() {
        alert('编辑资料功能');
    }
    
    showHelp() {
    
    // 个人中心按钮功能
    showMyPosts() {
        alert('我的发布功能');
    }
    
    editProfile() {
        alert('编辑资料功能');
    }
    
    showHelp() {
        alert('使用帮助功能');
    }
    
    // 管理员按钮功能
    manageItems() {
        alert('物品管理功能');
    }
    
    manageUsers() {
        alert('用户管理功能');
    }
    
    viewAnalytics() {
        alert('数据分析功能');
    }
    
    systemSettings() {
        alert('系统设置功能');
    }

    // 集成高级功能
    integrateAdvancedFeatures() {
        // 等待DOM加载完成后初始化高级功能
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAdvancedFeatures();
            });
        } else {
            this.setupAdvancedFeatures();
        }
    }

    setupAdvancedFeatures() {
        // 初始化高级功能模块
        if (typeof advancedFeatures !== 'undefined') {
            // 绑定高级功能到全局
            window.advancedFeatures = advancedFeatures;
            
            // 更新统计数据（集成高级分析）
            this.updateAdvancedStats();
            
            // 设置高级功能事件
            this.setupAdvancedEvents();
        }
    }

    setupAdvancedEvents() {
        // 高级功能按钮事件
        const advancedBtn = document.querySelector('.btn-advanced');
        if (advancedBtn) {
            advancedBtn.addEventListener('click', () => {
                this.showAdvancedDashboard();
            });
        }

        // 通知按钮事件
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.toggleNotifications();
            });
        }
    }

    showAdvancedDashboard() {
        // 显示高级功能概览
        alert('🚀 高级功能面板\n\n' +
              '💬 实时聊天 - 右下角聊天窗口\n' +
              '🗺️ 智能地图 - 点击位置查看地图\n' +
              '🤖 AI识别 - 发布页面图片识别\n' +
              '📊 数据分析 - 管理员后台查看\n' +
              '👤 高级认证 - 个人中心登录\n' +
              '🔔 智能推送 - 允许通知权限');
    }

    toggleNotifications() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                // 发送测试通知
                advancedFeatures.sendNotification({
                    title: '通知测试',
                    body: '智能推送系统工作正常！',
                    icon: '/assets/icon-192x192.png'
                });
            } else {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        alert('通知权限已启用！');
                    }
                });
            }
        }
    }

    updateAdvancedStats() {
        // 使用高级功能的数据统计
        const stats = this.calculateAdvancedStats();
        
        // 更新首页统计
        document.getElementById('totalItems').textContent = stats.totalItems;
        document.getElementById('resolvedItems').textContent = stats.resolvedItems;
        document.getElementById('activeUsers').textContent = stats.activeUsers;
        
        // 更新个人中心统计
        document.getElementById('myItems').textContent = stats.myItems;
        document.getElementById('myResolved').textContent = stats.myResolved;
        document.getElementById('myMessages').textContent = stats.myMessages;
        
        // 触发高级功能的数据更新
        if (typeof advancedFeatures !== 'undefined' && advancedFeatures.updateAnalytics) {
            advancedFeatures.updateAnalytics();
        }
    }

    calculateAdvancedStats() {
        const items = this.items;
        const currentUser = this.currentUser;
        
        return {
            totalItems: items.length,
            resolvedItems: items.filter(item => item.status === 'resolved').length,
            activeUsers: new Set(items.map(item => item.createdBy)).size,
            myItems: currentUser ? items.filter(item => item.createdBy === currentUser.name).length : 0,
            myResolved: currentUser ? items.filter(item => 
                item.createdBy === currentUser.name && item.status === 'resolved'
            ).length : 0,
            myMessages: Math.floor(Math.random() * 10) // 模拟消息数量
        };
    }

    // 原有基础功能保持不变，增强高级功能集成
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href').replace('#', '');
                this.showPage(targetPage);
            });
        });
        
        // 确保导航按钮可以点击
        this.ensureNavButtonsClickable();
    }
    
    ensureNavButtonsClickable() {
        // 确保所有导航按钮可以点击
        const navButtons = document.querySelectorAll('.nav-actions button');
        navButtons.forEach(button => {
            // 移除可能阻止点击的样式
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.style.zIndex = '100';
            
            // 确保按钮不在禁用状态
            button.disabled = false;
            
            // 添加点击事件监听器（如果还没有）
            if (!button.hasAttribute('data-click-fixed')) {
                const originalOnClick = button.onclick;
                if (originalOnClick) {
                    // 保留原始onclick
                    button.setAttribute('data-original-onclick', 'true');
                }
                button.setAttribute('data-click-fixed', 'true');
            }
        });
    }

    showPage(pageName) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // 更新导航激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').replace('#', '') === pageName) {
                link.classList.add('active');
            }
        });
        
        // 页面特定的初始化
        switch(pageName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'publish':
                this.setupPublishPage();
                break;
            case 'search':
                this.setupSearchPage();
                break;
            case 'profile':
                this.setupProfilePage();
                break;
        }
    }

    loadHomePage() {
        this.displayRecentItems();
        this.updateAdvancedStats();
    }

    displayRecentItems() {
        const recentItemsContainer = document.getElementById('recentItems');
        if (!recentItemsContainer) return;

        const recentItems = this.items.slice(-6).reverse(); // 显示最近6个
        recentItemsContainer.innerHTML = '';

        if (recentItems.length === 0) {
            recentItemsContainer.innerHTML = '<p class="no-items">暂无物品信息</p>';
            return;
        }

        recentItems.forEach(item => {
            const itemElement = this.createItemCard(item);
            recentItemsContainer.appendChild(itemElement);
        });
    }

    createItemCard(item) {
        const card = document.createElement('div');
        card.className = `item-card ${item.type}`;
        card.innerHTML = `
            <div class="item-header">
                <span class="item-type">${item.type === 'lost' ? '寻物' : '招领'}</span>
                <span class="item-category">${item.category}</span>
            </div>
            <div class="item-title">${item.title}</div>
            <div class="item-description">${item.description.substring(0, 50)}...</div>
            <div class="item-footer">
                <span class="item-location">📍 ${item.location}</span>
                <span class="item-time">${new Date(item.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="item-actions">
                <button onclick="app.viewItemDetail('${item.id}')">查看详情</button>
                <button onclick="app.showItemOnMap('${item.location}')">查看位置</button>
            </div>
        `;
        return card;
    }

    showItemOnMap(location) {
        // 使用高级功能的地图显示
        if (typeof advancedFeatures !== 'undefined' && advancedFeatures.showMap) {
            advancedFeatures.showMap(location);
        } else {
            alert(`物品位置: ${location}\n\n地图功能加载中...`);
        }
    }

    viewItemDetail(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        const detailHTML = `
            <div class="item-detail">
                <h3>${item.title}</h3>
                <p><strong>类型:</strong> ${item.type === 'lost' ? '寻物启事' : '失物招领'}</p>
                <p><strong>分类:</strong> ${item.category}</p>
                <p><strong>描述:</strong> ${item.description}</p>
                <p><strong>地点:</strong> ${item.location}</p>
                <p><strong>联系方式:</strong> ${item.contact}</p>
                <p><strong>发布时间:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
                <p><strong>状态:</strong> ${item.status === 'resolved' ? '已解决' : '待解决'}</p>
                
                <div class="detail-actions">
                    <button onclick="app.contactOwner('${item.id}')">💬 联系物主</button>
                    <button onclick="app.showItemOnMap('${item.location}')">🗺️ 查看位置</button>
                    ${item.status === 'pending' ? `<button onclick="app.markAsResolved('${item.id}')">✅ 标记解决</button>` : ''}
                </div>
            </div>
        `;

        // 使用模态框显示详情
        this.showModal('物品详情', detailHTML);
    }

    contactOwner(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        // 使用高级聊天功能
        if (typeof advancedFeatures !== 'undefined') {
            // 显示聊天窗口
            document.getElementById('chatWidget').style.display = 'block';
            
            // 模拟发送初始消息
            setTimeout(() => {
                advancedFeatures.addChatMessage('系统', `您正在联系关于"${item.title}"的物品`, false);
            }, 500);
        } else {
            alert(`联系方式: ${item.contact}\n\n物品: ${item.title}`);
        }
    }

    showModal(title, content) {
        const modalHTML = `
            <div id="detailModal" class="modal active">
                <div class="modal-content">
                    <span class="close" onclick="app.closeModal()">&times;</span>
                    <h2>${title}</h2>
                    ${content}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    closeModal() {
        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.remove();
        }
    }

    // 其他原有方法保持不变，但增强高级功能集成
    setupPublishPage() {
        const form = document.getElementById('publishForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.publishItem();
            });
        }

        // 图片预览功能 - 修复ID不匹配问题
        const imageInput = document.getElementById('itemImage');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.previewImage(e.target.files[0]);
            });
        }
    }

    publishItem() {
        // 直接获取表单元素的值，因为FormData需要name属性
        const itemType = document.getElementById('itemType').value;
        const itemTitle = document.getElementById('itemTitle').value;
        const category = document.getElementById('category').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const contact = document.getElementById('contact').value;
        
        const item = {
            id: Date.now().toString(),
            type: itemType,
            title: itemTitle,
            category: category,
            description: description,
            location: location,
            contact: contact,
            timestamp: new Date().toISOString(),
            status: 'pending',
            createdBy: this.currentUser ? this.currentUser.name : '匿名用户'
        };

        this.items.push(item);
        localStorage.setItem('lostFoundItems', JSON.stringify(this.items));

        // 显示成功消息
        alert('发布成功！');
        
        // 重置表单
        document.getElementById('publishForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // 更新统计和显示
        this.updateAdvancedStats();
        this.displayRecentItems();

        // 触发智能推送
        if (typeof advancedFeatures !== 'undefined' && advancedFeatures.checkAndSendNotifications) {
            setTimeout(() => {
                advancedFeatures.checkAndSendNotifications();
            }, 1000);
        }
    }

    // 搜索功能增强
    setupSearchPage() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchItems(e.target.value);
            });
        }

        // 筛选器事件
        const filters = ['categoryFilter', 'typeFilter', 'statusFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.searchItems();
                });
            }
        });
    }

    searchItems(keyword = '') {
        const searchTerm = keyword || document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;
        const type = document.getElementById('typeFilter').value;
        const status = document.getElementById('statusFilter').value;

        let results = this.items;

        if (searchTerm) {
            results = results.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (category) {
            results = results.filter(item => item.category === category);
        }

        if (type) {
            results = results.filter(item => item.type === type);
        }

        if (status) {
            results = results.filter(item => item.status === status);
        }

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsContainer = document.getElementById('searchResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">未找到匹配的物品</p>';
            return;
        }

        results.forEach(item => {
            const itemElement = this.createItemCard(item);
            resultsContainer.appendChild(itemElement);
        });
    }

    // 个人中心功能
    setupProfilePage() {
        this.updateProfileStats();
    }

    updateProfileStats() {
        const stats = this.calculateAdvancedStats();
        document.getElementById('myItems').textContent = stats.myItems;
        document.getElementById('myResolved').textContent = stats.myResolved;
        document.getElementById('myMessages').textContent = stats.myMessages;
    }

    // PWA设置
    setupPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }
}

// 全局应用实例
const app = new LostFoundApp();

// 全局函数供HTML调用
window.showPage = (pageName) => app.showPage(pageName);
window.searchItems = (keyword) => app.searchItems(keyword);
window.advancedFeatures = typeof advancedFeatures !== 'undefined' ? advancedFeatures : null;