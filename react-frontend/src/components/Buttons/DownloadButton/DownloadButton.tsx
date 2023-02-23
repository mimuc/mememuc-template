import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {useDownloadModal} from "src/hooks";
import {MemeType} from "src/types";

type DownloadButtonProps = {
    meme: MemeType
}

export const DownloadButton = ({meme}: DownloadButtonProps) => {
    const openDownloadModal = useDownloadModal();

    const handleDownload = async () => {
        await openDownloadModal(meme.id);
    };

    return <Button icon={<DownloadOutlined/>} onClick={handleDownload} type={'text'} style={{width: 80}}/>
}