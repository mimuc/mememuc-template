import {Circle, Image as KImage, Layer, Rect, Stage} from 'react-konva';
import {Button, Col, Row, theme} from "antd";
import {AddImageButton} from "src/components/Editor/AddImageButton";
import {SaveButton} from "src/components/Editor/SaveButton";
import useImage from "use-image";
import {ReactNode, useState} from "react";
import {useToggle} from "react-use";
import {EditOutlined} from "@ant-design/icons";
import uuid from 'react-uuid';

type Element = {
    id: string;
    node: ReactNode
};

const Image = ({url, onSelect}: any) => {
    const [image] = useImage(url);
    return <KImage image={image as any} draggable dashEnabled={true}/>
}

//  TODO: type properly
export const CanvasEditor = () => {
    const {token} = theme.useToken()
    const [freeDrawingOn, toggleFreeDrawing] = useToggle(false)
    const [elements, setElements] = useState<Element[]>([
        {
            id: 'rect',
            node: <Rect width={50} height={50} fill={'red'} draggable key={'rect'}/>
        },
        {
            id: 'circle',
            node: <Circle x={200} y={200} stroke={"black"} radius={50} draggable key={'circle'}/>
        }
    ]);

    const handleAddImage = (imageUrl: string) => {
        const id = uuid();
        setElements(prev => [...prev, {id, node: <Image key={id} url={imageUrl}/>}]);
    };

    const handleSave = (type: any) => {

    };


    return (
        <>
            <Row>
                <Col span={12}>
                    <div>
                        <AddImageButton onClick={handleAddImage}/>
                        <Button
                            icon={<EditOutlined/>}
                            style={{marginLeft: token.marginXS}}
                            onClick={toggleFreeDrawing}
                            type={freeDrawingOn ? 'primary' : 'default'}/>

                    </div>
                    <Row>
                        <Stage width={window.innerWidth} height={window.innerHeight} style={{border: '1px solid gray'}}>
                            <Layer>
                                {elements.map(e => e.node)}
                            </Layer>
                        </Stage>
                    </Row>
                </Col>
            </Row>
            <Row>

                <Col span={12}>
                    <Row>
                        <SaveButton onClick={handleSave}/>
                    </Row>
                </Col>
            </Row>
        </>
    )
}