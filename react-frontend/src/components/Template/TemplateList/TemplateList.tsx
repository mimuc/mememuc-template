import {useEffect, useState} from "react";
import {Alert, Empty} from "antd";
import {useTemplates} from "src/hooks";
import {TemplateItem} from "../TemplateItem/TemplateItem";

export const TemplateList = (props: any) => {
    const {templates} = useTemplates();
    const [selected, setSelectedId] = useState<string | null>(null);
    const {setTemplate} = props;

    useEffect(() => {
        const templateName = templates?.find(t => t.id === selected);
        setTemplate(templateName?.name);
    }, [selected])

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