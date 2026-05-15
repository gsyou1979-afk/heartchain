const http = require('http');

async function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    // 登录
    const loginRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/auth/password-login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, {
        phone: '+821022098999',
        password: 'asdf123'
    });

    if (loginRes.status !== 200 || !loginRes.data.accessToken) {
        console.log('❌ 登录失败:', loginRes.data);
        return;
    }
    const token = loginRes.data.accessToken;
    console.log('✅ 登录成功:', loginRes.data.user?.nickname);

    // 发布任务
    const taskRes = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/tasks',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, {
        title: '测试任务',
        description: '这是一个测试任务',
        taskType: 'team_once',
        teamSize: 3,
        requiredSkills: ['repair', 'cleaning'],
        location: '{"city":"서울","district":"강남구","address":"테헤란로"}',
        schedule: {
            type: 'range',
            startDate: '2026-04-26',
            endDate: '2026-04-26',
            startTime: '09:00',
            endTime: '17:00'
        },
        pointsReward: 50
    });

    if (taskRes.status === 201) {
        console.log('✅ 发布任务成功:', taskRes.data.title);
    } else {
        console.log('❌ 发布任务失败:', taskRes.status, taskRes.data);
    }
}

test().catch(console.error);
