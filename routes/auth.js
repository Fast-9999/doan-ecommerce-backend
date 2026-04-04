var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
let jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt')
let { checkLogin } = require('../utils/authHandler.js')
let { changePasswordValidator, validateResult, resetPasswordValidator } = require('../utils/validatorHandler')
let crypto = require('crypto')
let mailHandler = require('../utils/sendMailHandler')

/* GET home page. */
//localhost:3000
router.post('/register', async function (req, res) {
    try {
        await userController.CreateAnUser(
            req.body.username,
            req.body.password,
            req.body.email,
            "69cd1583dbd107c95c61f600"
        )
        res.send({
            message: "dang ki thanh cong"
        })
    } catch (error) {
        // Nếu lỗi trùng Email/Username từ MongoDB (E11000)
        if (error.code === 11000) {
            return res.status(400).send({
                message: "Email hoặc Tên đăng nhập đã tồn tại trong hệ thống!"
            });
        }
        res.status(500).send({ message: error.message });
    }
});

router.post('/login', async function (req, res) {
    // 🚀 ĐÃ BỌC TRY...CATCH TRÁNH TREO SERVER QUAY MÒNG MÒNG
    try {
        let result = await userController.QueryByUserNameAndPassword(
            req.body.username, req.body.password
        )
        if (result) {
            let token = jwt.sign({
                id: result.id
            }, 'secret', {
                expiresIn: '1h'
            })
            res.cookie("token", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true
            });
            res.send(token)
        } else {
            res.status(404).send({ message: "sai THONG TIN DANG NHAP" })
        }
    } catch (error) {
        console.error("Lỗi Đăng Nhập:", error);
        res.status(500).send({ message: "Lỗi kết nối cơ sở dữ liệu!" });
    }
});

router.get('/me', checkLogin, async function (req, res) {
    console.log(req.userId);
    let getUser = await userController.FindUserById(req.userId);
    res.send(getUser);
})

router.post('/logout', checkLogin, function (req, res) {
    res.cookie('token', null, {
        maxAge: 0,
        httpOnly: true
    })
    res.send("da logout ")
})

router.post('/changepassword', checkLogin, changePasswordValidator, validateResult, async function (req, res) {
    try {
        let { oldpassword, newpassword } = req.body;
        let user = await userController.FindUserById(req.userId);

        if (!user) {
            return res.status(404).send("Không tìm thấy User");
        }

        if (bcrypt.compareSync(oldpassword, user.password)) {
            // 🚀 BẮT BUỘC PHẢI BĂM (HASH) MẬT KHẨU MỚI TRƯỚC KHI LƯU
            let salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(newpassword, salt);

            await user.save();
            res.send("password da duoc thay doi");
        } else {
            // 🚀 ĐỔI THÀNH STATUS 400 ĐỂ FRONTEND BÁO LỖI ĐỎ
            res.status(400).send("Nhập sai mật khẩu hiện tại rồi Chủ Tịch ơi!");
        }
    } catch (error) {
        console.error("Lỗi Đổi Mật Khẩu:", error);
        res.status(500).send("Lỗi hệ thống khi đổi mật khẩu!");
    }
})

router.post('/forgotpassword', async function (req, res) {
    try {
        let email = req.body.email;
        let user = await userController.FindUserByEmail(email);
        if (!user) {
            res.status(404).send({
                message: "email khong ton tai"
            })
            return;
        }
        user.forgotpasswordToken = crypto.randomBytes(21).toString('hex');
        user.forgotpasswordTokenExp = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        let URL = 'http://localhost:3000/api/v1/auth/resetpassword/' + user.forgotpasswordToken;
        mailHandler.sendMail(user.email, URL);
        res.send("check mail")
    } catch (error) {
        console.error("Lỗi Quên Mật Khẩu:", error);
        res.status(500).send({ message: "Lỗi hệ thống!" });
    }
})

router.post('/resetpassword/:token', resetPasswordValidator, validateResult, async function (req, res) {
    try {
        let password = req.body.password;
        let token = req.params.token;
        let user = await userController.FindUserByToken(token);

        if (!user) {
            res.status(404).send("token reset password sai");
            return;
        }

        // 🚀 BẮT BUỘC PHẢI BĂM (HASH) KHI RESET PASSWORD
        let salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(password, salt);

        user.forgotpasswordToken = null;
        user.forgotpasswordTokenExp = null;
        await user.save()
        res.send("update password thanh cong")
    } catch (error) {
        console.error("Lỗi Reset Mật Khẩu:", error);
        res.status(500).send("Lỗi hệ thống khi đặt lại mật khẩu!");
    }
})

module.exports = router;
