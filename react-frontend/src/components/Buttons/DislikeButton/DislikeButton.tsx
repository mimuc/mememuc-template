import {Button, Typography} from "antd";
import {DislikeFilled, DislikeOutlined} from "@ant-design/icons";
import {abbreviateNumber} from "src/utils";
import {MemeType} from "src/types";
import {useAuth, useMeme} from "src/hooks";
import {useEffect} from "react";

const {Text} = Typography;

export const DislikeButton = ({id}: { id: string }) => {
    const {session} = useAuth();
    const {meme, toggleDislike} = useMeme(id)

    useEffect(() => {
        console.log('updated meme in dislike button', meme)
    }, [meme])

    if (!meme) return null;

    const totalDislikes = abbreviateNumber(meme.dislikes)

    return (
        <Button
            disabled={!session}
            icon={meme.vote === -1 ? <DislikeFilled/> : <DislikeOutlined/>}
            key={'dislike'}
            onClick={toggleDislike}
            type={'text'}
            style={{width: 80}}
        >
            <Text>{totalDislikes}</Text>
        </Button>
    );
}