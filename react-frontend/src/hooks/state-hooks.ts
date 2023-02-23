import {useEffectOnce, useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";
import uuid from "react-uuid";
import {api} from "src/api";
import {useEditorState} from "src/states";
import {DraftType, ShapeInterface, TemplateType} from "src/types";

export const useDrafts = () => {
    const [shapes, setShapes] = useEditorState();
    const [drafts, setDrafts,] = useLocalStorage<DraftType[]>('drafts', []);
    const navigate = useNavigate();

    const addDraft = () => {
        const newDrafts = [];

        if (drafts) {
            newDrafts.push(...drafts);
        }

        newDrafts.push({
            id: uuid(),
            shapes
        });

        setDrafts(newDrafts)
    }

    const loadDraft = (id: string) => {
        if (!drafts) return;

        setShapes(drafts.find(draft => draft.id === id)?.shapes || []);
        navigate('/');
    }

    const deleteDraft = (id: string) => {
        if (!drafts) return;

        setDrafts(drafts.filter(draft => draft.id !== id));
    }

    return {drafts, addDraft, loadDraft, deleteDraft};
}

export const useTemplates = () => {
    const [templates, setTemplates] = useLocalStorage<TemplateType[]>('templates', []);

    // Load templates from server
    useEffectOnce(() => {
        api.templates.all().then(templates => setTemplates(templates as TemplateType[]));
    });

    const addTemplate = async (name: string, shapes: ShapeInterface[]) => {
        await api.templates.add(name, shapes, {width: 700, height: 700});

        // Replace text with placeholders
        const templateShapes = shapes.map(s => s.type === 'text' ? {...s, text: 'Text Here'} : s);

        const newTemplate = {
            id: uuid(),
            name,
            shapes: templateShapes as ShapeInterface[]
        } as TemplateType;

        // Update local storage
        const updatedTemplates: TemplateType[] = [];

        if (templates) {
            updatedTemplates.push(...templates);
        }

        updatedTemplates.push(newTemplate);
        setTemplates(updatedTemplates);
    }

    return {templates, addTemplate};
}