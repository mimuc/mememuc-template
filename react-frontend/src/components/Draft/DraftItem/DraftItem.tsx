import {DraftType, ImageShapeInterface} from "src/types";
import {useDrafts} from "src/hooks";
import {Button} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

type DraftItemProps = {
    draft: DraftType
}

export const DraftItem = ({draft}: DraftItemProps) => {
    const {loadDraft, deleteDraft} = useDrafts()

    const handleLoad = () => {
        loadDraft(draft.id)
    };

    const handleDelete = () => {
        deleteDraft(draft.id)
    };

    const firstImage = draft.shapes.find(s => s.type === 'image') as ImageShapeInterface;
    const numberImages = draft.shapes.filter(s => s.type === 'image').length;
    const numberTexts = draft.shapes.filter(s => s.type === 'text').length;

    return (
        <div style={{
            display: 'inline-block',
            width: 200,
            marginRight: 20,
        }}>
            <div style={{
                marginBottom: 20,
                width: 200,
                height: 200,
                backgroundColor: 'lightgray',
                borderRadius: 10,
            }} onClick={handleLoad}>
                {firstImage &&
                    <img src={firstImage.url} style={{objectFit: 'contain', width: '100%', height: '100%'}}
                         alt={'TemplateItem Image'}/>}
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{color: 'darkslategray'}}>
                    {numberImages} image{numberImages != 1 ? 's' : ''}, {numberTexts} text{numberTexts != 1 ? 's' : ''}
                </span>
                <Button icon={<DeleteOutlined/>} onClick={handleDelete} danger/>
            </div>
        </div>
    );
}