
import React, { Component } from 'react'
import BakeryCard from '../../components/BakeryCard'
import {
    Grid
} from '@mui/material';
export default class Bakery extends Component {

    constructor() {
        super();

        this.state = {
            newsData: []
        }

        this.getNewsData = this.getNewsData.bind(this);
    }

    getNewsData = () => {
        const data = [{
            title: '麵包一',
            price: 100,
            remaind: 10,
            ingredients: ['麵粉', '鮮奶', '紅豆'],
            storageDays: 3,
            storageMethod: '12小時內未食用完必須冰冷藏'
        }, {
            title: '麵包2',
            price: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays: 5,
            storageMethod: '24小時內未食用完必須冰冷藏'
        }]

        this.setState({
            newsData: data
        })
    }

    componentDidMount = () => {
        this.getNewsData();
    }

    render() {
        return (
            <div>
                <Grid container spacing={2}>
                    {
                        this.state.newsData.map((item, idx) => {
                            return (<Grid item xs={12} sm={6} md={3} lg={2} key={idx} ><BakeryCard data={item} /></Grid>)
                        })
                    }
                </Grid>
            </div>
        )
    }
}
