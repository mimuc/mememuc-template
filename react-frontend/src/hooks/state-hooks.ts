import {useEffect} from "react";
import {useLocalStorage} from "react-use";
import {useNavigate} from "react-router-dom";
import uuid from "react-uuid";
import {api} from "src/api";
import {useEditorState, useTemplatesState} from "src/states";
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
    // TODO: store templates in local storage (we need to download all images, create urls locally and load them again...)
    // TODO: make sure to not overwrite them with templates from server
    const [templates, setTemplates] = useTemplatesState();

    // Load templates from server
    useEffect(() => {
        api.templates.all().then(templates => setTemplates(templates));
    }, [setTemplates]);


    const addTemplate = (name: string, shapes: ShapeInterface[]) => {
        // TODO: save server side and locally
        // TODO: if logged in attribute to user

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