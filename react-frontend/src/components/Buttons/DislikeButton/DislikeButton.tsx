import {MemeType} from "src/types";
import {Button, Typography} from "antd";
import {api} from "src/api";
import {DislikeFilled, DislikeOutlined} from "@ant-design/icons";
import {useMemesState} from "src/states";
import {abbreviateNumber} from "src/utils";

type DislikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const DislikeButton = ({meme}: DislikeButtonProps) => {
    const [, setMemes] = useMemesState()
    const totalDislikes = abbreviateNumber(meme.totalDislikes)

    const handleDislikeToggle = async () => {
        if (meme.vote === -1) {
            await api.memes.upvote(meme.id)
            setMemes(prev => prev && prev.map(m => m.id === meme.id ? {...m, vote: 0} : m))
        } else {
            await api.memes.downvote(meme.id)
            setMemes(prev => prev.map(m => m.id === meme.id ? {...m, vote: -1} : m))
        }
    }

    return <Button icon={meme.vote === -1 ? <DislikeFilled/> : <DislikeOutlined key={'like'}/>}
                   onClick={handleDislikeToggle} type={'text'} style={{width: 80}}>
        <Text>{totalDislikes}</Text>
    </Button>
}