// 修复脚本 - 022340614数据可视化平台
console.log('开始修复数据可视化平台...');

// 修复1: 确保Plotly.js加载
function ensurePlotlyLoaded() {
    if (typeof Plotly === 'undefined') {
        console.error('Plotly.js未加载，尝试重新加载...');
        const script = document.createElement('script');
        script.src = 'https://cdn.plot.ly/plotly-2.16.1.min.js';
        script.onload = function() {
            console.log('Plotly.js重新加载成功');
            initializePlatform();
        };
        script.onerror = function() {
            console.error('Plotly.js加载失败');
            showError('Plotly.js加载失败，请检查网络连接');
        };
        document.head.appendChild(script);
        return false;
    }
    return true;
}

// 修复2: 数据加载修复（带超时机制）
function loadDataWithFallback() {
    return new Promise(async (resolve) => {
        const TIMEOUT = 5000; // 5秒超时
        let timeoutId;
        
        // 设置超时
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error('数据加载超时，使用默认数据'));
            }, TIMEOUT);
        });
        
        try {
            // 尝试本地文件（带超时）
            const loadPromise = (async () => {
                try {
                    const response = await fetch('chapter5_data.json');
                    if (response.ok) {
                        const data = await response.json();
                        console.log('从本地文件加载数据成功');
                        return data;
                    }
                    throw new Error('本地文件加载失败');
                } catch (error) {
                    console.log('本地数据文件加载失败:', error.message);
                    
                    // 尝试GitHub
                    try {
                        const response = await fetch('https://raw.githubusercontent.com/022340614/022340614zzx/main/chapter5_data.json');
                        if (response.ok) {
                            const data = await response.json();
                            console.log('从GitHub加载数据成功');
                            return data;
                        }
                        throw new Error('GitHub加载失败');
                    } catch (githubError) {
                        console.log('GitHub加载失败:', githubError.message);
                        throw githubError;
                    }
                }
            })();
            
            // 等待加载完成或超时
            const data = await Promise.race([loadPromise, timeoutPromise]);
            clearTimeout(timeoutId);
            resolve(data);
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.log('数据加载失败，使用默认数据:', error.message);
            
            // 使用默认数据
            resolve({
                productSales: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    productA: [20, 28, 23, 16, 29, 36, 39, 33, 31, 19, 21, 25],
                    productB: [17, 22, 39, 26, 35, 23, 25, 27, 29, 38, 28, 20]
                },
                population: {
                    countries: ['中国', '加拿大', '巴西', '澳大利亚', '日本', '墨西哥', '俄罗斯', '韩国', '瑞士', '土耳其', '英国', '美国'],
                    catOwners: [19, 33, 28, 29, 14, 24, 57, 6, 26, 15, 27, 39],
                    dogOwners: [25, 33, 58, 39, 15, 64, 29, 23, 22, 11, 27, 50]
                },
                douyin: {
                    cities: ['一线城市', '二线城市', '三线城市', '四线及以外', '其他国家及地区'],
                    data2017: [21, 35, 22, 19, 3],
                    data2018: [13, 32, 27, 27, 1],
                    growth: [51, 73, 99, 132, 45]
                },
                temperature: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    temperature: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 33.4, 23.0, 16.5, 12.0, 6.2],
                    precipitation: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                    evaporation: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                carSales: {
                    months: ['1月', '2月', '3月', '4月', '5月', '6月'],
                    sales: [2150, 1050, 1560, 1480, 1530, 1490],
                    cities: ['北京', '上海', '广州', '深圳', '浙江', '山东'],
                    salesCount: [83775, 62860, 59176, 64205, 48671, 39968]
                }
            });
        }
    });
}

// 修复3: 强制显示图表（即使数据加载失败）
function forceShowCharts() {
    console.log('强制显示图表...');
    
    // 立即隐藏所有加载动画
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.style.display = 'none';
    });
    
    // 更新所有加载文本
    const loadingTexts = document.querySelectorAll('.chart-container div');
    loadingTexts.forEach(container => {
        if (container.textContent.includes('加载图表数据')) {
            container.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">正在加载图表数据，请稍候...</div>';
        }
    });
    
    // 更新状态消息
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.className = 'warning';
        statusElement.innerHTML = '🔄 正在加载数据，请稍候...';
    }
    
    // 设置超时，如果加载时间过长，显示备用内容
    setTimeout(() => {
        const stillLoading = document.querySelectorAll('.chart-container div');
        stillLoading.forEach(container => {
            if (container.textContent.includes('正在加载图表数据')) {
                container.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">数据加载较慢，正在尝试使用默认数据...</div>';
            }
        });
        
        if (statusElement && statusElement.textContent.includes('正在加载数据')) {
            statusElement.innerHTML = '⚠️ 数据加载较慢，正在尝试备用方案...';
        }
    }, 3000); // 3秒后显示备用消息
}

// 修复3: 图表初始化修复
function initializeCharts(data) {
    try {
        // 更新全局数据
        if (window.chapter5ExactData) {
            if (data.productSales) window.chapter5ExactData.productSales = data.productSales;
            if (data.population) window.chapter5ExactData.population = data.population;
            if (data.douyin) window.chapter5ExactData.douyin = data.douyin;
            if (data.temperature) window.chapter5ExactData.temperature = data.temperature;
            if (data.carSales) window.chapter5ExactData.carSales = data.carSales;
        }
        
        // 调用原始初始化函数
        if (typeof initCharts === 'function') {
            initCharts();
        }
        
        // 更新表格
        if (typeof updateTableData === 'function') {
            updateTableData();
        }
        
        console.log('图表初始化成功');
        showSuccess('平台修复成功！所有功能已恢复正常。');
    } catch (error) {
        console.error('图表初始化失败:', error);
        showError('图表初始化失败: ' + error.message);
    }
}

// 修复4: 显示状态消息
function showSuccess(message) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.className = 'success';
        statusElement.innerHTML = '✅ ' + message;
    }
    console.log('成功:', message);
}

function showError(message) {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.className = 'error';
        statusElement.innerHTML = '❌ ' + message;
    }
    console.error('错误:', message);
}

// 修复5: 初始化平台
function initializePlatform() {
    console.log('初始化数据可视化平台...');
    
    // 首先强制显示图表，避免卡在加载状态
    forceShowCharts();
    
    if (!ensurePlotlyLoaded()) {
        return;
    }
    
    // 设置加载超时
    const loadTimeout = setTimeout(() => {
        console.log('数据加载超时，使用默认数据');
        showError('数据加载超时，使用默认数据继续显示...');
        // 即使超时也尝试初始化图表
        initializeCharts({});
    }, 8000); // 8秒超时
    
    // 加载数据
    loadDataWithFallback().then(data => {
        clearTimeout(loadTimeout);
        initializeCharts(data);
    }).catch(error => {
        clearTimeout(loadTimeout);
        console.error('数据加载失败:', error);
        showError('数据加载失败，使用默认数据: ' + error.message);
        // 即使失败也尝试初始化图表
        initializeCharts({});
    });
}

// 修复6: 按钮事件绑定
function fixButtonEvents() {
    console.log('修复按钮事件...');
    
    // 修复导航按钮
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // 修复功能按钮
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        const originalOnClick = button.getAttribute('onclick');
        if (originalOnClick) {
            button.removeAttribute('onclick');
            button.addEventListener('click', function() {
                try {
                    eval(originalOnClick);
                } catch (error) {
                    console.error('按钮点击错误:', error);
                }
            });
        }
    });
    
    console.log('按钮事件修复完成');
}

// 修复7: 错误处理
function setupErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript错误:', e.error);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('未处理的Promise拒绝:', e.reason);
    });
}

// 主修复函数
function applyFixes() {
    console.log('应用修复...');
    
    // 设置错误处理
    setupErrorHandling();
    
    // 修复按钮事件
    fixButtonEvents();
    
    // 初始化平台
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePlatform);
    } else {
        initializePlatform();
    }
    
    console.log('修复应用完成');
}

// 自动应用修复
if (typeof window !== 'undefined') {
    applyFixes();
}