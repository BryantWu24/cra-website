import React, { Component } from 'react';
import { Grid, Box, FormControl, InputLabel, Select, Button, TextField, Chip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
class BakerySheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                productName: '',
                unitPrice: 0,
                storageCount: 0,
                ingredients: [],
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
            materialData: [],
            isSnackbarOpen: false,
            snackbarMsg: ''
        }
        this.doSave = this.doSave.bind(this);
        this.handleMateriaChange = this.handleMateriaChange.bind(this);
    }

    componentDidMount = async () => {
        const data = this.props.data[0] || {
            productName: '',
            unitPrice: 0,
            storageCount: 0,
            ingredients: [],
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
        this.getMaterialData();
    }

    // 取得成分資料
    getMaterialData = () => {
        const materialData = ['麵粉', '奶油', '糖粉', '鮮奶','無鹽奶油','水','糖霜','花生'];
        this.setState({ materialData })
    }

    // 儲存
    doSave = () => {
        console.log('onSave:', this.state.data)
        if (!this.state.hasDoSave) {
            this.setState({
                hasDoSave: true
            })
        }

        this.doVerify();
        const errorData = this.state.errorData;
        if (Object.values(errorData).some(item => item.length !== 0)) this.showSnackbar('error', '儲存失敗')
        else this.showSnackbar('success', '儲存成功')

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
                    if (value.length === 0) errorData[key] = '請至少選擇一種成分'
                    else errorData[key] = ''
                    break;
                default:
                    if (value.trim().length === 0) errorData[key] = '此欄位為必填欄位'
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
        await this.setState({ data })

        if (this.state.hasDoSave) this.doVerify()
    }

    // 選擇組成成分
    handleMateriaChange = ($event) => {
        const data = this.state.data;
        data.ingredients = $event.target.value
        this.setState({ data })

        if (this.state.hasDoSave) this.doVerify()
    }

    // 通知框開關
    handleSnackbarState(state) {
        switch (state) {
            case 'close':
                this.setState({
                    isSnackbarOpen: false
                })
                break;
            case 'open':
                this.setState({
                    isSnackbarOpen: true
                })
                break;
            default:
                break;
        }
    }

    // 顯示通知框
    showSnackbar = async (severity, msg) => {
        await this.setState({
            snackbarMsg: msg,
            alertSeverity: severity,
            isSnackbarOpen: true
        })
    }

    render() {
        return (
            <Grid container spacing={2}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.state.isSnackbarOpen}
                    autoHideDuration={5000}
                    onClose={() => { this.handleSnackbarState('close') }}
                    key={'top center'}
                >
                    <Alert onClose={() => { this.handleSnackbarState('close') }} severity={this.state.alertSeverity} sx={{ width: '100%' }}>
                        {this.state.snackbarMsg}
                    </Alert>
                </Snackbar>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <TextField
                        id="name"
                        label="商品名稱"
                        variant="outlined"
                        fullWidth
                        onChange={($event) => { this.handleChange('productName', $event) }}
                        value={this.state.data.productName}
                        error={(this.state.errorData?.productName?.length > 0 && !!this.state.hasDoSave)} />
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.productName}</div>
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
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.unitPrice}</div>
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
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.storageCount}</div>
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
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.storageDays}</div>
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
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.storageMethod}</div>
                </Grid >
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="demo-multiple-chip-label">組成成分</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={this.state.data.ingredients}
                            onChange={this.handleMateriaChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        return ((!!value) ?
                                            <Chip key={value} label={value} />
                                            : <div></div>)

                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            error={(this.state.errorData?.ingredients?.length > 0 && !!this.state.hasDoSave)}
                        >
                            {this.state.materialData.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.ingredients}</div>
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
