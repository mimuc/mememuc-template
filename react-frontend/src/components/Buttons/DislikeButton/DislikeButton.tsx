import {Button, Typography} from "antd";
import {DislikeFilled, DislikeOutlined} from "@ant-design/icons";
import {abbreviateNumber} from "src/utils";
import {MemeType} from "src/types";
import {useMeme} from "src/hooks";

type DislikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const DislikeButton = ({meme}: DislikeButtonProps) => {
    const {toggleDislike} = useMeme(meme.publicId)
    const totalDislikes = abbreviateNumber(meme.dislikes)

    return <Button icon={meme.vote === -1 ? <DislikeFilled/> : <DislikeOutlined key={'like'}/>}
                   onClick={toggleDislike} type={'text'} style={{width: 80}}>
        <Text>{totalDislikes}</Text>
    </Button>
}