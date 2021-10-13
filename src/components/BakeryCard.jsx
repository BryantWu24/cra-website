
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
class BakeryCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
        this.handleImgOnLoad = this.handleImgOnLoad.bind(this);
    }

    handleImgOnLoad = () => {
        this.setState({
            isLoading: false
        })
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
                            <IconButton aria-label="add to cart">
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
            </div>
        )
    }
}

export default BakeryCard