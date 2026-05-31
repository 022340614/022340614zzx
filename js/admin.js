// 管理员后台逻辑
class AdminApp {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || [
            '证件', '书本', '电子产品', '衣物', '钥匙', '其他'
        ];
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.setupNavigation();
    }

    setupEventListeners() {
        // 导航切换
        document.querySelectorAll('.admin-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showPage(target);
            });
        });

        // 搜索功能
        document.getElementById('postSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.filterPosts();
            }
        });
    }

    setupNavigation() {
        // 默认显示仪表板
        this.showPage('dashboard');
    }

    showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.admin-page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(pageId).classList.add('active');

        // 更新导航激活状态
        document.querySelectorAll('.admin-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        // 加载页面数据
        switch(pageId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'posts':
                this.loadPosts();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }

    loadDashboard() {
        const totalPosts = this.items.length;
        const pendingPosts = this.items.filter(item => item.status === 'pending').length;
        const resolvedPosts = this.items.filter(item => item.status === 'resolved').length;
        
        // 今日新增
        const today = new Date().toDateString();
        const todayPosts = this.items.filter(item => 
            new Date(item.createdAt).toDateString() === today
        ).length;

        document.getElementById('totalPosts').textContent = totalPosts;
        document.getElementById('pendingPosts').textContent = pendingPosts;
        document.getElementById('resolvedPosts').textContent = resolvedPosts;
        document.getElementById('todayPosts').textContent = todayPosts;

        // 加载最近活动
        this.loadRecentActivity();
    }

    loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        const recentItems = this.items.slice(0, 10).reverse(); // 最新的10条
        
        container.innerHTML = recentItems.map(item => `
            <div class="activity-item">
                <div>
                    <strong>${item.title || item.itemName || '未命名物品'}</strong>
                    <span class="post-meta">${item.type === 'lost' ? '寻物' : '招领'} · ${item.category}</span>
                </div>
                <div>
                    <span class="status-badge ${item.status === 'pending' ? 'status-pending' : 'status-approved'}">
                        ${item.status === 'pending' ? '待审核' : '已审核'}
                    </span>
                    <small>${new Date(item.createdAt || item.timestamp || Date.now()).toLocaleString()}</small>
                </div>
            </div>
        `).join('');
    }

    loadPosts() {
        const container = document.getElementById('postsList');
        const statusFilter = document.getElementById('postStatusFilter').value;
        const searchTerm = document.getElementById('postSearch').value.toLowerCase();

        let filteredItems = this.items;

        if (statusFilter) {
            filteredItems = filteredItems.filter(item => item.status === statusFilter);
        }

        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                (item.title || item.itemName || '').toLowerCase().includes(searchTerm) ||
                (item.description || '').toLowerCase().includes(searchTerm) ||
                (item.location || '').toLowerCase().includes(searchTerm)
            );
        }

        container.innerHTML = filteredItems.map(item => `
            <div class="post-item">
                <div class="post-info">
                    <h4>${item.title || item.itemName || '未命名物品'}</h4>
                    <div class="post-meta">
                        <span>类型: ${item.type === 'lost' ? '寻物启事' : '招领启事'}</span> | 
                        <span>分类: ${item.category}</span> | 
                        <span>地点: ${item.location}</span> | 
                        <span>时间: ${new Date(item.time || item.timestamp || Date.now()).toLocaleString()}</span>
                    </div>
                    <p>${item.description || '无描述'}</p>
                    <div class="post-meta">
                        发布人: ${item.createdBy || '匿名用户'} | 
                        发布时间: ${new Date(item.createdAt || item.timestamp || Date.now()).toLocaleString()}
                    </div>
                </div>
                <div class="post-actions">
                    <button onclick="adminApp.reviewPost('${item.id}')" class="btn-small btn-approve">审核</button>
                    <button onclick="adminApp.deletePost('${item.id}')" class="btn-small btn-delete">删除</button>
                </div>
            </div>
        `).join('');
    }

    filterPosts() {
        this.loadPosts();
    }

    reviewPost(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item) return;

        const modalContent = document.getElementById('reviewContent');
        modalContent.innerHTML = `
            <h3>审核帖子</h3>
            <div class="post-detail">
                <h4>${item.title || item.itemName || '未命名物品'}</h4>
                <p><strong>类型:</strong> ${item.type === 'lost' ? '寻物启事' : '招领启事'}</p>
                <p><strong>分类:</strong> ${item.category}</p>
                <p><strong>地点:</strong> ${item.location}</p>
                <p><strong>时间:</strong> ${new Date(item.time || item.timestamp || Date.now()).toLocaleString()}</p>
                <p><strong>描述:</strong> ${item.description || '无描述'}</p>
                <p><strong>联系方式:</strong> ${item.contact || '未提供'}</p>
                ${item.image ? `<img src="${item.image}" alt="${item.title || item.itemName}" style="max-width: 100%; margin: 1rem 0;">` : ''}
            </div>
            <div class="review-actions" style="margin-top: 2rem;">
                <button onclick="adminApp.approvePost('${item.id}')" class="btn-primary">通过审核</button>
                <button onclick="adminApp.rejectPost('${item.id}')" class="btn-secondary" style="background: #f44336;">拒绝审核</button>
            </div>
        `;

        document.getElementById('reviewModal').style.display = 'block';
    }

    approvePost(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.status = 'approved';
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            this.closeReviewModal();
            this.loadPosts();
            this.showMessage('帖子已通过审核', 'success');
        }
    }

    rejectPost(itemId) {
        if (confirm('确定要拒绝这个帖子吗？')) {
            this.items = this.items.filter(i => i.id !== itemId);
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            this.closeReviewModal();
            this.loadPosts();
            this.showMessage('帖子已拒绝', 'success');
        }
    }

    deletePost(itemId) {
        if (confirm('确定要删除这个帖子吗？此操作不可撤销。')) {
            this.items = this.items.filter(i => i.id !== itemId);
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            this.loadPosts();
            this.loadDashboard();
            this.showMessage('帖子已删除', 'success');
        }
    }

    closeReviewModal() {
        document.getElementById('reviewModal').style.display = 'none';
    }

    loadCategories() {
        const container = document.getElementById('categoriesList');
        container.innerHTML = this.categories.map(category => `
            <div class="category-item">
                <span>${category}</span>
                <button onclick="adminApp.deleteCategory('${category}')" class="btn-small btn-delete">删除</button>
            </div>
        `).join('');
    }

    addCategory() {
        const input = document.getElementById('newCategory');
        const category = input.value.trim();
        
        if (!category) {
            this.showMessage('请输入分类名称', 'error');
            return;
        }

        if (this.categories.includes(category)) {
            this.showMessage('分类已存在', 'error');
            return;
        }

        this.categories.push(category);
        localStorage.setItem('categories', JSON.stringify(this.categories));
        input.value = '';
        this.loadCategories();
        this.showMessage('分类添加成功', 'success');
    }

    deleteCategory(category) {
        if (confirm(`确定要删除分类"${category}"吗？`)) {
            this.categories = this.categories.filter(c => c !== category);
            localStorage.setItem('categories', JSON.stringify(this.categories));
            this.loadCategories();
            this.showMessage('分类删除成功', 'success');
        }
    }

    loadUsers() {
        // 简单的用户管理，实际应用中应该从服务器获取
        const container = document.getElementById('usersList');
        const uniqueUsers = [...new Set(this.items.map(item => item.createdBy))];
        
        container.innerHTML = uniqueUsers.map(user => `
            <div class="user-item">
                <div>
                    <strong>${user}</strong>
                    <div class="post-meta">
                        发布帖子: ${this.items.filter(item => item.createdBy === user).length} 个
                    </div>
                </div>
                <div class="post-actions">
                    <button onclick="adminApp.banUser('${user}')" class="btn-small btn-delete">封禁</button>
                </div>
            </div>
        `).join('');
    }

    banUser(username) {
        if (confirm(`确定要封禁用户"${username}"吗？`)) {
            // 这里可以实现封禁逻辑
            this.showMessage(`用户"${username}"已被封禁`, 'success');
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                document.body.removeChild(messageDiv);
            }
        }, 3000);
    }

    // 导出数据功能
    exportData() {
        const data = {
            items: this.items,
            categories: this.categories,
            users: this.users,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lost-found-admin-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('数据导出成功', 'success');
    }

    // 导入数据功能
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.items) {
                    this.items = data.items;
                    localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
                }
                
                if (data.categories) {
                    this.categories = data.categories;
                    localStorage.setItem('categories', JSON.stringify(this.categories));
                }
                
                if (data.users) {
                    this.users = data.users;
                    localStorage.setItem('users', JSON.stringify(this.users));
                }
                
                this.showMessage('数据导入成功', 'success');
                this.loadDashboard();
                this.loadPosts();
                this.loadCategories();
                this.loadUsers();
            } catch (error) {
                this.showMessage('数据导入失败: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // 批量操作功能
    batchApprove() {
        const pendingItems = this.items.filter(item => item.status === 'pending');
        if (pendingItems.length === 0) {
            this.showMessage('没有待审核的帖子', 'error');
            return;
        }

        if (confirm(`确定要批量通过 ${pendingItems.length} 个待审核帖子吗？`)) {
            pendingItems.forEach(item => {
                item.status = 'approved';
            });
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            this.loadPosts();
            this.loadDashboard();
            this.showMessage(`已批量通过 ${pendingItems.length} 个帖子`, 'success');
        }
    }

    // 数据统计功能
    generateReport() {
        const report = {
            总帖子数: this.items.length,
            待审核数: this.items.filter(item => item.status === 'pending').length,
            已审核数: this.items.filter(item => item.status === 'approved').length,
            已解决数: this.items.filter(item => item.status === 'resolved').length,
            分类统计: {},
            用户统计: new Set(this.items.map(item => item.createdBy)).size,
            生成时间: new Date().toLocaleString()
        };

        // 分类统计
        this.categories.forEach(category => {
            report.分类统计[category] = this.items.filter(item => item.category === category).length;
        });

        // 生成报告文本
        let reportText = '=== 校园失物招领系统统计报告 ===

';
        reportText += `生成时间: ${report.生成时间}

`;
        reportText += `总帖子数: ${report.总帖子数}
`;
        reportText += `待审核数: ${report.待审核数}
`;
        reportText += `已审核数: ${report.已审核数}
`;
        reportText += `已解决数: ${report.已解决数}
`;
        reportText += `活跃用户数: ${report.用户统计}

`;
        reportText += '=== 分类统计 ===
';
        Object.entries(report.分类统计).forEach(([category, count]) => {
            reportText += `${category}: ${count} 个
`;
        });

        // 下载报告
        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lost-found-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('统计报告生成成功', 'success');
    }

    // 初始化示例数据
    initExampleData() {
        if (confirm('确定要初始化示例数据吗？这将清除现有数据。')) {
            // 使用example-data.js中的示例数据
            if (typeof exampleItems !== 'undefined') {
                this.items = exampleItems;
                this.categories = ['证件', '书本', '电子产品', '衣物', '钥匙', '其他'];
                this.users = [];
                
                localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
                localStorage.setItem('categories', JSON.stringify(this.categories));
                localStorage.setItem('users', JSON.stringify(this.users));
                
                this.showMessage('示例数据初始化成功', 'success');
                this.loadDashboard();
                this.loadPosts();
                this.loadCategories();
                this.loadUsers();
            } else {
                this.showMessage('示例数据文件未找到', 'error');
            }
        }
    }

    // 清除所有数据
    clearAllData() {
        if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
            this.items = [];
            this.categories = ['证件', '书本', '电子产品', '衣物', '钥匙', '其他'];
            this.users = [];
            
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            localStorage.setItem('categories', JSON.stringify(this.categories));
            localStorage.setItem('users', JSON.stringify(this.users));
            
            this.showMessage('所有数据已清除', 'success');
            this.loadDashboard();
            this.loadPosts();
            this.loadCategories();
            this.loadUsers();
        }
    }
}

// 全局管理员应用实例
const adminApp = new AdminApp();

// 全局函数供HTML调用
window.adminApp = adminApp;
window.exportData = () => adminApp.exportData();
window.importData = (event) => adminApp.importData(event);
window.batchApprove = () => adminApp.batchApprove();
window.generateReport = () => adminApp.generateReport();
window.initExampleData = () => adminApp.initExampleData();
window.clearAllData = () => adminApp.clearAllData();