require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware สำหรับตรวจสอบ JWT
exports.authenticateWebToken = function (req, res, next) {
  // console.log('Cookies: ', req.cookies); // ✅ Debug ว่ามี Cookie หรือไม่

  const token = req.cookies.authToken;
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie('authToken', {
        httpOnly: true,
        // sameSite: 'None', // อนุญาตให้ใช้ข้ามโดเมนได้
        // secure: true, // ใช้ cookie เฉพาะกับการเชื่อมต่อ HTTPS
      });
      return res.status(403).json({ message: 'Invalid Token' });
    }

    // ✅ สร้าง Token ใหม่และอัปเดตให้ User (ป้องกัน Token หมดอายุ)
    const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('authToken', newToken, {
      httpOnly: true,
      // sameSite: 'None', // อนุญาตให้ใช้ข้ามโดเมนได้
      // secure: true, // ใช้ cookie เฉพาะกับการเชื่อมต่อ HTTPS
      maxAge: 3600000, // อายุของ cookie (1 ชั่วโมง)
    });

    req.user = user; // ส่งข้อมูล user ไปยัง Middleware ถัดไป
    next();
  });
};
