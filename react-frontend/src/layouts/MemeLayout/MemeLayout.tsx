import {ReactNode, useEffect} from "react";
import {useAsync} from "react-use";
import {Input, Layout, Segmented} from "antd";
import {ClockCircleOutlined, HeartOutlined} from "@ant-design/icons";
import {api} from "src/api";
import {useMemesState} from "src/states";
import {Header} from "src/components";
import styled from "styled-components";

type MemeLayoutProps = {
    children: ReactNode;
}

const Content = styled(Layout.Content)`
  margin-top: 100px;
  padding-inline: 100px !important;
`;


export const MemeLayout = ({children}: MemeLayoutProps) => {
    const memesLoadable = useAsync(api.memes.all)
    const [, setMemes] = useMemesState();

    useEffect(() => {
        if (memesLoadable.value) {
            setMemes(memesLoadable.value)
        }
    }, [memesLoadable, setMemes]);

    if (memesLoadable.loading) return null;

    // TODO: apply sorter 'popular' | 'latest'
    // TODO: add filter
    // TODO: filter should additionally influence random meem get
    // TODO: sort and filter influence endless scroll and left-right navigation
    // TODO: endless scroll
    // TODO: sort by creation date and popularity
    // TODO: filter by votes
    // TODO: filter after firatm template, title, text <- search field
    // TODO: load memes based on filter and sort
    return (
        <Layout>
            <Header>
                <Input.Search style={{width: 400, marginRight: 20}} enterButton/>
                {/* TODO: filters*/}
                <div style={{display: 'inline-block'}}>
                    <Segmented
                        options={[
                            {
                                value: 'latest',
                                label: 'Latest',
                                icon: <ClockCircleOutlined/>,
                            },
                            {
                                value: 'popular',
                                label: 'Popular',
                                icon: <HeartOutlined/>,
                            },
                        ]}
                    />
                </div>
            </Header>
            <Content>
                {children}
            </Content>
        </Layout>
    );
}