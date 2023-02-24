import uuid from "react-uuid";
import {Dropdown, MenuProps, Upload} from "antd";
import {useEditorState, useImageUrlState} from "src/states";
import {useImgflipInputModal, useScreenshot, useUrlInputModal, useWebcamInputModal} from "src/hooks";
import {getMeta, isImgUrl} from "src/utils";
import {ImageShapeInterface} from "src/types";
import {useEffect} from "react";

const imageButtonOptions: MenuProps['items'] = [
    {
        label: 'Image from URL',
        key: 'url'
    },
    {
        label: 'Take Photo',
        key: 'camera'
    },
    {
        label: 'Take Screenshot',
        key: 'screenshot'
    },
    {
        label: 'Imgflip',
        key: 'imgflip'
    }
];

export const AddImageButton = () => {
    const [, setShapes] = useEditorState();
    const takeScreenshot = useScreenshot();
    const openUrlInput = useUrlInputModal();
    const openWebcamInput = useWebcamInputModal();
    const openImgflipInput = useImgflipInputModal();
    const [imageUrl, setImageUrl] = useImageUrlState();

    const createImageElement = async (url: string) => {
        const meta = await getMeta(url);

        // Normalize width and height to 100px
        const width = meta.width;
        const height = meta.height;
        const ratio = width / height;
        const newWidth = 200;
        const newHeight = 200 / ratio;

        setShapes(prev => [...prev, {
            id: uuid(),
            type: 'image',
            x: 0,
            y: 0,
            url,
            width: newWidth,
            height: newHeight,
        } as ImageShapeInterface]);
    }

    // FIX BUG WITH MODAL
    useEffect(() => {
        console.log("imageUrl (In add image)", imageUrl)

        const loadImage = async () => {
            if(!imageUrl) return;

            const blob = await fetch(imageUrl).then(r => r.blob());
            console.log("blob", blob)
            const localImageUrl = URL.createObjectURL(blob);
            console.log("localsImageUrl", localImageUrl)
            await createImageElement(localImageUrl);
        }

        if(isImgUrl(imageUrl)) {
            loadImage();
        } else {
            setImageUrl(null)
        }
    }, [imageUrl])

    const handleAddImage = async (event: any) => {
        const key = event?.key;

        if (key === 'url') {
            await openUrlInput();
        } else if (key === 'camera') {
            const imageUrl = await openWebcamInput();
            if (imageUrl) await createImageElement(imageUrl);
        } else if (key === 'screenshot') {
            const screenshotUrl = await takeScreenshot();
            if (screenshotUrl) await createImageElement(screenshotUrl)
        } else if (key === 'imgflip') {
            await openImgflipInput();
            if (imageUrl) {
                const blob = await fetch(imageUrl).then(r => r.blob());
                console.log("blob", blob)
                const localImageUrl = URL.createObjectURL(blob);
                console.log("localsImageUrl", localImageUrl)
                await createImageElement(localImageUrl);
            }
        } else {
            // Upload image from disk
            const imageUrl = URL.createObjectURL(event);
            await createImageElement(imageUrl);
            return false;
        }
    };

    return (
        <div style={{display: 'inline-block'}}>
            <Dropdown.Button
                menu={{items: imageButtonOptions, onClick: handleAddImage}}
            >
                <Upload showUploadList={false} beforeUpload={handleAddImage} accept={"image/*"}>
                    Add Image
                </Upload>
            </Dropdown.Button>
        </div>
    );

}