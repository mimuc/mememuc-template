import {useRef, useState} from "react";
import {Layer, Stage} from 'react-konva';
import {useEffectOnce} from "react-use";
import {Col, InputNumber, Row, Space, theme} from "antd";
import {useEditorState, useSelectedShapeIdState, useStageRef} from "src/states";
import {AddImageButton, AddTextButton, ClearButton, CreateButton} from 'src/components/Buttons';
import {ImageShape, TextShape} from "../Shape";
import {ContextMenu} from "../ContextMenu/ContextMenu";

export const CanvasEditor = () => {
    const {token} = theme.useToken();
    const [shapes,] = useEditorState();
    const [, setStageRef] = useStageRef();
    const [selectedShapeId, setSelectedShapeId] = useSelectedShapeIdState();
    const [width, setWidth] = useState(700);
    const [height, setHeight] = useState(700);

    const stageRef = useRef<any>(null);

    const checkDeselect = (e: any) => {
        // Deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedShapeId(null);
        }
    };

    // Effects
    useEffectOnce(() => {
        setStageRef(stageRef);
    });


    return (
        <Space direction={'vertical'} size={'large'} style={{width: '100%'}}>
            <Row>
                <Col span={7} style={{display: 'flex', alignItems: 'center'}}>
                    Canvas Size (w x h):
                    <InputNumber min={100} max={1000} value={width} style={{width: 70, marginInline: token.marginXS}}
                                 onChange={setWidth as any}/>
                    x
                    <InputNumber min={100} max={1000} value={height} style={{width: 70, marginInline: token.marginXS}}
                                 onChange={setHeight as any}/>
                </Col>
                <Col offset={1} span={4} style={{display: 'flex', alignItems: 'center'}}>
                    <AddImageButton/>
                    <AddTextButton/>
                    <ClearButton/>
                </Col>
                <Col offset={1} span={4} style={{display: 'flex', alignItems: 'center'}}>
                    <ContextMenu id={selectedShapeId}/>
                </Col>
                <Col offset={1} span={4}>
                    <CreateButton/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Stage
                        ref={stageRef}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                        width={width}
                        height={height}
                        style={{border: '1px solid gray'}}
                    >
                        <Layer>
                            {shapes.map(s => s.type === 'text' ?
                                <TextShape key={s.id} id={s.id} selected={s.id === selectedShapeId}
                                           onSelect={setSelectedShapeId}/> :
                                <ImageShape key={s.id} id={s.id} selected={s.id === selectedShapeId}
                                            onSelect={setSelectedShapeId}/>
                            )}
                        </Layer>
                    </Stage>
                </Col>
            </Row>
        </Space>
    )
}