import {ReactNode} from "react";
import {useNetworkState} from "react-use";
import {Link, NavLink} from "react-router-dom";
import {Alert, Button, Col, Layout, Row, theme, Typography} from "antd";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import styled from "styled-components";
import {config} from "src/config";
import {useAuth} from "src/hooks";
import {useSessionState} from "src/states";

type HeaderProps = {
    children?: ReactNode
}

const {Title} = Typography;

const LayoutHeader = styled(Layout.Header)`
  height: 70px;
  position: fixed;
  z-index: 100;
  width: 100%;
  padding-inline: 0 !important;
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
    const {logout} = useAuth();
    const [session] = useSessionState();

    return (
        <LayoutHeader style={{backgroundColor: token.colorBgContainer}}>
            <NetworkStatus/>
            <Row>
                <Col offset={1} span={22}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'inline-flex', alignItems: 'center'}}>
                            <img src={'/logo.png'} height={40} style={{marginRight: 20}} alt={'Logo'}/>
                            <Title level={3}
                                   style={{display: 'inline-block', color: '#232323', margin: 0, marginRight: 50}}>
                                {config.APP_TITLE}
                            </Title>
                            <Navigation>
                                <NavLink to={'/'}
                                         style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Editor</NavLink>
                                <NavLink to={'/memes'}
                                         style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Memes</NavLink>
                                <NavLink to={'/profile'}
                                         style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>Profile</NavLink>
                                <NavLink to={'/api'}
                                         style={({isActive}) => ({textDecoration: `${isActive ? 'underline' : 'none'}`})}>API</NavLink>
                            </Navigation>
                        </div>
                        <div style={{display: 'inline-flex', alignItems: 'center'}}>
                            {children}
                        </div>
                        {session ?
                            <div style={{display: 'inline-flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <span style={{marginRight: 10}}>{session.username}</span>
                                <Button icon={<LogoutOutlined/>} onClick={logout}>Logout</Button>
                            </div>
                            :
                            <div style={{display: 'inline-flex', justifyContent: 'flex-end'}}>
                                <Link to={'/login'}>
                                    <Button icon={<LoginOutlined/>}>Login</Button>
                                </Link>
                            </div>
                        }
                    </div>
                </Col>
            </Row>
        </LayoutHeader>
    )
}
