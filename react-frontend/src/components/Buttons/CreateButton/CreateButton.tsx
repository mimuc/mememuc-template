import {Dropdown, MenuProps, message} from "antd";
import {useAuth, useCreateMemeModal, useCreateTemplateModal, useDownloadModal, useDrafts} from "src/hooks";

export const CreateButton = () => {
    const [messageApi, contextHolder] = message.useMessage({maxCount: 3});
    const {session} = useAuth();
    const openDownloadModal = useDownloadModal();
    const openCreateTemplateModal = useCreateTemplateModal();
    const openCreateMemeModal = useCreateMemeModal();
    const {addDraft} = useDrafts();
    const handleCreate = async (event: any) => {
        const key = event?.key;

        if (key === 'template') {
            await openCreateTemplateModal();
            await messageApi.success('TemplateItem saved.');
        } else if (key === 'draft') {
            addDraft();
            await messageApi.success('Draft saved.')
        } else if (key === 'download') {
            await openDownloadModal();
        } else {
            await openCreateMemeModal();
        }
    }

    const createButtonOptions: MenuProps['items'] = [
        {
            label: 'Save as template',
            key: 'template',
            disabled: !session
        },
        {
            label: 'Save as draft',
            key: 'draft'
        },
        {
            label: 'Download only',
            key: 'download',
        }
    ];

    return (
        <>
            {contextHolder}
            <Dropdown.Button
                menu={{items: createButtonOptions, onClick: handleCreate}}
                onClick={handleCreate}
            >Create Meme</Dropdown.Button>
        </>
    );
}


