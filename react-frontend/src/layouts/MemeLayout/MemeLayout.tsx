import {ReactNode, useEffect} from "react";
import {useAsync} from "react-use";
import {Segmented} from "antd";
import {ClockCircleOutlined, HeartOutlined} from "@ant-design/icons";
import {api} from "src/api";
import {useMemesState} from "src/states";

type MemeLayoutProps = {
    children: ReactNode;
}

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
    // TODO: load memes based on filter and sort
    return <>
        <div style={{
            position: 'fixed',
            zIndex: 100,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingBlock: 10,
            boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)"
        }}>
            <div>
                {/* TODO: filters*/}
            </div>
            <div>
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
        </div>
        <div style={{paddingTop: 120}}>
            {children}
        </div>
    </>
}