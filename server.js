const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// 100条预设默认数据（保持你原本的酒桌规则）
const defaultData = {
    title: "这次该谁喝",
    duration: 4,
    noRepeat: true,
    options: [
        "穿裙子的喝", "不会唱歌的喝", "不会做饭的喝", "有纹身的喝", "朋友圈三天可见的喝", 
        "手机电量低于50%的喝", "骰子猜左右手", "指甲最长的喝", "这个月过生日的喝", "不会开车的喝", 
        "美甲有钻的喝", "3天内发过朋友圈的喝", "有对象的喝", "戴眼镜的喝", "发际线最高的喝", 
        "抽烟的喝", "短发的喝", "相册自拍最多的喝", "考驾照挂过科的喝", "没穿过包臀裙的喝", 
        "谈恋爱爱秀恩爱的喝", "经常不回消息的喝", "抖音关注美女最多的喝", "微信置顶是工作群的喝", 
        "最近分手的喝", "还没删前任的喝", "刷B站5级以上的喝", "点歌只会唱高潮的喝", 
        "不会划拳的喝", "手机有合成大西瓜的喝", "用过栓Q梗的喝", "没买过卫生巾的喝", 
        "手机交友软件最多的喝", "暖男喝", "一人一句土味情话，说不出的喝", "喂左边玩家喝", 
        "找陌生人喂自己喝", "穿牛仔裤的喝", "知道奥利给来源的喝", "熬夜超过凌晨2点的喝", 
        "当天没吃早饭的喝", "穿运动鞋的喝", "留过长头发的喝", "谈过3次以上恋爱的喝", 
        "喜欢熬夜的喝", "会做饭的喝", "单身的喝", "当天化妆的喝", "手机壁纸是人物的喝", 
        "喜欢喝奶茶的喝", "爱吃辣的喝", "养宠物的喝", "近视超过300度的喝", "经常失眠的喝", 
        "去过省外旅游的喝", "会游泳的喝", "喜欢看恐怖片的喝", "玩过剧本杀的喝", "经常网购的喝", 
        "微信余额少于100的喝", "今天洗头的喝", "穿拖鞋的喝", "头发染过色的喝", "经常健身的喝", 
        "爱吃甜食的喝", "熬夜党喝", "社恐喝", "社牛喝", "喜欢追剧的喝", "会跳舞的喝", 
        "喜欢运动的喝", "当天穿黑色衣服的喝", "当天穿白色衣服的喝", "戴耳环的喝", "戴手表的喝", 
        "穿高跟鞋的喝", "爱吃夜宵的喝", "会打麻将的喝", "会打扑克的喝", "经常喝酒的喝", 
        "第一次喝酒的喝", "酒量最好的喝", "酒量最差的喝", "当天最开心的喝", "当天最难过的喝", 
        "年龄最大的喝", "年龄最小的喝", "体重最重的喝", "体重最轻的喝", "身高最高的喝", 
        "身高最矮的喝", "第一个到现场的喝", "最后一个到现场的喝", "主动买单的喝", "今天没运动的喝", 
        "不爱吃香菜的喝", "喜欢喝咖啡的喝", "经常换头像的喝", "今天运气最差的喝", "过（不喝）"
    ],
    drawnOptions: []
};

let currentWheelData = JSON.parse(JSON.stringify(defaultData));

// 静态文件服务组件（必须在路由之前）
app.use(express.static(__dirname));

// 页面路由映射
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// WebSocket 核心同步逻辑
io.on('connection', (socket) => {
    // 新连入的设备同步当前服务器的数据
    socket.emit('initData', currentWheelData);

    // 监听管理员或大屏的数据更新修改
    socket.on('updateData', (newData) => {
        currentWheelData = newData;
        // 广播给除发送者以外的所有人
        socket.broadcast.emit('syncData', currentWheelData);
    });

    // 监听重置默认
    socket.on('resetData', () => {
        currentWheelData = JSON.parse(JSON.stringify(defaultData));
        io.emit('syncData', currentWheelData);
    });
});

server.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 转盘分布式同步系统启动成功！`);
    console.log(`📺 玩家大屏端: http://localhost:${PORT}`);
    console.log(`⚙️ 后台配置端: http://localhost:${PORT}/admin`);
    console.log(`==============================================\n`);
});