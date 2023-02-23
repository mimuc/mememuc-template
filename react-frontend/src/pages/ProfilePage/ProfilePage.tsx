import {Alert, Card, Col, Row, theme, Typography} from "antd";
import {DraftList} from "src/components";
import {Link} from "react-router-dom";
import {useAsync} from "react-use";
import {api} from "src/api";
import {useSession} from "src/hooks";

const {Title} = Typography;

const MyMemeList = () => {
    const myMemesLoadable = useAsync(api.my.memes);

    if (!myMemesLoadable.value) return null;

    return (
        <Row gutter={[50, 50]}>
            {
                myMemesLoadable.value.map((meme) => (
                    <Col span={8}>
                        <Link to={`/memes/${meme.publicId}`}>
                            <Card hoverable title={meme.name}>
                                <img src={meme.imageUrl} alt={'Meme'}
                                     style={{width: "100%", height: "100%", objectFit: 'contain'}}/>
                            </Card>
                        </Link>
                    </Col>
                ))
            }
        </Row>
    )
}

export const ProfilePage = () => {
    const {token} = theme.useToken();
    const session = useSession();

    return (
        <>
            <Title level={2}>Your Drafts</Title>
            <DraftList/>
            <Title level={2} style={{marginTop: token.marginXXL}}>Your Memes</Title>
            {session ? <MyMemeList/> :
                <Alert showIcon message={<>You are not logged in. <Link to={'/login'}>Login</Link></>}/>}
        </>
    )
}