import React, { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Button } from '@mui/material';

class BakeryManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectItemId: [],
            selectItemData: []
        }
        this.getData = this.getData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);

    }

    componentDidMount = () => {
        this.getData();
    }

    // 編輯
    doEdit = () => {
        alert('do Edit');
    }

    // 新增
    doCreate = () => {
        alert('do Create');
    }

    // 刪除
    doDelete = () => {
        alert('請選擇一筆')
    }

    // handle 勾選
    handleSelect = (item) => {
        console.log(item);
        const state = {};
        const itemData = [];
        if (item.length > 0)
            item.forEach((item) => {
                this.state.data.forEach((dataItem) => {
                    if (dataItem.id === item) itemData.push(dataItem);
                })
            })

        state.selectItemData = itemData;
        state.selectItemId = item
        this.setState(state)

    }

    // handle 點擊列
    handleRowClick = (item) => {
        console.log(item);
    }

    // 取得資料
    getData = () => {
        const data = [{
            title: '麵包一',
            unitPrice: 100,
            remaind: 0,
            ingredients: ['麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '鮮奶', '紅豆'],
            storageDays: 3,
            storageMethod: '12小時內未食用完必須冰冷藏',
            id: 0
        }, {
            id: 1123,
            title: '麵包2',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 2,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 3,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 4,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 5,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 6,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 7,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 8,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 9,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 10,
            title: '麵包32',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }]

        this.setState({
            data
        })
    }
    render() {
        const columns = [
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'title', headerName: '名稱', width: 150 },
            { field: 'ingredients', headerName: '成分', width: 150, sortable: false, },
            {
                field: 'storageDays',
                headerName: '保存天數',
                type: 'number',
                width: 80,
            },
            {
                field: 'storageMethod',
                headerName: '保存方法',
                description: '各種商品保存方法皆不同，請特別注意',
                sortable: false,
                width: 200,
            },
            {
                field: 'unitPrice',
                headerName: '單價',
                type: 'number',
                width: 50,
            },
            {
                field: 'remaind',
                headerName: '庫存',
                type: 'number',
                width: 50,
            },
        ];

        return (
            <Grid container>
                <Grid item xs={12}>
                    Bakery 後臺管理系統
                </Grid>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '50px' }}>
                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={this.doDelete} disabled={(this.state.selectItemData.length === 0) ? true : false}>
                            刪除
                        </Button>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={this.doCreate}>
                            新增
                        </Button>
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={this.doEdit} disabled={(this.state.selectItemData.length !== 1) ? true : false}>
                            編輯
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ height: 680, width: '800px' }}>
                        <DataGrid
                            rows={this.state.data}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onRowClick={this.handleRowClick}
                            onSelectionModelChange={this.handleSelect}
                        />
                    </div>
                </Grid>
            </Grid >
        );
    }
}

export default BakeryManage;
