
import React, { Component } from 'react'
import BakeryCard from '../../components/BakeryCard'
import {
    Grid,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    DialogContent,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Divider,
    SpeedDialAction,
    SpeedDial,
    IconButton
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

const actions = [
    { icon: <ShoppingCartIcon />, name: '購物清單' },
];

export default class Bakery extends Component {

    constructor() {
        super();

        this.state = {
            newsData: [],
            isCartDialogOpen: false,
            count: 0,
            currentProductInfo: {
                ingredients: [],
                price: 0,
                storageCount: 0,
                storageDays: 0,
                storageMethod: "",
                title: ""
            },
            orderList: [],
            orderTotalPrice: 0,
            isOrderListDialogOpen: false
        }

        this.getNewsData = this.getNewsData.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleProductInfo = this.handleProductInfo.bind(this);
        this.addCart = this.addCart.bind(this);
        this.openOrderListDialog = this.openOrderListDialog.bind(this);
        this.doCheckOut = this.doCheckOut.bind(this);
    }

    // 開啟購物清單 Dialog
    openOrderListDialog = () => {
        this.countOrderTotalPrice();
        const state = {};
        state.isOrderListDialogOpen = true;
        this.setState(state)
    }
    // 購物清單數量增加
    orderListAdd = async (row, index) => {
        const orderList = this.state.orderList;

        if (orderList[index].storageCount > orderList[index].count) {
            orderList[index].count++;
            orderList[index].totalPrice = orderList[index].count * orderList[index].unitPrice;
            await this.setState({ orderList });
            this.countOrderTotalPrice();
        } else {
            alert('庫存數量不足，無法增加');
        }
    }
    // 購物清單數量減少
    orderListDecrease =async (row, index) => {
        const orderList = this.state.orderList;

        if (orderList[index].count === 1) orderList.splice(index, 1);
        else {
            orderList[index].count--;
            orderList[index].totalPrice = orderList[index].count * orderList[index].unitPrice;
        }
        await this.setState({ orderList });
        this.countOrderTotalPrice();
    }
    // 購物清單刪除
    orderListDelete =async (row, index) => {
        const orderList = this.state.orderList;
        orderList.splice(index, 1);
        await this.setState({ orderList });
        this.countOrderTotalPrice();
    }

    // 接收到代表點擊新增購物按鈕
    handleProductInfo = (info) => {
        this.setState({
            currentProductInfo: info,
            isCartDialogOpen: true
        })
    }

    // 計算訂單總金額
    countOrderTotalPrice = async ()=>{
        const orderList = this.state.orderList;
        const state = {};
        if (orderList.length > 0) {
            let orderTotalPrice = 0;
            orderList.forEach((item) => {
                orderTotalPrice += item.totalPrice
            })
            state.orderTotalPrice = orderTotalPrice;
        }
        await this.setState(state);
    }

    // 加入購物車
    addCart = () => {
        if (this.state.count !== 0) {
            const curOrderList = this.state.orderList;
            const orderInfo = {}
            const profile = JSON.parse(localStorage.getItem('profile'));
            orderInfo.orderer = profile.name;
            orderInfo.productName = this.state.currentProductInfo.productName;
            orderInfo.count = this.state.count;
            orderInfo.storageCount = this.state.currentProductInfo.storageCount
            orderInfo.unitPrice = this.state.currentProductInfo.unitPrice
            orderInfo.totalPrice = this.state.currentProductInfo.unitPrice * this.state.count;
            orderInfo.orderStatus = '備貨中'
            curOrderList.push(orderInfo);
            this.setState({
                isCartDialogOpen: false,
                count: 0,
                orderList: curOrderList
            })
            console.log('加入購物車資訊：', curOrderList)
        } else {
            alert('請選擇數量')
        }
    }

    // 關閉 Dialog
    closeDialog = (mode) => {
        const state = {};
        switch (mode) {
            case 'orderList':
                state.isOrderListDialogOpen = false;
                break;
            case 'cart':
                state.isCartDialogOpen = false;
                break;
            default:
                break;
        }
        this.setState(state)
    }

    // handle 購買數量
    handleCountChange = ($event) => {
        this.setState({
            count: $event.target.value || 0
        })
    }

    // 設定數量下拉選單
    setSelectCountOption = () => {
        const storageCount = this.state.currentProductInfo.storageCount;
        const ele = [];
        for (let i = 0; i < storageCount; i++) {
            ele.push(<MenuItem key={i} value={i}>{i}</MenuItem>)
        }

        if (ele.length === 0)
            return (<div> 不好意思，商品已全數售出</div>)
        else
            return (
                <FormControl fullWidth>
                    <InputLabel id="count-select-label">請選擇要購買的數量</InputLabel>
                    <Select
                        labelId="count-select-label"
                        id="count-select"
                        value={this.state.count}
                        label="請選擇要購買的數量"
                        onChange={this.handleCountChange}
                    >
                        {ele}
                    </Select>
                </FormControl>
            )
    }

    // 取得資料
    getNewsData = () => {
        const data = [{
            productName: '麵包一',
            unitPrice: 100,
            productImgUrl: '/bakeryImg/01.jpg',
            storageCount: 0,

            ingredients: ['麵粉', '鮮奶', '紅豆'],
            storageDays: 3,
            storageMethod: '12小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包2',
            unitPrice: 80,
            productImgUrl: '/bakeryImg/02.jpg',
            storageCount: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包3',
            unitPrice: 60,
            productImgUrl: '/bakeryImg/03.jpg',
            storageCount: 7,
            ingredients: ['麵粉', '鮮奶', '糖粉', '花生'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包4',
            unitPrice: 110,
            productImgUrl: '/bakeryImg/04.jpg',
            storageCount: 2,
            ingredients: ['無鹽奶油', '鮮奶', '水'],
            storageDays: 3,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包5',
            unitPrice: 60,
            productImgUrl: '/bakeryImg/05.jpg',
            storageCount: 7,
            ingredients: ['麵粉', '鮮奶', '糖粉', '花生'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包6',
            unitPrice: 110,
            productImgUrl: '/bakeryImg/06.jpg',
            storageCount: 2,
            ingredients: ['無鹽奶油', '鮮奶', '水'],
            storageDays: 3,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }, {
            productName: '麵包7',
            unitPrice: 110,
            productImgUrl: '/bakeryImg/07.jpg',
            storageCount: 2,
            ingredients: ['無鹽奶油', '鮮奶', '水'],
            storageDays: 3,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }]

        this.setState({
            newsData: data
        })
    }

    // 結帳
    doCheckOut = () => {
        alert('結帳')
    }
    componentDidMount = () => {
        this.getNewsData();
    }

    render() {
        return (
            <div style={{ width: '100%', padding: '0.5rem' }}>
                <Grid container spacing={2}>
                    {
                        this.state.newsData.map((item, idx) => {
                            return (<Grid style={{ display: 'flex', justifyContent: "center" }} item xs={12} sm={6} md={3} lg={2} key={idx} ><BakeryCard data={item} productInfo={this.handleProductInfo} /></Grid>)
                        })
                    }
                </Grid>
                {/* 購物 Dialog */}
                <Dialog open={this.state.isCartDialogOpen} disableEscapeKeyDown id="cart-dialog" >
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >{this.state.currentProductInfo.productName}</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {
                            (this.state.currentProductInfo.storageCount === 0)
                                ?
                                <div></div>
                                :
                                <div style={{ background: '#959595', color: 'white', marginBottom: '1rem' }} >
                                    單價：$ {this.state.currentProductInfo.unitPrice}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 總金額： {this.state.currentProductInfo.unitPrice * this.state.count} 元
                                </div>
                        }
                        <div>
                            {this.setSelectCountOption()}
                        </div>
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.closeDialog('cart') }}>取消</Button>
                        {
                            (this.state.currentProductInfo.storageCount === 0)
                                ?
                                <div></div>
                                :
                                <Button color="secondary" onClick={this.addCart} >加入購物車</Button>
                        }
                    </DialogActions>
                </Dialog>
                {/* 購物清單 Dialog */}
                <Dialog open={this.state.isOrderListDialogOpen} disableEscapeKeyDown id="order-list-dialog" >
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >購物清單</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {
                            (this.state.orderList.length > 0)
                                ?
                                <div>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>商品名稱</TableCell>
                                                    <TableCell align="center">單價</TableCell>
                                                    <TableCell align="center">數量</TableCell>
                                                    <TableCell align="center">總價</TableCell>
                                                    <TableCell align="center">庫存數量</TableCell>
                                                    <TableCell align="center">功能</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.orderList.map((row, index) => (
                                                    <TableRow
                                                        key={row.productName}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.productName}
                                                        </TableCell>
                                                        <TableCell align="center">{row.unitPrice}</TableCell>
                                                        <TableCell align="center">{row.count}</TableCell>
                                                        <TableCell align="center">{row.totalPrice}</TableCell>
                                                        <TableCell align="center">{row.storageCount}</TableCell>
                                                        <TableCell align="center" >
                                                            <IconButton color="primary" aria-label="upload picture" component="span" onClick={(() => { this.orderListAdd(row, index) })}>
                                                                <AddIcon />
                                                            </IconButton>
                                                            <IconButton color="primary" aria-label="upload picture" component="span" onClick={(() => { this.orderListDecrease(row, index) })}>
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <IconButton color="primary" aria-label="upload picture" component="span" onClick={(() => { this.orderListDelete(row, index) })}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <Divider />
                                    消費總金額：{this.state.orderTotalPrice}
                                </div>
                                :
                                <div>
                                    您尚未購買任何商品唷!
                                </div>
                        }
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.closeDialog('orderList') }}>關閉</Button>
                        {(this.state.orderList.length > 0)
                            ?
                            <Button color="secondary" onClick={this.doCheckOut}>結帳</Button>
                            :
                            <div></div>}
                    </DialogActions>
                </Dialog>
                <SpeedDial
                    ariaLabel="購物"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SettingsIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={this.openOrderListDialog}
                        />
                    ))}
                </SpeedDial>
            </div>
        )
    }
}
