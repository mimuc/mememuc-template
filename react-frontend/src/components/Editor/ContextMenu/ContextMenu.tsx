import {useToggle} from "react-use";
import {Alert, Button, Input, InputNumber, theme} from "antd";
import {
    BoldOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    FontColorsOutlined,
    FontSizeOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import {TwitterPicker} from "react-color";
import {useSelectedShapeIdState} from "src/states";
import {ImageShapeInterface, ShapeInterface, TextShapeInterface} from "src/types";
import {getTextColor} from "src/utils";
import {useShape} from "src/hooks";
import {VoiceInputButton} from "src/components";

type ContextMenuProps = {
    id: string | null;
}

const CloseIcon = styled(CloseCircleOutlined)`
  position: absolute;
  color: black;
  opacity: 0.6;
  bottom: 18px;
  right: 20px;

  &:hover {
    opacity: 0.8;
  }
`;

export const ContextMenu = ({id}: ContextMenuProps) => {
    const {token} = theme.useToken();

    // States
    const {shape, updateShape, deleteShape} = useShape<ShapeInterface>(id);
    const [, setSelectedShapeId] = useSelectedShapeIdState();
    const [showColorPicker, toggleColorPicker] = useToggle(false);

    // Type mappings
    const imageShape = shape?.type === 'image' && shape as ImageShapeInterface;
    const textShape = shape?.type === 'text' && shape as TextShapeInterface;

    // Handlers
    const handleFontSizeChange = (value: number) => {
        updateShape({fontSize: value} as Partial<TextShapeInterface>);
    }

    const handleTextChange = (e: any) => {
        updateShape({text: e.target.value} as Partial<TextShapeInterface>);
    }

    const handleBoldToggle = () => {
        updateShape({fontStyle: textShape && textShape?.fontStyle === 'bold' ? 'normal' : 'bold'} as Partial<TextShapeInterface>);
    }

    const handleColorSelection = (color: any) => {
        updateShape({fill: color.hex} as Partial<TextShapeInterface>)
    }

    const handleDelete = () => {
        setSelectedShapeId(null);
        deleteShape()
    };

    const handleVoiceInput = (value: string) => {
        updateShape({text: textShape ? textShape.text + value : value} as Partial<TextShapeInterface>);
    }

    if (!id) return <Alert message={'No shape selected'} type={'info'} showIcon
                           style={{width: 380, paddingBlock: 4}}/>

    return (
        <>
            <Button
                icon={<DeleteOutlined/>}
                danger
                onClick={handleDelete}
            />

            {
                /* Render image info when shape type is image */
                imageShape && (
                    <>
                        <InputNumber min={100} max={1000} value={shape?.width}
                                     style={{width: 70, marginInline: token.marginXS}}
                        />
                        x
                        <InputNumber min={100} max={1000} value={shape?.height}
                                     style={{width: 70, marginInline: token.marginXS}}
                        />
                    </>
                )
            }
            {
                /* Render text controls when shape type is text */
                textShape && (
                    <>
                        <InputNumber
                            addonBefore={<FontSizeOutlined style={{fontSize: 12}}/>}
                            style={{width: 90, marginLeft: token.marginXS}}
                            value={textShape.fontSize}
                            onChange={handleFontSizeChange as any}
                            controls={false}
                            min={5}
                            max={100}
                        />
                        <Input
                            value={textShape.text}
                            onChange={handleTextChange}
                            style={{marginLeft: token.marginXS, width: 150}}
                            suffix={<VoiceInputButton onTranscript={handleVoiceInput}/>}
                        />
                        <Button
                            icon={<BoldOutlined/>}
                            style={{marginLeft: token.marginXS}}
                            type={textShape.fontStyle === 'bold' ? 'primary' : 'default'}
                            onClick={handleBoldToggle}
                        />
                        <div style={{display: 'inline-block', position: 'relative', marginLeft: token.marginXS}}>
                            <Button
                                icon={<FontColorsOutlined style={{color: getTextColor(textShape.fill || 'black')}}/>}
                                style={{backgroundColor: textShape.fill}}
                                onClick={toggleColorPicker}
                            />
                            {showColorPicker && <div style={{position: 'absolute', top: 45, left: -5, zIndex: 1000}}>
                                <TwitterPicker width={'170px'} onChangeComplete={handleColorSelection}/>
                                <CloseIcon onClick={toggleColorPicker}/>
                            </div>}
                        </div>
                    </>
                )
            }
        </>
    );
}