import React, { Component } from 'react';
import {
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { withStyles } from '@material-ui/styles';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Config } from '../../core/config'
import Pageheader from '../../components/PageHeader';
import { DataGrid } from '@mui/x-data-grid';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
});

class BakeryOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentOrderNumber: '',
            isStatusDialogOpen: false,
            orderStatus: [],
            currentStatus: {},
            nextStatus: {},
            selectedData: []
        }
    }

    componentDidMount = () => {
        this.getOrderStatus();
        this.getOrderList();
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

    updateStatus = async () => {
        const request = {
            conditions: [{
                field: 'FOrderNumber', operation: 'equal', value: this.state.currentOrderNumber
            }],
            FOrderStatusId: this.state.nextStatus.FOrderStatusId
        };

        await axios
            .post(Config.apiUrl + "/bakery/order/update", request)
            .then((res) => {
                if (!!res.data) {
                    console.log('bakery item update :', res.data);
                    switch (res.data.code.toString()) {
                        case '20000':
                            this.showSnackbar('success', res.data.message);
                            this.getOrderList();
                            this.switchStatusDialog(false);
                            break;
                        case '20099':
                            this.showSnackbar('error', res.data.message);
                            break;
                        default:
                            break;
                    }
                } else this.showSnackbar('error', '更新訂單狀態發生異常，請稍後再嘗試。');
            })
            .catch((e) => { this.showSnackbar('error', '更新訂單狀態發生異常，請稍後再嘗試。'); });
    }

    getOrderList = async () => {
        await axios.post(Config.apiUrl + '/openapi/bakery/order/list').then((res) => {
            console.log('getOrderList:', res);

            const data = res.data.data;
            const tableData = []
            data.forEach((item, index) => {
                console.log()
                tableData.push({
                    FOrderNumber: item.FOrderNumber,
                    FUserName: item.FUserName,
                    FOrderStatusId: item.FOrderStatusId,
                    FOrderStatusName: item.FOrderStatusName,
                    FOrder: item.FOrder,
                    FOrderId: item.FOrderId,
                    FTotalPrice: item.FTotalPrice,
                    FCreateDate: new Date(item.FCreateDate).toLocaleString(),
                    id: index + 1
                })
            })
            // fix list disappear when create new item.
            setTimeout(() => {
                this.setState({
                    data: tableData
                })
            }, 100)
        })
    }
    getOrderStatus = async () => {
        await axios.post(Config.apiUrl + '/bakery/order/status/list').then((res) => {
            console.log('OrderStatus:', res);
            const data = res.data.data;
            this.setState({
                orderStatus: data
            })
        })
    }

    getOrderDetail = async (id) => {
        const body = { id }
        await axios.post(Config.apiUrl + '/openapi/bakery/getSpecifyOrderDetail', body).then((res) => {
            console.log('OrderDetail:', res);
            if (!!res.data) {
                switch (res.data.code.toString()) {
                    case '20000':
                        const data = res.data.data;
                        this.setState({
                            selectedData: data
                        })
                        break;
                    default:
                        break;
                }
            } else this.showSnackbar('error', '取得商品清單發生異常，請稍後再嘗試。');
        })
    }

    // handle 點擊列
    handleRowClick = (item) => {
        console.log(item);
        this.getOrderDetail(item.row.FOrderId);
        const FOrder = item.row.FOrder;
        let nextStatus = {};
        const currentStatus = {
            FOrderStatusId: item.row.FOrderStatusId,
            FOrderStatusName: item.row.FOrderStatusName,
        }
        this.state.orderStatus.forEach((status) => {
            if (status.FOrder === FOrder + 1) nextStatus = status
        })


        this.setState({
            isStatusDialogOpen: true,
            currentStatus,
            nextStatus,
            currentOrderNumber: item.row.FOrderNumber
        })
    }

    switchStatusDialog = (isOpen) => {
        const state = {};
        if (isOpen === true || isOpen === false) state.isStatusDialogOpen = isOpen;
        else state.isStatusDialogOpen = !this.state.isStatusDialogOpen;
        this.setState(state);
    }

    saveStatus = () => {
        this.switchStatusDialog();
    }

    render() {
        const columns = [
            // { field: 'id', headerName: 'No.', width: 100 },
            { field: 'FOrderNumber', headerName: '訂單編號', width: 150 },
            { field: 'FUserName', headerName: '訂購人', width: 120, },
            { field: 'FOrderStatusName', headerName: '訂單狀態', width: 150, },
            { field: 'FTotalPrice', headerName: '訂單總金額', width: 150, },
            { field: 'FCreateDate', headerName: '訂單成立時間', width: 180, },
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
                    <Pageheader title='烘焙坊訂單管理系統'></Pageheader>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ height: 680, width: '800px' }}>
                        <DataGrid
                            rows={this.state.data}
                            columns={columns}
                            alignItems='center'
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            onCellDoubleClick={this.handleRowClick}
                        />
                    </div>
                </Grid>
                {/* 狀態 Dialog */}
                <Dialog open={this.state.isStatusDialogOpen} disableEscapeKeyDown id="status-dialog" >
                    <DialogTitle style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', fontSize: '1.5rem', fontWeight: 'bold' }} >
                        訂單明細
                    </DialogTitle>
                    <DialogContent  >
                        <div style={{ width: '100%', maxHeight: '20rem', display: 'flex', justifyContent: 'center', alignItems: 'start', paddingBottom: '1rem' }}>
                            {
                                this.state.selectedData.length > 0
                                    ?
                                    <table style={{ border: '1px solid black' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: 'solid 1px black' }}>商品名稱</th>
                                                <th style={{ border: 'solid 1px black' }}>單價</th>
                                                <th style={{ border: 'solid 1px black' }}>數量</th>
                                                <th style={{ border: 'solid 1px black' }}>單項合計</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.selectedData.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td style={{ border: 'solid 1px black' }}>{item.FBakeryItemName}</td>
                                                            <td style={{ border: 'solid 1px black' }}>{item.FUnitPrice}</td>
                                                            <td style={{ border: 'solid 1px black' }}>{item.FCount}</td>
                                                            <td style={{ border: 'solid 1px black' }}>{item.FOrderDetailTotalPrice}</td>
                                                        </tr>)
                                                })
                                            }
                                            <tr>
                                                <td colSpan='4' style={{ border: 'solid 1px black', textAlign: 'end' }}>  總計： {this.state.selectedData[0].FOrderTotalPrice}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    <div> 查無此明細 </div>
                            }
                        </div>
                        {
                            this.state?.currentStatus?.FOrderStatusName === '已完成'
                                ?
                                <div></div>
                                :
                                <div >目前訂單狀態為<span style={{ color: 'red', fontSize: '1rem', fontWeight: 'bold' }}>{this.state?.currentStatus?.FOrderStatusName}</span>，是否要將狀態更新至<span style={{ color: 'red', fontSize: '1rem', fontWeight: 'bold' }}>{this.state?.nextStatus?.FOrderStatusName}</span></div>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.switchStatusDialog} >關閉</Button>
                        {
                            this.state?.currentStatus?.FOrderStatusName === '已完成'
                                ?
                                <div></div>
                                :
                                <Button color="secondary" onClick={this.updateStatus}>更新狀態</Button>
                        }
                    </DialogActions>
                </Dialog >
            </Grid >
        );
    }
}

export default withStyles(styles)(BakeryOrder);

