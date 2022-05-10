import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios'
import {
    Typography,
    Button,
    Avatar,
    Container,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    ListItem,
    Divider,
    List,
    SwipeableDrawer,
    ListItemIcon,
    ListItemText,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    RadioGroup,
    Radio,
    DialogTitle,
    FormLabel,
    FormControl,
    FormControlLabel,
    DialogContentText
} from '@mui/material';
import { mainListItems } from './ListItem'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from '../Dashboard/Dashboard';
import Tool from '../Tool/Tool';
import Home from '../Home/Home';
import Bakery from '../Bakery/Bakery';
import BakeryManage from '../BakeryManage/BakeryManage';
import BakeryOrder from '../BakeryOrder/BakeryOrder';
import Database from '../Database/Database';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Config } from '../../core/config'

import '../../style/Backend.css'

const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
    },
    content: {
        // flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        width: '100%',
        background:'#F1F1F1'
    },
    userInfoDiv: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    userNameDiv: {
        marginLeft: '5px',
        color: '#172B4D',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'

    }
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class Backend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSnackbarOpen: false,
            alertSeverity: 'success',
            isDrawerOpen: false,
            currentPage: 'HOME',
            isLogInDialogOpen: false, // 登入 Dialog 狀態
            isLogOutDialogOpen: false, // 登出 Dialog 狀態
            isSignUpDialogOpen: false, // 註冊 Dialog 狀態
            snackbarMsg: '',
            signInfo: { // 註冊表單資料
                name: '',
                password: '',
                account: '',
                email: '',
                phone: '',
                gender: 'male',
                avatar: '',
                function: {
                    bakery: '',
                    bakeryManage: '',
                },
                err_name: '',
                err_password: '',
                err_account: '',
                err_email: '',
                err_phone: '',
                err_gender: '',
                err_avatar: '',
            },
            loginInfo: { // 登入表單資料
                account: '',
                password: '',
                err_account: '',
                err_password: '',
            },
            isSignUpClicked: false, // 註冊表單是否按下註冊按鈕
            isLoginClicked: false, // 登入表單是否按下登入按鈕
            profile: {
                avatar: '',
                name: 'Guest',
                auth: 'Guest',
                list: [{
                    title: '首頁',
                    key: 'HOME'
                }],
                isLogin: false
            },
            listItem: [] // 目錄
        }
        this.doSignUp = this.doSignUp.bind(this);
        this.doLogIn = this.doLogIn.bind(this);
        this.doLogOut = this.doLogOut.bind(this);
        this.handleSignName = this.handleSignName.bind(this);
        this.handleSignPhone = this.handleSignPhone.bind(this);
        this.handleSignGender = this.handleSignGender.bind(this)
        this.handleSignAccount = this.handleSignAccount.bind(this)
        this.handleSignPassword = this.handleSignPassword.bind(this)
        this.handleSignEmail = this.handleSignEmail.bind(this)
        this.handleLoginAccount = this.handleLoginAccount.bind(this)
        this.handleLoginPassword = this.handleLoginPassword.bind(this)
        this.handleFunctionChange = this.handleFunctionChange.bind(this)
        this.verify = this.verify.bind(this);
    }
    componentDidMount = async () => {
        window.onbeforeunload = () => {
            sessionStorage.setItem('currentPage', this.state.currentPage);
        }

        if (!!sessionStorage.getItem('currentPage')) {
            const currentPage = sessionStorage.getItem('currentPage');
            await this.setState({ currentPage })
        }

        if (!!localStorage.getItem('profile')) {
            const profile = JSON.parse(localStorage.getItem('profile'));
            await this.setState({ profile })
            await this.setListItem();
        }
    }

    // 設定目錄
    setListItem = async () => {
        const listItem = [];
        mainListItems.forEach((item) => {
            this.state.profile.list.forEach((items) => {
                if (items.key === item.key) {
                    item.title = items.title;
                    listItem.push(item);
                }
            })
        })
        let currentPage = this.state.currentPage;
        let isPageNotFound = true;
        listItem.forEach((item) => {
            if (item.key === currentPage) isPageNotFound = false;
        })
        if (!!isPageNotFound) currentPage = listItem[0]?.key || 'HOME';

        await this.setState({
            listItem, currentPage
        })
    }

    // 點擊目錄
    clickListItem = (page) => {
        this.setState({
            currentPage: page
        })
    }

    // 路由渲染
    renderSwitch = () => {
        switch (this.state.currentPage) {
            case 'DASHBOARD':
                return <Dashboard />
            case 'TOOL':
                return <Tool />
            case 'BAKERY':
                return <Bakery />
            case 'BAKERY MANAGE':
                return <BakeryManage />
            case 'BAKERY ORDER':
                return <BakeryOrder />
            case 'DATABASE':
                return <Database />
            default:
                return <Home />;
        }
    }

    // 顯示 Dialog
    showDialog = async (mode) => {
        switch (mode) {
            case 'signUp':
                await this.setState({
                    isSignUpDialogOpen: true,
                    isLogInDialogOpen: false,
                    signInfo: {
                        name: '',
                        password: '',
                        account: '',
                        email: '',
                        phone: '',
                        gender: 'male',
                        avatar: '',
                        function: {
                            bakery: false,
                            bakeryManage: false
                        },
                        err_name: '',
                        err_password: '',
                        err_account: '',
                        err_email: '',
                        err_phone: '',
                        err_gender: '',
                        err_avatar: '',
                    },
                    isSignUpClicked: false,
                    loginInfo: {
                        account: '',
                        password: '',
                        err_account: '',
                        err_password: '',
                    },
                    isLoginClicked: false
                });
                break;
            case 'logIn':
                await this.setState({
                    isSignUpDialogOpen: false,
                    isLogInDialogOpen: true,
                    signInfo: {
                        name: '',
                        password: '',
                        account: '',
                        email: '',
                        phone: '',
                        gender: 'male',
                        avatar: '',
                        function: {
                            bakery: false,
                            bakeryManage: false
                        },
                        err_name: '',
                        err_password: '',
                        err_account: '',
                        err_email: '',
                        err_phone: '',
                        err_gender: '',
                        err_avatar: '',
                    },
                    isSignUpClicked: false,
                    loginInfo: {
                        account: '',
                        password: '',
                        err_account: '',
                        err_password: '',
                    },
                    isLoginClicked: false
                })
                break;
            case 'logOut':
                await this.setState(
                    {
                        isLogOutDialogOpen: true,
                        isSignUpDialogOpen: false,
                        isLogInDialogOpen: false,
                    })
                break;
            default:
                break;
        }
    }

    // 關閉 Dialog
    closeDialog = (mode) => {
        const state = {};
        switch (mode) {
            case 'signUp':
                state.isSignUpDialogOpen = false;
                break;
            case 'logIn':
                state.isLogInDialogOpen = false;
                break;
            case 'logOut':
                state.isLogOutDialogOpen = false;
                break;
            default:
                break;
        }
        this.setState(state);
    }

    // 登出
    doLogOut = async () => {
        await this.setState(
            {
                profile: {
                    avatar: '',
                    name: 'Guest',
                    auth: 'Guest',
                    list: [{
                        title: '首頁',
                        key: 'HOME'
                    }],
                    isLogin: false
                },
                currentPage: 'HOME',
                isLogOutDialogOpen: false
            })
        localStorage.removeItem('profile')
        this.setListItem();

    }

    // 顯示通知框
    showSnackbar = async (severity, msg) => {
        await this.setState({
            snackbarMsg: msg,
            alertSeverity: severity,
            isSnackbarOpen: true
        })
    }

    // 登入
    doLogIn = async () => {
        const loginField = ['account', 'password'];
        const loginErrField = ['err_account', 'err_password'];
        const result = this.verify('login', this.state.loginInfo, loginField);
        result.isLoginClicked = true;
        const hasError = loginErrField.some(item => result.loginInfo[item] !== '');

        if (!hasError) {
            await axios
                .post(Config.apiUrl + "/login", {
                    account: this.state.loginInfo.account,
                    password: this.state.loginInfo.password,
                })
                .then((res) => {
                    if (!!res.data) {
                        switch (res.data.code.toString()) {
                            case '20000':
                                const profile = this.state.profile;
                                const data = res.data.data[0];
                                profile.avatar = data.FAvatar;
                                profile.name = data.FUserName;
                                profile.id = data.FUserId;
                                profile.list = data.list;
                                profile.isLogin = true;
                                profile.auth = data.FRoleName;
                                result.profile = profile;
                                result.isLogInDialogOpen = false;
                                localStorage.setItem('profile', JSON.stringify(profile));
                                this.setState(result)
                                const snackbarMsg = '歡迎 ' + data.FUserName + ' 蒞臨本網站';
                                this.showSnackbar('success', snackbarMsg);
                                break;
                            case '20099':
                                this.showSnackbar('error', res.data.message);
                                break;
                            default:
                                break;
                        }
                    } else this.showSnackbar('error', '登入發生異常，請稍後再嘗試。');
                })
                .catch((e) => { this.showSnackbar('error', '登入發生異常，請稍後再嘗試。'); });
        } else this.showSnackbar('error', '請填寫正確的資料');
        this.setListItem();
    }

    // 註冊
    doSignUp = async () => {
        const signField = ['name', 'phone', 'gender', 'account', 'email', 'password'];
        const signErrField = ['err_name', 'err_phone', 'err_gender', 'err_account', 'err_email', 'err_password'];
        const result = this.verify('sign', this.state.signInfo, signField);
        // result.function = this.state.signInfo.function;
        result.isSignUpClicked = true;
        const hasError = signErrField.some(item => result.signInfo[item] !== '');
        if (!hasError) {
            await axios
                .post(Config.apiUrl + "/user/create", {
                    FUserName: this.state.signInfo.name,
                    FEmail: this.state.signInfo.email,
                    FRoleId: '08292820-6f86-4566-bbb2-af267187ab1b', // BakeryUser
                    FPhone: this.state.signInfo.phone,
                    FAccount: this.state.signInfo.account,
                    FPassword: this.state.signInfo.password,
                    FGender: this.state.signInfo.gender,
                    FAvatar: this.state.loginInfo.avatar,
                })
                .then((res) => {
                    if (!!res.data) {
                        switch (res.data.code.toString()) {
                            case '20000':
                                console.log('user create :', res.data);
                                result.isSignUpDialogOpen = false;
                                const snackbarMsg = '註冊成功';
                                this.showSnackbar('success', snackbarMsg);
                                const loginInfo = {
                                    account: this.state.signInfo.account,
                                    password: this.state.signInfo.password
                                }
                                result.loginInfo = loginInfo;
                                this.setState(result)
                                this.doLogIn();
                                break;
                            default:
                                break;
                        }
                    } else this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。');
                })
                .catch((e) => { this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。'); });
        } else this.showSnackbar('error', '請填寫正確的資料');
    }

    // 驗證欄位
    // 當欄位為字串會直接寫入 state ；否則回傳結果
    verify(mode, curInfo, field) {
        const info = Object.assign({}, curInfo);
        const result = {}

        if (typeof (field) === 'string') {
            if (info[field].trim().length === 0) info['err_' + field] = '此欄位為必填欄位';
            else info['err_' + field] = ''

            if (mode === 'sign') result.signInfo = info;
            else result.loginInfo = info;
            this.setState(result);
        } else {
            field.forEach((item) => {
                if (info[item].trim().length === 0) info['err_' + item] = '此欄位為必填欄位';
                else info['err_' + item] = ''

                if (mode === 'sign') result.signInfo = info;
                else result.loginInfo = info;
            })
            return result;
        }
    }

    // 註冊：使用者名稱
    handleSignName($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.name = $event.target.value;
        this.verify('sign', curSingInfo, 'name')
    }

    // 註冊：電話/手機
    handleSignPhone($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.phone = $event.target.value;
        this.verify('sign', curSingInfo, 'phone')
    }

    // 註冊：性別
    handleSignGender($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.gender = $event.target.value;
        this.verify('sign', curSingInfo, 'gender')
    }

    // 註冊：帳號
    handleSignAccount($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.account = $event.target.value;
        this.verify('sign', curSingInfo, 'account')
    }

    // 註冊：密碼
    handleSignPassword($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.password = $event.target.value;
        this.verify('sign', curSingInfo, 'password')
    }

    // 註冊：信箱
    handleSignEmail($event) {
        const curSingInfo = Object.assign({}, this.state.signInfo);
        curSingInfo.email = $event.target.value;
        this.verify('sign', curSingInfo, 'email')
    }

    // 註冊：功能勾選框
    handleFunctionChange($event) {
        const functionGroup = this.state.signInfo.function;
        functionGroup[$event.target.name] = $event.target.checked;
        const signInfo = this.state.signInfo;
        signInfo.function = functionGroup;
        this.setState({
            signInfo
        })
    }

    // 登入：帳號
    handleLoginAccount($event) {
        const curLoginInfo = Object.assign({}, this.state.loginInfo);
        curLoginInfo.account = $event.target.value;
        this.verify('login', curLoginInfo, 'account')
    }

    // 登入：密碼
    handleLoginPassword($event) {
        const curLoginInfo = Object.assign({}, this.state.loginInfo);
        curLoginInfo.password = $event.target.value;
        this.verify('login', curLoginInfo, 'password')
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

    render() {
        const { classes } = this.props;
        const toggleDrawer = (isDrawerOpen) => (event) => {
            if (
                event &&
                event.type === 'keydown' &&
                (event.key === 'Tab' || event.key === 'Shift')
            ) return;
            this.setState({ isDrawerOpen });
        };

        const list = () => (
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    {
                        (this.state.listItem?.length > 0) ?
                            this.state.listItem.map((item, index) =>
                            (<ListItem button key={index} onClick={() => { this.clickListItem(item.key) }}>
                                <ListItemIcon >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>)
                            )
                            :
                            <div></div>
                    }
                </List>
            </Box>
        );

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
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{ background: '#272727' }} >
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                烘焙坊
                            </Typography>
                            {
                                (this.state.profile?.isLogin)
                                    ?
                                    <Button color="inherit" onClick={() => { this.showDialog('logOut') }}><LogoutIcon /></Button>
                                    :
                                    <Button color="inherit" onClick={() => { this.showDialog('logIn') }}><AccountBoxIcon /></Button>
                            }
                        </Toolbar>
                    </AppBar>
                </Box>
                <div>
                    <SwipeableDrawer
                        anchor='left'
                        open={this.state.isDrawerOpen}
                        onClose={toggleDrawer(false)}
                        onOpen={toggleDrawer(true)}
                    >
                        <div className={classes.drawerHeader}>
                            <div className={classes.userInfoDiv}>
                                {
                                    (this.state.profile?.avatar?.length > 0)
                                        ?
                                        <Avatar alt="Remy Sharp" src={this.state.profile.avatar} />
                                        :
                                        <AccountCircleIcon />
                                }
                                <div className={classes.userNameDiv}>{this.state.profile.name}</div>
                            </div>
                            <IconButton onClick={toggleDrawer(false)}>
                                <ArrowLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        {list()}
                    </SwipeableDrawer>
                    <main className={classes.content}>
                        <Container className={classes.container}>
                            {this.renderSwitch()}
                        </Container>
                    </main>
                </div>
                {/* 註冊 Dialog */}
                <Dialog open={this.state.isSignUpDialogOpen} disableEscapeKeyDown id="sign-up-dialog">
                    <DialogTitle className="DialogTitle"  >會員註冊</DialogTitle>
                    <DialogContent  >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="使用者名稱"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleSignName}
                            value={this.state.signInfo.name}
                            helperText={this.state.signInfo.err_name}
                            error={(this.state.signInfo?.err_name?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                        <FormControl component="fieldset" className='DialogTextColor' style={{ marginTop: '1rem' }}>
                            <FormLabel component="legend" className="DialogTextColor">性別</FormLabel>
                            <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
                                onChange={this.handleSignGender}
                                value={this.state.signInfo.gender}>
                                <FormControlLabel value="male" control={<Radio
                                />} label="男" />
                                <FormControlLabel value="female" control={<Radio
                                />} label="女" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="phone"
                            label="電話/手機"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleSignPhone}
                            value={this.state.signInfo.phone}
                            helperText={this.state.signInfo.err_phone}
                            error={(this.state.signInfo?.err_phone?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            label="信箱"
                            type="email"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleSignEmail}
                            value={this.state.signInfo.email}
                            helperText={this.state.signInfo.err_email}
                            error={(this.state.signInfo?.err_email?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                        <TextField
                            margin="dense"
                            id="account"
                            label="帳號"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleSignAccount}
                            value={this.state.signInfo.account}
                            helperText={this.state.signInfo.err_account}
                            error={(this.state.signInfo?.err_account?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="密碼"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleSignPassword}
                            value={this.state.signInfo.password}
                            helperText={this.state.signInfo.err_password}
                            error={(this.state.signInfo?.err_password?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                        {/* <Typography style={{ color: '#3C3C3C', paddingTop: '1rem' }}>
                            授權功能
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={this.handleFunctionChange} />} name="bakery" label="麵包坊" style={{ color: '#3C3C3C' }} />
                            <FormControlLabel control={<Checkbox onChange={this.handleFunctionChange} disabled />} name="bakeryManage" label="麵包坊管理平台" style={{ color: '#3C3C3C' }} />
                            <FormControlLabel control={<Checkbox onChange={this.handleFunctionChange} disabled />} name="tool" label="工具" style={{ color: '#3C3C3C' }} />
                        </FormGroup>
                        <div style={{ display: 'flex', alignItems: 'center', color: 'red', fontSize: '1rem' }}>
                            <ReportProblemIcon />  <label style={{ paddingLeft: '5px' }}>部分授權功能需通過審核才能使用，請聯繫授權人員</label>
                        </div> */}
                    </DialogContent>
                    <DialogActions>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Button onClick={() => { this.showDialog('logIn') }} >我要登入</Button>
                            </div>
                            <div>
                                <Button onClick={() => { this.closeDialog('signUp') }} >取消</Button>
                                <Button onClick={this.doSignUp}>註冊</Button>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>
                {/* 登入 Dialog */}
                <Dialog open={this.state.isLogInDialogOpen} disableEscapeKeyDown id="log-in-dialog">
                    <DialogTitle className="DialogTitle" >會員登入</DialogTitle>
                    <DialogContent  >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="account"
                            label="帳號"
                            type="text"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleLoginAccount}
                            value={this.state.loginInfo.account}
                            helperText={this.state.loginInfo.err_account}
                            error={(this.state.loginInfo?.err_account?.length > 0 && !!this.state.isLoginClicked)}
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="密碼"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={this.handleLoginPassword}
                            value={this.state.loginInfo.password}
                            helperText={this.state.loginInfo.err_password}
                            error={(this.state.loginInfo?.err_password?.length > 0 && !!this.state.isLoginClicked)}
                        />
                    </DialogContent>
                    <DialogActions  >
                        <div style={{ display: 'flex', color: '#DCDC8B', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Button onClick={() => { this.showDialog('signUp') }} >我要註冊</Button>
                            </div>
                            <div>
                                <Button onClick={() => { this.closeDialog('logIn') }} >取消</Button>
                                <Button onClick={this.doLogIn}>登入</Button>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>
                {/* 確認登出 Dialog */}
                <Dialog open={this.state.isLogOutDialogOpen} disableEscapeKeyDown id="log-out-dialog" >
                    <DialogTitle className="DialogTitle" >登出</DialogTitle>
                    <DialogContent >
                        <DialogContentText >
                            請問確定要登出了嗎?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.closeDialog('logOut') }} >取消</Button>
                        <Button onClick={this.doLogOut} >登出</Button>
                    </DialogActions>
                </Dialog>
            </div >
        );
    }
}

export default withStyles(styles)(Backend)

