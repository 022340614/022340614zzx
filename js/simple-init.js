// 简单初始化脚本 - 确保基本功能正常工作
(function() {
    console.log('简单初始化脚本开始...');
    
    // 全局错误处理
    window.onerror = function(message, source, lineno, colno, error) {
        console.error('全局错误:', message, 'at', source, ':', lineno, ':', colno);
        return true; // 阻止默认错误处理
    };
    
    // 确保基本功能可用的全局函数
    window.simpleApp = {
        // 页面切换
        showSection: function(sectionId) {
            console.log('切换到页面:', sectionId);
            try {
                // 隐藏所有section
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // 显示目标section
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // 更新导航按钮状态
                document.querySelectorAll('.nav-actions button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                const activeButton = document.querySelector(`.nav-actions button[onclick*="${sectionId}"]`);
                if (activeButton) {
                    activeButton.classList.add('active');
                }
            } catch (error) {
                console.error('切换页面错误:', error);
            }
        },
        
        // 校园地图
        showCampusMap: function() {
            console.log('显示校园地图');
            try {
                if (typeof hbmzuMap !== 'undefined' && hbmzuMap.showMap) {
                    hbmzuMap.showMap();
                } else {
                    alert('校园地图功能加载中...');
                }
            } catch (error) {
                console.error('显示校园地图错误:', error);
                alert('校园地图功能暂时不可用');
            }
        },
        
        // 搜索功能
        searchItems: function() {
            const searchInput = document.getElementById('searchInput');
            const keyword = searchInput ? searchInput.value.trim() : '';
            
            console.log('搜索关键词:', keyword);
            
            if (keyword) {
                alert('搜索: ' + keyword + '\n（搜索功能加载中...）');
            } else {
                alert('请输入搜索关键词');
            }
        },
        
        // 聊天功能
        toggleChat: function() {
            const chatWidget = document.getElementById('chatWidget');
            if (chatWidget) {
                chatWidget.style.display = chatWidget.style.display === 'none' ? 'block' : 'none';
            }
        },
        
        sendChatMessage: function() {
            const chatInput = document.getElementById('chatInput');
            const message = chatInput ? chatInput.value.trim() : '';
            
            if (!message) {
                alert('请输入消息内容');
                return;
            }
            
            // 简单聊天功能
            const messagesDiv = document.getElementById('chatMessages');
            if (messagesDiv) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message self';
                messageDiv.innerHTML = `
                    <div class="message-sender">我</div>
                    <div class="message-content">${message}</div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                `;
                messagesDiv.appendChild(messageDiv);
                
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
                    
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'chat-message other';
                    replyDiv.innerHTML = `
                        <div class="message-sender">客服</div>
                        <div class="message-content">${randomResponse}</div>
                        <div class="message-time">${new Date().toLocaleTimeString()}</div>
                    `;
                    messagesDiv.appendChild(replyDiv);
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 1000);
            }
            
            if (chatInput) {
                chatInput.value = '';
            }
        },
        
        // 发布功能
        publishItem: function() {
            console.log('简单发布功能');
            
            // 获取表单数据
            const itemType = document.getElementById('itemType');
            const itemTitle = document.getElementById('itemTitle');
            const category = document.getElementById('category');
            const location = document.getElementById('location');
            const description = document.getElementById('description');
            const contact = document.getElementById('contact');
            
            // 检查元素
            if (!itemType || !itemTitle || !category || !location || !description || !contact) {
                alert('表单加载失败，请刷新页面重试');
                return;
            }
            
            // 验证数据
            if (!itemType.value || !itemTitle.value || !category.value || !location.value || !description.value || !contact.value) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 创建物品
            const item = {
                id: Date.now().toString(),
                type: itemType.value,
                title: itemTitle.value,
                category: category.value,
                description: description.value,
                location: location.value,
                contact: contact.value,
                timestamp: new Date().toISOString(),
                status: 'pending',
                createdBy: '匿名用户'
            };
            
            // 保存到localStorage
            let items = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
            items.push(item);
            localStorage.setItem('lostFoundItems', JSON.stringify(items));
            
            // 显示成功消息
            alert('发布成功！物品已保存。');
            
            // 重置表单
            const publishForm = document.getElementById('publishForm');
            if (publishForm) {
                publishForm.reset();
            }
            
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) {
                imagePreview.innerHTML = '';
            }
            
            // 更新统计
            this.updateStatistics();
        },
        
        // 更新统计
        updateStatistics: function() {
            try {
                const items = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
                
                // 更新首页统计
                const totalItemsEl = document.getElementById('totalItems');
                const foundItemsEl = document.getElementById('foundItems');
                const activeUsersEl = document.getElementById('activeUsers');
                
                if (totalItemsEl) totalItemsEl.textContent = items.length;
                if (foundItemsEl) foundItemsEl.textContent = items.filter(item => item.status === 'found').length;
                if (activeUsersEl) activeUsersEl.textContent = new Set(items.map(item => item.createdBy)).size;
            } catch (error) {
                console.error('更新统计错误:', error);
            }
        },
        
        // 初始化所有按钮
        initButtons: function() {
            console.log('初始化按钮...');
            
            // 导航按钮
            document.querySelectorAll('.nav-actions button').forEach(button => {
                this.fixButton(button);
                
                // 根据按钮文本设置点击事件
                const text = button.textContent.trim();
                if (text.includes('校园地图') || text.includes('🗺️')) {
                    button.onclick = () => this.showCampusMap();
                } else if (text.includes('首页') || text.includes('🏠')) {
                    button.onclick = () => this.showSection('home');
                } else if (text.includes('发布') || text.includes('📝')) {
                    button.onclick = () => this.showSection('publish');
                } else if (text.includes('搜索') || text.includes('🔍')) {
                    button.onclick = () => this.showSection('search');
                } else if (text.includes('我的') || text.includes('👤')) {
                    button.onclick = () => this.showSection('profile');
                } else if (text.includes('管理') || text.includes('⚙️')) {
                    button.onclick = () => this.showSection('admin');
                }
            });
            
            // 热点区域卡片
            document.querySelectorAll('.hotspot-card').forEach(card => {
                card.style.cursor = 'pointer';
                const location = card.querySelector('h4')?.textContent;
                if (location) {
                    card.onclick = () => {
                        const locationInput = document.getElementById('location');
                        if (locationInput) {
                            locationInput.value = `湖北民族大学 ${location}`;
                        }
                        alert(`已选择地点: ${location}`);
                    };
                }
            });
            
            // 建议项
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.style.cursor = 'pointer';
                const location = item.textContent.trim();
                item.onclick = () => {
                    const locationInput = document.getElementById('location');
                    if (locationInput) {
                        locationInput.value = `湖北民族大学 ${location}`;
                    }
                };
            });
            
            // 表单按钮
            document.querySelectorAll('.btn-primary, .btn-secondary, .search-input-group button').forEach(button => {
                this.fixButton(button);
            });
            
            // 发布表单
            const publishForm = document.getElementById('publishForm');
            if (publishForm) {
                publishForm.onsubmit = (e) => {
                    e.preventDefault();
                    this.publishItem();
                };
            }
            
            // 搜索按钮
            const searchButton = document.querySelector('.search-input-group button');
            if (searchButton) {
                searchButton.onclick = () => this.searchItems();
            }
            
            // 聊天按钮
            const chatToggle = document.querySelector('.chat-toggle');
            if (chatToggle) {
                chatToggle.onclick = () => this.toggleChat();
            }
            
            const chatSendBtn = document.querySelector('#chatWidget .chat-input button');
            if (chatSendBtn) {
                chatSendBtn.onclick = () => this.sendChatMessage();
            }
            
            console.log('按钮初始化完成');
        },
        
        // 修复按钮
        fixButton: function(button) {
            if (!button) return;
            
            button.style.pointerEvents = 'auto';
            button.style.cursor = 'pointer';
            button.disabled = false;
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.display = '';
        },
        
        // 初始化应用
        init: function() {
            console.log('简单应用初始化开始...');
            
            try {
                // 1. 初始化按钮
                this.initButtons();
                
                // 2. 显示首页
                this.showSection('home');
                
                // 3. 更新统计
                this.updateStatistics();
                
                // 4. 确保聊天窗口初始隐藏
                const chatWidget = document.getElementById('chatWidget');
                if (chatWidget) {
                    chatWidget.style.display = 'none';
                }
                
                // 5. 绑定图片预览
                const imageInput = document.getElementById('itemImage');
                if (imageInput) {
                    imageInput.onchange = function(e) {
                        const preview = document.getElementById('imagePreview');
                        const file = e.target.files[0];
                        if (file && preview) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                preview.innerHTML = `<img src="${e.target.result}" alt="预览图片" style="max-width: 200px; border-radius: 5px;">`;
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                }
                
                console.log('简单应用初始化完成');
                
                // 尝试加载完整应用
                setTimeout(() => {
                    this.tryLoadFullApp();
                }, 1000);
                
            } catch (error) {
                console.error('简单应用初始化错误:', error);
                alert('应用初始化遇到问题，但基本功能已恢复。');
            }
        },
        
        // 尝试加载完整应用
        tryLoadFullApp: function() {
            console.log('尝试加载完整应用...');
            
            // 检查app对象
            if (typeof app !== 'undefined') {
                console.log('完整app对象已存在');
                return;
            }
            
            // 检查advancedFeatures对象
            if (typeof advancedFeatures !== 'undefined') {
                console.log('高级功能已加载');
            }
            
            // 检查hbmzuMap对象
            if (typeof hbmzuMap !== 'undefined') {
                console.log('校园地图已加载');
            }
        }
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.simpleApp.init();
        });
    } else {
        window.simpleApp.init();
    }
    
    // 导出到全局
    window.showSection = window.simpleApp.showSection;
    window.showCampusMap = window.simpleApp.showCampusMap;
    window.searchItems = window.simpleApp.searchItems;
    window.toggleChat = window.simpleApp.toggleChat;
    window.sendChatMessage = window.simpleApp.sendChatMessage;
    
    console.log('简单初始化脚本加载完成');
})();