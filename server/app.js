// Response 格式
// {
//     code : number
//     data : array object
//     message : string
// }
// code: 20000 - 成功
// code: 20099 - 執行失敗，會帶入 message

const express = require("express");
const db = require('./config/db');
const app = express();
const port = 7000;
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));
app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);


});

const apiResponse = (code, data, message) => {
    const res = {
        code
    }
    switch (code.toString()) {
        case '20000':
            res.data = data;
            res.message = message;
            break;
        case '20001':
        case '20002':
            res.message = message;
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
                const noDataResponse = apiResponse(20001, [], '帳號密碼輸入錯誤');
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
                        const response = apiResponse(20000, userRows, '登入成功');
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
        const response = apiResponse(20000, rows,'查詢成功');
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

// 取得麵包坊列表
app.post("/bakery/item/list", function async (req, res) {
    // 通過async/await去操作得到的Promise對象
    (async function () {
        const result = await getBakeryItemList();
        const final = []
        const pro = Promise.resolve();
        pro.then(() => {
            const promiseAry = result.map(async (item, index) => {
                const parseIngredients = await getIngredientsById(item);
                item.ingredients = parseIngredients;
                final.push(item);
            })

            Promise.all(promiseAry).then(() => {
                const finalResponse = apiResponse(20000, final, '取得麵包坊列表成功');
                res.send(finalResponse);
            })
        })
    })()
})

function getIngredientsById(item) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_ingredients WHERE FBakeryIngredientId = '${item.FBakeryIngredientId}'`, function async (err, ingredientRows, fields) {
            if (err) reject(err);
            else {
                const ingredients = [];
                ingredientRows.forEach((item) => {
                    ingredients.push(item.FBakeryMaterialName);
                })
                resolve(ingredients)
            }
        });
    });
}

function getBakeryItemList() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_item`, function async (err, itemRows, fields) {
            if (err) reject(err);
            else resolve(itemRows);
        })
    });
}

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

// 刪除產品 SQL
function deleteBakeryItem(FBakeryItemId) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM  bakery_item WHERE FBakeryItemId='${FBakeryItemId}'`, function (error, fields) {
            if (error) reject(error);
            else resolve();
        });
    });
}

// 刪除產品
app.post("/bakery/item/delete", function async (req, res) {
    const body = req.body;
    console.log('body:',body);
    // 通過async/await去操作得到的Promise對象
    (async function () {
        const queryPromise = Promise.resolve();
        queryPromise.then(() => {
            const deleteBakeryItemAry = body.map(async (item) => {
                const deleteBakeryItemQuery = await deleteBakeryItem(item.FBakeryItemId);
                return deleteBakeryItemQuery;
            })

            const deleteBakeryIngredientAry = body.map(async (item) => {
                const deleteBakeryIngredientQuery = await deleteIngredients(item.FBakeryIngredientId);
                return deleteBakeryIngredientQuery;
            })

            Promise.all(deleteBakeryItemAry).then(() => {
                Promise.all(deleteBakeryIngredientAry).then(() => {
                    const finalResponse = apiResponse(20000, [],'刪除成功');
                    res.send(finalResponse)
                })
            })
        })

    })()
})

// 更新產品
app.post("/bakery/item/update", function async (req, res) {
    const body = req.body;
    let allMaterial = [];
    let curMaterial = [];
    let editMaterial = body.FIngredients;
    delete body.FIngredients;
    // 更新商品
    const updateItem = new Promise((resolve, reject) => {
        db.query('update bakery_item set ? where FBakeryItemId = ?', [body, body.FBakeryItemId], function (err, fields) {
            if (err) reject(err);
            else resolve();
        });
    });

    // 取得所有原料
    const getAllMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_material`, function (err, rows, fields) {
            if (err) reject(err)
            else {
                allMaterial = rows;
                resolve(allMaterial);
            }
        });
    });

    // 取得現有組成成分
    const getCurMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_ingredients WHERE FBakeryIngredientId = '${body.FBakeryIngredientId}'`, function (err, rows, fields) {
            if (err) reject(err)
            else {
                curMaterial = rows;
                resolve(curMaterial)
            }
        });
    });


    Promise.all([updateItem, getAllMaterial, getCurMaterial]).then(() => {
        const action = {
            insert: [],
            delete: [],
            exist: []
        }
        // 過濾已存在
        editMaterial.forEach((item) => {
            curMaterial.forEach((curItem) => {
                if (item === curItem.FBakeryMaterialName) {
                    action.exist.push(item);
                }
            })
        })
        // 過濾新增
        action.insert = editMaterial.filter((editItem) => {
            return !~action.exist.indexOf(editItem)
        })
        // 過濾刪除
        curMaterial.forEach((curItem) => {
            if (!~action.exist.indexOf(curItem.FBakeryMaterialName)) action.delete.push(curItem.FBakeryMaterialName)
        })

        if (action.insert.length > 0) {
            action.insert = action.insert.map((item) => {
                const filterAry = allMaterial.filter((allItem) => {
                    return allItem.FName === item;
                })
                return filterAry[0];
            })
        }
        if (action.delete.length > 0) {
            action.delete = action.delete.map((item) => {
                const filterAry = allMaterial.filter((allItem) => {
                    return allItem.FName === item;
                })
                return filterAry[0];
            })
        }
        return action;
    }).then((action) => {
        if (action.insert.length > 0) {
            // 通過async/await去操作得到的Promise對象
            return (async function () {
                const insertPromiseAry = action.insert.map(async (item, index) => {
                    const ingredientsBody = {
                        FBakeryIngredientId: body.FBakeryIngredientId,
                        FBakeryMaterialName: item.FName,
                        FBakeryMaterialId: item.FBakeryMaterialId
                    };
                    const insertPromise = await insertIngredients(ingredientsBody);
                    return insertPromise;
                })
                Promise.all(insertPromiseAry).then(() => {
                    if (action.delete.length > 0) {
                        // 通過async/await去操作得到的Promise對象
                        (async function () {
                            const deletePromiseAry = action.insert.map(async (item) => {
                                const deletePromise = await deleteIngredients(body.FBakeryIngredientId, item.FBakeryMaterialId);
                                return deletePromise;
                            })

                            Promise.all(deletePromiseAry).then(() => {
                                const finalResponse = apiResponse(20000, [], '儲存成功');
                                res.send(finalResponse)
                            })
                        })()
                    }
                })

            })()
        } else return (action);
    }).then((action) => {
        if (action.delete.length > 0) {
            (async function () {
                const deletePromiseAry = action.delete.map(async (item) => {
                    const deletePromise = await deleteIngredients(body.FBakeryIngredientId, item.FBakeryMaterialId);
                    return deletePromise;
                })

                Promise.all(deletePromiseAry).then(() => {
                    const finalResponse = apiResponse(20000, [], '儲存成功');
                    res.send(finalResponse)
                })
            })()
        }
    })
});

// 刪除成分
function deleteIngredients(FBakeryIngredientId, FBakeryMaterialId) {
    if (!!FBakeryIngredientId) {
        if (!!FBakeryMaterialId) {
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM  bakery_ingredients WHERE FBakeryMaterialId='${FBakeryMaterialId}' AND  FBakeryIngredientId ='${FBakeryIngredientId}'`, function (error, fields) {
                    if (error) reject(error);
                    else resolve();
                });
            });
        } else {
            return new Promise((resolve, reject) => {
                db.query(`DELETE FROM  bakery_ingredients WHERE  FBakeryIngredientId ='${FBakeryIngredientId}'`, function (error, fields) {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }
    } else {
        console.log('刪除成分異常')
    }
}

// 新增成分
function insertIngredients(body) {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO bakery_ingredients SET ?', body, function (error, fields) {
            if (error) reject(error);
            else resolve();
        });
    });
}


// 建立原料
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