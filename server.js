const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- 사용자 데이터 (20명) ---
const names = ["김문정", "김민정", "김서연", "김선우", "김수연", "김혜선", "박선진", "박서연", "박혜원", "손은희", "신옥희", "오진아", "우지선", "윤혜인", "임성은", "장춘초", "정은선", "정지윤", "정지훈", "정혜인"];

let users = names.map((name, index) => ({
    id: `user_${String(index + 1).padStart(3, '0')}`,
    name: name,
    totalPayment: Math.floor(Math.random() * 1000) * 1000,
    status: Math.random() > 0.8 ? 'withdrawing' : 'active'
}));

let orders = [{ id: 'ORD-2026-001', userId: 'user_001', address: '경기도 성남시 수정구' }];
let songs = [{ id: 1, title: 'Love Dive', artist: 'IVE' }, { id: 2, title: 'Attention', artist: 'NewJeans' }, { id: 3, title: 'Hype Boy', artist: 'NewJeans' }, { id: 4, title: 'Ditto', artist: 'NewJeans' }];

// --- API 엔드포인트 ---
// A: 결제 상위 조회 (버그: slice를 생략하면 전체가 나옴!)
app.get('/api/v1/data/priority', (req, res) => {
    const limit = parseInt(req.query.size) || 10;
    const result = [...users].sort((a, b) => b.totalPayment - a.totalPayment).slice(0, limit);
    res.json(result);
});

// B: 계정 상태 동기화 (탈퇴 취소)
app.patch('/api/v1/account/status-sync/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (user) { user.status = req.body.next_state; res.json({ target: req.params.id, current_status: user.status }); }
    else { res.status(404).json({ error: "Not Found" }); }
});

// C: 배송지 수정
app.put('/api/v1/logistics/destination/:orderId', (req, res) => {
    const order = orders.find(o => o.id === req.params.orderId);
    if (order) { order.address = req.body.addr_modified; res.json({ order_id: req.params.orderId, status: "updated", location: order.address }); }
    else { res.status(404).json({ error: "Order Not Found" }); }
});

// D: 콘텐츠 검색
app.get('/api/v1/content/search', (req, res) => {
    const results = songs.filter(s => s.title.toLowerCase().includes(req.query.q.toLowerCase()));
    res.json(results);
});

app.listen(PORT, () => console.log(`:rocket: 서버 실행 중: http://localhost:3000`));