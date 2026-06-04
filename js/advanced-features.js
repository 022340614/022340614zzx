// 高级功能模块
class AdvancedFeatures {
    constructor() {
        this.socket = null;
        this.map = null;
        this.aiModel = null;
        this.init();
    }

    async init() {
        // 初始化所有高级功能
        await this.initRealTimeChat();
        await this.initSmartMap();
        await this.initAIImageRecognition();
        await this.initAnalyticsDashboard();
        await this.initAdvancedAuth();
        await this.initSmartNotifications();
    }

    // 1. 实时聊天系统
    async initRealTimeChat() {
        console.log('初始化实时聊天系统...');
        
        // 模拟WebSocket连接
        this.socket = {
            connected: true,
            send: (data) => {
                console.log('发送消息:', data);
                // 模拟接收消息
                setTimeout(() => {
                    this.onMessageReceived({
                        type: 'chat',
                        from: '客服',
                        message: '消息已收到，我们会尽快处理您的咨询。',
                        timestamp: new Date().toISOString()
                    });
                }, 1000);
            },
            onmessage: null
        };

        // 不创建重复的聊天UI，使用index.html中已有的聊天窗口
        // 只设置事件监听器
        this.setupChatEvents();
    }

    setupChatEvents() {
        // 确保聊天窗口按钮可点击
        this.ensureChatButtonsClickable();
        
        // 监听发送按钮
        const sendBtn = document.querySelector('#chatWidget .chat-input button');
        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.sendChatMessage();
            });
        }
        
        // 监听输入框回车键
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }
        
        // 监听聊天窗口切换按钮
        const chatToggle = document.querySelector('#chatWidget .chat-toggle');
        if (chatToggle) {
            chatToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleChat();
            });
        }
    }
    
    ensureChatButtonsClickable() {
        const chatToggle = document.querySelector('.chat-toggle');
        const chatSendBtn = document.querySelector('#chatWidget .chat-input button');
        
        if (chatToggle) {
            chatToggle.style.pointerEvents = 'auto';
            chatToggle.style.cursor = 'pointer';
            chatToggle.style.userSelect = 'none';
            chatToggle.style.webkitTapHighlightColor = 'transparent';
        }
        
        if (chatSendBtn) {
            chatSendBtn.style.pointerEvents = 'auto';
            chatSendBtn.style.cursor = 'pointer';
            chatSendBtn.style.userSelect = 'none';
            chatSendBtn.style.webkitTapHighlightColor = 'transparent';
        }
    }
    
    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        const chatBody = document.querySelector('.chat-body');
        const chatToggle = document.querySelector('.chat-toggle');
        
        if (chatWidget && chatBody && chatToggle) {
            if (chatWidget.style.display === 'none' || chatWidget.style.display === '') {
                // 显示聊天窗口
                chatWidget.style.display = 'block';
                chatBody.style.display = 'block';
                chatToggle.textContent = '−';
                
                // 聚焦到输入框
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    setTimeout(() => chatInput.focus(), 100);
                }
            } else {
                // 隐藏聊天窗口
                chatWidget.style.display = 'none';
                chatToggle.textContent = '+';
            }
        }
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input ? input.value.trim() : '';
        
        if (!message) {
            alert('请输入消息内容');
            return;
        }

        // 添加到消息列表
        this.addChatMessage('我', message, true);
        
        // 发送到服务器
        if (this.socket && this.socket.connected) {
            this.socket.send({
                type: 'chat',
                message: message,
                timestamp: new Date().toISOString()
            });
        }

        if (input) {
            input.value = '';
        }
    }

    addChatMessage(sender, message, isSelf = false) {
        const messagesDiv = document.getElementById('chatMessages');
        if (!messagesDiv) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isSelf ? 'self' : 'other'}`;
        messageDiv.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    onMessageReceived(data) {
        if (data.type === 'chat') {
            this.addChatMessage(data.from, data.message, false);
        }
    }

    // 2. 智能地图功能
    async initSmartMap() {
        console.log('初始化智能地图...');
        
        // 创建地图容器
        const mapHTML = `
            <div id="mapModal" class="modal">
                <div class="modal-content">
                    <span class="close" onclick="advancedFeatures.closeMap()">&times;</span>
                    <h3>校园地图</h3>
                    <div id="campusMap" class="campus-map"></div>
                    <div class="map-controls">
                        <input type="text" id="searchLocation" placeholder="搜索地点...">
                        <button onclick="advancedFeatures.searchLocation()">搜索</button>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('mapModal')) {
            document.body.insertAdjacentHTML('beforeend', mapHTML);
        }

        // 模拟地图数据
        this.campusLocations = {
            '图书馆': { lat: 31.2304, lng: 121.4737 },
            '教学楼': { lat: 31.2310, lng: 121.4740 },
            '食堂': { lat: 31.2298, lng: 121.4730 },
            '体育馆': { lat: 31.2320, lng: 121.4750 },
            '宿舍楼': { lat: 31.2280, lng: 121.4720 }
        };
    }

    showMap(locationName = null) {
        document.getElementById('mapModal').style.display = 'block';
        
        // 模拟地图显示
        const mapDiv = document.getElementById('campusMap');
        if (locationName && this.campusLocations[locationName]) {
            const loc = this.campusLocations[locationName];
            mapDiv.innerHTML = `
                <div class="map-marker">
                    <div class="marker-icon">📍</div>
                    <div class="marker-info">
                        <strong>${locationName}</strong>
                        <p>坐标: ${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</p>
                    </div>
                </div>
                <div class="map-overlay">
                    <p>点击地图查看详细位置</p>
                </div>
            `;
        } else {
            mapDiv.innerHTML = `
                <div class="map-overlay">
                    <p>校园地图加载中...</p>
                    <p>支持地点搜索和导航</p>
                </div>
            `;
        }
    }

    closeMap() {
        document.getElementById('mapModal').style.display = 'none';
    }

    searchLocation() {
        const input = document.getElementById('searchLocation');
        const location = input.value.trim();
        
        if (location && this.campusLocations[location]) {
            this.showMap(location);
        } else {
            alert('未找到该地点，请尝试：图书馆、教学楼、食堂、体育馆、宿舍楼');
        }
    }

    // 3. AI图片识别
    async initAIImageRecognition() {
        console.log('初始化AI图片识别...');
        
        // 创建图片识别UI
        const aiHTML = `
            <div id="aiRecognition" class="ai-recognition">
                <h4>🤖 AI智能识别</h4>
                <div class="ai-upload">
                    <input type="file" id="aiImageInput" accept="image/*" onchange="advancedFeatures.analyzeImage(this.files[0])">
                    <label for="aiImageInput" class="ai-upload-btn">
                        <span>📷 上传图片识别</span>
                    </label>
                </div>
                <div id="aiResults" class="ai-results"></div>
            </div>
        `;

        // 添加到发布表单
        const publishForm = document.querySelector('.publish-form');
        if (publishForm && !document.getElementById('aiRecognition')) {
            publishForm.insertAdjacentHTML('beforeend', aiHTML);
        }
    }

    async analyzeImage(file) {
        if (!file) return;

        const resultsDiv = document.getElementById('aiResults');
        resultsDiv.innerHTML = '<div class="ai-loading">AI分析中...</div>';

        // 模拟AI分析
        setTimeout(() => {
            const categories = ['证件', '书本', '电子产品', '衣物', '钥匙', '其他'];
            const predictedCategory = categories[Math.floor(Math.random() * categories.length)];
            
            const confidence = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5-1.0
            
            resultsDiv.innerHTML = `
                <div class="ai-result">
                    <div class="ai-category">
                        <strong>识别结果:</strong> ${predictedCategory}
                    </div>
                    <div class="ai-confidence">
                        <strong>置信度:</strong> ${(confidence * 100).toFixed(1)}%
                    </div>
                    <div class="ai-suggestions">
                        <strong>建议:</strong> 
                        <ul>
                            <li>自动填充物品分类</li>
                            <li>建议描述关键词</li>
                            <li>相似物品匹配</li>
                        </ul>
                    </div>
                </div>
            `;

            // 自动填充分类
            const categorySelect = document.getElementById('category');
            if (categorySelect) {
                categorySelect.value = predictedCategory;
            }
        }, 1500);
    }

    // 4. 数据分析仪表板
    async initAnalyticsDashboard() {
        console.log('初始化数据分析仪表板...');
        
        // 创建仪表板UI
        const analyticsHTML = `
            <div id="analyticsPanel" class="analytics-panel">
                <h3>📊 数据洞察</h3>
                <div class="analytics-grid">
                    <div class="metric-card">
                        <div class="metric-value" id="activeUsers">0</div>
                        <div class="metric-label">活跃用户</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="successRate">0%</div>
                        <div class="metric-label">找回成功率</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="avgResponse">0h</div>
                        <div class="metric-label">平均响应时间</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value" id="popularCategory">-</div>
                        <div class="metric-label">热门分类</div>
                    </div>
                </div>
                <canvas id="analyticsChart" width="400" height="200"></canvas>
            </div>
        `;

        // 添加到管理员后台
        const dashboard = document.getElementById('dashboard');
        if (dashboard && !document.getElementById('analyticsPanel')) {
            dashboard.insertAdjacentHTML('beforeend', analyticsHTML);
            this.updateAnalytics();
        }
    }

    updateAnalytics() {
        // 模拟数据更新
        const items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
        
        // 计算统计数据
        const activeUsers = new Set(items.map(item => item.createdBy)).size;
        const resolvedItems = items.filter(item => item.status === 'resolved').length;
        const successRate = items.length > 0 ? Math.round((resolvedItems / items.length) * 100) : 0;
        
        // 热门分类
        const categoryCount = {};
        items.forEach(item => {
            categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        });
        const popularCategory = Object.keys(categoryCount).length > 0 
            ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
            : '-';

        // 更新UI
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('successRate').textContent = `${successRate}%`;
        document.getElementById('popularCategory').textContent = popularCategory;

        // 模拟图表
        this.createAnalyticsChart();
    }

    createAnalyticsChart() {
        const canvas = document.getElementById('analyticsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 模拟图表数据
        const data = {
            labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            datasets: [{
                label: '发布数量',
                data: [12, 19, 8, 15, 22, 18, 25],
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 2
            }]
        };

        // 简单图表绘制
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网格
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = i * 40;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 绘制数据线
        ctx.strokeStyle = 'rgba(76, 175, 80, 1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.datasets[0].data.forEach((value, index) => {
            const x = (index + 1) * (canvas.width / (data.labels.length + 1));
            const y = canvas.height - (value * 8);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    // 5. 高级用户认证
    async initAdvancedAuth() {
        console.log('初始化高级用户认证...');
        
        // 创建社交登录按钮
        const authHTML = `
            <div id="advancedAuth" class="advanced-auth">
                <h4>快速登录</h4>
                <div class="auth-buttons">
                    <button class="auth-btn wechat" onclick="advancedFeatures.loginWithWechat()">
                        <span>微信登录</span>
                    </button>
                    <button class="auth-btn qq" onclick="advancedFeatures.loginWithQQ()">
                        <span>QQ登录</span>
                    </button>
                    <button class="auth-btn phone" onclick="advancedFeatures.loginWithPhone()">
                        <span>手机验证码登录</span>
                    </button>
                </div>
                <div class="user-profile" id="userProfile" style="display: none;">
                    <div class="profile-header">
                        <div class="avatar" id="userAvatar">👤</div>
                        <div class="profile-info">
                            <div class="username" id="userDisplayName">用户</div>
                            <div class="user-score">
                                <span class="score-label">信誉分:</span>
                                <span class="score-value" id="userScore">100</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到个人中心
        const profileSection = document.querySelector('.profile-section');
        if (profileSection && !document.getElementById('advancedAuth')) {
            profileSection.insertAdjacentHTML('afterbegin', authHTML);
        }
    }

    loginWithWechat() {
        alert('微信登录功能（模拟）\n实际应用中需要接入微信开放平台');
        this.updateUserProfile('微信用户', 'wechat', 120);
    }

    loginWithQQ() {
        alert('QQ登录功能（模拟）\n实际应用中需要接入QQ互联平台');
        this.updateUserProfile('QQ用户', 'qq', 110);
    }

    loginWithPhone() {
        const phone = prompt('请输入手机号:');
        if (phone && /^1[3-9]\d{9}$/.test(phone)) {
            alert(`验证码已发送到 ${phone}\n模拟验证码: 123456`);
            this.updateUserProfile('手机用户', 'phone', 105);
        }
    }

    updateUserProfile(name, type, score) {
        document.getElementById('userDisplayName').textContent = name;
        document.getElementById('userScore').textContent = score;
        
        const avatar = document.getElementById('userAvatar');
        if (type === 'wechat') avatar.textContent = '💚';
        else if (type === 'qq') avatar.textContent = '💙';
        else avatar.textContent = '📱';
        
        document.getElementById('userProfile').style.display = 'block';
    }

    // 6. 智能推送系统
    async initSmartNotifications() {
        console.log('初始化智能推送系统...');
        
        // 请求通知权限
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('通知权限已授予');
                    this.setupSmartNotifications();
                }
            });
        } else if (Notification.permission === 'granted') {
            this.setupSmartNotifications();
        }
    }

    setupSmartNotifications() {
        // 模拟智能推送
        setInterval(() => {
            this.checkAndSendNotifications();
        }, 30000); // 每30秒检查一次
    }

    checkAndSendNotifications() {
        const items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
        
        // 检查是否有匹配的物品
        const userItems = items.filter(item => item.createdBy === '当前用户');
        const otherItems = items.filter(item => item.createdBy !== '当前用户' && item.status === 'pending');
        
        if (userItems.length > 0 && otherItems.length > 0) {
            // 简单匹配逻辑
            const userCategories = userItems.map(item => item.category);
            const matchingItems = otherItems.filter(item => 
                userCategories.includes(item.category)
            );
            
            if (matchingItems.length > 0) {
                this.sendNotification({
                    title: '🔔 发现匹配物品',
                    body: `有${matchingItems.length}个物品可能与您相关`,
                    icon: '/assets/icon-192x192.png'
                });
            }
        }
    }

    sendNotification(options) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(options.title, {
                body: options.body,
                icon: options.icon,
                tag: 'smart-notification'
            });
        }
    }

    // 公共方法
    showAdvancedFeatures() {
        this.showMap();
        this.updateAnalytics();
    }
}

// 全局实例
const advancedFeatures = new AdvancedFeatures();

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedFeatures;
}