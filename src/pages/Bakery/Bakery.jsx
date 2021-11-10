
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
import axios from 'axios';
import { Config } from '../../core/config';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const actions = [
    { icon: <ShoppingCartIcon />, name: '購物清單' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default class Bakery extends Component {

    constructor() {
        super();

        this.state = {
            isSnackbarOpen: false,
            alertSeverity: 'success',
            data: [],
            isCartDialogOpen: false,
            count: 0,
            currentProductInfo: {
                ingredients: [],
                price: 0,
                FStorageCount: 0,
                FtorageDays: 0,
                FtorageMethod: "",
                FName: "",
            },
            orderList: [],
            orderTotalPrice: 0,
            isOrderListDialogOpen: false
        }

        this.getData = this.getData.bind(this);
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

        if (orderList[index].FStorageCount > orderList[index].FCount) {
            orderList[index].FCount++;
            orderList[index].FTotalPrice = orderList[index].FCount * orderList[index].FUnitPrice;
            await this.setState({ orderList });
            this.countOrderTotalPrice();
        } else {
            alert('庫存數量不足，無法增加');
        }
    }
    // 購物清單數量減少
    orderListDecrease = async (row, index) => {
        const orderList = this.state.orderList;

        if (orderList[index].FCount === 1) orderList.splice(index, 1);
        else {
            orderList[index].FCount--;
            orderList[index].FTotalPrice = orderList[index].FCount * orderList[index].FUnitPrice;
        }
        await this.setState({ orderList });
        this.countOrderTotalPrice();
    }
    // 購物清單刪除
    orderListDelete = async (row, index) => {
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
    countOrderTotalPrice = async () => {
        const orderList = this.state.orderList;
        const state = {};
        if (orderList.length > 0) {
            let orderTotalPrice = 0;
            orderList.forEach((item) => {
                orderTotalPrice += item.FTotalPrice
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
            orderInfo.FUserId = profile.id;
            orderInfo.orderer = profile.name;
            orderInfo.FName = this.state.currentProductInfo.FName;
            orderInfo.FBakeryItemId = this.state.currentProductInfo.FBakeryItemId;
            orderInfo.FCount = this.state.count;
            orderInfo.FStorageCount = this.state.currentProductInfo.FStorageCount
            orderInfo.FUnitPrice = this.state.currentProductInfo.FUnitPrice
            orderInfo.FTotalPrice = this.state.currentProductInfo.FUnitPrice * this.state.count;
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
        const storageCount = this.state.currentProductInfo.FStorageCount;
        const ele = [];
        for (let i = 0; i <= storageCount; i++) {
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
    getData = async () => {
        await axios.post(Config.apiUrl + '/bakery/item/list').then((res) => {
            console.log(res)
            const data = JSON.parse(JSON.stringify(res.data.data))
            if (res.data.code === 20000) {
                this.setState({ data })
            }
        })
    }

    // 結帳
    doCheckOut = async () => {
        let profile = {}
        if (!!localStorage.getItem('profile')) {
            profile = JSON.parse(localStorage.getItem('profile'));

        }

        console.log('送出訂單:', this.state.orderList);
        const orderList = JSON.parse(JSON.stringify(this.state.orderList));
        const body = {
            orderList,
            orderTotalPrice: this.state.orderTotalPrice,
            FUserId: profile.id
        }
        await axios.post(Config.apiUrl + '/bakery/order/create', body).then((res) => {
            console.log(res)
            if (!!res.data) {
                switch (res.data.code.toString()) {
                    case '20000':
                        this.setState({
                            orderList: [],
                            orderTotalPrice: 0,
                            isOrderListDialogOpen: false
                        })
                        this.showSnackbar('success', res.data.message);
                        break;
                    case '20099':
                        this.showSnackbar('error', res.data.message);
                        break;
                    default:
                        break;
                }
            } else this.showSnackbar('error', '送出訂單時發生異常，請稍後再嘗試。');
        })

    }

    // 顯示通知框
    showSnackbar = async (severity, msg) => {
        await this.setState({
            snackbarMsg: msg,
            alertSeverity: severity,
            isSnackbarOpen: true
        })
    }

    // 通知框開關
    handleSnackbarState(state) {
        switch (state) {
            case 'close':
                this.setState({
                    isSnackbarOpen: false
                })
                break;
            case 'open':
                this.setState({
                    isSnackbarOpen: true
                })
                break;
            default:
                break;
        }
    }
    componentDidMount = async () => {
        await this.getData();
    }

    render() {
        return (
            <div style={{ width: '100%', padding: '0.5rem' }}>
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
                <Grid container spacing={2}>
                    {
                        this.state.data.map((item, idx) => {
                            return (<Grid style={{ display: 'flex', justifyContent: "center" }} item xs={12} sm={6} md={3} lg={2} key={idx} ><BakeryCard data={item} productInfo={this.handleProductInfo} /></Grid>)
                        })
                    }
                </Grid>
                {/* 購物 Dialog */}
                <Dialog open={this.state.isCartDialogOpen} disableEscapeKeyDown id="cart-dialog" >
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >{this.state.currentProductInfo.FName}</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {
                            (this.state.currentProductInfo.FStorageCount === 0)
                                ?
                                <div></div>
                                :
                                <div style={{ background: '#959595', color: 'white', marginBottom: '1rem' }} >
                                    單價：$ {this.state.currentProductInfo.FUnitPrice}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 總金額： {this.state.currentProductInfo.FUnitPrice * this.state.count} 元
                                </div>
                        }
                        <div>
                            {this.setSelectCountOption()}
                        </div>
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.closeDialog('cart') }}>取消</Button>
                        {
                            (this.state.currentProductInfo.FStorageCount === 0)
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
                                                        key={row.FName}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.FName}
                                                        </TableCell>
                                                        <TableCell align="center">{row.FUnitPrice}</TableCell>
                                                        <TableCell align="center">{row.FCount}</TableCell>
                                                        <TableCell align="center">{row.FTotalPrice}</TableCell>
                                                        <TableCell align="center">{row.FStorageCount}</TableCell>
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
                                </div>
                                :
                                <div>
                                    您尚未購買任何商品唷!
                                </div>
                        }
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div style={{ marginLeft: '0.5rem' }}>
                                {(this.state.orderList.length > 0)
                                    ?
                                    <div>消費總金額：{this.state.orderTotalPrice}</div>
                                    :
                                    <div></div>
                                }
                            </div>
                            <div>
                                <Button color="secondary" onClick={() => { this.closeDialog('orderList') }}>關閉</Button>
                                {(this.state.orderList.length > 0)
                                    ?
                                    <Button color="secondary" onClick={this.doCheckOut}>送出訂單</Button>
                                    :
                                    <div></div>}
                            </div>
                        </div>
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
            </div >
        )
    }
}
