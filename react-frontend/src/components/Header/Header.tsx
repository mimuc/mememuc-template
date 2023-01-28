import {config} from "src/config";
import {Link, NavLink} from "react-router-dom";
import styled from "styled-components";
import {Alert, Button, Layout, theme, Typography} from "antd";
import {ReactNode} from "react";
import {useNetworkState} from "react-use";
import {LoginOutlined} from "@ant-design/icons";

const BLOCK_WIDTH = 360

type HeaderProps = {
    children?: ReactNode
}

const {Title} = Typography;

const LayoutHeader = styled(Layout.Header)`
  height: 70px;
  paddingInline: 100px !important;
  position: fixed;
  z-index: 100;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
`;

const Navigation = styled.nav`
  display: inline-block;

  * {
    margin-inline: 10px;
  }
`;

const NetworkStatus = () => {
    const {online} = useNetworkState();

    if (online) return null;

    return <Alert type={'info'} banner closable message={
        <>
            You are offline. If memes were previously loaded you can view them{' '}
            <Link to={'/memes'}>here</Link>.
        </>
    }/>

}

export const Header = ({children}: HeaderProps) => {
    const {token} = theme.useToken();

    return (
        <LayoutHeader style={{backgroundColor: token.colorBgContainer}}>
            <NetworkStatus/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                {/*TODO: add logo */}
                <div style={{display: 'inline-flex', alignItems: 'center', width: BLOCK_WIDTH}}>
                    <Title level={3} style={{display: 'inline-block', color: '#232323', margin: 0, marginRight: 50}}>
                        {config.APP_TITLE}
                    </Title>
                    <Navigation>
                        <NavLink to={'/'}
                                 style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Editor</NavLink>
                        <NavLink to={'/memes'}
                                 style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Memes</NavLink>
                        {/*TODO: if registered add profile page */}
                        <NavLink to={'/profile'}
                                 style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Profile</NavLink>
                    </Navigation>
                </div>
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                    {children}
                </div>
                {/*TODO: login/logout button -> on login page, register page */}
                <div style={{display: 'inline-flex', justifyContent: 'flex-end', width: BLOCK_WIDTH}}>
                    <Link to={'/login'}>
                        <Button icon={<LoginOutlined/>}>Login</Button>
                    </Link>
                </div>
            </div>
        </LayoutHeader>
    )
}
