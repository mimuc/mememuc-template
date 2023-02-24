import {Button, Typography} from "antd";
import {DislikeFilled, DislikeOutlined} from "@ant-design/icons";
import {abbreviateNumber} from "src/utils";
import {MemeType} from "src/types";
import {useAuth, useMeme} from "src/hooks";
import {useEffect} from "react";

type DislikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const DislikeButton = ({meme}: DislikeButtonProps) => {
    const {session} = useAuth();
    const {toggleDislike} = useMeme(meme.publicId)
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