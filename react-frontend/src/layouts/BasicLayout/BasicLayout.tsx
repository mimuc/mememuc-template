import {ReactNode} from "react";
import {Col, Layout, Row} from "antd";
import styled from "styled-components";
import {Header} from "src/components";

type AppLayoutProps = {
    children: ReactNode
}

const Content = styled(Layout.Content)`
  margin-top: 100px;
  padding-inline: 0 !important;
`;

export const BasicLayout = ({children}: AppLayoutProps) => {
    return (
        <Layout>
            <Header/>
            <Content>
                <Row>
                    <Col offset={1} span={22}>
                        {children}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}