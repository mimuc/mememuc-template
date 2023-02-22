import {Button, Popconfirm, theme} from "antd";
import {ClearOutlined} from "@ant-design/icons";
import {useEditorState, useSelectedShapeIdState} from "src/states";

export const ClearButton = () => {
    const [, setSelectedShapeId] = useSelectedShapeIdState();
    const {token} = theme.useToken();
    const [, setShapes] = useEditorState();

    const clearCanvas = () => {
        setSelectedShapeId(null);
        setShapes([]);
    }

    return (
        <Popconfirm title={'Are you sure you want to clear the canvas?'} okText={'Yes'} cancelText={'No'}
                    onConfirm={clearCanvas}>
            <Button
                icon={<ClearOutlined/>}
                style={{marginLeft: token.marginXS}}
                danger
            />
        </Popconfirm>
    );
}