import React from 'react';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import PollIcon from '@mui/icons-material/Poll';
import BuildIcon from '@mui/icons-material/Build';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import StorageIcon from '@mui/icons-material/Storage';

export const mainListItems = [
    {
        icon: <PollIcon />,
        key: "DASHBOARD",
        title: 'Dashboard'
    }, {
        icon: <BreakfastDiningIcon />,
        key: "BAKERY",
        title: 'Bakery'
    }, {
        icon: <SettingsApplicationsIcon />,
        key: "BAKERY MANAGE",
        title: 'BakeryManage'
    }, {
        icon: <BuildIcon />,
        key: "TOOL",
        title: 'Tool'
    }, {
        icon: <StorageIcon />,
        key: "DATABASE",
        title: 'DataBase'
    },];
