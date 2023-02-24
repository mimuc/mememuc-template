import {useEffect, useState} from "react";
import {useToggle} from "react-use";
import {Alert, Button, InputNumber, theme} from "antd";
import {
    BoldOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    FontColorsOutlined,
    FontSizeOutlined
} from "@ant-design/icons";
import styled from "styled-components";
import {TwitterPicker} from "react-color";
import {useEditorState, useSelectedShapeIdState} from "src/states";
import {ImageShapeInterface, ShapeInterface, TextShapeInterface} from "src/types";
import {getTextColor} from "src/utils";

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
    const [shapes, setShapes] = useEditorState();
    const [, setSelectedShapeId] = useSelectedShapeIdState();
    const [shape, setShape] = useState<ShapeInterface | null>(null);
    const [showColorPicker, toggleColorPicker] = useToggle(false);

    // Type mappings
    const imageShape = shape?.type === 'image' && shape as ImageShapeInterface;
    const textShape = shape?.type === 'text' && shape as TextShapeInterface;

    // Handlers
    const handleChangeFontSize = (value: number) => {
        setShapes(prev => prev.map((shape) => {
            if (shape.id === id) {
                return {
                    ...shape,
                    fontSize: value
                }
            }
            return shape;
        }));
    }

    const handleToggleBold = () => {
        setShapes(prev => prev.map((shape) => {
                if (shape.id === id) {
                    return {
                        ...shape,
                        fontStyle: textShape && textShape?.fontStyle === 'bold' ? 'normal' : 'bold'
                    }
                }
                return shape;
            }
        ));
    }

    const handleColorSelection = (color: any) => {
        setShapes(prev => prev.map((shape) => {
            if (shape.id === id) {
                return {
                    ...shape,
                    fill: color.hex
                }
            }
            return shape;
        }));
    }

    const handleDelete = () => {
        setSelectedShapeId(null);
        setShapes(prev => prev.filter((shape) => shape.id !== id));
    };

    // Effects
    useEffect(() => {
        const selectedShape = shapes.find((shape) => shape.id === id);
        setShape(selectedShape || null);
    }, [id, shapes]);

    if (!id) return <Alert message={'No shape selected'} type={'info'} showIcon
                           style={{height: 32, width: 230, paddingBlock: 4}}/>

    return (
        <>
            <Button
                icon={<DeleteOutlined/>}
                style={{color: token.colorError}}
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
                            onChange={handleChangeFontSize as any}
                            controls={false}
                            min={5}
                            max={100}
                        />
                        <Button
                            icon={<BoldOutlined/>}
                            style={{marginLeft: token.marginXS}}
                            type={textShape.fontStyle === 'bold' ? 'primary' : 'default'}
                            onClick={handleToggleBold}
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