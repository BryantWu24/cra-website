import React from 'react';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import PollIcon from '@mui/icons-material/Poll';
import BuildIcon from '@mui/icons-material/Build';

export const mainListItems = [
    {
        icon: <BreakfastDiningIcon />,
        key: "BAKERY",
        title: 'Bakery'
    }, {
        icon: <PollIcon />,
        key: "DASHBOARD",
        title: 'Dashboard'
    }, {
        icon: <BuildIcon />,
        key: "TOOL",
        title: 'Tool'
    }];
