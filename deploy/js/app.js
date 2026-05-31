// 应用主逻辑
class LostAndFoundApp {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('lostFoundItems')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: '游客' };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRecentItems();
        this.setupImagePreview();
        this.checkLoginStatus();
    }

    setupEventListeners() {
        // 导航切换
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                this.showPage(target);
            });
        });

        // 移动端菜单切换
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });

        // 发布表单提交
        document.getElementById('publishForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.publishItem();
        });

        // 模态框关闭
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('itemModal')) {
                this.closeModal();
            }
        });

        // 搜索输入框回车事件
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchItems();
            }
        });
    }

    showPage(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        document.getElementById(pageId).classList.add('active');

        // 更新导航激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        // 关闭移动端菜单
        document.querySelector('.nav-links').classList.remove('active');

        // 页面特定逻辑
        switch(pageId) {
            case 'home':
                this.loadRecentItems();
                break;
            case 'profile':
                this.loadUserPosts();
                break;
        }
    }

    setupImagePreview() {
        const imageInput = document.getElementById('image');
        const preview = document.getElementById('imagePreview');

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="预览图片">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    publishItem() {
        const formData = new FormData(document.getElementById('publishForm'));
        const imageInput = document.getElementById('image');
        
        const item = {
            id: Date.now().toString(),
            type: formData.get('type'),
            itemName: formData.get('itemName'),
            category: formData.get('category'),
            location: formData.get('location'),
            time: formData.get('time'),
            description: formData.get('description'),
            contact: formData.get('contact'),
            image: null,
            status: 'pending',
            comments: [],
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser.name
        };

        // 处理图片
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                item.image = e.target.result;
                this.saveItem(item);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.saveItem(item);
        }
    }

    saveItem(item) {
        this.items.unshift(item);
        localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
        
        // 重置表单
        document.getElementById('publishForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // 显示成功消息
        this.showMessage('发布成功！', 'success');
        
        // 返回首页
        this.showPage('home');
    }

    loadRecentItems() {
        const container = document.getElementById('recentItemsList');
        const recentItems = this.items.slice(0, 6); // 显示最近6条
        
        container.innerHTML = recentItems.map(item => this.createItemCard(item)).join('');
        
        // 添加点击事件
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showItemDetail(recentItems[index]);
            });
        });
    }

    searchItems() {
        const keyword = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const type = document.getElementById('typeFilter').value;
        
        let results = this.items.filter(item => {
            let match = true;
            
            if (keyword) {
                match = match && (
                    item.itemName.toLowerCase().includes(keyword) ||
                    item.description.toLowerCase().includes(keyword) ||
                    item.location.toLowerCase().includes(keyword)
                );
            }
            
            if (category) {
                match = match && item.category === category;
            }
            
            if (type) {
                match = match && item.type === type;
            }
            
            return match;
        });

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">没有找到匹配的物品</p>';
            return;
        }

        container.innerHTML = results.map(item => this.createItemCard(item)).join('');
        
        // 添加点击事件
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showItemDetail(results[index]);
            });
        });
    }

    createItemCard(item) {
        return `
            <div class="item-card">
                <div class="item-header">
                    <span class="item-type ${item.type === 'lost' ? 'type-lost' : 'type-found'}">
                        ${item.type === 'lost' ? '寻物启事' : '招领启事'}
                    </span>
                    <span class="status-badge ${item.status === 'pending' ? 'status-pending' : 'status-resolved'}">
                        ${item.status === 'pending' ? '待认领' : '已解决'}
                    </span>
                </div>
                ${item.image ? `<img src="${item.image}" alt="${item.itemName}" class="item-image">` : ''}
                <div class="item-info">
                    <h4>${item.itemName}</h4>
                    <p><strong>分类:</strong> ${item.category}</p>
                    <p><strong>地点:</strong> ${item.location}</p>
                    <p><strong>时间:</strong> ${new Date(item.time).toLocaleString()}</p>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
    }

    showItemDetail(item) {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <h2>${item.itemName}</h2>
            <div class="item-header">
                <span class="item-type ${item.type === 'lost' ? 'type-lost' : 'type-found'}">
                    ${item.type === 'lost' ? '寻物启事' : '招领启事'}
                </span>
                <span class="status-badge ${item.status === 'pending' ? 'status-pending' : 'status-resolved'}">
                    ${item.status === 'pending' ? '待认领' : '已解决'}
                </span>
            </div>
            
            ${item.image ? `<img src="${item.image}" alt="${item.itemName}" class="item-image" style="max-width: 100%;">` : ''}
            
            <div class="item-details">
                <p><strong>分类:</strong> ${item.category}</p>
                <p><strong>地点:</strong> ${item.location}</p>
                <p><strong>时间:</strong> ${new Date(item.time).toLocaleString()}</p>
                <p><strong>描述:</strong> ${item.description}</p>
                <p><strong>联系方式:</strong> ${item.contact}</p>
                <p><strong>发布时间:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
                <p><strong>发布人:</strong> ${item.createdBy}</p>
            </div>

            <div class="comments-section">
                <h3>留言互动</h3>
                <div id="commentsList">
                    ${item.comments.map(comment => `
                        <div class="comment">
                            <strong>${comment.user}:</strong> ${comment.text}
                            <small>${new Date(comment.time).toLocaleString()}</small>
                        </div>
                    `).join('')}
                </div>
                
                <div class="comment-form">
                    <input type="text" id="commentInput" placeholder="请输入留言...">
                    <button onclick="app.addComment('${item.id}')" class="btn-primary">发送</button>
                </div>
            </div>

            <div class="action-buttons" style="margin-top: 1rem;">
                ${item.status === 'pending' ? 
                    `<button onclick="app.markAsResolved('${item.id}')" class="btn-primary">标记为已解决</button>` : 
                    ''
                }
            </div>
        `;

        document.getElementById('itemModal').style.display = 'block';
    }

    addComment(itemId) {
        const input = document.getElementById('commentInput');
        const commentText = input.value.trim();
        
        if (!commentText) return;

        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.comments.push({
                user: this.currentUser.name,
                text: commentText,
                time: new Date().toISOString()
            });

            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            input.value = '';
            this.showItemDetail(item); // 刷新显示
        }
    }

    markAsResolved(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.status = 'resolved';
            localStorage.setItem('lostFoundItems', JSON.stringify(this.items));
            this.showItemDetail(item); // 刷新显示
            this.showMessage('已标记为已解决', 'success');
        }
    }

    closeModal() {
        document.getElementById('itemModal').style.display = 'none';
    }

    loadUserPosts() {
        const userPosts = this.items.filter(item => item.createdBy === this.currentUser.name);
        document.getElementById('postCount').textContent = userPosts.length;
        
        const container = document.getElementById('myPostsList');
        container.innerHTML = userPosts.map(item => this.createItemCard(item)).join('');
        
        // 添加点击事件
        container.querySelectorAll('.item-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showItemDetail(userPosts[index]);
            });
        });
    }

    checkLoginStatus() {
        // 简单的用户状态检查，实际应用中应该更复杂
        if (!this.currentUser.name || this.currentUser.name === '游客') {
            // 可以在这里添加登录逻辑
            document.getElementById('userName').textContent = '游客';
        } else {
            document.getElementById('userName').textContent = this.currentUser.name;
        }
    }

    showMessage(message, type) {
        // 简单的消息提示
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
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

// 全局应用实例
const app = new LostAndFoundApp();

// 全局函数供HTML调用
function showPage(pageId) {
    app.showPage(pageId);
}

function searchItems() {
    app.searchItems();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 显示首页
    app.showPage('home');
});