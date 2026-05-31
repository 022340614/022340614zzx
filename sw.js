// Service Worker for Lost and Found PWA
const CACHE_NAME = 'lost-found-v1.0.0';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/app.js',
    '/js/pwa.js',
    '/manifest.json',
    '/assets/icon-72x72.png',
    '/assets/icon-96x96.png',
    '/assets/icon-128x128.png',
    '/assets/icon-144x144.png',
    '/assets/icon-152x152.png',
    '/assets/icon-192x192.png',
    '/assets/icon-384x384.png',
    '/assets/icon-512x512.png'
];

// 安装事件
self.addEventListener('install', (event) => {
    console.log('Service Worker 安装中...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存资源中...');
                return cache.addAll(URLS_TO_CACHE);
            })
            .then(() => {
                console.log('所有资源已缓存');
                return self.skipWaiting();
            })
    );
});

// 激活事件
self.addEventListener('activate', (event) => {
    console.log('Service Worker 激活中...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker 已激活');
            return self.clients.claim();
        })
    );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
    // 跳过非GET请求
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 返回缓存或网络请求
                return response || fetch(event.request)
                    .then((fetchResponse) => {
                        // 检查是否为有效响应
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // 克隆响应
                        const responseToCache = fetchResponse.clone();

                        // 缓存新请求
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch(() => {
                        // 网络失败时，对于HTML页面返回缓存的首页
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// 推送通知处理
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body || '校园失物招领有新消息',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/icon-72x72.png',
        tag: 'lost-found-notification',
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: '查看'
            },
            {
                action: 'dismiss',
                title: '忽略'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('校园失物招领', options)
    );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then((clientList) => {
                    // 如果已有窗口打开，聚焦它
                    for (const client of clientList) {
                        if (client.url.includes(self.location.origin) && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // 否则打开新窗口
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    }
});

// 后台同步处理
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// 后台同步任务
async function doBackgroundSync() {
    // 这里可以实现后台数据同步逻辑
    // 例如：同步离线时发布的数据到服务器
    console.log('执行后台同步...');
}

// 消息处理
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker 已加载');