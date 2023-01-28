import {useCopyToClipboard} from "react-use";
import {Button, message} from "antd";
import {ShareAltOutlined} from "@ant-design/icons";
import {Meme} from "src/types";

type ShareButtonProps = {
    meme: Meme
}

export const ShareButton = ({meme}: ShareButtonProps) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [, copyToClipboard] = useCopyToClipboard()

    const handleShare = () => {
        // TODO: make sure this works
        copyToClipboard(window.location.href + '/' + meme.id)
        messageApi.success('Meme URL copied.')
    }

    return (
        <>
            {contextHolder}
            <Button icon={<ShareAltOutlined/>} onClick={handleShare} type={'text'} style={{width: 80}}/>
        </>
    );
}