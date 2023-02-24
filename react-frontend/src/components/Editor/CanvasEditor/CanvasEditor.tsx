import {useRef} from "react";
import {Layer, Stage} from 'react-konva';
import {useEffectOnce} from "react-use";
import {Col, Divider, InputNumber, Row, Space, theme} from "antd";
import {useCanvasSizeState, useEditorState, useSelectedShapeIdState, useStageRef} from "src/states";
import {AddImageButton, AddTextButton, ClearButton, CreateButton} from 'src/components/Buttons';
import {ImageShape, TextShape} from "../Shape";
import {ContextMenu} from "../ContextMenu/ContextMenu";
import {api} from "src/api";
import {useNavigate} from "react-router-dom";

export const CanvasEditor = () => {
    const {token} = theme.useToken();
    const [shapes,] = useEditorState();
    const [, setStageRef] = useStageRef();
    const [selectedShapeId, setSelectedShapeId] = useSelectedShapeIdState();
    const [canvasSize, setCanvasSize] = useCanvasSizeState();


    const stageRef = useRef<any>(null);
    const navigate = useNavigate();

    const checkDeselect = (e: any) => {
        // Deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedShapeId(null);
        }
    };

    const setWidth = (width: number) => {
        setCanvasSize(prev => ({...prev, width}));
    }

    const setHeight = (height: number) => {
        setCanvasSize(prev => ({...prev, height}));
    }

    // Effects
    useEffectOnce(() => {
        setStageRef(stageRef);
    });

    const onMemeCreate = (values: any) => {
        const url = stageRef.current.toDataURL();

        api.memes.add(values.visibility, values.name, url, canvasSize.width, canvasSize.height)
        .then(newMeme => {
            navigate(`/memes/${newMeme.publicId}`);
        });
    };


    return (
        <Space direction={'vertical'} size={'large'} style={{width: '100%'}}>
            <Row>
                <Col span={24}>
                    <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        Canvas Size (w x h):
                        <InputNumber min={100} max={1000} value={canvasSize.width}
                                     style={{width: 70, marginInline: token.marginXS}}
                                     onChange={setWidth as any}/>
                        x
                        <InputNumber min={100} max={1000} value={canvasSize.height}
                                     style={{width: 70, marginLeft: token.marginXS}}
                                     onChange={setHeight as any}/>
                    </div>
                    <Divider type={'vertical'} style={{height: '100%', marginInline: token.marginMD}}/>
                    <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        <AddImageButton/>
                        <AddTextButton/>
                        <ClearButton/>
                    </div>
                    <Divider type={'vertical'} style={{height: '100%', marginInline: token.marginMD}}/>

                    <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        <ContextMenu id={selectedShapeId}/>
                    </div>
                    <Divider type={'vertical'} style={{height: '100%', marginInline: token.marginMD}}/>
                    <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        <CreateButton onMemeCreate={onMemeCreate}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Stage
                        ref={stageRef}
                        onMouseDown={checkDeselect}
                        onTouchStart={checkDeselect}
                        width={canvasSize.width}
                        height={canvasSize.height}
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