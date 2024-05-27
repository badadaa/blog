const express = require('express')

const router = express.Router()

const { v4: uuidv4 } = require('uuid')  //不知道怎么用可以搜node uuid

const { db, genid } = require('../db/DbUtils')

// req:前端传给服务器  res:服务器返回给前端
router.post('/login', async (req, res) => {
    let { account, password } = req.body
    let { err, rows } = await db.async.all("select * from `admin` where `account`=? AND `password`=?", [account, password])

    if (err == null && rows.length > 0) {
        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token`=? where id=?"

        await db.async.run(update_token_sql, [login_token, rows[0].id])

        // 将数据返回给前端
        let admin_info = rows[0]
        admin_info.token = login_token
        // 一般不返回密码，所以将其置空
        admin_info.password = ""

        res.send({
            code: 200,
            msg: '登录成功',
            // 接收数据将其输出
            data: admin_info
        })
    } else {
            res.send({
                code: 500,
                msg: '登录失败'
            })

    }
})

module.exports = router