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
    ListItemText
} from '@mui/material';
import { mainListItems } from './ListItem'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import MenuIcon from '@mui/icons-material/Menu';
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
            userName: 'UserName'
        }
    }
    clickListItem = (page) => {
        this.setState({
            currentPage: page
        })
    }

    renderSwitch() {
        switch (this.state.currentPage) {
            case 'DASHBOARD':
                return <Dashboard />
            case 'TOOL':
                return <Tool />
            default:
                return <Home />;
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
                    <AppBar position="static" style={{ background: '#272727' }} id="appBar">
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
                            <Button color="inherit">Login</Button>
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
            </div>
        );
    }
}




export default withStyles(styles, { withTheme: true })(Backend)

