import {useCopyToClipboard} from "react-use";
import {Button, message} from "antd";
import {ShareAltOutlined} from "@ant-design/icons";
import {MemeType} from "src/types";

type ShareButtonProps = {
    meme: MemeType
}

export const ShareButton = ({meme}: ShareButtonProps) => {
    const [messageApi, contextHolder] = message.useMessage({maxCount: 3});
    const [, copyToClipboard] = useCopyToClipboard()

    const handleShare = () => {
        // TODO: make sure this works
        copyToClipboard(window.location.href + '/' + meme.publicId)
        messageApi.success('Meme URL copied.')
    }

    return (
        <>
            {contextHolder}
            <Button icon={<ShareAltOutlined/>} onClick={handleShare} type={'text'} style={{width: 80}}/>
        </>
    );
}