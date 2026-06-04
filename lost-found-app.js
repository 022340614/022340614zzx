// 学院失物招领系统 - 主应用逻辑
// 学号：022340614

class LostAndFoundApp {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.currentSection = 'home';
        this.isLoginMode = true;
        this.notices = this.loadFromStorage('notices') || this.getDefaultNotices();
        this.users = this.loadFromStorage('users') || this.getDefaultUsers();
        this.settings = this.loadFromStorage('settings') || this.getDefaultSettings();
        
        this.init();
    }

    // 初始化应用
    init() {
        this.initNavigation();
        this.initAuthModal();
        this.initAdminPanel();
        this.initPublishForm();
        this.initEventListeners();
        this.loadHomePage();
        this.initThemeToggle();
        
        console.log('失物招领系统已初始化');
    }

    // 从本地存储加载数据
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`lostAndFound_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`加载 ${key} 数据失败:`, error);
            return null;
        }
    }

    // 保存数据到本地存储
    saveToStorage(key, data) {
        try {
            localStorage.setItem(`lostAndFound_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`保存 ${key} 数据失败:`, error);
            return false;
        }
    }

    // 获取默认启事数据
    getDefaultNotices() {
        return [
            {
                id: 1,
                type: 'lost',
                title: '丢失校园卡',
                category: 'cards',
                description: '在图书馆附近丢失校园卡，卡号为2023123456，姓名张三。如有拾到请联系。',
                location: '图书馆二楼',
                time: '2024-06-01 14:30',
                contact: '13800138000',
                image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
                urgent: true,
                status: 'approved',
                author: '张三',
                authorId: 1,
                createdAt: '2024-06-01 15:00',
                comments: [
                    { id: 1, author: '李四', authorId: 2, content: '我在图书馆看到一张卡，请联系我', time: '2024-06-01 16:30' },
                    { id: 2, author: '张三', authorId: 1, content: '非常感谢！已经联系您了', time: '2024-06-01 17:00' }
                ]
            },
            {
                id: 2,
                type: 'found',
                title: '捡到黑色钱包',
                category: 'others',
                description: '在食堂门口捡到一个黑色钱包，内有身份证和银行卡若干。',
                location: '食堂门口',
                time: '2024-06-02 12:00',
                contact: '13900139000',
                image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
                urgent: false,
                status: 'approved',
                author: '王五',
                authorId: 3,
                createdAt: '2024-06-02 12:30',
                comments: []
            },
            {
                id: 3,
                type: 'lost',
                title: '丢失笔记本电脑',
                category: 'electronics',
                description: '在教室丢失一台银色MacBook Pro，型号2023款，内有重要学习资料。',
                location: '教学楼301',
                time: '2024-06-03 09:00',
                contact: '13700137000',
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
                urgent: true,
                status: 'approved',
                author: '赵六',
                authorId: 4,
                createdAt: '2024-06-03 10:00',
                comments: []
            },
            {
                id: 4,
                type: 'found',
                title: '捡到课本',
                category: 'books',
                description: '在操场捡到一本《高等数学》教材，封面写有姓名。',
                location: '操场看台',
                time: '2024-06-04 16:00',
                contact: '13600136000',
                image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
                urgent: false,
                status: 'pending',
                author: '钱七',
                authorId: 5,
                createdAt: '2024-06-04 16:30',
                comments: []
            }
        ];
    }

    // 获取默认用户数据
    getDefaultUsers() {
        return [
            { id: 1, username: '张三', email: 'zhangsan@campus.edu', registered: '2024-01-15', notices: 3, status: 'active' },
            { id: 2, username: '李四', email: 'lisi@campus.edu', registered: '2024-02-20', notices: 2, status: 'active' },
            { id: 3, username: '王五', email: 'wangwu@campus.edu', registered: '2024-03-10', notices: 1, status: 'active' },
            { id: 4, username: '赵六', email: 'zhaoliu@campus.edu', registered: '2024-04-05', notices: 2, status: 'active' },
            { id: 5, username: '钱七', email: 'qianqi@campus.edu', registered: '2024-05-12', notices: 1, status: 'active' }
        ];
    }

    // 获取默认设置
    getDefaultSettings() {
        return {
            siteName: '学院失物招领系统',
            autoApprove: true,
            urgentDays: 7,
            keepDays: 30,
            theme: 'light'
        };
    }

    // 初始化导航
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.showSection(sectionId);
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // 登录/注册按钮
        document.querySelectorAll('a[href="#login"], a[href="#register"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isRegister = btn.getAttribute('href') === '#register';
                this.showAuthModal(isRegister);
            });
        });
    }

    // 显示指定区域
    showSection(sectionId) {
        // 隐藏所有区域
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // 显示目标区域
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionId;
            
            // 加载对应区域的内容
            switch(sectionId) {
                case 'home':
                    this.loadHomePage();
                    break;
                case 'lost':
                    this.loadNoticesList();
                    break;
                case 'publish':
                    // 发布页面已初始化
                    break;
                case 'admin':
                    this.loadAdminPanel();
                    break;
            }
        }
    }

    // 加载首页
    loadHomePage() {
        this.updateStats();
        this.loadLatestNotices();
    }

    // 更新统计数据
    updateStats() {
        const total = this.notices.length;
        const lostCount = this.notices.filter(n => n.type === 'lost').length;
        const foundCount = this.notices.filter(n => n.type === 'found').length;
        const solvedCount = this.notices.filter(n => n.status === 'approved' && n.comments.length > 0).length;

        document.getElementById('total-notices').textContent = total;
        document.getElementById('lost-count').textContent = lostCount;
        document.getElementById('found-count').textContent = foundCount;
        document.getElementById('solved-count').textContent = solvedCount;
    }

    // 加载最新启事
    loadLatestNotices() {
        const container = document.getElementById('latest-notices');
        if (!container) return;

        // 按时间排序，取前6个
        const latestNotices = [...this.notices]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);

        container.innerHTML = latestNotices.map(notice => this.createNoticeCard(notice)).join('');
    }

    // 创建启事卡片
    createNoticeCard(notice) {
        const categoryNames = {
            'electronics': '电子产品',
            'books': '书籍资料',
            'clothing': '衣物饰品',
            'cards': '证件卡片',
            'others': '其他物品'
        };

        return `
            <div class="notice-card" onclick="app.showNoticeDetail(${notice.id})">
                <img src="${notice.image}" alt="${notice.title}" class="notice-image" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(notice.title)}'">
                <div class="notice-content">
                    <div class="notice-header">
                        <div>
                            <h3 class="notice-title">${notice.urgent ? '🔴 ' : ''}${notice.title}</h3>
                            <div class="notice-meta">
                                <span class="notice-meta-item">
                                    <i class="fas fa-map-marker-alt"></i> ${notice.location}
                                </span>
                                <span class="notice-meta-item">
                                    <i class="fas fa-clock"></i> ${this.formatTime(notice.time)}
                                </span>
                                <span class="notice-meta-item">
                                    <i class="fas fa-tag"></i> ${categoryNames[notice.category] || notice.category}
                                </span>
                            </div>
                        </div>
                        <span class="notice-type ${notice.type}">
                            ${notice.type === 'lost' ? '失物' : '招领'}
                        </span>
                    </div>
                    <p class="notice-description">${notice.description.substring(0, 100)}...</p>
                    <div class="notice-footer">
                        <span class="notice-contact">
                            <i class="fas fa-user"></i> ${notice.author}
                        </span>
                        <div class="d-flex gap-1">
                            ${notice.status === 'pending' ? 
                                '<span class="status-badge status-pending">待审核</span>' : 
                                notice.status === 'approved' ? 
                                '<span class="status-badge status-approved">已发布</span>' : 
                                '<span class="status-badge status-rejected">已拒绝</span>'
                            }
                            <span class="notice-meta-item">
                                <i class="fas fa-comment"></i> ${notice.comments.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 加载启事列表
    loadNoticesList() {
        const container = document.getElementById('notices-list');
        if (!container) return;

        // 获取筛选条件
        const category = document.getElementById('category-filter')?.value || '';
        const type = document.getElementById('type-filter')?.value || '';
        const timeFilter = document.getElementById('time-filter')?.value || '';

        // 筛选启事
        let filteredNotices = this.notices.filter(notice => {
            if (category && notice.category !== category) return false;
            if (type && notice.type !== type) return false;
            if (timeFilter) {
                const noticeDate = new Date(notice.createdAt);
                const now = new Date();
                const diffTime = now - noticeDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                
                switch(timeFilter) {
                    case 'today':
                        return diffDays < 1;
                    case 'week':
                        return diffDays < 7;
                    case 'month':
                        return diffDays < 30;
                }
            }
            return notice.status === 'approved'; // 只显示已审核通过的
        });

        // 按紧急程度和时间排序
        filteredNotices.sort((a, b) => {
            if (a.urgent && !b.urgent) return -1;
            if (!a.urgent && b.urgent) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (filteredNotices.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <i class="fas fa-inbox"></i>
                    <h3>暂无启事</h3>
                    <p>当前没有找到符合条件的启事</p>
                    <button class="btn btn-primary" onclick="app.showSection('publish')">
                        <i class="fas fa-plus"></i> 发布第一个启事
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = filteredNotices.map(notice => this.createNoticeCard(notice)).join('');
        }
    }

    // 显示启事详情
    showNoticeDetail(id) {
        const notice = this.notices.find(n => n.id === id);
        if (!notice) return;

        this.showSection('detail');
        
        const container = document.getElementById('detail-content');
        const categoryNames = {
            'electronics': '电子产品',
            'books': '书籍资料',
            'clothing': '衣物饰品',
            'cards': '证件卡片',
            'others': '其他物品'
        };

        container.innerHTML = `
            <div class="mb-4">
                <img src="${notice.image}" alt="${notice.title}" class="detail-image" onerror="this.src='https://via.placeholder.com/800x400/667eea/ffffff?text=${encodeURIComponent(notice.title)}'">
            </div>
            
            <div class="detail-info">
                <div class="info-item">
                    <div class="info-label">物品名称</div>
                    <div class="info-value">${notice.title}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">启事类型</div>
                    <div class="info-value">
                        <span class="notice-type ${notice.type}">
                            ${notice.type === 'lost' ? '失物启事' : '招领启事'}
                        </span>
                        ${notice.urgent ? '<span class="status-badge status-urgent ml-2">紧急</span>' : ''}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">物品分类</div>
                    <div class="info-value">${categoryNames[notice.category] || notice.category}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${notice.type === 'lost' ? '丢失时间' : '捡拾时间'}</div>
                    <div class="info-value">${this.formatDateTime(notice.time)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">${notice.type === 'lost' ? '丢失地点' : '捡拾地点'}</div>
                    <div class="info-value">${notice.location}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">联系方式</div>
                    <div class="info-value">${notice.contact}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">发布者</div>
                    <div class="info-value">${notice.author}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">发布时间</div>
                    <div class="info-value">${this.formatDateTime(notice.createdAt)}</div>
                </div>
            </div>

            <div class="mb-4">
                <h3 class="mb-2">详细描述</h3>
                <p>${notice.description}</p>
            </div>

            <div class="comments-section">
                <h3 class="mb-3">留言沟通 (${notice.comments.length})</h3>
                
                <div class="comment-form mb-4">
                    <textarea class="form-control form-textarea" placeholder="请输入留言内容..." id="comment-input"></textarea>
                    <button class="btn btn-primary mt-2" onclick="app.addComment(${notice.id})">
                        <i class="fas fa-paper-plane"></i> 发表留言
                    </button>
                </div>

                <div class="comment-list" id="comments-list-${notice.id}">
                    ${notice.comments.map(comment => `
                        <div class="comment-item">
                            <div class="comment-header">
                                <div class="comment-author">
                                    <div class="comment-avatar">${comment.author.charAt(0)}</div>
                                    <div>
                                        <strong>${comment.author}</strong>
                                        <div class="comment-time">${this.formatDateTime(comment.time)}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="comment-content">${comment.content}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 添加留言
    addComment(noticeId) {
        const input = document.getElementById('comment-input');
        const content = input.value.trim();
        
        if (!content) {
            this.showAlert('请输入留言内容', 'warning');
            return;
        }

        if (!this.currentUser) {
            this.showAuthModal(false);
            return;
        }

        const notice = this.notices.find(n => n.id === noticeId);
        if (notice) {
            const newComment = {
                id: notice.comments.length + 1,
                author: this.currentUser.username,
                authorId: this.currentUser.id,
                content: content,
                time: new Date().toISOString()
            };
            
            notice.comments.push(newComment);
            this.saveToStorage('notices', this.notices);
            input.value = '';
            
            // 重新加载评论列表
            const commentsList = document.getElementById(`comments-list-${noticeId}`);
            if (commentsList) {
                commentsList.innerHTML += `
                    <div class="comment-item">
                        <div class="comment-header">
                            <div class="comment-author">
                                <div class="comment-avatar">${newComment.author.charAt(0)}</div>
                                <div>
                                    <strong>${newComment.author}</strong>
                                    <div class="comment-time">${this.formatDateTime(newComment.time)}</div>
                                </div>
                            </div>
                        </div>
                        <div class="comment-content">${newComment.content}</div>
                    </div>
                `;
            }
            
            this.showAlert('留言发表成功', 'success');
        }
    }

    // 初始化认证模态框
    initAuthModal() {
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('auth-title');
        const submitBtn = document.getElementById('auth-submit');
        const switchBtn = document.getElementById('auth-switch');
        const emailGroup = document.getElementById('auth-email-group');
        const confirmGroup = document.getElementById('auth-confirm-group');
        const form = document.getElementById('auth-form');

        switchBtn.addEventListener('click', () => {
            this.isLoginMode = !this.isLoginMode;
            
            if (this.isLoginMode) {
                title.textContent = '用户登录';
                submitBtn.textContent = '登录';
                switchBtn.textContent = '切换到注册';
                emailGroup.classList.add('hidden');
                confirmGroup.classList.add('hidden');
            } else {
                title.textContent = '用户注册';
                submitBtn.textContent = '注册';
                switchBtn.textContent = '切换到登录';
                emailGroup.classList.remove('hidden');
                confirmGroup.classList.remove('hidden');
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('auth-username').value.trim();
            const password = document.getElementById('auth-password').value;
            
            if (!username || !password) {
                this.showAlert('请输入用户名和密码', 'error');
                return;
            }

            if (this.isLoginMode) {
                // 模拟登录
                const user = this.users.find(u => u.username === username);
                if (user) {
                    this.currentUser = {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    };
                    
                    this.updateUserInfo();
                    this.closeModal();
                    this.showAlert('登录成功！', 'success');
                } else {
                    this.showAlert('用户名或密码错误', 'error');
                }
            } else {
                const email = document.getElementById('auth-email').value.trim();
                const confirm = document.getElementById('auth-confirm').value;
                
                if (!email) {
                    this.showAlert('请输入邮箱', 'error');
                    return;
                }
                
                if (password !== confirm) {
                    this.showAlert('两次输入的密码不一致', 'error');
                    return;
                }
                
                if (this.users.some(u => u.username === username)) {
                    this.showAlert('用户名已存在', 'error');
                    return;
                }
                
                // 创建新用户
                const newUser = {
                    id: this.users.length + 1,
                    username: username,
                    email: email,
                    registered: new Date().toISOString().split('T')[0],
                    notices: 0,
                    status: 'active'
                };
                
                this.users.push(newUser);
                this.saveToStorage('users', this.users);
                
                this.currentUser = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                };
                
                this.updateUserInfo();
                this.closeModal();
                this.showAlert('注册成功！', 'success');
            }
        });
    }

    // 显示认证模态框
    showAuthModal(isRegister = false) {
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('auth-title');
        const submitBtn = document.getElementById('auth-submit');
        const switchBtn = document.getElementById('auth-switch');
        const emailGroup = document.getElementById('auth-email-group');
        const confirmGroup = document.getElementById('auth-confirm-group');
        const form = document.getElementById('auth-form');

        this.isLoginMode = !isRegister;
        
        if (this.isLoginMode) {
            title.textContent = '用户登录';
            submitBtn.textContent = '登录';
            switchBtn.textContent = '切换到注册';
            emailGroup.classList.add('hidden');
            confirmGroup.classList.add('hidden');
        } else {
            title.textContent = '用户注册';
            submitBtn.textContent = '注册';
            switchBtn.textContent = '切换到登录';
            emailGroup.classList.remove('hidden');
            confirmGroup.classList.remove('hidden');
        }
        
        form.reset();
        modal.classList.add('active');
    }

    // 初始化发布表单
    initPublishForm() {
        const form = document.getElementById('publish-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!this.currentUser) {
                this.showAuthModal(false);
                return;
            }
            
            const type = document.querySelector('input[name="notice-type"]:checked').value;
            const name = document.getElementById('item-name').value.trim();
            const category = document.getElementById('item-category').value;
            const time = document.getElementById('item-time').value;
            const location = document.getElementById('item-location').value.trim();
            const description = document.getElementById('item-description').value.trim();
            const contact = document.getElementById('contact-info').value.trim();
            const urgent = document.getElementById('urgent').checked;
            const imageInput = document.getElementById('item-image');
            
            // 验证必填字段
            if (!name || !category || !time || !location || !description || !contact) {
                this.showAlert('请填写所有必填字段', 'error');
                return;
            }
            
            // 创建新启事
            const newNotice = {
                id: this.notices.length > 0 ? Math.max(...this.notices.map(n => n.id)) + 1 : 1,
                type: type,
                title: name,
                category: category,
                description: description,
                location: location,
                time: time.replace('T', ' '),
                contact: contact,
                image: imageInput.files.length > 0 ? 
                    URL.createObjectURL(imageInput.files[0]) : 
                    `https://images.unsplash.com/photo-${type === 'lost' ? '1579621970563' : '1549924231'}-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80`,
                urgent: urgent,
                status: this.settings.autoApprove ? 'approved' : 'pending',
                author: this.currentUser.username,
                authorId: this.currentUser.id,
                createdAt: new Date().toISOString(),
                comments: []
            };
            
            this.notices.unshift(newNotice);
            this.saveToStorage('notices', this.notices);
            form.reset();
            
            // 更新用户发布数
            const user = this.users.find(u => u.id === this.currentUser.id);
            if (user) {
                user.notices++;
                this.saveToStorage('users', this.users);
            }
            
            this.showAlert(`启事发布${this.settings.autoApprove ? '成功' : '成功！等待管理员审核。'}`, 'success');
            this.showSection('home');
            this.loadHomePage();
        });
    }

    // 初始化管理员面板
    initAdminPanel() {
        // 管理员登录按钮
        document.getElementById('admin-login-btn').addEventListener('click', () => {
            document.getElementById('admin-auth-modal').classList.add('active');
        });
        
        // 管理员登录表单
        document.getElementById('admin-auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('admin-username').value.trim();
            const password = document.getElementById('admin-password').value;
            
            // 模拟管理员登录
            if (username === 'admin' && password === 'admin123') {
                this.isAdmin = true;
                document.getElementById('admin-status').textContent = `管理员：${username}`;
                document.getElementById('admin-panel').classList.remove('hidden');
                document.getElementById('admin-auth-modal').classList.remove('active');
                this.loadAdminDashboard();
                this.showAlert('管理员登录成功', 'success');
            } else {
                this.showAlert('管理员账号或密码错误', 'error');
            }
        });
        
        // 管理员菜单切换
        document.querySelectorAll('.admin-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('data-tab');
                
                // 更新活动菜单项
                document.querySelectorAll('.admin-menu-item').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
                
                // 显示对应标签页
                document.querySelectorAll('.admin-tab').forEach(t => {
                    t.classList.add('hidden');
                });
                document.getElementById(`${tab}-tab`).classList.remove('hidden');
                
                // 加载对应数据
                switch(tab) {
                    case 'dashboard':
                        this.loadAdminDashboard();
                        break;
                    case 'pending':
                        this.loadPendingNotices();
                        break;
                    case 'all-notices':
                        this.loadAllNotices();
                        break;
                    case 'users':
                        this.loadUsersList();
                        break;
                }
            });
        });
        
        // 管理员设置表单
        document.getElementById('admin-settings').addEventListener('submit', (e) => {
            e.preventDefault();
            
            this.settings.siteName = document.querySelector('#admin-settings input[type="text"]').value;
            this.settings.autoApprove = document.querySelector('#admin-settings input[type="checkbox"]').checked;
            this.settings.urgentDays = parseInt(document.querySelector('#admin-settings input[type="number"]:nth-of-type(1)').value);
            this.settings.keepDays = parseInt(document.querySelector('#admin-settings input[type="number"]:nth-of-type(2)').value);
            
            this.saveToStorage('settings', this.settings);
            this.showAlert('设置已保存', 'success');
        });
    }

    // 加载管理员仪表板
    loadAdminDashboard() {
        if (!this.isAdmin) return;
        
        document.getElementById('admin-total').textContent = this.notices.length;
        document.getElementById('admin-pending').textContent = this.notices.filter(n => n.status === 'pending').length;
        document.getElementById('admin-users').textContent = this.users.length;
        document.getElementById('admin-solved').textContent = this.notices.filter(n => n.status === 'approved' && n.comments.length > 0).length;
        
        // 加载最近活动
        const activities = [
            { time: '刚刚', user: '张三', action: '发布了启事', detail: '丢失校园卡' },
            { time: '10分钟前', user: '李四', action: '发表了留言', detail: '在"丢失校园卡"下' },
            { time: '1小时前', user: '管理员', action: '审核通过', detail: '捡到黑色钱包' },
            { time: '2小时前', user: '王五', action: '注册账号', detail: '新用户注册' },
            { time: '3小时前', user: '赵六', action: '发布了启事', detail: '丢失笔记本电脑' }
        ];
        
        const container = document.getElementById('recent-activities');
        container.innerHTML = activities.map(activity => `
            <tr>
                <td>${activity.time}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td>${activity.detail}</td>
            </tr>
        `).join('');
    }

    // 加载待审核启事
    loadPendingNotices() {
        if (!this.isAdmin) return;
        
        const pendingNotices = this.notices.filter(n => n.status === 'pending');
        const container = document.getElementById('pending-list');
        
        if (pendingNotices.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center" style="padding: 2rem; color: var(--text-light);">
                        <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        暂无待审核启事
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = pendingNotices.map(notice => `
                <tr>
                    <td>${notice.id}</td>
                    <td>${notice.title}</td>
                    <td><span class="notice-type ${notice.type}">${notice.type === 'lost' ? '失物' : '招领'}</span></td>
                    <td>${notice.author}</td>
                    <td>${this.formatDateTime(notice.createdAt)}</td>
                    <td class="table-actions">
                        <button class="btn btn-success btn-small" onclick="app.approveNotice(${notice.id})">
                            <i class="fas fa-check"></i> 通过
                        </button>
                        <button class="btn btn-danger btn-small" onclick="app.rejectNotice(${notice.id})">
                            <i class="fas fa-times"></i> 拒绝
                        </button>
                        <button class="btn btn-outline btn-small" onclick="app.showNoticeDetail(${notice.id})">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // 加载所有启事
    loadAllNotices() {
        if (!this.isAdmin) return;
        
        const container = document.getElementById('all-notices-list');
        
        if (this.notices.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-light);">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        暂无启事
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = this.notices.map(notice => `
                <tr>
                    <td>${notice.id}</td>
                    <td>${notice.title}</td>
                    <td><span class="notice-type ${notice.type}">${notice.type === 'lost' ? '失物' : '招领'}</span></td>
                    <td>
                        <span class="status-badge ${notice.status === 'pending' ? 'status-pending' : notice.status === 'approved' ? 'status-approved' : 'status-rejected'}">
                            ${notice.status === 'pending' ? '待审核' : notice.status === 'approved' ? '已发布' : '已拒绝'}
                        </span>
                        ${notice.urgent ? '<span class="status-badge status-urgent ml-1">紧急</span>' : ''}
                    </td>
                    <td>${notice.author}</td>
                    <td>${this.formatDateTime(notice.createdAt)}</td>
                    <td class="table-actions">
                        ${notice.status === 'pending' ? `
                            <button class="btn btn-success btn-small" onclick="app.approveNotice(${notice.id})">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-danger btn-small" onclick="app.rejectNotice(${notice.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-outline btn-small" onclick="app.showNoticeDetail(${notice.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline btn-small" onclick="app.toggleUrgent(${notice.id})">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn btn-outline btn-small" onclick="app.deleteNotice(${notice.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // 加载用户列表
    loadUsersList() {
        if (!this.isAdmin) return;
        
        const container = document.getElementById('users-list');
        
        if (this.users.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-light);">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                        暂无用户
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = this.users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.registered}</td>
                    <td>${user.notices}</td>
                    <td>
                        <span class="status-badge status-approved">${user.status}</span>
                    </td>
                    <td class="table-actions">
                        <button class="btn btn-outline btn-small" onclick="app.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline btn-small" onclick="app.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // 管理员操作函数
    approveNotice(id) {
        const notice = this.notices.find(n => n.id === id);
        if (notice) {
            notice.status = 'approved';
            this.saveToStorage('notices', this.notices);
            this.showAlert('启事已审核通过', 'success');
            this.loadPendingNotices();
            this.loadAllNotices();
            this.loadAdminDashboard();
            this.loadHomePage();
        }
    }

    rejectNotice(id) {
        const notice = this.notices.find(n => n.id === id);
        if (notice) {
            notice.status = 'rejected';
            this.saveToStorage('notices', this.notices);
            this.showAlert('启事已拒绝', 'success');
            this.loadPendingNotices();
            this.loadAllNotices();
            this.loadAdminDashboard();
        }
    }

    toggleUrgent(id) {
        const notice = this.notices.find(n => n.id === id);
        if (notice) {
            notice.urgent = !notice.urgent;
            this.saveToStorage('notices', this.notices);
            this.showAlert(`启事已${notice.urgent ? '设为紧急' : '取消紧急'}`, 'success');
            this.loadAllNotices();
        }
    }

    deleteNotice(id) {
        if (confirm('确定要删除这个启事吗？')) {
            const index = this.notices.findIndex(n => n.id === id);
            if (index !== -1) {
                this.notices.splice(index, 1);
                this.saveToStorage('notices', this.notices);
                this.showAlert('启事已删除', 'success');
                this.loadAllNotices();
                this.loadAdminDashboard();
                this.loadHomePage();
            }
        }
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const newUsername = prompt('请输入新的用户名：', user.username);
            if (newUsername && newUsername.trim()) {
                user.username = newUsername.trim();
                this.saveToStorage('users', this.users);
                this.showAlert('用户信息已更新', 'success');
                this.loadUsersList();
            }
        }
    }

    deleteUser(id) {
        if (id === 1) {
            this.showAlert('不能删除管理员账号', 'error');
            return;
        }
        
        if (confirm('确定要删除这个用户吗？')) {
            const index = this.users.findIndex(u => u.id === id);
            if (index !== -1) {
                this.users.splice(index, 1);
                this.saveToStorage('users', this.users);
                this.showAlert('用户已删除', 'success');
                this.loadUsersList();
                this.loadAdminDashboard();
            }
        }
    }

    // 加载管理员面板
    loadAdminPanel() {
        if (this.isAdmin) {
            document.getElementById('admin-panel').classList.remove('hidden');
            this.loadAdminDashboard();
        }
    }

    // 更新用户信息显示
    updateUserInfo() {
        const userInfo = document.querySelector('.user-info');
        if (this.currentUser) {
            userInfo.innerHTML = `
                <div class="user-avatar">${this.currentUser.username.charAt(0)}</div>
                <div>
                    <div style="font-weight: 500;">${this.currentUser.username}</div>
                    <div style="font-size: 0.875rem; color: var(--text-light);">已登录</div>
                </div>
            `;
        } else {
            userInfo.innerHTML = `
                <div class="user-avatar">访</div>
                <div>
                    <div class="d-flex align-items-center gap-1">
                        <a href="#login" class="btn btn-outline btn-small">登录</a>
                        <a href="#register" class="btn btn-primary btn-small">注册</a>
                    </div>
                </div>
            `;
            
            // 重新绑定登录/注册按钮事件
            document.querySelectorAll('a[href="#login"], a[href="#register"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isRegister = btn.getAttribute('href') === '#register';
                    this.showAuthModal(isRegister);
                });
            });
        }
    }

    // 初始化事件监听器
    initEventListeners() {
        // 筛选器事件
        document.getElementById('category-filter')?.addEventListener('change', () => this.loadNoticesList());
        document.getElementById('type-filter')?.addEventListener('change', () => this.loadNoticesList());
        document.getElementById('time-filter')?.addEventListener('change', () => this.loadNoticesList());

        // 搜索功能
        const searchBtn = document.querySelector('.search-bar .btn-primary');
        const searchInput = document.querySelector('.search-bar .search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.performSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // 模态框关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // 返回按钮
        document.querySelector('button[onclick="history.back()"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('home');
        });
    }

    // 执行搜索
    performSearch() {
        const searchInput = document.querySelector('.search-bar .search-input');
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            const filtered = this.notices.filter(notice => 
                notice.title.toLowerCase().includes(searchTerm) ||
                notice.description.toLowerCase().includes(searchTerm) ||
                notice.location.toLowerCase().includes(searchTerm) ||
                notice.author.toLowerCase().includes(searchTerm)
            );
            
            // 显示搜索结果
            const container = document.getElementById('notices-list') || document.getElementById('latest-notices');
            if (container) {
                if (filtered.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state" style="grid-column: 1/-1;">
                            <i class="fas fa-search"></i>
                            <h3>未找到相关启事</h3>
                            <p>没有找到与"${searchTerm}"相关的启事</p>
                            <button class="btn btn-primary" onclick="app.showSection('publish')">
                                <i class="fas fa-plus"></i> 发布新启事
                            </button>
                        </div>
                    `;
                } else {
                    container.innerHTML = filtered.map(notice => this.createNoticeCard(notice)).join('');
                }
            }
        } else {
            this.loadNoticesList();
        }
    }

    // 初始化主题切换
    initThemeToggle() {
        // 检查保存的主题
        const savedTheme = localStorage.getItem('lostAndFound_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // 创建主题切换按钮
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = savedTheme === 'dark' ? '切换到浅色主题' : '切换到深色主题';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = newTheme === 'dark' ? '切换到浅色主题' : '切换到深色主题';
            
            localStorage.setItem('lostAndFound_theme', newTheme);
        });
        
        document.body.appendChild(themeToggle);
    }

    // 显示提示消息
    showAlert(message, type = 'info') {
        // 移除现有的提示
        const existingAlert = document.querySelector('.alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // 创建新提示
        const alert = document.createElement('div');
        alert.className = `alert-message ${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
            color: white;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        alert.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(alert);
        
        // 3秒后自动移除
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
        
        // 添加动画样式
        if (!document.querySelector('#alert-styles')) {
            const style = document.createElement('style');
            style.id = 'alert-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 关闭模态框
    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // 工具函数
    formatTime(timeStr) {
        const date = new Date(timeStr);
        const now = new Date();
        const diff = now - date;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (diffMinutes < 60) {
            return `${diffMinutes}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    formatDateTime(dateTimeStr) {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('zh-CN');
    }
}

// 创建全局应用实例
const app = new LostAndFoundApp();

// 导出全局函数供HTML调用
window.app = app;
window.showNoticeDetail = (id) => app.showNoticeDetail(id);
window.addComment = (id) => app.addComment(id);
window.approveNotice = (id) => app.approveNotice(id);
window.rejectNotice = (id) => app.rejectNotice(id);
window.toggleUrgent = (id) => app.toggleUrgent(id);
window.deleteNotice = (id) => app.deleteNotice(id);
window.editUser = (id) => app.editUser(id);
window.deleteUser = (id) => app.deleteUser(id);
window.closeModal = () => app.closeModal();