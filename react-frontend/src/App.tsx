import 'antd/dist/reset.css';
import './index.css';

import {ConfigProvider} from 'antd';
import React, {StrictMode} from 'react';
import {Router} from './router';
import {ThemeConfig} from "antd/es/config-provider/context";

const theme: ThemeConfig = {
    token: {
    },
};

export const App = () => {
    return (
        <StrictMode>
            <ConfigProvider theme={theme}>
                <Router/>
            </ConfigProvider>
        </StrictMode>
    );
};