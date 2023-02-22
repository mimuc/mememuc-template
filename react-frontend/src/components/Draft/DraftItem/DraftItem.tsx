import {DraftType} from "src/types";
import {useDrafts} from "src/hooks";

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

    // TODO: display draft
    // TODO: display basic info (number of texts and numebr of images)
    // TODO: wire handlers
    return null;
}