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
                    <strong>${item.itemName}</strong>
                    <span class="post-meta">${item.type === 'lost' ? '寻物' : '招领'} · ${item.category}</span>
                </div>
                <div>
                    <span class="status-badge ${item.status === 'pending' ? 'status-pending' : 'status-approved'}">
                        ${item.status === 'pending' ? '待审核' : '已审核'}
                    </span>
                    <small>${new Date(item.createdAt).toLocaleString()}</small>
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
                item.itemName.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm)
            );
        }

        container.innerHTML = filteredItems.map(item => `
            <div class="post-item">
                <div class="post-info">
                    <h4>${item.itemName}</h4>
                    <div class="post-meta">
                        <span>类型: ${item.type === 'lost' ? '寻物启事' : '招领启事'}</span> | 
                        <span>分类: ${item.category}</span> | 
                        <span>地点: ${item.location}</span> | 
                        <span>时间: ${new Date(item.time).toLocaleString()}</span>
                    </div>
                    <p>${item.description}</p>
                    <div class="post-meta">
                        发布人: ${item.createdBy} | 
                        发布时间: ${new Date(item.createdAt).toLocaleString()}
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
                <h4>${item.itemName}</h4>
                <p><strong>类型:</strong> ${item.type === 'lost' ? '寻物启事' : '招领启事'}</p>
                <p><strong>分类:</strong> ${item.category}</p>
                <p><strong>地点:</strong> ${item.location}</p>
                <p><strong>时间:</strong> ${new Date(item.time).toLocaleString()}</p>
                <p><strong>描述:</strong> ${item.description}</p>
                <p><strong>联系方式:</strong> ${item.contact}</p>
                ${item.image ? `<img src="${item.image}" alt="${item.itemName}" style="max-width: 100%; margin: 1rem 0;">` : ''}
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
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 3000;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }
}

// 全局管理员应用实例
const adminApp = new AdminApp();