import {theme, Typography} from "antd";
import {CanvasEditor, TemplateList} from "src/components";

const {Title} = Typography;

export const EditorPage = () => {
    const {token} = theme.useToken();

    return (
        <>
            <CanvasEditor/>
            <Title level={2} style={{marginTop: token.marginXXL}}>Templates</Title>
            <TemplateList />
        </>
    )
}

