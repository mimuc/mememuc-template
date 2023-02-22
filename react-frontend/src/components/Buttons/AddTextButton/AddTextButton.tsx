import uuid from "react-uuid";
import {Button, Tooltip, theme} from "antd";
import {EditOutlined} from "@ant-design/icons";
import {useEditorState} from "src/states";
import {TextShapeInterface} from "src/types";

export const AddTextButton = () => {
    const {token} = theme.useToken();
    const [, setShapes] = useEditorState();

    const addTextBox = () => {
        setShapes(prev => [
            ...prev,
            {
                id: uuid(),
                type: 'text',
                x: 0,
                y: 0,
                text: 'Text here',
                fontSize: 20,
                fill: '#000000',
            } as TextShapeInterface
        ])
    }

    return <Tooltip title={'Add text box'} mouseEnterDelay={.5}>
        <Button
            icon={<EditOutlined/>}
            style={{marginLeft: token.marginXS}}
            onClick={addTextBox}
        />
    </Tooltip>
}