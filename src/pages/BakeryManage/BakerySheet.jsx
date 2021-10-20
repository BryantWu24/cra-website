import React, { Component } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
class BakerySheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                productName: '',
                unitPrice: 0,
                storageCount: 0,
                ingredients: ['麵粉', '鮮奶', '糖粉'],
                storageDays: 0,
                storageMethod: '',
            },
            errorData: {
                productName: '',
                unitPrice: '',
                storageCount: '',
                ingredients: '',
                storageDays: '',
                storageMethod: ''
            },
            mode: 'create',
            hasDoSave: false,
        }
        this.doSave = this.doSave.bind(this);
    }

    componentDidMount = async () => {
        const data = this.props.data[0] || {
            productName: '',
            unitPrice: 0,
            storageCount: 0,
            ingredients: [''],
            storageDays: 0,
            storageMethod: '',
        };
        const errorData = {
            productName: '',
            unitPrice: '',
            storageCount: '',
            ingredients: '',
            storageDays: '',
            storageMethod: ''
        }
        const mode = this.props.mode || 'create';
        await this.setState({
            data,
            mode,
            errorData,
            hasDoSave: false
        })
        console.log('data:', data);
    }

    // 儲存
    doSave = () => {
        console.log('onSave:', this.state.data)
        if (!this.state.hasDoSave)
            this.setState({
                hasDoSave: true
            })

        this.doVerify();
        const errorData = this.state.errorData;
        if (Object.values(errorData).some(item => item.length !== 0)) alert('有問題')
    }

    // 驗證
    doVerify = async () => {
        const errorData = this.state.errorData;
        const keyArray = Object.keys(errorData);

        keyArray.forEach((key) => {
            let value = this.state.data[key];
            switch (key) {
                case 'unitPrice':
                    // 去除開頭為0
                    value = parseInt(value.toString().replace(/0*(\d+)/, "$1"));
                    // 判斷是否有小數
                    if (value !== (value | 0)) errorData[key] = '請輸入整數';
                    else if (value === 0) errorData[key] = '單價需輸入大於 0 的數字';
                    else errorData[key] = ''
                    break;
                case 'storageCount':
                case 'storageDays':
                    // 去除開頭為0
                    value = parseInt(value.toString().replace(/0*(\d+)/, "$1"));
                    // 判斷是否有小數
                    if (value !== (value | 0)) errorData[key] = '請輸入整數';
                    else errorData[key] = ''
                    break;
                case 'ingredients':
                    if (value.length === 0)
                        errorData[key] = '此欄位為必填欄位'
                    else errorData[key] = ''
                    break;
                default:
                    if (value.trim().length === 0)
                        errorData[key] = '此欄位為必填欄位'
                    else errorData[key] = ''
                    break;
            }
        })


        await this.setState({ errorData })
    }

    // handle 輸入框
    handleChange = async (key, $event) => {
        let value = $event.target.value;
        const data = this.state.data;
        data[key] = value;
        await this.setState({
            data
        })

        if (this.state.hasDoSave) {
            this.doVerify(key, value)
        }
    }

    render() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="name"
                        label="商品名稱"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('productName', $event) }}
                        value={this.state.data.productName}
                        error={(this.state.errorData?.productName?.length > 0 && !!this.state.hasDoSave)} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="unitPrice"
                        label="單價"
                        type="number" variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('unitPrice', $event) }}
                        value={this.state.data.unitPrice}
                        error={(this.state.errorData?.unitPrice?.length > 0 && !!this.state.hasDoSave)} />
                </Grid >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="storageCount"
                        label="庫存數量"
                        type="number"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('storageCount', $event) }}
                        value={this.state.data.storageCount}
                        error={(this.state.errorData?.storageCount?.length > 0 && !!this.state.hasDoSave)} />
                </Grid >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="ingredients"
                        label="組成成分"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('ingredients', $event) }}
                        value={this.state.data.ingredients}
                        error={(this.state.errorData?.ingredients?.length > 0 && !!this.state.hasDoSave)} />
                </Grid >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="storageDays"
                        label="保存天數"
                        type="number"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('storageDays', $event) }}
                        value={this.state.data.storageDays}
                        error={(this.state.errorData?.storageDays?.length > 0 && !!this.state.hasDoSave)} />
                </Grid >
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="storageMethod"
                        label="保存方法"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('storageMethod', $event) }}
                        value={this.state.data.storageMethod}
                        error={(this.state.errorData?.storageMethod?.length > 0 && !!this.state.hasDoSave)} />
                </Grid >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}>
                        <Button
                            variant="outlined"
                            startIcon={<SaveIcon />}
                            onClick={this.doSave}>
                            儲存
                        </Button>
                    </div>
                </Grid >

            </Grid >
        );
    }
}

export default BakerySheet;
