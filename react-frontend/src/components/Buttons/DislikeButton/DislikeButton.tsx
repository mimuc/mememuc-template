import {Button, Typography} from "antd";
import {DislikeFilled, DislikeOutlined} from "@ant-design/icons";
import {api} from "src/api";
import {useMemesState} from "src/states";
import {abbreviateNumber} from "src/utils";
import {MemeType} from "src/types";

type DislikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const DislikeButton = ({meme}: DislikeButtonProps) => {
    const [, setMemes] = useMemesState()
    const totalDislikes = abbreviateNumber(meme.dislikes)

    const handleDislikeToggle = async () => {
        if (meme.vote === -1) {
            await api.memes.downvoteRemove(meme.publicId)
            setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, dislikes: m.dislikes - 1, vote: 0} : m))
        } else {
            await api.memes.downvote(meme.publicId)
            setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, dislikes: m.dislikes + 1, likes: m.vote === 1 ? m.likes - 1 : m.likes, vote: -1} : m))
        }
    }

    return (
        <Button icon={meme.vote === -1 ? <DislikeFilled/> : <DislikeOutlined key={'dislike'}/>}
                onClick={handleDislikeToggle} type={'text'} style={{width: 80}}>
            <Text>{totalDislikes}</Text>
        </Button>
    );
}