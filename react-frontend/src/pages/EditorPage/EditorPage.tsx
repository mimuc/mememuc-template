import {theme, Typography} from "antd";
import {CanvasEditor, TemplateList} from "src/components";
import {api} from "src/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {useTemplates} from "src/hooks";

const {Title} = Typography;

export const EditorPage = () => {
    const {token} = theme.useToken();
    const navigate = useNavigate();
    const {addTemplate} = useTemplates();
    const [template, setTemplate] = useState("");

    const onMemeCreation = (values: any) => {
        const url = values.stageRef.current.toDataURL();

        api.memes.add(values.visibility, values.name, url, values.canvasSize.width, values.canvasSize.height, template)
        .then(newMeme => {
            navigate(`/memes/${newMeme.publicId}`);
        });
    };

    const onTemplateCreation = (values: any) => {
        api.templates.add(
            values.name,
            values.shapes,
            values.canvasSize
        )
        addTemplate(values.name, values.canvasSize, values.shapes)
    }

    return (
        <>
            <CanvasEditor onMemeCreation={onMemeCreation} onTemplateCreation={onTemplateCreation}/>
            <Title level={2} style={{marginTop: token.marginXXL}}>Templates</Title>
            <TemplateList setTemplate={setTemplate}/>
        </>
    )
}

