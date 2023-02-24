import {useMemo, useState} from "react";
import {useEffectOnce} from "react-use";
import {Button, Form, Input, Typography} from "antd";
import {SendOutlined} from "@ant-design/icons";
import styled from "styled-components";
import randomColor from "randomcolor";
import {api} from "src/api";
import {getTimeSince} from "src/utils";
import {CommentType, MemeType} from "src/types";

type CommentsProps = {
    meme: MemeType
}

const {Text} = Typography;

const CommentsList = styled.div`
  height: 520px;
`;

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
    const [comments, setComments] = useState<CommentType[]>([]);

    // Handlers
    const handlePostComment = async ({text}: any) => {
        if (!text) return;

        const newComment = await api.comments.add(meme.publicId, text);
        setComments(prev => [...prev, newComment]);
    }

    useEffectOnce(() => {
        api.comments.forMeme(meme.publicId).then(data => setComments(data));
    })

    return (
        <div style={{width: 400}}>
            <Form name={'comment'} onFinish={handlePostComment} validateTrigger={'onSubmit'} style={{height: 40}}>
                <Input.Group compact>
                    <Form.Item name={'text'}>
                        <Input autoComplete={'off'} style={{
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
                    comments.slice().reverse().map(c => <Comment key={c.id} comment={c}/>)
                    : <Text style={{display: 'inline-block', color: 'gray', marginTop: 20}}>No comments yet.</Text>}
            </CommentsList>
        </div>
    )
}