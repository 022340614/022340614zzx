// 示例数据，用于演示应用功能
const exampleItems = [
    {
        id: "1",
        type: "lost",
        itemName: "学生证",
        category: "证件",
        location: "图书馆三楼",
        time: "2026-05-31T10:00:00",
        description: "红色封面，姓名：张三，学号：20230001",
        contact: "13800138000",
        image: null,
        status: "pending",
        comments: [
            {
                user: "李四",
                text: "我在图书馆服务台看到过，可以去问问",
                time: "2026-05-31T11:30:00"
            }
        ],
        createdAt: "2026-05-31T10:15:00",
        createdBy: "张三"
    },
    {
        id: "2",
        type: "found",
        itemName: "黑色钱包",
        category: "其他",
        location: "食堂门口",
        time: "2026-05-30T18:00:00",
        description: "内有身份证、银行卡若干，现金200元",
        contact: "学生处办公室",
        image: null,
        status: "pending",
        comments: [],
        createdAt: "2026-05-30T18:30:00",
        createdBy: "王老师"
    },
    {
        id: "3",
        type: "lost",
        itemName: "笔记本电脑",
        category: "电子产品",
        location: "教学楼302教室",
        time: "2026-05-29T15:00:00",
        description: "银色MacBook Pro，贴有星空贴纸",
        contact: "微信：macbook_owner",
        image: null,
        status: "resolved",
        comments: [
            {
                user: "管理员",
                text: "已找到，请到失物招领处领取",
                time: "2026-05-30T09:00:00"
            }
        ],
        createdAt: "2026-05-29T16:00:00",
        createdBy: "赵同学"
    },
    {
        id: "4",
        type: "found",
        itemName: "英语课本",
        category: "书本",
        location: "操场看台",
        time: "2026-05-28T14:00:00",
        description: "《大学英语》第三册，内有笔记",
        contact: "体育部办公室",
        image: null,
        status: "pending",
        comments: [],
        createdAt: "2026-05-28T15:00:00",
        createdBy: "钱同学"
    },
    {
        id: "5",
        type: "lost",
        itemName: "校园卡",
        category: "证件",
        location: "体育馆",
        time: "2026-05-27T19:00:00",
        description: "蓝色卡套，学号：20230045",
        contact: "孙同学 13912345678",
        image: null,
        status: "pending",
        comments: [
            {
                user: "周同学",
                text: "我在更衣室看到一张卡，已交给前台",
                time: "2026-05-27T20:00:00"
            }
        ],
        createdAt: "2026-05-27T19:30:00",
        createdBy: "孙同学"
    },
    {
        id: "6",
        type: "found",
        itemName: "钥匙串",
        category: "钥匙",
        location: "宿舍楼门口",
        time: "2026-05-26T08:00:00",
        description: "三把钥匙，一个U盘挂件",
        contact: "宿管阿姨",
        image: null,
        status: "resolved",
        comments: [
            {
                user: "吴同学",
                text: "是我的钥匙，非常感谢！",
                time: "2026-05-26T10:00:00"
            }
        ],
        createdAt: "2026-05-26T08:30:00",
        createdBy: "宿管阿姨"
    }
];

// 初始化示例数据
function initExampleData() {
    if (!localStorage.getItem('lostFoundItems')) {
        localStorage.setItem('lostFoundItems', JSON.stringify(exampleItems));
        console.log('示例数据已初始化');
    }
    
    if (!localStorage.getItem('categories')) {
        const categories = ['证件', '书本', '电子产品', '衣物', '钥匙', '其他'];
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    
    if (!localStorage.getItem('currentUser')) {
        const user = { name: '示例用户' };
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
}

// 清除所有数据
function clearAllData() {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
        localStorage.clear();
        console.log('所有数据已清除');
        location.reload();
    }
}

// 导出数据
function exportData() {
    const data = {
        items: JSON.parse(localStorage.getItem('lostFoundItems') || '[]'),
        categories: JSON.parse(localStorage.getItem('categories') || '[]'),
        users: []
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lost-found-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// 导入数据
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.items) {
                localStorage.setItem('lostFoundItems', JSON.stringify(data.items));
            }
            if (data.categories) {
                localStorage.setItem('categories', JSON.stringify(data.categories));
            }
            
            alert('数据导入成功！');
            location.reload();
        } catch (error) {
            alert('数据导入失败：' + error.message);
        }
    };
    reader.readAsText(file);
}

// 页面加载时初始化
if (typeof window !== 'undefined') {
    window.initExampleData = initExampleData;
    window.clearAllData = clearAllData;
    window.exportData = exportData;
    window.importData = importData;
    
    // 自动初始化示例数据（首次访问时）
    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('firstVisit') === null) {
            initExampleData();
            localStorage.setItem('firstVisit', 'true');
        }
    });
}