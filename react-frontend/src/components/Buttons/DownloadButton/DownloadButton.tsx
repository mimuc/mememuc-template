import {MemeType} from "src/types";
import {Button} from "antd";
import {DownloadOutlined} from "@ant-design/icons";

type DownloadButtonProps = {
    meme: MemeType
}

export const DownloadButton = ({meme}: DownloadButtonProps) => {
    const handleDownload = () => {
        console.log("Downloading image...")
        // TODO: implement
    };

    return <Button icon={<DownloadOutlined />} onClick={handleDownload} type={'text'} style={{width: 80}}/>
}