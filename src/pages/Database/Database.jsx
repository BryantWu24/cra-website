import React, { Component } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const tabHeader = ["User", "Auth", "Role", "List","Bakery_Material"];

class Database extends Component {
    constructor() {
        super();

        this.state = {
            currentTab: 0,
            listData: [],
            columns: [],
            snackbarMsg: '',
            alertSeverity: '',
            isSnackbarOpen: false,
            isLoading: false,
            isQureyFailed: false
        }

        this.handleTabChange = this.handleTabChange.bind(this);
    }
    componentDidMount = () => {
        this.setState({
            isLoading: true
        }, () => { this.getTableData('user'); })
    }

    // 切換 Tab
    handleTabChange = (event, value) => {
        this.setState({
            currentTab: value,
            isLoading: true
        })

        switch (value.toString()) {
            case '0':
                this.getTableData('user');
                break;
            case '1':
                this.getTableData('auth');
                break;
            case '2':
                this.getTableData('role');
                break;
            case '3':
                this.getTableData('list');
                break;
            case '4':
                this.getTableData('bakery/material');
                break;
            default:
                break;

        }
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
    handleSnackbarState = (state) => {
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

    // 取得資料表
    getTableData = async (tableName) => {
        const url = "http://localhost:7000/" + tableName + "/list";
        await axios
            .post(url)
            .then((res) => {
                console.log(res);
                if (res.data.code === 20000) this.setTableFormat(res);
                else {
                    this.setState({
                        listData: [],
                        isQureyFailed: true
                    });
                    this.setLoading(false);
                    this.showSnackbar('error', '查詢失敗');
                }
            }).catch((e) => {
                this.setState({
                    listData: [],
                    isQureyFailed: true
                });
                this.setLoading(false);
                this.showSnackbar('error', '查詢失敗');
            })
    }

    // 載入中效果開關
    setLoading = async (state) => {
        await this.setState({
            isLoading: state
        })
    }

    // 組成表格格式
    setTableFormat = async (res) => {
        let listData = res.data.data
        const columns = [];
        if (listData.length > 0) {
            const fieldKey = Object.keys(listData[0]);

            fieldKey.forEach((key) => {
                const columnData = {
                    field: key,
                    headerName: key,
                    width: 280
                }
                columns.push(columnData);
            })
        }
        listData = listData.map((item, id) => {
            item.id = id;
            return item;
        })
        const state = {
            listData,
            columns,
            isLoading: false,
            isQureyFailed: false
        }
        this.setState(state, () => { this.showSnackbar('success', '查詢成功') });
    }

    // 組成表格
    setTable = () => {
        if (this.state.listData.length > 0) {
            return (<Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ height: 680, width: '800px' }}>
                    <DataGrid
                        rows={this.state.listData}
                        columns={this.state.columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection
                        onRowClick={this.handleRowClick}
                        onSelectionModelChange={this.handleSelect}
                    />
                </div>
            </Grid>)
        } else if (!!this.state.isQureyFailed) return (<div>查詢失敗!</div>)
        else return (<div>查無資料!</div>)
    }

    render() {
        return (
            <div>
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
                <Grid container justifyContent='center' >
                    <Grid item sm={12} lg={12} style={{ bgcolor: 'white', maxWidth: '90VW' }}>
                        <Box style={{ bgcolor: 'white', marginTop: '1rem' }}>
                            <Tabs
                                value={this.state.currentTab}
                                onChange={this.handleTabChange}
                                variant="scrollable"
                                scrollButtons={true}
                                aria-label="scrollable auto tabs example"
                            >
                                {
                                    tabHeader.map((label) => <Tab label={label} />)
                                }
                            </Tabs>
                        </Box>
                    </Grid>
                    <Grid item sm={12} lg={12} style={{ bgcolor: 'white', maxWidth: '90VW' }}>
                        <Backdrop
                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={this.state.isLoading}
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>
                        <Box style={{ bgcolor: 'white', marginTop: '1rem' }}>
                            {(!!this.state.isLoading)
                                ?
                                <div>查詢中...</div>
                                :
                                this.setTable()
                            }
                        </Box>
                    </Grid>
                </Grid>


            </div>
        )
    }
}

export default Database