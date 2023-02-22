import uuid from "react-uuid";
import {Dropdown, MenuProps, Upload} from "antd";
import {useEditorState} from "src/states";
import {useImgflipInputModal, useUrlInputModal, useWebcamInputModal} from "src/hooks";
import {getMeta} from "src/utils";
import {ImageShapeInterface} from "src/types";

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
    const openUrlInput = useUrlInputModal();
    const openWebcamInput = useWebcamInputModal();
    const openImgflipInput = useImgflipInputModal();

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
    const handleAddImage = async (event: any) => {
            const key = event?.key;

            if (key === 'url') {
                const imageUrl = await openUrlInput();
                if (imageUrl) createImageElement(imageUrl);
            } else if (key === 'camera') {
                const imageUrl = await openWebcamInput();
                if (imageUrl) createImageElement(imageUrl);
            } else if (key === 'screenshot') {
                // TODO: Screenshot does not capture the entire screen
                // TODO: Move to hook
                const stream = await navigator.mediaDevices.getDisplayMedia();
                const track = stream.getTracks()[0];
                const imageCapture = new ImageCapture(track);
                const data = await imageCapture.grabFrame().then((bitmap) => {
                    var MAX_WIDTH = 300;
                    var MAX_HEIGHT = 300;

                    var width = bitmap.width;
                    var height = bitmap.height;

                    // Change the resizing logic
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = width * (MAX_HEIGHT / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d') as CanvasRenderingContext2D;
                    context.drawImage(bitmap, 0, 0, width, height)
                    return canvas.toDataURL();
                });
                track.stop()
                createImageElement(data)
            } else if (key === 'imgflip') {
                const imageUrl = await openImgflipInput();
                if (imageUrl) createImageElement(imageUrl);
            } else {
                // Upload image from disk
                const imageUrl = URL.createObjectURL(event);
                createImageElement(imageUrl);
                return false;
            }
        }
    ;

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