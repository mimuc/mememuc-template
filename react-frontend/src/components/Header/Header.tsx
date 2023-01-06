import { Layout, Typography } from 'antd';
import styled from 'styled-components';
import { CSSProperties, ReactNode } from 'react';
import { config } from 'src/config';

const { Title } = Typography;

const LayoutHeader = styled(Layout.Header)`
  display: flex;
  align-items: center;
  @media screen and (min-width: 1000px) {
    padding-inline: 50px !important;
  }
`;

type HeaderProps = {
    style?: CSSProperties;
    children?: ReactNode;
};

// TODO: add logo
export const Header = ({ style, children }: HeaderProps) => {
    return (
        <LayoutHeader
            style={{
                padding: 0,
                height: '10vh',
                backgroundColor: 'inherit',
                ...style
            }}>
            <Title level={3} style={{ color: '#232323', margin: 0 }}>
                {config.APP_TITLE}
            </Title>
            {children}
        </LayoutHeader>
    );
};