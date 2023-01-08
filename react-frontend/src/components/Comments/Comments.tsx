import {Meme} from "src/types";
import {SendOutlined} from "@ant-design/icons";
import {Button, Input, List, Typography} from "antd";
import {useState} from "react";

type CommentsProps = {
    meme: Meme
}

const {Text} = Typography;

export const Comments = ({meme}: CommentsProps) => {
    const [comments, setComments] = useState<string[]>([]);

    const handlePostComment = () => {
        setComments(prev => [...prev, "abcd"]);
    }

    return (
        <>
            <Input.Group compact>
                <Input style={{width: 500}} allowClear/>
                <Button type={'primary'} onClick={handlePostComment}>
                    <SendOutlined/>
                </Button>
            </Input.Group>
            {comments.length > 0 ?
                <List
                    dataSource={comments}
                    renderItem={(item) =>
                        <List.Item>{item}</List.Item>}
                    footer={
                        <div>
                            <Button style={{display: 'inline-block', marginInline: 'auto'}} type={'link'}>Load More</Button>
                        </div>
                    }/>
                : <Text style={{display: 'inline-block', color: 'gray', marginTop: 20}}>No comments yet.</Text>}
        </>
    )
}