
import React, { Component } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
} from '@mui/material';
class BakeryCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isCartDialogOpen: false,
            count: 0
        }
        this.handleImgOnLoad = this.handleImgOnLoad.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
    }

    handleCartDialogOpen = (status) => {
        const state = {};
        if (status) {
            state.isCartDialogOpen = true;
            state.count = 0;
        } else {
            state.isCartDialogOpen = false;
        }
        this.setState(state)
    }

    handleImgOnLoad = () => {
        this.setState({
            isLoading: false
        })
    }

    handleCountChange = ($event) => {
        this.setState({
            count: $event.target.value || 0
        })
    }

    setSelectCountOption = () => {
        const remaind = this.props.data.remaind;
        const ele = [];
        for (let i = 0; i < remaind; i++) {
            ele.push(<MenuItem key={i} value={i}>{i}</MenuItem>)
        }
        return ele;
    }

    render() {
        const price = '$' + this.props.data.price;
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={this.state.isLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Card sx={{ maxWidth: 345 }}>
                    <CardHeader
                        title={this.props.data.title}
                        action={
                            <IconButton aria-label="add to cart" onClick={() => { this.handleCartDialogOpen(true) }} >
                                <AddShoppingCartIcon />
                            </IconButton>
                        }
                    />
                    <CardMedia
                        component="img"
                        height="194"
                        image="https://source.unsplash.com/random/400x200"
                        alt="Picture"
                        onLoad={this.handleImgOnLoad}
                    />
                    <CardContent>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            價格：{price}
                        </Typography>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            剩餘數量：{this.props.data.remaind}
                        </Typography>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            成分：{
                                (this.props.data?.ingredients) ?
                                    this.props.data.ingredients.map((item, index) => {
                                        if (index === this.props.data.ingredients.length - 1)
                                            return <span key={index}>{item}</span>
                                        else return <span key={index}>{item + '、'}</span>
                                    }) : <div></div>
                            }
                        </Typography>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            保存期限：{this.props.data.storageDays} 天
                        </Typography>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            保存方法：{this.props.data.storageMethod}
                        </Typography>
                    </CardContent>
                </Card>
                <Dialog open={this.state.isCartDialogOpen} disableEscapeKeyDown id="cart-dialog" style={{ maxWidth: '30rem' }} fullWidth>
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >{this.props.data.title}</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        <div style={{ background: '#959595', color: 'white', marginBottom: '1rem' }} >
                            單價：$ {this.props.data.price}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 總金額： {this.props.data.price * this.state.count} 元
                        </div>
                        <div>
                            <FormControl fullWidth>
                                <InputLabel id="count-select-label">請選擇要購買的數量</InputLabel>
                                <Select
                                    labelId="count-select-label"
                                    id="count-select"
                                    value={this.state.count}
                                    label="請選擇要購買的數量"
                                    onChange={this.handleCountChange}
                                >
                                    {
                                        this.setSelectCountOption()
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <Button color="secondary" onClick={() => { this.handleCartDialogOpen(false) }}>取消</Button>
                        <Button color="secondary" >下單</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default BakeryCard