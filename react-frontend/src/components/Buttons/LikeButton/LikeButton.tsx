import {MemeType} from "src/types";
import {Button, Typography} from "antd";
import {api} from "src/api";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {useMemesState} from "src/states";
import {abbreviateNumber} from "src/utils";

type LikeButtonProps = {
    meme: MemeType
}

const {Text} = Typography;

export const LikeButton = ({meme}: LikeButtonProps) => {
    const [, setMemes] = useMemesState()
    const totalLikes = abbreviateNumber(meme.likes)

    const handleLikeToggle = async () => {
        if (meme.vote === 1) {
            await api.memes.upvoteRemove(meme.publicId)
            setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, likes: m.likes - 1, vote: 0} : m))
        } else {
            await api.memes.upvote(meme.publicId)
            setMemes(prev => prev.map(m => m.publicId === meme.publicId ? {...m, likes: m.likes + 1, dislikes: m.vote === -1 ? m.dislikes - 1 : m.dislikes , vote: 1} : m))
        }
    }

    return (
        <Button icon={meme.vote === 1 ? <LikeFilled/> : <LikeOutlined key={'like'}/>}
                onClick={handleLikeToggle} type={'text'} style={{width: 80}}>
            <Text>{totalLikes}</Text>
        </Button>
    );
}