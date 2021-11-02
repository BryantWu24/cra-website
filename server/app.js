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
                    `SELECT * FROM auth WHERE FRoleId='${userRows[0].FRoleId}'`,
                    function (err, authRows, fields) {
                        const listAry = [];
                        authRows.forEach(item => {
                            listAry.push({
                                key: item.FListKey.toUpperCase(),
                                title: item.FListName
                            });
                        });
                        userRows[0].list = listAry;
                        const response = apiResponse(20000, userRows);
                        return res.send(response);
                    }
                )
            }
        }
    );
});

// 查整張表
const querySelectList = (tableName, resFunction) => {
    const res = db.query(`SELECT * FROM ${tableName}`, function (err, rows, fields) {
        const response = apiResponse(20000, rows);
        return resFunction.send(response);
    });
    return res;
};

// 取得使用者
app.post("/user/list", function async (req, res) {
    querySelectList('user', res);
})
// 取得麵包坊原料
app.post("/bakery/material/list", function async (req, res) {
    querySelectList('bakery_material', res);
})

// 取得角色
app.post("/role/list", function async (req, res) {
    querySelectList('role', res);
});

// 取得角色與目錄的 mapping 表
app.post("/auth/list", function async (req, res) {
    querySelectList('auth', res);
});

// 取得目錄
app.post("/list/list", function async (req, res) {
    querySelectList('list', res);
});

// 建立使用者
app.post("/user/create", function async (req, res) {
    const body = req.body;
    body.FUserId = _uuid();
    db.query('INSERT INTO user SET ?', body, function (error, results, fields) {
        if (error) throw error;
        else {
            delete body.FAccount;
            delete body.FPassword;
            return res.send({
                code: 20000,
                data: [body]
            })
        }
    });
});


// 建立成分
app.post("/bakery/material/create", function async (req, res) {
    const body = req.body;
    body.FBakeryMaterialId = _uuid();

    db.query(`SELECT * from bakery_material WHERE FName = '${body.FName}'`, function (err, rows, field) {
        if (rows.length === 0) {
            db.query('INSERT INTO bakery_material SET ?', body, function (error, results, fields) {
                if (error) throw error;
                else {
                    return res.send({
                        code: 20000,
                        data: [body]
                    })
                }
            });
        } else {
            return res.send({
                code: 20001,
                message: '此成分已被建立'
            })
        }
    })
});

// 建立商品
app.post("/bakery/item/create", function async (req, res) {
    const body = req.body;
    const FBakeryIngredientId = _uuid();
    let materialSelectSQL = `SELECT * from bakery_material WHERE `;
    body.FIngredients.forEach((item, index) => {
        if (index === 0) materialSelectSQL += `FName = '${item}'`;
        else materialSelectSQL += ` OR FName = '${item}'`
    })

    db.query(materialSelectSQL, function (err, rows, field) {
        rows.forEach((item) => {
            const ingredientsBody = {
                FBakeryIngredientId,
                FBakeryMaterialId: item.FBakeryMaterialId,
                FBakeryMaterialName: item.FName
            };
            db.query('INSERT INTO bakery_ingredients SET ?', ingredientsBody, function (error, results, fields) {
                if (error) throw error;
                else {}
            });
        })
    })

    const itemBody = {
        FBakeryItemId: _uuid(),
        FBakeryIngredientId,
        FName: body.FName,
        FUnitPrice: body.FUnitPrice,
        FStorageCount: body.FStorageCount,
        FStorageDays: body.FStorageDays,
        FStorageMethod: body.FStorageMethod,
    }
    db.query('INSERT INTO bakery_item SET ?', itemBody, function (error, results, fields) {
        if (error) throw error;
        else {
            return res.send({
                code: 20000,
                data: [body]
            })
        }
    });

});

// 產生 UUID
function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}