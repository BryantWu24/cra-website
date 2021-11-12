// Response 格式
// {
//     code : number
//     data : array object
//     message : string
// }
// code: 20000 - 執行成功 
// code: 20099 - 執行失敗，會帶入 message

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

const apiResponse = (code, data, message) => {
    const res = {
        code
    }
    switch (code.toString()) {
        case '20000':
            res.data = data;
            res.message = message;
            break;
        case '20099':
            res.message = message;
            break;
        default:
            break;
    }
    return res;
}

const TEXT = {
    "CreateSuccess": "建立成功",
    "CreateFail": "建立失敗",
    "RegisterSuccess": "註冊成功",
    "RegisterFail": "註冊失敗",
    "AccountPasswordError": "帳號密碼輸入錯誤",
    "LoginSuccess": "登入成功",
    "LoginException": "登入異常，請稍後再嘗試",
    "LoginFail": "登入失敗",
    "SearchSuccess": "查詢成功",
    "SearchFail": "查詢失敗",
    "SearchAuthFail": "查詢權限失敗",
    "DeleteSuccess": "刪除成功",
    "DeleteFail": "刪除失敗",
    "SaveSuccess": "儲存成功",
    "SaveFail": "儲存失敗",
    "MaterialIsExist": "此原料已被建立",
    "CheckOutSuccess": "送出訂單成功"
}

// 登入
app.post("/login", function async (req, res) {
    const account = req.body.account;
    const password = req.body.password;

    db.query(`SELECT u.FUserId , u.FUserName, u.FAvatar, l.FListName, l.FListKey, r.FRoleId, r.FRoleName  FROM user u 
              LEFT JOIN auth a on  u.FRoleId = a.FRoleId 
              LEFT JOIN role r on  r.FRoleId = a.FRoleId  
              LEFT JOIN list l on a.FListId = l.FListId  
              WHERE u.FAccount='${account}' AND u.FPassword='${password}'`, function (err, result, field) {
        if (err) {
            console.log('/login API Error :', err);
            const response = apiResponse(20099, err, TEXT.LoginException);
            return res.send(response);
        } else {
            if (result.length === 0) {
                const noDataResponse = apiResponse(20099, [], TEXT.AccountPasswordError);
                return res.send(noDataResponse);
            } else {
                const listArray = [];
                result.forEach((item) => {
                    listArray.push({
                        key: item.FListKey.toUpperCase(),
                        title: item.FListName
                    })
                })
                const apiResult = [{
                    FRoleName: result[0].FRoleName,
                    FRoleId: result[0].FRoleId,
                    FUserId: result[0].FUserId,
                    FUserName: result[0].FUserName,
                    FAvatar: result[0].FAvatar,
                    list: listArray
                }]
                const response = apiResponse(20000, apiResult, TEXT.LoginSuccess);
                return res.send(response);
            }
        }
    })
});

// 查整張表
const querySelectList = (tableName, resFunction) => {
    const res = db.query(`SELECT * FROM ${tableName}`, function (err, rows, fields) {
        if (err) {
            console.log('Search ' + tableName + ' Table Error Log :', err);
            throw err;
        } else {
            const response = apiResponse(20000, rows, TEXT.SearchSucces);
            return resFunction.send(response);
        }
    });
    return res;
};

app.post('/db/table', function async (req, res) {
    db.query(`select TABLE_NAME from information_schema.tables where TABLE_SCHEMA='cra-website'`, function async (err, tableName, fields) {
        let response;
        if (err) response = apiResponse(20099, [], TEXT.SearchFail);
        else response = apiResponse(20000, tableName, TEXT.SearchSuccess);
        res.send(response);
    })
})

// 取得使用者
app.post("/user/list", function async (req, res) {
    querySelectList('user', res);
})

// 取得麵包坊原料
app.post("/bakery/material/list", function async (req, res) {
    querySelectList('bakery_material', res);
})

// 取得麵包坊組成成分
app.post("/bakery/ingredients/list", function async (req, res) {
    querySelectList('bakery_ingredients', res);
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
                const finalResponse = apiResponse(20000, final, TEXT.SearchSucces);
                res.send(finalResponse);
            })
        })
    })()
})

// 取得指定商品組合成分
function getIngredientsById(item) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_ingredients WHERE FBakeryIngredientId = '${item.FBakeryIngredientId}'`, function async (err, ingredientRows, fields) {
            if (err) {
                console.log('Do getIngredientsById Error Log : ', err);
                reject(err);
            } else {
                const ingredients = [];
                ingredientRows.forEach((item) => {
                    ingredients.push(item.FBakeryMaterialName);
                })
                resolve(ingredients)
            }
        });
    });
}

// 取得麵包坊商品清單
function getBakeryItemList() {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_item`, function async (err, itemRows, fields) {
            if (err) {
                console.log('Do getBakeryItemList Error Log : ', err);
                reject(err);
            } else resolve(itemRows);
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
    db.query('INSERT INTO user SET ?', body, function (err, results, fields) {
        let finalResponse;
        if (err) {
            console.log('/user/create Error Log : ', err);
            finalResponse = apiResponse(20099, [], TEXT.RegisterFail);
        } else {
            delete body.FAccount;
            delete body.FPassword;
            finalResponse = apiResponse(20000, [body], TEXT.RegisterSuccess);
        }
        return res.send(finalResponse)
    });
});

// 刪除產品
app.post("/bakery/item/delete", function async (req, res) {
    const body = req.body;
    // 刪除組成成分
    const ingredientsPromse = new Promise((resolve, reject) => {
        const sql = `DELETE FROM bakery_ingredients WHERE (FBakeryIngredientId) IN (?)`;
        const apiBody = [];
        body.forEach((item) => {
            const rowBody = [item.FBakeryIngredientId];
            apiBody.push(rowBody);
        })
        db.query(sql, [apiBody], function (err, result, fields) {
            if (err) {
                console.log('/bakery/item/delete - 刪除成分失敗:', err);
                reject(err);
            } else {
                console.log('/bakery/item/delete - 刪除成分成功:');
                resolve();
            }
        });
    })
    // 刪除商品
    const itemPromise = new Promise((resolve, reject) => {
        const sql = `DELETE FROM bakery_item WHERE (FBakeryItemId) IN (?)`;
        const apiBody = [];
        body.forEach((item) => {
            const rowBody = [item.FBakeryItemId];
            apiBody.push(rowBody);
        })
        db.query(sql, [apiBody], function (err, result, fields) {
            if (err) {
                console.log('/bakery/item/delete - 刪除商品失敗:', err);
                reject();
            } else {
                console.log('/bakery/item/delete - 刪除商品成功:');
                resolve();
            }
        });
    })
    Promise.all([itemPromise, ingredientsPromse]).then(() => {
        const finalResponse = apiResponse(20000, [], TEXT.DeleteSuccess);
        res.send(finalResponse).end();
    }).catch((e) => {
        console.log('/bakery/item/delete - 刪除商品是常:', e);
    })
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
            if (err) {
                console.log('/bakery/item/update - 更新商品失敗:', err);
                reject(err);
            } else {
                console.log('/bakery/item/update - 更新商品成功');
                resolve();
            }
        });
    });

    // 更新庫存
    const storePromise = new Promise((resolve, reject) => {
        const apiBody = {
            FName: body.FName,
            FCount: body.FStorageCount
        }
        db.query('update bakery_store set ? where FBakeryItemId = ?', [apiBody, body.FBakeryItemId], function (err, fields) {
            if (err) {
                console.log('/bakery/item/update - 更新庫存失敗:', err);
                reject(err);
            } else {
                console.log('/bakery/item/update - 更新庫存成功');
                resolve();
            }
        });
    });

    // 取得所有原料
    const getAllMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_material`, function (err, rows, fields) {
            if (err) {
                console.log('/bakery/item/update - 取得所有原料失敗:', err);
                reject(err)
            } else {
                allMaterial = rows;
                console.log('/bakery/item/update - 取得所有原料成功');
                resolve(allMaterial);
            }
        });
    });

    // 取得現有組成成分
    const getCurMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_ingredients WHERE FBakeryIngredientId = '${body.FBakeryIngredientId}'`, function (err, rows, fields) {
            if (err) {
                console.log('/bakery/item/update - 取得現有組成成分失敗:', err);
                reject(err)
            } else {
                curMaterial = rows;
                console.log('/bakery/item/update - 取得現有組成成分成功:');
                resolve(curMaterial)
            }
        });
    });

    Promise.all([updateItem, getAllMaterial, getCurMaterial, storePromise]).then(() => {
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
            // 新增組成成分
            const insertPromise = new Promise((resolve, reject) => {
                const sql = `INSERT INTO bakery_ingredients (FBakeryIngredientId,FBakeryMaterialId,FBakeryMaterialName) VALUES ?`;
                const apiBody = [];
                action.insert.forEach((item) => {
                    const rowBody = [body.FBakeryIngredientId, item.FBakeryMaterialId, item.FName];
                    apiBody.push(rowBody);
                })

                db.query(sql, [apiBody], function (err, fields) {
                    if (err) {
                        console.log('/bakery/item/update - 新增組成成分失敗:', err);
                        reject(err);
                    } else {
                        console.log('/bakery/item/update - 新增組成成分成功:');
                        resolve();
                    }
                });
            });

            insertPromise.then(() => {
                if (action.delete.length > 0) {
                    // 刪除組成成分
                    const sql = `DELETE FROM bakery_ingredients WHERE (FBakeryMaterialId,FBakeryIngredientId) IN (?)`;
                    const apiBody = [];
                    action.delete.forEach((item) => {
                        const rowBody = [item.FBakeryMaterialId, body.FBakeryIngredientId];
                        apiBody.push(rowBody);
                    })
                    db.query(sql, [apiBody], function (err, result, fields) {
                        if (err) {
                            console.log('/bakery/item/update - 刪除組成成分失敗:', err);
                            insertPromise.reject(err);
                        } else {
                            console.log('/bakery/item/update - 刪除組成成分成功:');
                            const finalResponse = apiResponse(20000, [], TEXT.SaveSuccess);
                            res.send(finalResponse).end();
                        }
                    });
                }
            })
        } else if (action.delete.length > 0) {
            // 刪除組成成分
            const sql = `DELETE FROM bakery_ingredients WHERE (FBakeryMaterialId,FBakeryIngredientId) IN (?)`;
            const apiBody = [];
            action.delete.forEach((item) => {
                const rowBody = [item.FBakeryMaterialId, body.FBakeryIngredientId];
                apiBody.push(rowBody);
            })

            db.query(sql, [apiBody], function (err, result, fields) {
                if (err) {
                    console.log('/bakery/item/update - 刪除組成成分失敗:', err);
                } else {
                    console.log('/bakery/item/update - 刪除組成成分成功:');
                    const finalResponse = apiResponse(20000, [], TEXT.SaveSuccess);
                    res.send(finalResponse).end();
                }
            });
        } else {
            const finalResponse = apiResponse(20000, [], TEXT.SaveSuccess);
            res.send(finalResponse).end();
        }
    });
})

// 取得指定商品庫存
app.post("/bakery/store/item", function async (req, res) {
    const FBakeryItemId = req.body.FBakeryItemId;
    db.query(`SELECT * from bakery_store WHERE FBakeryItemId = '${FBakeryItemId}'`, function (err, result) {
        let finalResponse = '';
        if (err) {
            console.log('/bakery/store/item - 取得指定商品庫存失敗: ', err);
            finalResponse = apiResponse(20099, [], TEXT.SearchFail);
        } else {
            console.log('/bakery/store/item - 取得指定商品庫存成功');
            finalResponse = apiResponse(20000, result, TEXT.SearchSuccess);
        }
        res.send(finalResponse).end();
    })
});


// 建立原料
app.post("/bakery/material/create", function async (req, res) {
    const body = req.body;
    body.FBakeryMaterialId = _uuid();

    db.query(`SELECT * from bakery_material WHERE FName = '${body.FName}'`, function (err, rows, field) {
        if (rows.length === 0) {
            db.query('INSERT INTO bakery_material SET ?', body, function (err, results, fields) {
                if (err) throw err;
                else {
                    const finalResponse = apiResponse(20000, [body], TEXT.CreateSuccess);
                    return res.send(finalResponse)
                }
            });
        } else {
            return res.send({
                code: 20099,
                message: TEXT.MaterialIsExist
            })
        }
    })
});

// 建立商品
app.post("/bakery/item/create", function async (req, res) {
    const body = req.body;
    const FBakeryIngredientId = _uuid();
    const FBakeryItemId = _uuid();
    body.FBakeryIngredientId = FBakeryIngredientId;
    body.FBakeryItemId = FBakeryItemId;
    const ingredientPromise = new Promise((resolve, reject) => {
        let materialSelectSQL = `SELECT * from bakery_material WHERE `;
        body.FIngredients.forEach((item, index) => {
            if (index === 0) materialSelectSQL += `FName = '${item}'`;
            else materialSelectSQL += ` OR FName = '${item}'`
        })
        // 新增麵包坊組成成分紀錄
        db.query(materialSelectSQL, function (err, rows, field) {
            rows.forEach((item) => {
                const ingredientsBody = {
                    FBakeryIngredientId,
                    FBakeryMaterialId: item.FBakeryMaterialId,
                    FBakeryMaterialName: item.FName
                };
                db.query('INSERT INTO bakery_ingredients SET ?', ingredientsBody, function (err, results, fields) {
                    if (err) {
                        console.log('/bakery/item/create - 新增麵包坊組成成分紀錄失敗: ', err);
                        reject(err);
                    } else {
                        console.log('/bakery/item/create - 新增麵包坊組成成分紀錄成功');
                        resolve();
                    }
                });
            })
        })

    });

    const itemPromise = new Promise((resolve, reject) => {
        const itemBody = {
            FBakeryItemId,
            FBakeryIngredientId,
            FName: body.FName,
            FUnitPrice: body.FUnitPrice,
            FStorageCount: body.FStorageCount,
            FStorageDays: body.FStorageDays,
            FStorageMethod: body.FStorageMethod,
        }
        // 新增麵包坊商品紀錄
        db.query('INSERT INTO bakery_item SET ?', itemBody, function (err, results, fields) {
            if (err) {
                console.log('/bakery/item/create - 新增麵包坊商品紀錄失敗: ', err);
                reject(err);
            } else {
                console.log('/bakery/item/create - 新增麵包坊商品紀錄成功');
                resolve();
            }
        });
    });

    const storePromise = new Promise((resolve, reject) => {
        const storeBody = {
            FBakeryStoreId: _uuid(),
            FBakeryItemId,
            FName: body.FName,
            FCount: body.FStorageCount,
        }
        // 新增麵包坊商品紀錄
        db.query('INSERT INTO bakery_store SET ?', storeBody, function (err, results, fields) {
            if (err) {
                console.log('/bakery/item/create - 新增麵包坊庫存紀錄失敗: ', err);
                reject(err);
            } else {
                console.log('/bakery/item/create - 新增麵包坊庫存紀錄成功');
                resolve();
            }
        });
    });

    Promise.all([ingredientPromise, itemPromise, storePromise]).then(() => {
        console.log('建立商品完成');
        const finalResponse = apiResponse(20000, [body], TEXT.CreateSuccess);
        return res.send(finalResponse)
    }).catch((e) => {
        const finalResponse = apiResponse(20099, [], TEXT.CreateFail);
        return res.send(finalResponse)
    })


});

// 建立麵包坊銷售紀錄
app.post("/bakery/order/create", function async (req, res) {
    const body = req.body;
    const FOrderId = _uuid();
    const promise = new Promise((resolve, reject) => {
        const apiBody = {
            FUserId: body.FUserId,
            FTotalPrice: body.orderTotalPrice,
            FOrderId
        }
        // 新增麵包坊銷售紀錄
        db.query('INSERT INTO bakery_order SET ?', apiBody, function (err, result) {
            if (err) {
                console.log('新增麵包坊銷售紀錄失敗:', err);
                reject(err);
            } else {
                console.log('新增麵包坊銷售紀錄成功，FOrderId :', FOrderId);
                resolve(FOrderId)
            }
        });
    });

    promise.then((FOrderId) => {
        // 新增麵包坊銷售明細
        const sql = `INSERT INTO bakery_order_detail (FOrderDetailId,FOrderId,FBakeryItemId,FName,FCount,FUnitPrice,FTotalPrice) VALUES ?`;
        const apiBody = [];
        body.orderList.forEach((item) => {
            const rowBody = [_uuid(), FOrderId, item.FBakeryItemId, item.FName, item.FCount, item.FUnitPrice, item.FTotalPrice];
            apiBody.push(rowBody);
        })

        db.query(sql, [apiBody], function (err, result) {
            let response;
            if (!err) {
                console.log('新增麵包坊銷售明細成功');
                response = apiResponse(20000, [], TEXT.CheckOutSuccess);
            } else {
                console.log('新增麵包坊銷售明細失敗:', err);
                response = apiResponse(20099, [], TEXT.CheckOutFail);
            }
            res.send(response);
        });
    }).then(() => {
        // 需要去更新 bakery_store 表
    })

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