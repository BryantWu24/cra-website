
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
            isLoading: true,
            isCartDialogOpen: false,
            count: 0
        }
        this.handleImgOnLoad = this.handleImgOnLoad.bind(this);
    }

    // 傳送商品資訊給父元件
    passInfo = () => {
        this.props.productInfo(this.props.data)
    }

    // handle 圖片讀取
    handleImgOnLoad = () => {
        this.setState({
            isLoading: false
        })
    }


    render() {
        const price = '$' + this.props.data.FUnitPrice;
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
                        title={this.props.data.FBakeryItemName}
                        action={
                            <IconButton aria-label="add to cart" onClick={this.passInfo} disabled={!this.props.data.FStorageCount}>
                                <AddShoppingCartIcon />
                            </IconButton>
                        }
                    />
                    {
                        (!!this.props.data.productImgUrl) ?
                            <CardMedia
                                component="img"
                                height="200"
                                image={this.props.data.productImgUrl}
                                alt="Picture"
                                onLoad={this.handleImgOnLoad}
                                onError={this.handleImgOnLoad}
                            /> :
                            <CardMedia
                                component="img"
                                height="200"
                                image="/bakeryImg/01.jpg"
                                alt="Picture"
                                onLoad={this.handleImgOnLoad}
                                onError={this.handleImgOnLoad}
                            />
                    }
                    <CardContent>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            價格：{price}
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
                            保存期限：{this.props.data.FStorageDays} 天
                        </Typography>
                        <Typography color="text.secondary" style={{ textAlign: 'left' }}>
                            保存方法：{this.props.data.FStorageMethod}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default BakeryCard