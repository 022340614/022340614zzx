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
        console.log('开始修复所有按钮可点击性...');
        
        // 确保所有按钮可点击
        this.ensureNavButtonsClickable();
        this.ensureProfileButtonsClickable();
        this.ensureAdminButtonsClickable();
        this.ensureFormButtonsClickable();
        this.ensureHotspotCardsClickable();
        this.ensureSuggestionItemsClickable();
        this.ensureChatButtonsClickable();
        this.ensureMapButtonsClickable();
        
        // 额外检查：修复所有按钮的onclick事件
        this.fixAllButtonClickEvents();
        
        console.log('所有按钮已确保可点击');
    }
    
    fixAllButtonClickEvents() {
        // 修复所有按钮的onclick事件
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            this.fixButtonClickEvent(button);
        });
        
        // 修复所有可点击元素
        const clickableElements = document.querySelectorAll('.hotspot-card, .suggestion-item, .chat-toggle, [onclick]');
        clickableElements.forEach(element => {
            this.fixElementClickEvent(element);
        });
    }
    
    fixButtonClickEvent(button) {
        if (!button) return;
        
        // 确保按钮可点击
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.disabled = false;
        button.style.opacity = '1';
        
        // 如果按钮没有onclick事件，根据文本内容添加
        if (!button.onclick && !button.hasAttribute('data-click-fixed')) {
            const buttonText = button.textContent.trim();
            
            // 导航按钮
            if (buttonText.includes('校园地图')) {
                button.onclick = () => this.showCampusMap();
            } else if (buttonText.includes('首页')) {
                button.onclick = () => this.showPage('home');
            } else if (buttonText.includes('发布')) {
                button.onclick = () => this.showPage('publish');
            } else if (buttonText.includes('搜索')) {
                button.onclick = () => this.showPage('search');
            } else if (buttonText.includes('我的')) {
                button.onclick = () => this.showPage('profile');
            } else if (buttonText.includes('管理')) {
                button.onclick = () => this.showPage('admin');
            }
            
            // 标记为已修复
            button.setAttribute('data-click-fixed', 'true');
        }
    }
    
    fixElementClickEvent(element) {
        if (!element) return;
        
        // 确保元素可点击
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'pointer';
        
        // 热点区域卡片
        if (element.classList.contains('hotspot-card')) {
            const location = element.querySelector('h4')?.textContent;
            if (location && !element.onclick) {
                element.onclick = () => this.showCampusMapWithLocation(location);
            }
        }
        
        // 建议项
        if (element.classList.contains('suggestion-item')) {
            const location = element.textContent.trim();
            if (location && !element.onclick) {
                element.onclick = () => this.selectCampusLocation(location);
            }
        }
    }
    
    ensureChatButtonsClickable() {
        // 确保聊天按钮可点击
        const chatToggle = document.querySelector('.chat-toggle');
        const chatSendBtn = document.querySelector('#chatWidget .chat-input button');
        
        if (chatToggle) {
            this.fixButtonClickEvent(chatToggle);
            if (!chatToggle.onclick) {
                chatToggle.onclick = () => this.toggleChat();
            }
        }
        
        if (chatSendBtn) {
            this.fixButtonClickEvent(chatSendBtn);
            if (!chatSendBtn.onclick) {
                chatSendBtn.onclick = () => this.sendChatMessage();
            }
        }
    }
    
    ensureMapButtonsClickable() {
        // 确保地图相关按钮可点击
        const mapButtons = document.querySelectorAll('.btn-select-campus, .btn-campus-map, .btn-view-on-map');
        mapButtons.forEach(button => {
            this.fixButtonClickEvent(button);
        });
    }
    
    // 校园地图相关函数
    showCampusMap() {
        console.log('显示校园地图');
        if (typeof hbmzuMap !== 'undefined' && hbmzuMap.showMap) {
            hbmzuMap.showMap();
        } else {
            alert('校园地图功能加载中...');
        }
    }
    
    showCampusMapWithLocation(location) {
        console.log('显示校园地图位置:', location);
        if (typeof hbmzuMap !== 'undefined' && hbmzuMap.showMap) {
            hbmzuMap.showMap(location);
        } else {
            alert('校园地图功能加载中...');
            this.selectCampusLocation(location);
        }
    }
    
    selectCampusLocation(location) {
        const locationInput = document.getElementById('location');
        if (locationInput) {
            locationInput.value = `湖北民族大学 ${location}`;
            console.log('已选择校园地点:', location);
        }
    }
    
    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        if (chatWidget) {
            if (chatWidget.style.display === 'none' || chatWidget.style.display === '') {
                chatWidget.style.display = 'block';
            } else {
                chatWidget.style.display = 'none';
            }
        }
    }
    
    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput ? chatInput.value.trim() : '';
        
        if (!message) {
            alert('请输入消息内容');
            return;
        }
        
        // 添加到消息列表
        this.addChatMessage('我', message, true);
        
        // 清空输入框
        if (chatInput) {
            chatInput.value = '';
        }
        
        // 模拟回复
        setTimeout(() => {
            const responses = [
                '您好！我是校园失物招领助手，有什么可以帮您的吗？',
                '请描述您丢失或捡到的物品，我会尽力帮助您。',
                '您可以在发布页面填写详细信息，方便其他同学看到。',
                '建议您检查一下校园地图，看看物品可能丢失的位置。',
                '感谢您的使用！祝您早日找到失物。'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage('客服', randomResponse, false);
        }, 1000);
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
        // 显示用户发布的物品
        const currentUser = this.currentUser;
        if (!currentUser) {
            alert('请先登录以查看您的发布');
            return;
        }

        const userItems = this.items.filter(item => item.createdBy === currentUser.name);
        
        if (userItems.length === 0) {
            alert('您还没有发布任何物品');
            return;
        }

        // 创建显示用户发布物品的模态框
        let itemsHtml = '<div class="my-posts-modal">';
        itemsHtml += '<h3>我的发布 (' + userItems.length + ')</h3>';
        itemsHtml += '<div class="my-posts-list">';
        
        userItems.forEach(item => {
            const statusText = item.status === 'resolved' ? '已解决' : 
                             item.status === 'pending' ? '待审核' : '进行中';
            const statusClass = item.status === 'resolved' ? 'status-resolved' : 
                              item.status === 'pending' ? 'status-pending' : 'status-active';
            
            itemsHtml += `
                <div class="my-post-item ${statusClass}">
                    <div class="post-header">
                        <span class="post-title">${item.title}</span>
                        <span class="post-status">${statusText}</span>
                    </div>
                    <div class="post-details">
                        <span>类型: ${item.type === 'lost' ? '寻物' : '招领'}</span>
                        <span>分类: ${item.category}</span>
                        <span>地点: ${item.location}</span>
                    </div>
                    <div class="post-time">${new Date(item.timestamp).toLocaleDateString()}</div>
                    <div class="post-actions">
                        <button onclick="app.viewItemDetail('${item.id}')">查看详情</button>
                        <button onclick="app.editItem('${item.id}')">编辑</button>
                        <button onclick="app.deleteItem('${item.id}')">删除</button>
                    </div>
                </div>
            `;
        });
        
        itemsHtml += '</div></div>';
        
        // 显示模态框
        this.showModal('我的发布', itemsHtml);
    }
    
    editProfile() {
        // 编辑用户资料
        const currentUser = this.currentUser || { name: '游客', contact: '未设置' };
        
        const profileHtml = `
            <div class="edit-profile-modal">
                <h3>编辑资料</h3>
                <form id="profileForm">
                    <div class="form-group">
                        <label for="userNameInput">昵称:</label>
                        <input type="text" id="userNameInput" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="userContactInput">联系方式:</label>
                        <input type="text" id="userContactInput" value="${currentUser.contact || ''}" 
                               placeholder="请输入手机号或邮箱">
                    </div>
                    <div class="form-group">
                        <label for="userAvatar">头像:</label>
                        <div class="avatar-options">
                            <div class="avatar-option" onclick="app.selectAvatar('👤')">👤</div>
                            <div class="avatar-option" onclick="app.selectAvatar('👨')">👨</div>
                            <div class="avatar-option" onclick="app.selectAvatar('👩')">👩</div>
                            <div class="avatar-option" onclick="app.selectAvatar('🎓')">🎓</div>
                            <div class="avatar-option" onclick="app.selectAvatar('🔍')">🔍</div>
                        </div>
                        <input type="hidden" id="userAvatar" value="${currentUser.avatar || '👤'}">
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="app.saveProfile()">保存</button>
                        <button type="button" onclick="app.closeModal()">取消</button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal('编辑资料', profileHtml);
    }
    
    showHelp() {
        // 显示使用帮助
        const helpContent = `
            <div class="help-modal">
                <h3>📱 校园失物招领平台使用指南</h3>
                <div class="help-section">
                    <h4>1. 发布物品</h4>
                    <ul>
                        <li>点击顶部导航栏的"发布"按钮</li>
                        <li>选择物品类型（寻物/招领）</li>
                        <li>填写物品信息（名称、分类、地点、描述）</li>
                        <li>输入联系方式（手机号或邮箱）</li>
                        <li>点击"发布"按钮提交</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>2. 查找物品</h4>
                    <ul>
                        <li>在首页浏览最新发布的物品</li>
                        <li>使用搜索框输入关键词查找</li>
                        <li>使用筛选器按分类、类型、状态筛选</li>
                        <li>点击物品卡片查看详细信息</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>3. 我的发布</h4>
                    <ul>
                        <li>在个人中心查看自己发布的所有物品</li>
                        <li>管理进行中和已解决的发布</li>
                        <li>编辑或删除已发布的物品</li>
                        <li>查看物品状态和联系记录</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>4. 个人资料</h4>
                    <ul>
                        <li>编辑个人昵称和联系方式</li>
                        <li>选择个性化头像</li>
                        <li>查看发布统计信息</li>
                        <li>管理账户设置</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>5. 高级功能</h4>
                    <ul>
                        <li>💬 实时在线客服</li>
                        <li>🗺️ 校园地图定位</li>
                        <li>🤖 AI智能识别</li>
                        <li>📊 数据统计分析</li>
                        <li>🔔 智能消息推送</li>
                    </ul>
                </div>
                <div class="help-contact">
                    <h4>📞 联系我们</h4>
                    <p>如有问题或建议，请联系：</p>
                    <p>📧 邮箱：support@campus.com</p>
                    <p>📞 电话：400-123-4567</p>
                    <p>🕒 工作时间：周一至周五 9:00-18:00</p>
                </div>
            </div>
        `;
        
        this.showModal('使用帮助', helpContent);
    }
    
    // 辅助函数：显示模态框
    showModal(title, content) {
        // 移除现有的模态框
        const existingModal = document.getElementById('customModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 创建模态框
        const modalHtml = `
            <div id="customModal" class="custom-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <span class="modal-close" onclick="app.closeModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 添加样式
        this.addModalStyles();
    }
    
    closeModal() {
        const modal = document.getElementById('customModal');
        if (modal) {
            modal.remove();
        }
    }
    
    addModalStyles() {
        // 如果样式不存在，添加模态框样式
        if (!document.getElementById('modalStyles')) {
            const style = document.createElement('style');
            style.id = 'modalStyles';
            style.textContent = `
                .custom-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .modal-header {
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #333;
                }
                .modal-close {
                    cursor: pointer;
                    font-size: 24px;
                    color: #999;
                }
                .modal-close:hover {
                    color: #333;
                }
                .modal-body {
                    padding: 20px;
                }
                .my-posts-modal h3 {
                    margin-top: 0;
                    color: #4CAF50;
                }
                .my-post-item {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: #f9f9f9;
                }
                .post-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .post-title {
                    font-weight: bold;
                    font-size: 16px;
                }
                .post-status {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    color: white;
                }
                .status-resolved { background: #4CAF50; }
                .status-pending { background: #FF9800; }
                .status-active { background: #2196F3; }
                .post-details {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 10px;
                    color: #666;
                    font-size: 14px;
                }
                .post-time {
                    color: #999;
                    font-size: 12px;
                    margin-bottom: 10px;
                }
                .post-actions {
                    display: flex;
                    gap: 10px;
                }
                .post-actions button {
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                }
                .post-actions button:hover {
                    background: #45a049;
                }
                .edit-profile-modal .form-group {
                    margin-bottom: 15px;
                }
                .edit-profile-modal label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .edit-profile-modal input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .avatar-options {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .avatar-option {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #ddd;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                }
                .avatar-option:hover {
                    border-color: #4CAF50;
                }
                .form-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .form-actions button {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .form-actions button:first-child {
                    background: #4CAF50;
                    color: white;
                }
                .form-actions button:last-child {
                    background: #f0f0f0;
                    color: #333;
                }
                .help-modal h3 {
                    color: #4CAF50;
                    margin-top: 0;
                }
                .help-section {
                    margin-bottom: 20px;
                }
                .help-section h4 {
                    color: #333;
                    margin-bottom: 10px;
                }
                .help-section ul {
                    margin: 0;
                    padding-left: 20px;
                }
                .help-section li {
                    margin-bottom: 5px;
                }
                .help-contact {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }
                .help-contact h4 {
                    color: #333;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 选择头像
    selectAvatar(avatar) {
        document.getElementById('userAvatar').value = avatar;
        // 更新显示
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.style.borderColor = option.textContent === avatar ? '#4CAF50' : '#ddd';
        });
    }
    
    // 保存资料
    saveProfile() {
        const name = document.getElementById('userNameInput').value;
        const contact = document.getElementById('userContactInput').value;
        const avatar = document.getElementById('userAvatar').value;
        
        if (!name.trim()) {
            alert('请输入昵称');
            return;
        }
        
        this.currentUser = {
            name: name.trim(),
            contact: contact.trim(),
            avatar: avatar
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // 更新页面显示
        document.getElementById('userName').textContent = name;
        document.getElementById('userContact').textContent = contact || '未设置联系方式';
        
        alert('资料保存成功！');
        this.closeModal();
    }
    
    // 查看物品详情
    viewItemDetail(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) {
            alert('物品不存在');
            return;
        }
        
        const detailHtml = `
            <div class="item-detail-modal">
                <h3>${item.title}</h3>
                <div class="item-info">
                    <p><strong>类型:</strong> ${item.type === 'lost' ? '寻物' : '招领'}</p>
                    <p><strong>分类:</strong> ${item.category}</p>
                    <p><strong>地点:</strong> ${item.location}</p>
                    <p><strong>状态:</strong> ${item.status === 'resolved' ? '已解决' : 
                                               item.status === 'pending' ? '待审核' : '进行中'}</p>
                    <p><strong>发布时间:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
                    <p><strong>发布者:</strong> ${item.createdBy}</p>
                </div>
                <div class="item-description">
                    <h4>物品描述</h4>
                    <p>${item.description}</p>
                </div>
                <div class="item-contact">
                    <h4>联系方式</h4>
                    <p>${item.contact}</p>
                </div>
                <div class="item-actions">
                    <button onclick="app.closeModal()">关闭</button>
                </div>
            </div>
        `;
        
        this.showModal('物品详情', detailHtml);
    }
    
    // 编辑物品
    editItem(itemId) {
        alert('编辑物品功能开发中...');
    }
    
    // 删除物品
    deleteItem(itemId) {
        if (confirm('确定要删除这个物品吗？')) {
            this.items = this.items.filter(item => item.id !== itemId);
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            alert('物品已删除');
            this.closeModal();
            this.showMyPosts(); // 刷新显示
        }
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
        console.log('publishItem函数被调用');
        
        // 直接获取表单元素的值，因为FormData需要name属性
        const itemType = document.getElementById('itemType');
        const itemTitle = document.getElementById('itemTitle');
        const category = document.getElementById('category');
        const location = document.getElementById('location');
        const description = document.getElementById('description');
        const contact = document.getElementById('contact');
        
        // 检查元素是否存在
        if (!itemType || !itemTitle || !category || !location || !description || !contact) {
            console.error('表单元素未找到:', { itemType, itemTitle, category, location, description, contact });
            alert('表单加载失败，请刷新页面重试');
            return;
        }
        
        // 获取值
        const itemTypeValue = itemType.value;
        const itemTitleValue = itemTitle.value;
        const categoryValue = category.value;
        const locationValue = location.value;
        const descriptionValue = description.value;
        const contactValue = contact.value;
        
        // 验证必填字段
        if (!itemTypeValue || !itemTitleValue || !categoryValue || !locationValue || !descriptionValue || !contactValue) {
            alert('请填写所有必填字段');
            return;
        }
        
        console.log('表单数据:', {
            type: itemTypeValue,
            title: itemTitleValue,
            category: categoryValue,
            location: locationValue,
            description: descriptionValue,
            contact: contactValue
        });
        
        const item = {
            id: Date.now().toString(),
            type: itemTypeValue,
            title: itemTitleValue,
            category: categoryValue,
            description: descriptionValue,
            location: locationValue,
            contact: contactValue,
            timestamp: new Date().toISOString(),
            status: 'pending',
            createdBy: this.currentUser ? this.currentUser.name : '匿名用户'
        };

        this.items.push(item);
        localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
        
        console.log('物品已保存到localStorage，当前物品数:', this.items.length);

        // 显示成功消息
        alert('发布成功！');
        
        // 重置表单
        const publishForm = document.getElementById('publishForm');
        if (publishForm) {
            publishForm.reset();
        }
        
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
        
        // 更新统计和显示
        this.updateAdvancedStats();
        this.displayRecentItems();
        
        console.log('发布完成，更新显示');

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

    // 清除缓存
    clearCache() {
        if (confirm('确定要清除所有缓存数据吗？这将删除所有本地存储的物品和用户信息。')) {
            localStorage.removeItem('lostFoundItems');
            localStorage.removeItem('currentUser');
            
            // 重置应用数据
            this.items = [];
            this.currentUser = null;
            
            // 更新显示
            document.getElementById('userName').textContent = '游客';
            document.getElementById('userContact').textContent = '未设置联系方式';
            document.getElementById('userAvatarDisplay').textContent = '👤';
            document.getElementById('myItems').textContent = '0';
            document.getElementById('myResolved').textContent = '0';
            document.getElementById('myMessages').textContent = '0';
            
            // 更新首页统计
            this.updateAdvancedStats();
            
            alert('缓存已清除！');
        }
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
window.showMyPosts = () => app.showMyPosts();
window.editProfile = () => app.editProfile();
window.showHelp = () => app.showHelp();
window.clearCache = () => app.clearCache();
window.advancedFeatures = typeof advancedFeatures !== 'undefined' ? advancedFeatures : null;

// 确保app在全局可用
window.app = app;