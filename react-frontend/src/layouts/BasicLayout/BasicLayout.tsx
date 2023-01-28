import {ReactNode} from "react";
import {Layout} from "antd";
import styled from "styled-components";
import {Header} from "src/components";

type AppLayoutProps = {
    children: ReactNode
}

const Content = styled(Layout.Content)`
  margin-top: 100px;
  padding-inline: 100px !important;
`;

export const BasicLayout = ({children}: AppLayoutProps) => {
    return (
        <Layout>
            <Header/>
            <Content>
                {children}
            </Content>
        </Layout>
    );
}