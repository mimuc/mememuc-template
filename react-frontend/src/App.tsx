import 'antd/dist/reset.css';
import './index.css';

import {ConfigProvider, message} from 'antd';
import React, {StrictMode} from 'react';
import {Router} from './router';
import {ThemeConfig} from "antd/es/config-provider/context";

const theme: ThemeConfig = {
    token: {
    },
};
export const App = () => {
    // TODO: does not work
    message.config({maxCount: 3});

    return (
        <StrictMode>
            <ConfigProvider theme={theme}>
                <Router/>
            </ConfigProvider>
        </StrictMode>
    );
};