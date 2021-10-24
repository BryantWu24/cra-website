
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
    SpeedDial
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
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
                remaind: 0,
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
        this.doOrder = this.doOrder.bind(this);
        this.openOrderListDialog = this.openOrderListDialog.bind(this);
        this.doCheckOut = this.doCheckOut.bind(this);

    }

    // 開啟購物清單 Dialog
    openOrderListDialog = () => {
        const orderList = this.state.orderList;
        const state = {};
        if (orderList.length > 0) {
            let orderTotalPrice = 0;
            orderList.forEach((item) => {
                orderTotalPrice += item.totalPrice
            })
            state.orderTotalPrice = orderTotalPrice;
        }
        state.isOrderListDialogOpen = true;
        this.setState(state)
    }

    // 接收到代表點擊新增購物按鈕
    handleProductInfo = (info) => {
        console.log(info);
        this.setState({
            currentProductInfo: info,
            isCartDialogOpen: true
        })
    }

    // 下單
    doOrder = () => {
        if (this.state.count !== 0) {
            const curOrderList = this.state.orderList;
            const orderInfo = {}
            const profile = JSON.parse(localStorage.getItem('profile'));
            orderInfo.orderer = profile.name;
            orderInfo.productName = this.state.currentProductInfo.title;
            orderInfo.count = this.state.count;
            orderInfo.unitPrice = this.state.currentProductInfo.unitPrice
            orderInfo.totalPrice = this.state.currentProductInfo.unitPrice * this.state.count;
            orderInfo.orderStatus = '備貨中'
            curOrderList.push(orderInfo);
            this.setState({
                count: 0,
                orderList: curOrderList,
                isCartDialogOpen: false
            })
            console.log('下單資訊：', curOrderList)
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
        const remaind = this.state.currentProductInfo.remaind;
        const ele = [];
        for (let i = 0; i < remaind; i++) {
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
            title: '麵包一',
            unitPrice: 100,
            remaind: 0,
            ingredients: ['麵粉', '鮮奶', '紅豆'],
            storageDays: 3,
            storageMethod: '12小時內未食用完必須冰冷藏'
        }, {
            title: '麵包2',
            unitPrice: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }]

        this.setState({
            newsData: data
        })
    }
    
    // 結帳
    doCheckOut = () => {

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
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >{this.state.currentProductInfo.title}</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {
                            (this.state.currentProductInfo.remaind === 0)
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
                            (this.state.currentProductInfo.remaind === 0)
                                ?
                                <div></div>
                                :
                                <Button color="secondary" onClick={this.doOrder} >加入購物車</Button>
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

                                    <table >
                                        <thead>
                                            <tr style={{ border: '1px black solid' }}>
                                                <th style={{ border: '1px black solid' }}>商品名稱</th>
                                                <th style={{ border: '1px black solid' }}>單價</th>
                                                <th style={{ border: '1px black solid' }}>數量</th>
                                                <th style={{ border: '1px black solid' }}>總價</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.orderList.map((item, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td style={{ border: '1px black solid' }}>{item.productName}</td>
                                                            <td style={{ border: '1px black solid' }}>{item.unitPrice}</td>
                                                            <td style={{ border: '1px black solid' }}>{item.count}</td>
                                                            <td style={{ border: '1px black solid' }}>{item.totalPrice}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
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
