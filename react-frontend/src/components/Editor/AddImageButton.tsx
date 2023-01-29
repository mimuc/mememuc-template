import {Dropdown, MenuProps, Upload} from "antd";
import {useUrlInputModal, useWebcamInputModal} from "src/hooks";

type AddImageButtonProps = {
    onClick: (imageUrl: string) => void
}

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
    }
];

export const AddImageButton = ({onClick}: AddImageButtonProps) => {
    const openUrlInput = useUrlInputModal();
    const openWebcamInput = useWebcamInputModal();
    const handleAddImage = async (event: any) => {
            const key = event?.key;

            if (key === 'url') {
                const imageUrl = await openUrlInput();
                if (imageUrl) onClick(imageUrl);
            } else if (key === 'camera') {
                const imageUrl = await openWebcamInput();
                if (imageUrl) onClick(imageUrl);
            } else if (key === 'screenshot') {
                // TODO: Screenshot does not capture the entire screen
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
                onClick(data);
            } else {
                // Upload image from disk
                const imageUrl = URL.createObjectURL(event);
                onClick(imageUrl);
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
                    Upload Image
                </Upload>
            </Dropdown.Button>
        </div>
    );

}