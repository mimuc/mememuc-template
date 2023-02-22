import {useTemplates} from "src/hooks";
import {TemplateItem} from "src/components/Template/TemplateItem/TemplateItem";
import {useState} from "react";
import {Alert, Empty} from "antd";

export const TemplateList = () => {
    const {templates} = useTemplates();
    const [selected, setSelectedId] = useState<string | null>(null);

    return (
        <div style={{height: 300, width: '100%', overflow: 'auto', whiteSpace: 'nowrap'}}>
            {templates && templates.length > 0 && templates.map(t => <TemplateItem
                    key={t.id}
                    template={t}
                    selected={t.id === selected}
                    onSelect={setSelectedId}
                />
            )}
            {(!templates || templates.length === 0) && <Alert message={<Empty description={'No templates found'}/>}/>}
        </div>
    );
}