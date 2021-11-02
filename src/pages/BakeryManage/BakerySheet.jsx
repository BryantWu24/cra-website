import React, { Component } from 'react';
import {
    Grid, Box, FormControl, InputLabel, Select, Button, Chip,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Config } from '../../core/config';
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
            addMaterialInfo: {
                name: '',
                err_name: ''
            },
            isAddMaterialClicked: false,
            mode: 'create',
            hasDoSave: false,
            materialData: [],
            isSnackbarOpen: false,
            snackbarMsg: '',
            isShowAddMaterialDialog: false
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
        this.getMaterial();
    }
    // 新建組成成分
    doAddMaterial = async () => {
        const addMaterialInfo = this.state.addMaterialInfo;
        if (addMaterialInfo.name.trim().length > 0) {
            await axios
                .post(Config.apiUrl + "/bakery/material/create", {
                    FName: addMaterialInfo.name.trim(),
                })
                .then((res) => {
                    if (!!res.data) {
                        switch (res.data.code.toString()) {
                            case '20000':
                                console.log('bakery material create :', res.data);
                                this.showSnackbar('success', '新增組成成分成功');
                                this.getMaterial();
                                this.switchAddMaterialDialog(false);
                                break;
                            case '20001':
                                console.log('bakery material create :', res.data);
                                this.showSnackbar('error', res.data.message);
                                break;
                            default:
                                break;
                        }
                    } else this.showSnackbar('error', '新增成分發生異常，請稍後再嘗試。');
                })
                .catch((e) => { this.showSnackbar('error', '新增成分發生異常，請稍後再嘗試。'); });
        } else this.showSnackbar('error', '請填寫正確的資料');
    }

    // 取得組成成分
    getMaterial = async () => {
        await axios
            .post(Config.apiUrl + "/bakery/material/list")
            .then((res) => {
                if (!!res.data) {
                    switch (res.data.code.toString()) {
                        case '20000':
                            console.log('bakery material list :', res.data);
                            this.setState({
                                materialData: res.data.data
                            })

                            break;
                        default:
                            break;
                    }
                } else this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。');
            })
            .catch((e) => { this.showSnackbar('error', '註冊發生異常，請稍後再嘗試。'); });
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

    // handle 新建組成成分輸入框
    handleAddMaterialChange = ($event) => {
        const addMaterialInfo = this.state.addMaterialInfo;
        if (!!this.state.isAddMaterialClicked && addMaterialInfo.name.trim().length === 0) addMaterialInfo.err_name = '此欄位為必填欄位';
        else addMaterialInfo.err_name = '';
        addMaterialInfo.name = $event.target.value;
        this.setState({ addMaterialInfo })
    }

    // 新增成分 Dialog 開關
    switchAddMaterialDialog = (status) => {
        this.setState({
            isShowAddMaterialDialog: status,
            isAddMaterialClicked: false,
            addMaterialInfo: {
                name: '',
                err_name: ''
            },
        })
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

    // handle 表單輸入框
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
                <Grid item xs={12} sm={9} md={10} lg={10}>
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
                            {this.state.materialData.map((item) => (
                                <MenuItem
                                    key={item.FBakeryMaterialId}
                                    value={item.FName}
                                >
                                    {item.FName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div style={{ width: '100%', textAlign: 'left', color: 'red' }}>{this.state.errorData.ingredients}</div>
                </Grid >
                <Grid item xs={12} sm={3} md={2} lg={2}>
                    <div style={{ width: '100%', height: '100%', justifyContent: 'flex-end', display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => { this.switchAddMaterialDialog(true) }}
                            fullWidth
                        >
                            新增成分
                        </Button>
                    </div>
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
                {/* 新增成分 Dialog */}
                <Dialog open={this.state.isShowAddMaterialDialog} disableEscapeKeyDown id="add-material-dialog">
                    <DialogTitle style={{ background: '#959595', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }} >新增成分</DialogTitle>
                    <DialogContent style={{ background: '#959595', color: 'white' }} >
                        <TextField
                            autoFocus
                            margin="dense"
                            id="material"
                            label="成分名稱"
                            type="text"
                            fullWidth
                            variant="standard"
                            color="secondary"
                            onChange={this.handleAddMaterialChange}
                            value={this.state.addMaterialInfo.name}
                            helperText={this.state.addMaterialInfo.err_name}
                            error={(this.state.addMaterialInfo?.err_name?.length > 0 && !!this.state.isAddMaterialClicked)}
                        />
                    </DialogContent>
                    <DialogActions style={{ background: '#959595' }} >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div>
                                <Button color="secondary" onClick={() => { this.switchAddMaterialDialog(false) }} >取消</Button>
                            </div>

                            <div>
                                <Button color="secondary" onClick={this.doAddMaterial} >建立</Button>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>
            </Grid >
        );
    }
}

export default BakerySheet;
