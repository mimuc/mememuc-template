import {theme, Tooltip, Typography} from "antd";
import {ImageShapeInterface, TemplateType as TemplateType, TextShapeInterface} from "src/types";
import {useEditorState} from "src/states";

type TemplateItemProps = {
    template: TemplateType;
    selected: boolean;
    onSelect: (id: string) => void;
}

const {Title} = Typography;

export const TemplateItem = ({template, selected, onSelect}: TemplateItemProps) => {
    const {token} = theme.useToken();
    const [shapes, setShapes] = useEditorState();

    const handleSelect = () => {
        onSelect(template.id);

        const oldTexts = shapes.filter(s => s.type === 'text') as TextShapeInterface[] || [];
        const newShapes = template.shapes.map(s => {
            if (s.type === 'text' && oldTexts.length > 0) {
                const old = oldTexts.shift() as TextShapeInterface;
                return {...s, text: old.text} as TextShapeInterface;
            }

            return s;
        });

        // If there are more old texts than new texts, add them to the end of the new texts
        if (oldTexts.length > 0) {
            newShapes.push(...oldTexts);
        }

        console.log("new shapes:", newShapes);
        console.log("old shapes:", shapes);

        // Sort shapes so that images are in the background, i.e. rendered first
        newShapes.sort((a, b) => {
            if (a.type === 'image' && b.type === 'text') {
                return -1;
            } else if (a.type === 'text' && b.type === 'image') {
                return 1;
            } else return 0;
        });

        setShapes(newShapes);
    }

    const firstImage = template.shapes.find(s => s.type === 'image') as ImageShapeInterface;
    const numberImages = template.shapes.filter(s => s.type === 'image').length;
    const numberTexts = template.shapes.filter(s => s.type === 'text').length;

    return (
        <div style={{
            display: 'inline-block',
            width: 200,
            height: 200,
            marginRight: 20,
        }}>
            <div style={{
                marginBottom: 20,
                width: 200,
                height: 200,
                backgroundColor: 'lightgray',
                borderRadius: 10,
                border: selected ? `solid 2px ${token.colorPrimary}` : 'none'
            }} onClick={handleSelect}>
                {firstImage &&
                    <img src={firstImage.url} style={{objectFit: 'contain', width: '100%', height: '100%'}}
                         alt={'TemplateItem Image'}/>}
            </div>
            <Title level={5} style={{marginBottom: 0, whiteSpace: 'break-spaces'}}>{template.name}</Title>
            <span style={{color: 'darkslategray'}}>
                {numberImages} image{numberImages != 1 ? 's' : ''}, {numberTexts} text{numberTexts != 1 ? 's' : ''}
            </span>
        </div>
    );
}