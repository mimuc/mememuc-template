import {Layout} from "antd";
import styled from "styled-components";
import {Profile} from "src/components/Profile/Profile";
import {Navigation} from "src/components/Navigation/Navigation";

const LayoutSider = styled(Layout.Sider)``;

export const Sider = () => {
    return (
        <LayoutSider width={300} style={{backgroundColor: 'inherit'}}>
            <Profile/>
            <Navigation/>
        </LayoutSider>
    );
}