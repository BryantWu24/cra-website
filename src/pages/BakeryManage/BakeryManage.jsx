import React, { Component } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Button } from '@mui/material';
import BakerySheet from './BakerySheet';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Config } from '../../core/config'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        this.getBakeryItem();
    }

    showList = async () => {
        await this.setState({
            mode: 'list',
            title: '商品清單'
        })
        await this.getBakeryItem();
    }

    // 顯示通知框
    showSnackbar = async (severity, msg) => {
        await this.setState({
            snackbarMsg: msg,
            alertSeverity: severity,
            isSnackbarOpen: true
        })
    }

    // 取得商品清單
    getBakeryItem = async () => {
        await axios
            .post(Config.apiUrl + "/bakery/item/list")
            .then((res) => {
                if (!!res.data) {
                    switch (res.data.code.toString()) {
                        case '20000':
                            console.log('bakery item list :', res.data);
                            const data = res.data.data;
                            const tableData = []
                            data.forEach((item, index) => {
                                tableData.push({
                                    productName: '麵包一',
                                    unitPrice: item.FUnitPrice,
                                    storageCount: item.FStorageCount,
                                    ingredients: ['1', '2', '3', '4', '5', '6'],
                                    storageDays: item.FStorageDays,
                                    storageMethod: item.FStorageMethod,
                                    id: index
                                })
                            })
                            this.setState({
                                data: tableData
                            })

                            break;
                        default:
                            break;
                    }
                } else this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。');
            })
            .catch((e) => { this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。'); });
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
            title: '新增商品',
            selectItemData: [],
            selectItemId: []
        })
    }

    // 刪除
    doDelete = () => {
        if (this.state.selectItemData.length === 0 || this.state.selectItemId.length === 0)
            alert('請選擇一筆')

        this.getBakeryItem();
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
            ingredients: ['1', '2', '3', '4', '5', '6'],
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
            ingredients: ['麵粉', '奶油', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            id: 3,
            productName: '麵包32',
            unitPrice: 80,
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '巧克力'],
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
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.state.isSnackbarOpen}
                    autoHideDuration={5000}
                    onClose={() => { this.handleSnackbarState('close') }}
                    key={'top center'}
                >
                    <Alert onClose={() => { this.handleSnackbarState('close') }} severity={this.state.alertSeverity} sx={{ width: '100%' }}>
                        {this.state.snackbarMsg}
                    </Alert>
                </Snackbar>
                <Grid item xs={12}>
                    Bakery 後臺管理系統 - {this.state.title}
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '1rem' }}>
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
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={this.doCreate} disabled={(this.state.mode !== 'list') ? true : false}>
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
