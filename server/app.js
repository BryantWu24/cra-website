// Response 格式
// {
//     code : number
//     data : array object
//     message : string
// }
// code: 20000 - 執行成功 
// code: 20099 - 執行失敗，會帶入 message

// /openapi/ 路徑代表有使用 sql 去 mapping 其他表

const mysql = require("mysql");
const fs = require('fs'); // 載入File System module
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
const formidable = require("formidable");

app.use(express.json());
app.use(cors(corsOptions));
app.use('/public', express.static('public'))
app.listen(port, () => {
    console.log(`RUN http://localhost:${port}`);
    fs.unlink('error-log.txt', function () {
        console.log('已經刪除 error-log.txt 檔案!');
    });
    fs.unlink('log.txt', function () {
        console.log('已經刪除 log.txt 檔案!');
    });

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
            res.data = data || 'No Error Log';
            res.message = message;
            break;
        default:
            break;
    }
    return res;
}

const TEXT = {
    "CreateSuccess": "建立成功",
    "UpdateSuccess": "更新成功",
    "UpdateFail": "更新失敗",
    "UploadFail": "上傳失敗",
    "UploadSuccess": "上傳成功",
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

// 上傳
app.post('/api/upload', (req, res) => {
    var form = new formidable.IncomingForm()
    var path = require('path')
    form.uploadDir = path.join(__dirname, '../public/bakeryImg/');
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            const response = apiResponse(20099, [], TEXT.UploadFail);
            res.send(response);
            throw err;
        }
        let oldFilename = files.imgFile.originalFilename;
        //重新命名上傳的檔案
        fs.rename(files.imgFile.filepath, form.uploadDir + oldFilename, err => {
            if (err) {
                console.log("重新命名失敗");
                const response = apiResponse(20099, [], TEXT.UploadFail);
                res.send(response);
                console.log(err);
            } else {
                console.log("重新命名成功!");
            }
        })
        const response = apiResponse(20000, [{
            url: '/bakeryImg/' + oldFilename
        }], TEXT.UploadSuccess);
        res.send(response);
    })
})

// 登入 (OK)
app.post("/login", function async (req, res) {
    const account = req.body.account;
    const password = req.body.password;

    db.query(`SELECT u.FUserId , u.FUserName, u.FAvatar, l.FListName, l.FListKey, r.FRoleId, r.FRoleName  FROM user u 
              LEFT JOIN auth a on  u.FRoleId = a.FRoleId 
              LEFT JOIN role r on  r.FRoleId = a.FRoleId  
              LEFT JOIN list l on a.FListId = l.FListId  
              WHERE u.FAccount='${account}' AND u.FPassword='${password}'`, function (err, result, field) {
        if (err) {
            writeLogToFile('/login API Error :' + err, true)
            const response = apiResponse(20099, err, TEXT.LoginException);
            return res.send(response);
        } else {
            if (result.length === 0) {
                writeLogToFile('/login API Error : 查無帳號密碼', true)
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
                writeLogToFile('/login API : ' + result[0].FRoleName + TEXT.LoginSuccess)
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
            writeLogToFile('Search ' + tableName + ' Table Error Log :' + err, true)
            throw err;
        } else {
            writeLogToFile('Search ' + tableName + ' Table : ' + TEXT.SearchSuccess)
            const response = apiResponse(20000, rows, TEXT.SearchSucces);
            return resFunction.send(response);
        }
    });
    return res;
};

// 查詢 DB 所有的資料表
app.post('/db/table', function async (req, res) {
    db.query(`select TABLE_NAME from information_schema.tables where TABLE_SCHEMA='cra-website'`, function async (err, tableName, fields) {
        let response;
        if (err) {
            writeLogToFile('/db/table Error : ' + err, true);
            response = apiResponse(20099, [], TEXT.SearchFail);
        } else {
            writeLogToFile('/db/table : ' + TEXT.SearchSuccess);
            response = apiResponse(20000, tableName, TEXT.SearchSuccess);
        }
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

// 取得麵包坊銷售紀錄
app.post("/bakery/order/list", function async (req, res) {
    querySelectList('bakery_order', res);
})

// 取得麵包坊商品
app.post("/bakery/item/list", function async (req, res) {
    querySelectList('bakery_item', res);
})

// 取得麵包坊銷售明細
app.post("/bakery/order/detail/list", function async (req, res) {
    querySelectList('bakery_order_detail', res);
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

// 取得訂單狀態
app.post("/bakery/order/status/list", function async (req, res) {
    querySelectList('bakery_order_status', res);
});

// 取得指定商品  (OK)
app.post("/bakery/item/item", function async (req, res) {
    const FBakeryItemId = req.body.FBakeryItemId;
    db.query(`SELECT * from bakery_item WHERE FBakeryItemId = '${FBakeryItemId}'`, function (err, result) {
        let finalResponse = '';
        if (err) {
            writeLogToFile('/bakery/item/item - 取得指定商品庫存失敗 : ' + err, true);
            finalResponse = apiResponse(20099, [], TEXT.SearchFail);
        } else {
            writeLogToFile('/bakery/item/item - 取得指定商品庫存成功');
            finalResponse = apiResponse(20000, result, TEXT.SearchSuccess);
        }
        res.send(finalResponse).end();
    })
});

// 取得麵包坊列表 (OK)
app.post("/openapi/bakery/item/list", function async (req, res) {
    db.query(`SELECT * FROM bakery_item m 
              LEFT JOIN bakery_ingredients s on m.FBakeryIngredientId = s.FBakeryIngredientId 
              LEFT JOIN bakery_material l on s.FBakeryMaterialId = l.FBakeryMaterialId`, function (err, result) {
        if (err) {
            writeLogToFile('/openapi/bakery/item/list API Error : ' + err, true);
            const finalResponse = apiResponse(20000, err, TEXT.SearchFail);
            res.send(finalResponse);
        } else {
            const resultObj = {};
            const movedBakeryItemId = [];
            result.forEach((item) => {
                if (!!~movedBakeryItemId.indexOf(item.FBakeryItemId)) {
                    resultObj[item.FBakeryItemId]['ingredients'].push(item.FBakeryMaterialName);
                } else {
                    item['ingredients'] = [];
                    resultObj[item.FBakeryItemId] = item;
                    movedBakeryItemId.push(item.FBakeryItemId);
                }
            })
            const apiResult = Object.values(resultObj);
            writeLogToFile('/openapi/bakery/item/list API : ' + TEXT.SearchSucces);
            const finalResponse = apiResponse(20000, apiResult, TEXT.SearchSucces);
            res.send(finalResponse);

        }
    })
})

// 取得訂單列表 (OK)
app.post("/openapi/bakery/order/list", function async (req, res) {
    db.query(`SELECT o.FOrderNumber,s.FOrderStatusName,o.FOrderId,s.FOrderStatusId,s.FOrder,o.FUserId,o.FTotalPrice,o.FCreateDate,u.FUserName FROM bakery_order o 
              LEFT JOIN user u on o.FUserId = u.FUserId 
              LEFT JOIN bakery_order_status s on s.FOrderStatusId = o.FOrderStatusId`, function (err, result) {
        if (err) {
            writeLogToFile('/openapi/bakery/order/list API Error : ' + err, true);
            const finalResponse = apiResponse(20099, err, TEXT.SearchFail);
            res.send(finalResponse);
        } else {
            console.log(result);
            writeLogToFile('/openapi/bakery/order/list API : ' + TEXT.SearchSucces);
            const finalResponse = apiResponse(20000, result, TEXT.SearchSucces);
            res.send(finalResponse);

        }
    })
})



// 取得整筆訂單明細列表 (OK)
app.post("/openapi/bakery/getSpecifyOrderDetail", function async (req, res) {
    const FOrderId = req.body.id;
    console.log('FOrderId:', FOrderId)
    db.query(`SELECT o.FOrderId,o.FOrderNumber,o.FTotalPrice as 'FOrderTotalPrice' , od.FBakeryItemName,od.FCount,od.FUnitPrice,od.FTotalPrice as 'FOrderDetailTotalPrice' FROM  bakery_order o 
              LEFT JOIN bakery_order_detail  od ON o.FOrderId = od.FOrderId WHERE od.FOrderId = '${FOrderId}'`,
        function (err, result) {
            if (err) {
                writeLogToFile('/openapi/bakery/order/list API Error : ' + err, true);
                console.log(err);
                const finalResponse = apiResponse(20099, err, TEXT.SearchFail);
                res.send(finalResponse);
            } else {
                console.log(result);
                writeLogToFile('/openapi/bakery/order/list API : ' + TEXT.SearchSucces);
                const finalResponse = apiResponse(20000, result, TEXT.SearchSucces);
                res.send(finalResponse);
            }
        })
})

// 建立使用者 (OK)
app.post("/user/create", function async (req, res) {
    const body = req.body;
    body.FUserId = _uuid();
    db.query('INSERT INTO user SET ?', body, function (err, results, fields) {
        let finalResponse;
        if (err) {
            writeLogToFile('/user/create Error : ' + err, true);
            finalResponse = apiResponse(20099, [], TEXT.RegisterFail);
        } else {
            delete body.FAccount;
            delete body.FPassword;
            writeLogToFile('/user/create : ' + TEXT.RegisterSuccess);
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
                writeLogToFile('/bakery/item/delete - 刪除成分失敗 : ' + err, true);
                reject(err);
            } else {
                writeLogToFile('/bakery/item/delete - 刪除成分成功');
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
                writeLogToFile('/bakery/item/delete - 刪除商品失敗 : ' + err, true);
                reject();
            } else {
                writeLogToFile('/bakery/item/delete - 刪除商品成功');
                resolve();
            }
        });
    })
    Promise.all([itemPromise, ingredientsPromse]).then(() => {
        const finalResponse = apiResponse(20000, [], TEXT.DeleteSuccess);
        res.send(finalResponse).end();
    }).catch((e) => {
        writeLogToFile('/bakery/item/delete - 刪除商品異常 : ' + e, true);
    })
})

// 更新訂單 
app.post("/bakery/order/update", function async (req, res) {
    const conditions = req.body.conditions;
    const body = JSON.parse(JSON.stringify(req.body));
    delete body.conditions;

    db.query('update bakery_order set ? where ' + conditions[0].field + ' = ?', [body, conditions[0].value], function (err, fields) {
        if (err) {
            writeLogToFile('/bakery/order/status/update - 更新訂單狀態失敗 : ' + err, true);
        } else {
            writeLogToFile('/bakery/order/status/update - 更新訂單狀態成功');
            const finalResponse = apiResponse(20000, [], TEXT.UpdateSuccess);
            res.send(finalResponse).end();
        }
    });
})

// 更新產品
app.post("/bakery/item/update", function async (req, res) {
    const body = req.body;
    let allMaterial = [];
    let curMaterial = [];
    let editMaterial = body.ingredients;
    delete body.ingredients;
    // 更新商品
    const updateItem = new Promise((resolve, reject) => {
        db.query('update bakery_item set ? where FBakeryItemId = ?', [body, body.FBakeryItemId], function (err, fields) {
            if (err) {
                writeLogToFile('/bakery/item/update - 更新商品失敗 : ' + err, true);
                reject(err);
            } else {
                writeLogToFile('/bakery/item/update - 更新商品成功');
                resolve();
            }
        });
    });

    // 取得所有原料
    const getAllMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_material`, function (err, rows, fields) {
            if (err) {
                writeLogToFile('/bakery/item/update - 取得所有原料失敗 : ' + err, true);
                reject(err)
            } else {
                allMaterial = rows;
                writeLogToFile('/bakery/item/update - 取得所有原料成功');
                resolve(allMaterial);
            }
        });
    });

    // 取得現有組成成分
    const getCurMaterial = new Promise((resolve, reject) => {
        db.query(`SELECT * FROM bakery_ingredients WHERE FBakeryIngredientId = '${body.FBakeryIngredientId}'`, function (err, rows, fields) {
            if (err) {
                writeLogToFile('/bakery/item/update - 取得現有組成成分失敗 : ' + err, true);
                reject(err)
            } else {
                curMaterial = rows;
                writeLogToFile('/bakery/item/update - 取得現有組成成分成功');
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
                    return allItem.FBakeryMaterialName === item;
                })
                return filterAry[0];
            })
        }
        if (action.delete.length > 0) {
            action.delete = action.delete.map((item) => {
                const filterAry = allMaterial.filter((allItem) => {
                    return allItem.FBakeryMaterialName === item;
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
                    const rowBody = [body.FBakeryIngredientId, item.FBakeryMaterialId, item.FBakeryMaterialName];
                    apiBody.push(rowBody);
                })

                db.query(sql, [apiBody], function (err, fields) {
                    if (err) {
                        writeLogToFile('/bakery/item/update - 新增組成成分失敗 : ' + err, true);
                        reject(err);
                    } else {
                        writeLogToFile('/bakery/item/update - 新增組成成分成功');
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
                            writeLogToFile('/bakery/item/update - 刪除組成成分失敗:' + err, true);
                            insertPromise.reject(err);
                        } else {
                            writeLogToFile('/bakery/item/update - 刪除組成成分成功');
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
                    writeLogToFile('/bakery/item/update - 刪除組成成分失敗:' + err, true);
                } else {
                    writeLogToFile('/bakery/item/update - 刪除組成成分成功');
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


// 建立原料 (OK)
app.post("/bakery/material/create", function async (req, res) {
    const body = req.body;
    body.FBakeryMaterialId = _uuid();

    db.query(`SELECT * from bakery_material WHERE FBakeryMaterialName = '${body.FBakeryMaterialName}'`, function (err, rows, field) {
        if (rows.length === 0) {
            db.query('INSERT INTO bakery_material SET ?', body, function (err, results, fields) {
                if (err) {
                    writeLogToFile('/bakery/material/create - 建立原料失敗 : ' + err, true);
                    throw err;
                } else {
                    writeLogToFile('/bakery/material/create - 建立原料成功');
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

// 建立商品 (OK)
app.post("/bakery/item/create", function async (req, res) {
    const body = req.body;
    const FBakeryIngredientId = _uuid();
    const FBakeryItemId = _uuid();
    body.FBakeryIngredientId = FBakeryIngredientId;
    body.FBakeryItemId = FBakeryItemId;
    const ingredientPromise = new Promise((resolve, reject) => {
        let materialSelectSQL = `SELECT * from bakery_material WHERE `;
        body.ingredients.forEach((item, index) => {
            if (index === 0) materialSelectSQL += `FBakeryMaterialName = '${item}'`;
            else materialSelectSQL += ` OR FBakeryMaterialName = '${item}'`
        })
        // 新增麵包坊組成成分紀錄
        db.query(materialSelectSQL, function (err, rows, field) {
            rows.forEach((item) => {
                const ingredientsBody = {
                    FBakeryIngredientId,
                    FBakeryMaterialId: item.FBakeryMaterialId,
                    FBakeryMaterialName: item.FBakeryMaterialName
                };
                db.query('INSERT INTO bakery_ingredients SET ?', ingredientsBody, function (err, results, fields) {
                    if (err) {
                        writeLogToFile('/bakery/item/create - 新增麵包坊組成成分紀錄失敗: ' + err, true);
                        reject(err);
                    } else {
                        writeLogToFile('/bakery/item/create - 新增麵包坊組成成分紀錄成功');
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
            FBakeryItemName: body.FBakeryItemName,
            FUnitPrice: body.FUnitPrice,
            FStorageCount: body.FStorageCount,
            FStorageDays: body.FStorageDays,
            FStorageMethod: body.FStorageMethod,
        }
        // 新增麵包坊商品紀錄
        db.query('INSERT INTO bakery_item SET ?', itemBody, function (err, results, fields) {
            if (err) {
                writeLogToFile('/bakery/item/create - 新增麵包坊商品紀錄失敗: ' + err, true);
                reject(err);
            } else {
                console.log('/bakery/item/create - 新增麵包坊商品紀錄成功');
                resolve();
            }
        });
    });


    Promise.all([ingredientPromise, itemPromise]).then(() => {
        console.log('建立商品完成');
        const finalResponse = apiResponse(20000, [body], TEXT.CreateSuccess);
        return res.send(finalResponse)
    }).catch((e) => {
        const finalResponse = apiResponse(20099, e, TEXT.CreateFail);
        return res.send(finalResponse)
    })


});

// 建立麵包坊銷售紀錄
app.post("/openapi/bakery/order/create", function async (req, res) {
    const body = req.body;
    const FOrderId = _uuid();
    const promise = new Promise((resolve, reject) => {
        const curDateAry = new Date().toLocaleDateString().split('-');
        if (curDateAry[1].length === 1) curDateAry[1] = '0' + curDateAry[1].toString();
        if (curDateAry[2].length === 1) curDateAry[2] = '0' + curDateAry[2].toString();
        const orderNumberLike = 'BK-' + curDateAry[0] + curDateAry[1] + curDateAry[2];

        db.query(`SELECT FOrderNumber FROM bakery_order WHERE FOrderNumber LIKE '` + orderNumberLike + `%' order by FOrderNumber desc `, function (err, rows, fields) {
            if (err) {
                writeLogToFile('Search Order Table Error Log :' + err, true)
                throw err;
            } else {
                writeLogToFile('Search Order Table : ' + TEXT.SearchSuccess)
                let currentNumber = (rows.length === 0) ? 1 : (parseInt(rows[0].FOrderNumber.split('-')[rows[0].FOrderNumber.split('-').length - 1]) + 1);
                if (currentNumber.toString().length === 1) currentNumber = currentNumber.toString().padStart(3, '0')
                if (currentNumber.toString().length === 2) currentNumber = currentNumber.toString().padStart(2, '0')
                const FOrderNumber = orderNumberLike + '-' + currentNumber;
                resolve(FOrderNumber);

            }
        });
    });

    promise.then((FOrderNumber) => {
        const apiBody = {
            FUserId: body.FUserId,
            FTotalPrice: body.orderTotalPrice,
            FOrderId,
            FOrderNumber: FOrderNumber,
            FOrderStatusId: '7df08db2-91f1-41ec-8f86-60bcb7a3564e' //等待確定訂單
        };
        // 新增麵包坊銷售紀錄
        db.query('INSERT INTO bakery_order SET ?', apiBody, function (err, result) {
            if (err) {
                writeLogToFile('/bakery/order/create - 新增麵包坊銷售紀錄失敗: ' + err, true);
                promise.catch(err);
            } else {
                writeLogToFile('/bakery/order/create - 新增麵包坊銷售紀錄成功，FOrderId :', FOrderId);
            }
        });
    }).then(() => {
        console.log(FOrderId);
        // 新增麵包坊銷售明細
        const sql = `INSERT INTO bakery_order_detail (FOrderDetailId,FOrderId,FBakeryItemId,FBakeryItemName,FCount,FUnitPrice,FTotalPrice) VALUES ?`;
        const apiBody = [];
        body.orderList.forEach((item) => {
            const rowBody = [_uuid(), FOrderId, item.FBakeryItemId, item.FBakeryItemName, item.FCount, item.FUnitPrice, item.FTotalPrice];
            apiBody.push(rowBody);
        })

        db.query(sql, [apiBody], function (err, result) {
            let response;
            if (err) {
                writeLogToFile('/bakery/order/create - 新增麵包坊銷售明細失敗:', err);
            } else {
                writeLogToFile('/bakery/order/create - 新增麵包坊銷售明細成功');
            }
        });
    }).then(() => {
        const sql = 'UPDATE bakery_item SET FStorageCount = ? WHERE FBakeryItemId = ?';
        let sqls = '';
        body.orderList.forEach((item) => {
            const storageCOunt = item.FStorageCount - item.FCount;
            const rowBody = [storageCOunt, item.FBakeryItemId];
            sqls += mysql.format(sql, rowBody) + ';';
        })
        // 更新商品庫存
        db.query(sqls, function (err, restuls, fields) {
            let response;
            if (err) {
                writeLogToFile('/bakery/order/create - 更新麵包坊商品庫存失敗:', err.toString());
                console.log(err);
                response = apiResponse(20099, [], TEXT.CheckOutFail);
            } else {
                writeLogToFile('/bakery/order/create - 更新麵包坊商品庫存成功');
                response = apiResponse(20000, [], TEXT.CheckOutSuccess);
            }
            res.send(response);
        });
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

// 寫 Log 檔
function writeLogToFile(log, hasError) {
    const parselog = (typeof (log) === 'object') ? JSON.stringify(log) : log.toString();
    const message = new Date().toString() + ' : ' + parselog + ' \r\n';
    if (hasError) {
        fs.appendFile('./error-log.txt', message, function (err) {
            if (err) throw err;
        });
    }

    fs.appendFile('./log.txt', message, function (err) {
        if (err) throw err;
    });
}