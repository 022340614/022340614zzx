// Service Worker 注册和PWA功能
class ServiceWorkerManager {
    constructor() {
        this.swRegistration = null;
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        // 注册Service Worker
        this.registerServiceWorker();
        
        // 设置安装提示
        this.setupInstallPrompt();
        
        // 检查更新
        this.checkForUpdates();
        
        // 设置离线检测
        this.setupOfflineDetection();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('Service Worker 注册成功:', this.swRegistration);
                
                // 监听Service Worker状态
                this.monitorServiceWorker();
                
                // 发送欢迎消息
                this.sendWelcomeMessage();
                
            } catch (error) {
                console.error('Service Worker 注册失败:', error);
            }
        } else {
            console.log('当前浏览器不支持 Service Worker');
        }
    }

    monitorServiceWorker() {
        if (!this.swRegistration) return;

        // 监听Service Worker状态变化
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker 控制器已变更');
            this.showNotification('应用已更新', '请刷新页面以获取最新版本');
        });

        // 监听消息
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });

        // 定期检查更新
        setInterval(() => this.checkForUpdates(), 60 * 60 * 1000); // 每小时检查一次
    }

    setupInstallPrompt() {
        // 监听beforeinstallprompt事件
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // 显示安装按钮
            this.showInstallButton();
            
            console.log('PWA安装提示已准备');
        });

        // 监听appinstalled事件
        window.addEventListener('appinstalled', () => {
            console.log('PWA已成功安装');
            this.deferredPrompt = null;
            this.hideInstallButton();
            
            // 发送安装成功事件
            this.trackInstallation();
        });
    }

    showInstallButton() {
        // 创建安装按钮
        const installBtn = document.createElement('button');
        installBtn.id = 'installPWA';
        installBtn.className = 'install-btn';
        installBtn.innerHTML = '📱 安装应用';
        installBtn.onclick = () => this.promptInstall();
        
        // 添加到页面
        const navActions = document.querySelector('.nav-actions');
        if (navActions && !document.getElementById('installPWA')) {
            navActions.appendChild(installBtn);
            
            // 添加样式
            this.addInstallButtonStyles();
        }
    }

    addInstallButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .install-btn {
                background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                margin-left: 10px;
                transition: all 0.3s;
                animation: pulse 2s infinite;
            }
            
            .install-btn:hover {
                background: linear-gradient(135deg, #F57C00 0%, #E65100 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(255, 152, 0, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 152, 0, 0); }
            }
        `;
        document.head.appendChild(style);
    }

    hideInstallButton() {
        const installBtn = document.getElementById('installPWA');
        if (installBtn) {
            installBtn.remove();
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        
        const choiceResult = await this.deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
            console.log('用户接受了PWA安装');
            this.showNotification('安装成功', '应用已添加到主屏幕');
        } else {
            console.log('用户拒绝了PWA安装');
        }
        
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    async checkForUpdates() {
        if (!this.swRegistration) return;
        
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                await registration.update();
                console.log('Service Worker 更新检查完成');
            }
        } catch (error) {
            console.error('更新检查失败:', error);
        }
    }

    setupOfflineDetection() {
        // 监听在线状态
        window.addEventListener('online', () => {
            this.showNotification('网络已恢复', '应用现在可以正常使用');
            this.updateOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.showNotification('网络已断开', '部分功能可能受限');
            this.updateOnlineStatus(false);
        });

        // 初始状态检查
        this.updateOnlineStatus(navigator.onLine);
    }

    updateOnlineStatus(isOnline) {
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'networkStatus';
        statusIndicator.className = `network-status ${isOnline ? 'online' : 'offline'}`;
        statusIndicator.innerHTML = isOnline ? '🌐 在线' : '📴 离线';
        
        // 添加到导航栏
        const existingStatus = document.getElementById('networkStatus');
        if (existingStatus) {
            existingStatus.replaceWith(statusIndicator);
        } else {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.appendChild(statusIndicator);
            }
        }
        
        // 添加样式
        this.addNetworkStatusStyles();
    }

    addNetworkStatusStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .network-status {
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            .network-status.online {
                background: rgba(76, 175, 80, 0.9);
                color: white;
            }
            
            .network-status.offline {
                background: rgba(244, 67, 54, 0.9);
                color: white;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    showNotification(title, message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = `
            <div class="notification-icon">🔔</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        // 添加到通知区域
        const notificationArea = document.getElementById('notificationArea');
        if (notificationArea) {
            notificationArea.appendChild(notification);
            
            // 5秒后自动移除
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }
        
        // 添加通知样式
        this.addNotificationStyles();
    }

    addNotificationStyles() {
        if (document.querySelector('style[data-pwa-notification]')) return;
        
        const style = document.createElement('style');
        style.setAttribute('data-pwa-notification', 'true');
        style.textContent = `
            .pwa-notification {
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                animation: slideInRight 0.3s ease;
                border-left: 4px solid #4CAF50;
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .notification-icon {
                font-size: 1.5rem;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }
            
            .notification-message {
                font-size: 0.9rem;
                color: #666;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #999;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
            }
            
            .notification-close:hover {
                background: #f5f5f5;
                color: #333;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    sendWelcomeMessage() {
        // 发送欢迎消息到Service Worker
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'WELCOME',
                message: '欢迎使用校园失物招领PWA应用',
                timestamp: new Date().toISOString()
            });
        }
    }

    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'CACHE_UPDATED':
                this.showNotification('内容已更新', '新内容已缓存，可在离线时使用');
                break;
                
            case 'SYNC_COMPLETED':
                console.log('后台同步完成:', data.message);
                break;
                
            case 'PUSH_NOTIFICATION':
                this.showNotification(data.title, data.body);
                break;
                
            default:
                console.log('收到Service Worker消息:', data);
        }
    }

    trackInstallation() {
        // 跟踪安装事件
        const installData = {
            type: 'PWA_INSTALL',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
        
        // 保存到本地存储
        const installations = JSON.parse(localStorage.getItem('pwa_installations') || '[]');
        installations.push(installData);
        localStorage.setItem('pwa_installations', JSON.stringify(installations));
        
        // 发送到服务器（模拟）
        console.log('安装事件已记录:', installData);
    }

    // 公共方法
    async unregisterServiceWorker() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const result = await registration.unregister();
                console.log('Service Worker 注销结果:', result);
                return result;
            }
        }
        return false;
    }

    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('所有缓存已清除');
            return true;
        }
        return false;
    }

    getServiceWorkerInfo() {
        return {
            isSupported: 'serviceWorker' in navigator,
            registration: this.swRegistration,
            controller: navigator.serviceWorker.controller,
            canInstall: !!this.deferredPrompt,
            isOnline: navigator.onLine
        };
    }
}

// 全局实例
const serviceWorkerManager = new ServiceWorkerManager();

// 全局函数供HTML调用
window.installPWA = () => serviceWorkerManager.promptInstall();
window.checkForUpdates = () => serviceWorkerManager.checkForUpdates();
window.clearAppCache = () => serviceWorkerManager.clearCache();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // 确保Service Worker管理器已初始化
        if (!window.serviceWorkerManager) {
            window.serviceWorkerManager = serviceWorkerManager;
        }
    });
} else {
    window.serviceWorkerManager = serviceWorkerManager;
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceWorkerManager;
}