import {MemeType} from "src/types";
import {Button, Typography} from "antd";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {abbreviateNumber} from "src/utils";
import {useMeme} from "src/hooks";

type LikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const LikeButton = ({meme}: LikeButtonProps) => {
    const {toggleLike} = useMeme(meme.publicId);
    const totalLikes = abbreviateNumber(meme.likes)

    return (
        <Button icon={meme.vote === 1 ? <LikeFilled/> : <LikeOutlined key={'like'}/>}
                onClick={toggleLike} type={'text'} style={{width: 80}}>
            <Text>{totalLikes}</Text>
        </Button>
    );
}