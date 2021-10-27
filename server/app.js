// Response 格式
// {
//     code : number
//     data : array object
//     message : string
// }
// code: 20000 - 成功有值
// code: 20001 - 成功無值，會帶入 message

const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7000;
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);
});

const apiResponse = (code, info) => {
    const res = {
        code
    }
    switch (code.toString()) {
        case '20000':
            res.data = info;
            break;
        case '20001':
            res.message = info;
            break;
        default:
            break;
    }
    return res;
}

// 登入
app.post("/login", function async (req, res) {
    var account = req.body.account;
    var password = req.body.password;

    db.query(
        `SELECT * FROM user WHERE FAccount='${account}' AND FPassword='${password}'`,
        function (err, userRows, fields) {
            if (userRows.length === 0) {
                const noDataResponse = apiResponse(20001, '帳號密碼輸入錯誤');
                return res.send(noDataResponse);
            } else {
                db.query(
                    `SELECT FListName FROM auth WHERE FRoleId='${userRows[0].FRoleId}'`,
                    function (err, authRows, fields) {
                        const listAry = [];
                        authRows.forEach(item => {
                            listAry.push(item.FListName.toUpperCase());
                        });
                        userRows[0].list = listAry;
                        const response = apiResponse(20000, userRows);
                        console.log('login:', response);
                        return res.send(response);
                    }
                )
            }
        }
    );
});