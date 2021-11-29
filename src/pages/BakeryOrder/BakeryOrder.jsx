import React, { Component } from 'react';
import { Grid, Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Config } from '../../core/config'
import Pageheader from '../../components/PageHeader';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class BakeryOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount = () => {
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

    getOrderList = async () => {
        await axios.post(Config.apiUrl + '/openapi/bakery/order/list').then((res) => {
            console.log('getOrderList:', res);
        })
    }

    render() {
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
            </Grid >
        );
    }
}

export default BakeryOrder;
