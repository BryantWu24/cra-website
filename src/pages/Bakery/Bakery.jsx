
import React, { Component } from 'react'
import Bakery_Card from '../../components/Bakery_Card'

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
            storageDays:3,
            storageMethod:'12小時內未食用完必須冰冷藏'
        }, {
            title: '麵包2',
            price: 80,
            remaind: 12,
            ingredients: ['麵粉', '鮮奶', '糖粉'],
            storageDays:5,
            storageMethod:'24小時內未食用完必須冰冷藏'
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
                {
                    this.state.newsData.map(item =>
                        <Bakery_Card data={item} />
                    )
                }

            </div>
        )
    }
}
