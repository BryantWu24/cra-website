import React, { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Button } from '@mui/material';
import BakerySheet from './BakerySheet';

class BakeryManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectItemId: [],
            selectItemData: [],
            mode: 'list',
            title: '商品清單'
        }
        this.getData = this.getData.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.showList = this.showList.bind(this);

    }

    componentDidMount = () => {
        this.getData();
    }

    showList = async () => {
        await this.setState({
            mode: 'list',
            title: '商品清單'
        })
        await this.getData();

    }

    // 編輯
    doEdit = () => {
        this.setState({
            mode: 'edit',
            title: '編輯商品'
        })
        console.log('this.state.selectItemData:', this.state.selectItemData)
    }

    // 新增
    doCreate = () => {
        this.setState({
            mode: 'create',
            title: '新增商品'
        })
    }

    // 刪除
    doDelete = () => {
        if (this.state.selectItemData.length === 0 || this.state.selectItemId.length === 0)
            alert('請選擇一筆')

        this.getData();
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
            productName: '麵包一',
            unitPrice: 100,
            storageCount: 0,
            ingredients: ['麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '麵粉', '鮮奶', '紅豆'],
            storageDays: 3,
            storageMethod: '12小時內未食用完必須冰冷藏',
            id: 0
        }, {
            id: 1123,
            productName: '麵包2',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 2,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 3,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 4,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 5,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 6,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 7,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 8,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 9,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 10,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
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
            { field: 'productName', headerName: '名稱', width: 150 },
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
                field: 'storageCount',
                headerName: '庫存',
                type: 'number',
                width: 50,
            },
        ];

        return (
            <Grid container>
                <Grid item xs={12}>
                    Bakery 後臺管理系統 - {this.state.title}
                </Grid>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px' }}>
                        <div>
                            <Button variant="outlined" startIcon={<ListAltIcon />} onClick={this.showList} disabled={(this.state.mode === 'list') ? true : false}>
                                商品清單
                            </Button>
                        </div>
                        <div>
                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={this.doDelete} disabled={(this.state.selectItemData.length === 0) ? true : (this.state.mode === 'list') ? false : true}>
                                刪除
                            </Button>
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={this.doCreate} disabled={(this.state.mode === 'create') ? true : false}>
                                新增
                            </Button>
                            <Button variant="outlined" startIcon={<EditIcon />} onClick={this.doEdit} disabled={(this.state.selectItemData.length !== 1) ? true : (this.state.mode === 'list') ? false : true}>
                                編輯
                            </Button>
                        </div>
                    </div>
                </Grid>
                {
                    (this.state.mode === 'list')
                        ?
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
                        :
                        <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                            <BakerySheet data={this.state.selectItemData} mode={this.state.mode} />
                        </Grid>
                }


            </Grid >
        );
    }
}

export default BakeryManage;
