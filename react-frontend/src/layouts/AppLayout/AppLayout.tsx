import {ReactNode} from "react";
import {Button, Input, Layout} from "antd";
import {Header, Sider} from "src/components";
import {PlusOutlined} from "@ant-design/icons";

const {Content} = Layout;

type AppLayoutProps = {
    children: ReactNode
}

export const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <Layout>
            <Sider/>
            <Layout>
                <Header>
                    <Input.Search style={{width: 400, marginLeft: 50}} enterButton size={'large'}/>
                    <Button style={{marginLeft: 'auto'}} type={'primary'} size={'large'}>
                        <PlusOutlined/>Neues Meme
                    </Button>
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
        </Layout>
    );
}