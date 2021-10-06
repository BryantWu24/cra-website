import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

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
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { mainListItems } from './ListItem'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import Dashboard from '../Dashboard/Dashboard';
import Tool from '../Tool/Tool';
import Home from '../Home/Home';

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
            isSignUpDialogOpen: false
        }

        this.toggleLogInDialog = this.toggleLogInDialog.bind(this);
        this.toggleSignUpDialog = this.toggleSignUpDialog.bind(this);
    }
    clickListItem = (page) => {
        this.setState({
            currentPage: page
        })
    }

    renderSwitch = () => {
        switch (this.state.currentPage) {
            case 'DASHBOARD':
                return <Dashboard />
            case 'TOOL':
                return <Tool />
            default:
                return <Home />;
        }
    }

    goSignUp = () => {
        this.setState({
            isSignUpDialogOpen: true,
            isLogInDialogOpen: false
        })
    }

    goLogIn = () => {
        this.setState({
            isSignUpDialogOpen: false,
            isLogInDialogOpen: true
        })
    }

    doLogIn = () => {
        this.toggleLogInDialog(false);
    }

    doSingUp = () => {
        this.toggleSignUpDialog(false);
    }

    toggleLogInDialog = (status) => {
        this.setState({
            isLogInDialogOpen: status
        })
    }

    toggleSignUpDialog = (status) => {
        this.setState({
            isSignUpDialogOpen: status
        })
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
                            <Button color="inherit" onClick={() => { this.toggleLogInDialog(true) }}>LogIn / SignUp</Button>
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
                <Dialog open={this.state.isSignUpDialogOpen} disableEscapeKeyDown id="sign-up-dialog">
                    <DialogTitle style={{ background: '#959595', color: 'white' }} >Sign Up</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        <DialogContentText style={{ background: '#959595', color: 'white' }} >
                            Welcome to Register.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="User Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="phone"
                            label="Phone"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="E-Mail"
                            type="email"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="account"
                            label="Account"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.toggleSignUpDialog(false) }} >Cancel</Button>
                        <Button color="secondary" onClick={() => { this.goLogIn(false) }} >Go LogIn</Button>
                        <Button color="secondary" onClick={() => { this.doSingUp(false) }}>Sign Up</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.isLogInDialogOpen} disableEscapeKeyDown id="log-in-dialog">
                    <DialogTitle style={{ background: '#959595', color: 'white' }} >Log In</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        <DialogContentText style={{ background: '#959595', color: 'white' }} >
                            Welcome to Log In.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="account"
                            label="Account"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                        <TextField
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            color="secondary"
                        />
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.toggleLogInDialog(false) }} >Cancel</Button>
                        <Button color="secondary" onClick={() => { this.goSignUp() }} >Go SingUp</Button>
                        <Button color="secondary" onClick={() => { this.doLogIn(false) }}>Log In</Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

export default withStyles(styles)(Backend)

