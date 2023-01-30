import {Dropdown, MenuProps} from "antd";

type SaveButtonProps = {
    onClick: (type: 'meme' | 'template' | 'draft') => void;
}

const saveButtonOptions: MenuProps['items'] = [
    {
        label: 'Save as template',
        key: 'template'
    },
    {
        label: 'Save as draft',
        key: 'draft'
    }
];

export const SaveButton = ({onClick}: SaveButtonProps) => {
    const handleSave = (event: any) => {
        const key = event?.key;
        onClick(key || 'meme');
    }

    return (
        <Dropdown.Button
            menu={{items: saveButtonOptions, onClick: handleSave}}
            onClick={handleSave}
        >Save</Dropdown.Button>
    );
}