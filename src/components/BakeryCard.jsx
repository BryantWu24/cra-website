
import React, { Component } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
class BakeryCard extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const price = '$' + this.props.data.price;
        return (
            <div>
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
                                            return <span>{item}</span>
                                        else return <span>{item + '、'}</span>
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