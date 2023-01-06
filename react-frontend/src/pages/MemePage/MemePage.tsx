import {useLocation, useParams} from "react-router-dom";
import {Typography} from "antd";

const {Title} = Typography;
export const MemePage = () => {
    const {state} = useLocation();
    const params = useParams();

    if (state === 'comments') {
        // TODO: scroll to comments
    }

    return (
        <>
            {params.memeId}
            <Title id={'comments'}>Comments</Title>
        </>
    )
}