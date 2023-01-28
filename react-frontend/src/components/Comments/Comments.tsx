import {useMemo, useState} from "react";
import {Button, Form, Input, Typography} from "antd";
import {SendOutlined} from "@ant-design/icons";
import {api} from "src/api";
import {Comment as CommentType, Meme} from "src/types";
import {useEffectOnce} from "react-use";
import {getTimeSince} from "src/utils";
import styled from "styled-components";
import randomColor from "randomcolor";


type CommentsProps = {
    meme: Meme
}

const {Text} = Typography;

// TODO: height needs to adjust to image plus title
const CommentsList = styled.div`
  height: 600px;
  overflow-y: auto;
`;

// TODO: add pagination
const Comment = ({comment}: { comment: CommentType }) => {
    const nameColor = useMemo(() => randomColor({luminosity: 'dark'}), [])

    return (
        <div style={{marginInline: 5, marginBottom: 30}}>
            <div style={{backgroundColor: 'whitesmoke', borderRadius: 20, paddingInline: 18, paddingBlock: 5}}>
                <Text strong style={{
                    display: 'inline-block',
                    marginRight: 5,
                    color: nameColor as string
                }}>{comment.user ? `${comment.user.name}` : 'Unknown'}:</Text>
                <Text>{comment.text}</Text>
            </div>
            <Text
                style={{
                    fontSize: 12,
                    marginRight: 20,
                    display: 'block',
                    color: 'gray',
                    float: 'right'
                }}>
                {getTimeSince(new Date(comment.createdAt))}
            </Text>
        </div>
    );
}

export const Comments = ({meme}: CommentsProps) => {
    // States
    // TODO: sort comments by date new ones first
    const [comments, setComments] = useState<CommentType[]>([]);

    // Handlers
    const handlePostComment = async ({text}: any) => {
        if (!text) return;

        const newComment = await api.comments.add(meme.id, text);
        setComments(prev => [newComment, ...prev]);
    }

    useEffectOnce(() => {
        api.comments.forMeme(meme.id).then(data => setComments(data));
    })

    return (
        <div style={{width: 400}}>
            <Form name={'comment'} onFinish={handlePostComment} validateTrigger={'onSubmit'} style={{height: 40}}>
                <Input.Group compact>
                    <Form.Item name={'text'}>
                        <Input autoComplete={'off'} style={{
                            // TODO: make width responsive
                            width: 340,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 20,
                            borderTopLeftRadius: 20
                        }}
                               placeholder={"Write new comment..."} allowClear/>
                    </Form.Item>
                    <Form.Item noStyle>
                        <Button type={'primary'} htmlType={'submit'} style={{
                            borderBottomRightRadius: 20,
                            borderTopRightRadius: 20
                        }}>
                            <SendOutlined/>
                        </Button>
                    </Form.Item>
                </Input.Group>
            </Form>
            <CommentsList>
                {comments.length > 0 ?
                    comments.map(c => <Comment key={c.id} comment={c}/>)
                    : <Text style={{display: 'inline-block', color: 'gray', marginTop: 20}}>No comments yet.</Text>}
            </CommentsList>
        </div>
    )
}