import {useEffectOnce, useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";
import uuid from "react-uuid";
import {api} from "src/api";
import {useCanvasSizeState, useEditorState, useTemplatesState} from "src/states";
import {DraftType, ShapeInterface, TemplateType} from "src/types";
import {useEffect} from "react";

export const useDrafts = () => {
    const [canvasSize, setCanvasSize] = useCanvasSizeState();
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
            shapes,
            canvasSize
        });

        setDrafts(newDrafts)
    }

    const loadDraft = (id: string) => {
        if (!drafts) return;

        const draft = drafts.find(draft => draft.id === id);
        if (!draft) return;

        setCanvasSize(draft.canvasSize);
        setShapes(draft.shapes);
        navigate('/');
    }

    const deleteDraft = (id: string) => {
        if (!drafts) return;

        setDrafts(drafts.filter(draft => draft.id !== id));
    }

    return {drafts, addDraft, loadDraft, deleteDraft};
}

export const useTemplates = () => {
    const [persistentTemplates, setPersistentTemplates] = useLocalStorage<TemplateType[]>('templates', []);
    const [templates, setTemplates] = useTemplatesState();

    useEffectOnce(() => {
        setTemplates(persistentTemplates || []);
    });

    useEffect(() => {
        setPersistentTemplates(templates);
    }, [templates, setPersistentTemplates]);


    // Load templates from server
    useEffectOnce(() => {
        api.templates.all().then(templates => setTemplates(templates as TemplateType[]));
    });

    const addTemplate = async (name: string, canvasSize: {width: number, height: number}, shapes: ShapeInterface[]) => {
        const newTemplate = {
            id: uuid(),
            name,
            shapes: shapes,
            canvasSize
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