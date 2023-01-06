import {api} from "src/api";
import {useApi} from "src/hooks";
import {Template as TemplateType} from "src/types";
import {Template} from "src/components/Template/Template";

export const TemplateList = () => {
    const templates = useApi<TemplateType[]>(api.templates.all);

    if (!templates) return null;

    return (
        <div style={{width: '100%', overflow: 'auto', whiteSpace: 'nowrap'}}>
            {templates.map(t => <Template key={t.id} template={t} style={{marginRight: 20, marginBottom: 20}}/>)}
        </div>
    );
}