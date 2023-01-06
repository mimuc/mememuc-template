import {ReactNode} from "react";
import {Layout} from "antd";
import {Header, Navigation} from "src/components";

const {Content} = Layout;

type AppLayoutProps = {
    children: ReactNode
}

export const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <Layout>
            <Header>
                <Navigation />
            </Header>
            <Content
                style={{
                    paddingBlock: 50,
                    paddingInline: 50,
                    overflow: 'auto',
                }}>
                {children}
            </Content>
        </Layout>
    );
}