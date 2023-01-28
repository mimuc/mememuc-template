import {Meme} from "src/types";
import {Button, Typography} from "antd";
import {api} from "src/api";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {useMemesState} from "src/states";
import {abbreviateNumber} from "src/utils";

type LikeButtonProps = {
    meme: Meme
}

const {Text} = Typography;

export const LikeButton = ({meme}: LikeButtonProps) => {
    const [, setMemes] = useMemesState()
    const totalLikes = abbreviateNumber(meme.totalLikes)

    const handleLikeToggle = async () => {
        if (meme.vote === 1) {
            await api.memes.downvote(meme.id)
            setMemes(prev => prev.map(m => m.id === meme.id ? {...m, vote: 0} : m))
        } else {
            await api.memes.upvote(meme.id)
            setMemes(prev => prev.map(m => m.id === meme.id ? {...m, vote: 1} : m))
        }
    }

    return (
        <Button icon={meme.vote === 1 ? <LikeFilled/> : <LikeOutlined key={'like'}/>}
                onClick={handleLikeToggle} type={'text'} style={{width: 80}}>
            <Text>{totalLikes}</Text>
        </Button>
    );
}