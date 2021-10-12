import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
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
    // DialogContentText,
} from '@mui/material';
import { mainListItems } from './ListItem'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from '../Dashboard/Dashboard';
import Tool from '../Tool/Tool';
import Home from '../Home/Home';
import Bakery from '../Bakery/Bakery';


const styles = (theme) => ({
    root: {
        display: 'flex',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        background: '#7F7F7F'

    },
    content: {
        // flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        width: '100%',
    }, userInfoDiv: {
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
class Backend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDrawerOpen: false,
            currentPage: 'HOME',
            userName: 'UserName',
            isLogInDialogOpen: false,
            isSignUpDialogOpen: false,
            signInfo: {
                name: '',
                password: '',
                account: '',
                email: '',
                phone: '',
                gender: 'male',
                avatar: '',
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
        }

        this.toggleLogInDialog = this.toggleLogInDialog.bind(this);
        this.toggleSignUpDialog = this.toggleSignUpDialog.bind(this);
        this.doSignUp = this.doSignUp.bind(this);
        this.doLogIn = this.doLogIn.bind(this);
        this.handleSignName = this.handleSignName.bind(this);
        this.handleSignPhone = this.handleSignPhone.bind(this);
        this.handleSignGender = this.handleSignGender.bind(this)
        this.handleSignAccount = this.handleSignAccount.bind(this)
        this.handleSignPassword = this.handleSignPassword.bind(this)
        this.handleSignEmail = this.handleSignEmail.bind(this)
        this.handleLoginAccount = this.handleLoginAccount.bind(this)
        this.handleLoginPassword = this.handleLoginPassword.bind(this)
        this.verify = this.verify.bind(this);
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
            default:
                return <Home />;
        }
    }
    // 前往註冊
    goSignUp = () => {
        this.setState({
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
    }
    // 前往登入
    goLogIn = () => {
        this.setState({
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
    }
    // 登入
    doLogIn = () => {
        const loginField = ['account', 'password'];
        const loginErrField = ['err_account', 'err_password'];
        const result = this.verify('login', this.state.loginInfo, loginField);
        result.isLoginClicked = true;
        const hasError = loginErrField.some(item => result.loginInfo[item] !== '');

        if (!hasError) {
            result.isLogInDialogOpen = false;
            console.log('登入成功：', result);
        } else {
            console.log('登入失敗：', result);
        }
        this.setState(result)
    }
    // 註冊
    doSignUp = () => {
        const signField = ['name', 'phone', 'gender', 'account', 'email', 'password'];
        const signErrField = ['err_name', 'err_phone', 'err_gender', 'err_account', 'err_email', 'err_password'];
        const result = this.verify('sign', this.state.signInfo, signField);
        result.isSignUpClicked = true;
        const hasError = signErrField.some(item => result.signInfo[item] !== '');

        if (!hasError) {
            result.isSignUpDialogOpen = false;
            console.log('註冊成功：', result);
        } else {
            console.log('註冊失敗：', result);
        }
        this.setState(result)
    }
    // 切換登入視窗
    toggleLogInDialog = (status) => {
        this.setState({
            isLogInDialogOpen: status
        })
    }
    // 切換註冊視窗
    toggleSignUpDialog = (status) => {
        this.setState({
            isSignUpDialogOpen: status
        })
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
                        mainListItems.map((item, index) =>
                        (<ListItem button key={index} onClick={() => { this.clickListItem(item.key) }}>
                            <ListItemIcon >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>)
                        )
                    }
                </List>
            </Box>
        );

        return (
            <div>
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
                                News
                            </Typography>
                            <Button color="inherit" onClick={() => { this.toggleLogInDialog(true) }}><AccountBoxIcon /></Button>
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
                                <Avatar alt="Remy Sharp" src="https://source.unsplash.com/random" />
                                <div className={classes.userNameDiv}>{this.state.userName}</div>
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
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >註冊</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {/* <DialogContentText style={{ background: '#959595', color: 'white' }} >
                            
                        </DialogContentText> */}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="使用者名稱"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                            onChange={this.handleSignName}
                            value={this.state.signInfo.name}
                            helperText={this.state.signInfo.err_name}
                            error={(this.state.signInfo?.err_name?.length > 0 && !!this.state.isSignUpClicked)}
                        />

                        <FormControl component="fieldset" style={{ marginTop: '1rem' }}>
                            <FormLabel component="legend"
                                color="secondary">性別</FormLabel>
                            <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
                                onChange={this.handleSignGender}
                                value={this.state.signInfo.gender}>
                                <FormControlLabel style={{ color: '#4F4F4F' }} value="male" control={<Radio
                                    color="secondary" />} label="男" />
                                <FormControlLabel style={{ color: '#4F4F4F' }} value="female" control={<Radio
                                    color="secondary" />} label="女" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            margin="dense"
                            id="phone"
                            label="電話/手機"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
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
                            variant="standard"
                            color="secondary"
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
                            variant="standard"
                            color="secondary"
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
                            variant="standard"
                            color="secondary"
                            onChange={this.handleSignPassword}
                            value={this.state.signInfo.password}
                            helperText={this.state.signInfo.err_password}
                            error={(this.state.signInfo?.err_password?.length > 0 && !!this.state.isSignUpClicked)}
                        />
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Button color="secondary" onClick={() => { this.goLogIn(false) }} >我要登入</Button>
                            </div>
                            <div>
                                <Button color="secondary" onClick={() => { this.toggleSignUpDialog(false) }} >取消</Button>
                                <Button color="secondary" onClick={this.doSignUp}>註冊</Button>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>
                {/* 登入 Dialog */}
                <Dialog open={this.state.isLogInDialogOpen} disableEscapeKeyDown id="log-in-dialog">
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >登入</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        {/* <DialogContentText style={{ background: '#959595', color: 'white' }} >
                            登入
                        </DialogContentText> */}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="account"
                            label="帳號"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
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
                            variant="standard"
                            color="secondary"
                            onChange={this.handleLoginPassword}
                            value={this.state.loginInfo.password}
                            helperText={this.state.loginInfo.err_password}
                            error={(this.state.loginInfo?.err_password?.length > 0 && !!this.state.isLoginClicked)}
                        />
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Button color="secondary" onClick={() => { this.goSignUp() }} >我要註冊</Button>
                            </div>
                            <div>
                                <Button color="secondary" onClick={() => { this.toggleLogInDialog(false) }} >取消</Button>
                                <Button color="secondary" onClick={this.doLogIn}>登入</Button>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(styles)(Backend)

