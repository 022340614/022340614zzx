// PWA功能实现
class PWAHandler {
    constructor() {
        this.init();
    }

    async init() {
        // 注册Service Worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker 注册成功:', registration);
                
                // 检查更新
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('发现新版本 Service Worker');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker 注册失败:', error);
            }
        }

        // 监听Service Worker消息
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'NEW_POST_NOTIFICATION') {
                    this.showPushNotification(event.data);
                }
            });
        }

        // 初始化推送通知权限
        this.initPushNotifications();

        // 监听应用安装事件
        this.listenForInstallPrompt();
    }

    // 显示更新通知
    showUpdateNotification() {
        if (confirm('发现新版本，是否立即更新？')) {
            window.location.reload();
        }
    }

    // 初始化推送通知
    async initPushNotifications() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('推送通知权限已授予');
                
                // 这里可以订阅推送服务
                // 实际应用中需要配置推送服务器
            }
        }
    }

    // 显示推送通知
    showPushNotification(data) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('校园失物招领', {
                body: data.message || '有新的失物招领信息',
                icon: '/assets/icon-192x192.png',
                tag: 'lost-found-notification'
            });
        }
    }

    // 监听安装提示
    listenForInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // 阻止默认安装提示
            e.preventDefault();
            deferredPrompt = e;
            
            // 显示自定义安装按钮
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('应用已安装');
            deferredPrompt = null;
        });
    }

    // 显示安装按钮
    showInstallButton(deferredPrompt) {
        // 创建安装按钮
        const installButton = document.createElement('button');
        installButton.textContent = '安装应用';
        installButton.className = 'btn-primary';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        `;
        
        installButton.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                installButton.remove();
            }
        });

        document.body.appendChild(installButton);
    }

    // 检查网络状态
    checkNetworkStatus() {
        window.addEventListener('online', () => {
            this.showMessage('网络已连接', 'success');
        });

        window.addEventListener('offline', () => {
            this.showMessage('网络已断开，部分功能可能受限', 'warning');
        });
    }

    // 显示消息
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#f44336'};
            color: white;
            border-radius: 5px;
            z-index: 3000;
            text-align: center;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    // 添加到主屏幕功能
    showAddToHomeScreen() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('应用已添加到主屏幕');
        }
    }
}

// Service Worker注册和功能
class ServiceWorkerManager {
    constructor() {
        this.CACHE_NAME = 'lost-found-v1';
        this.URLS_TO_CACHE = [
            '/',
            '/index.html',
            '/styles/main.css',
            '/js/app.js',
            '/js/pwa.js',
            '/manifest.json',
            '/assets/icon-192x192.png',
            '/assets/icon-512x512.png'
        ];
    }

    // 安装Service Worker
    async install() {
        const cache = await caches.open(this.CACHE_NAME);
        await cache.addAll(this.URLS_TO_CACHE);
        console.log('资源已缓存');
    }

    // 拦截请求
    async fetch(request) {
        try {
            // 尝试从网络获取
            const networkResponse = await fetch(request);
            
            // 缓存新请求
            if (networkResponse.ok) {
                const cache = await caches.open(this.CACHE_NAME);
                cache.put(request, networkResponse.clone());
            }
            
            return networkResponse;
        } catch (error) {
            // 网络失败，尝试从缓存获取
            const cachedResponse = await caches.match(request);
            return cachedResponse || new Response('网络错误', { status: 503 });
        }
    }

    // 清理旧缓存
    async cleanup() {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName !== this.CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        );
    }
}

// 初始化PWA功能
const pwaHandler = new PWAHandler();

// 导出供Service Worker使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceWorkerManager;
}