import {useParams} from "react-router-dom";
import {Image, Typography} from "antd";
import {api} from "src/api";
import {Comments, MemeStat} from "src/components";
import {useApi} from "src/hooks";

const {Title} = Typography;
export const MemePage = () => {
    const params = useParams();
    const meme = useApi(() => api.memes.get(params.memeId as string));

    //  TODO: handle error if meme not found (useApi should return error and data etc or redirect on not found by axios)

    if (!meme) return null;

    return (
        <>
            {/* Single View Meme Actions */}
            <div style={{marginInline: 'auto', maxWidth: 800}}>
                <Image src={meme.image}/>
                <MemeStat meme={meme}/>
                <Title level={3}>Comments</Title>
                <Comments meme={meme}/>
            </div>
        </>
    )
}