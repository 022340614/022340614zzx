// 按钮点击诊断脚本
class ButtonDiagnostic {
    constructor() {
        this.init();
    }

    init() {
        console.log('按钮点击诊断脚本启动...');
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runDiagnostics());
        } else {
            this.runDiagnostics();
        }
    }

    runDiagnostics() {
        console.log('开始按钮诊断...');
        
        // 1. 检查所有按钮
        this.checkAllButtons();
        
        // 2. 检查事件监听器
        this.checkEventListeners();
        
        // 3. 检查CSS影响
        this.checkCSSIssues();
        
        // 4. 添加测试按钮
        this.addTestButtons();
    }

    checkAllButtons() {
        const buttons = document.querySelectorAll('button');
        console.log(`找到 ${buttons.length} 个按钮`);
        
        buttons.forEach((btn, index) => {
            const btnInfo = {
                index: index,
                text: btn.textContent.trim(),
                id: btn.id || '无ID',
                class: btn.className,
                onclick: btn.onclick ? '已设置' : '未设置',
                disabled: btn.disabled,
                style: window.getComputedStyle(btn)
            };
            
            console.log(`按钮 ${index}:`, btnInfo);
            
            // 检查点击事件
            if (!btn.onclick) {
                console.warn(`按钮 "${btnInfo.text}" 没有onclick事件`);
            }
            
            // 检查是否被禁用
            if (btn.disabled) {
                console.warn(`按钮 "${btnInfo.text}" 被禁用`);
            }
            
            // 检查CSS pointer-events
            if (btnInfo.style.pointerEvents === 'none') {
                console.error(`按钮 "${btnInfo.text}" 的pointer-events为none`);
            }
            
            // 检查opacity
            if (parseFloat(btnInfo.style.opacity) < 0.1) {
                console.warn(`按钮 "${btnInfo.text}" 的opacity过低: ${btnInfo.style.opacity}`);
            }
            
            // 检查z-index
            if (parseInt(btnInfo.style.zIndex) < 0) {
                console.warn(`按钮 "${btnInfo.text}" 的z-index为负值: ${btnInfo.style.zIndex}`);
            }
        });
    }

    checkEventListeners() {
        // 检查全局事件监听器
        const navButtons = document.querySelectorAll('.nav-actions button');
        const profileButtons = document.querySelectorAll('.profile-actions button');
        const adminButtons = document.querySelectorAll('.admin-actions button');
        
        console.log('导航按钮数量:', navButtons.length);
        console.log('个人中心按钮数量:', profileButtons.length);
        console.log('管理员按钮数量:', adminButtons.length);
        
        // 为每个按钮添加测试点击事件
        this.addTestClickEvents(navButtons, '导航按钮');
        this.addTestClickEvents(profileButtons, '个人中心按钮');
        this.addTestClickEvents(adminButtons, '管理员按钮');
    }

    addTestClickEvents(buttons, category) {
        buttons.forEach((btn, index) => {
            const originalOnClick = btn.onclick;
            
            // 添加测试事件监听器
            btn.addEventListener('click', (e) => {
                console.log(`${category} ${index} 被点击:`, {
                    text: btn.textContent.trim(),
                    eventType: e.type,
                    bubbles: e.bubbles,
                    cancelable: e.cancelable,
                    defaultPrevented: e.defaultPrevented
                });
                
                // 如果原始onclick存在，调用它
                if (originalOnClick) {
                    console.log('调用原始onclick函数');
                    try {
                        originalOnClick.call(btn, e);
                    } catch (error) {
                        console.error('调用原始onclick时出错:', error);
                    }
                }
            }, true); // 使用捕获阶段
            
            // 也检查冒泡阶段
            btn.addEventListener('click', (e) => {
                console.log(`${category} ${index} 冒泡阶段点击`);
            }, false);
        });
    }

    checkCSSIssues() {
        // 检查可能影响点击的CSS规则
        const styles = document.styleSheets;
        console.log(`找到 ${styles.length} 个样式表`);
        
        let problematicRules = [];
        
        for (let i = 0; i < styles.length; i++) {
            try {
                const rules = styles[i].cssRules || styles[i].rules;
                if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.selectorText && rule.selectorText.includes('button')) {
                            const style = rule.style;
                            if (style && (
                                style.pointerEvents === 'none' ||
                                style.opacity === '0' ||
                                style.display === 'none' ||
                                style.visibility === 'hidden'
                            )) {
                                problematicRules.push({
                                    selector: rule.selectorText,
                                    rule: rule.cssText.substring(0, 100)
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                // 跨域样式表可能无法访问
            }
        }
        
        if (problematicRules.length > 0) {
            console.warn('发现可能影响按钮点击的CSS规则:', problematicRules);
        } else {
            console.log('未发现明显影响按钮点击的CSS规则');
        }
    }

    addTestButtons() {
        // 添加测试按钮来验证点击功能
        const testContainer = document.createElement('div');
        testContainer.id = 'diagnostic-test-buttons';
        testContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-size: 12px;
        `;
        
        testContainer.innerHTML = `
            <h4 style="margin: 0 0 10px 0;">按钮诊断</h4>
            <button id="testBtn1" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px;">
                测试按钮1
            </button>
            <button id="testBtn2" style="background: #2196F3; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px;">
                测试按钮2
            </button>
            <button id="testBtn3" style="background: #ff9800; color: white; border: none; padding: 5px 10px; margin: 2px; border-radius: 3px;">
                测试按钮3
            </button>
            <div id="testResult" style="margin-top: 10px; font-size: 10px;"></div>
        `;
        
        document.body.appendChild(testContainer);
        
        // 为测试按钮添加事件
        document.getElementById('testBtn1').addEventListener('click', () => {
            this.showTestResult('测试按钮1 点击成功');
        });
        
        document.getElementById('testBtn2').addEventListener('click', () => {
            this.showTestResult('测试按钮2 点击成功');
        });
        
        document.getElementById('testBtn3').addEventListener('click', () => {
            this.showTestResult('测试按钮3 点击成功');
        });
        
        console.log('测试按钮已添加');
    }

    showTestResult(message) {
        const resultDiv = document.getElementById('testResult');
        resultDiv.textContent = `✅ ${message} - ${new Date().toLocaleTimeString()}`;
        resultDiv.style.color = '#4CAF50';
        
        console.log('测试按钮点击:', message);
    }

    // 修复按钮点击问题
    fixButtonIssues() {
        console.log('尝试修复按钮点击问题...');
        
        // 1. 确保所有按钮都有正确的pointer-events
        document.querySelectorAll('button').forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });
        
        // 2. 移除可能阻止点击的CSS类
        const problematicClasses = ['disabled', 'inactive', 'hidden', 'transparent'];
        document.querySelectorAll('button').forEach(btn => {
            problematicClasses.forEach(cls => {
                if (btn.classList.contains(cls)) {
                    btn.classList.remove(cls);
                    console.log(`从按钮移除类: ${cls}`);
                }
            });
        });
        
        // 3. 确保按钮不在其他元素后面
        document.querySelectorAll('button').forEach(btn => {
            btn.style.zIndex = '100';
            btn.style.position = 'relative';
        });
        
        console.log('按钮修复完成');
    }
}

// 自动启动诊断
window.addEventListener('load', () => {
    setTimeout(() => {
        const diagnostic = new ButtonDiagnostic();
        
        // 3秒后尝试修复问题
        setTimeout(() => {
            diagnostic.fixButtonIssues();
        }, 3000);
    }, 1000);
});

// 导出供手动调用
window.ButtonDiagnostic = ButtonDiagnostic;