import {useEffect} from "react";
import {useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";
import uuid from "react-uuid";
import {api} from "src/api";
import {useEditorState} from "src/states";
import {DraftType, ShapeInterface} from "src/types";

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
    const [templates, setTemplates] = useLocalStorage('templates', []);

    // Load templates from server
    useEffect(() => {
        api.templates.all().then(templates => {
            // For all image urls in templates, download them and replace the url with the local url
            const offlineTemplates = templates.map(template => {
                template.shapes.map(shape => {
                    if (shape.type === 'image') {
                        // TODO
                    }

                    return shape;
                })
            })

            setTemplates(offlineTemplates)
        });
    }, [setTemplates]);


    const addTemplate = async (name: string, shapes: ShapeInterface[]) => {
        await api.templates.add(name, shapes);

        // Replace text with placeholders
        const templateShapes = shapes.map(s => s.type === 'text' ? {...s, text: 'Text Here'} : s);

        const newTemplate = {
            id: uuid(),
            name,
            shapes: templateShapes as ShapeInterface[]
        }

        setTemplates(prev => [...prev, newTemplate]);
    }

    return {templates, addTemplate};
}