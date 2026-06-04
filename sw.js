// 学院失物招领系统 - Service Worker
// 学号：022340614

const CACHE_NAME = 'lost-and-found-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/lost-found-styles.css',
  '/app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1549924231-f129b911e442?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80'
];

// 安装Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: 正在安装...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: 缓存文件中...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: 安装完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: 安装失败:', error);
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: 正在激活...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 清除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: 激活完成');
      return self.clients.claim();
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
  // 跳过非GET请求
  if (event.request.method !== 'GET') return;
  
  // 跳过浏览器扩展请求
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // 处理请求
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有响应，直接返回
        if (response) {
          console.log('Service Worker: 从缓存返回:', event.request.url);
          return response;
        }
        
        // 否则从网络获取
        console.log('Service Worker: 从网络获取:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应以进行缓存
            const responseToCache = response.clone();
            
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('Service Worker: 缓存新资源:', event.request.url);
              });
            
            return response;
          })
          .catch(error => {
            console.error('Service Worker: 网络请求失败:', error);
            
            // 对于HTML页面，返回离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // 对于其他资源，返回占位符
            if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return new Response(
                `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                  <rect width="400" height="300" fill="#f3f4f6"/>
                  <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="20" fill="#6b7280">
                    图片加载失败
                  </text>
                </svg>`,
                {
                  headers: { 'Content-Type': 'image/svg+xml' }
                }
              );
            }
            
            // 返回错误响应
            return new Response('网络连接失败，请检查网络设置。', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 处理推送通知
self.addEventListener('push', event => {
  console.log('Service Worker: 收到推送通知');
  
  const options = {
    body: event.data ? event.data.text() : '新的失物招领通知',
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%234f46e5%22>🔍</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%234f46e5%22>🔍</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: '查看',
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%234f46e5%22>👀</text></svg>'
      },
      {
        action: 'close',
        title: '关闭',
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%234f46e5%22>❌</text></svg>'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('学院失物招领系统', options)
  );
});

// 处理通知点击
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: 通知被点击');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // 如果已经有打开的窗口，聚焦它
        for (const client of windowClients) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// 处理后台同步
self.addEventListener('sync', event => {
  console.log('Service Worker: 后台同步事件:', event.tag);
  
  if (event.tag === 'sync-notices') {
    event.waitUntil(syncNotices());
  }
});

// 同步启事数据
function syncNotices() {
  console.log('Service Worker: 正在同步启事数据...');
  
  // 这里可以添加数据同步逻辑
  // 例如：将本地存储的数据同步到服务器
  
  return Promise.resolve();
}

// 处理消息
self.addEventListener('message', event => {
  console.log('Service Worker: 收到消息:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_DATA') {
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.put(event.data.url, new Response(event.data.content));
      })
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// 处理错误
self.addEventListener('error', event => {
  console.error('Service Worker: 发生错误:', event.error);
});

// 处理未捕获的异常
self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: 未处理的Promise拒绝:', event.reason);
});

// 定期清理旧缓存
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cleanup-cache') {
    event.waitUntil(cleanupCache());
  }
});

// 清理缓存
function cleanupCache() {
  console.log('Service Worker: 正在清理缓存...');
  
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          console.log('Service Worker: 删除旧缓存:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });
}

// 注册定期同步
async function registerPeriodicSync() {
  if ('periodicSync' in self.registration) {
    try {
      await self.registration.periodicSync.register('cleanup-cache', {
        minInterval: 24 * 60 * 60 * 1000 // 24小时
      });
      console.log('Service Worker: 定期同步已注册');
    } catch (error) {
      console.error('Service Worker: 注册定期同步失败:', error);
    }
  }
}

// 初始化Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(registerPeriodicSync());
});

console.log('Service Worker: 已加载');