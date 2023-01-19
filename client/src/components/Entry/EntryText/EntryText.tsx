// IMPORTS
import './EntryText.scss';

export interface Props {
    id: string;
    name: string;
    label?: string;
    type: string;
    placeholder?: string;
    value?: string | number;
    zIndex?: number;
    isAutoFocused?: boolean;
    isRequired?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Icon?: {
        name: string; // e.g. <Icon />
        url?: string;
        state?: string; // can be used for toggling color. e.g. 'active' or 'inactive'
        label?: string; // can be used for accessibility
    };
}

export const EntryText = (props: Props): JSX.Element => {
    // FUNCTIONS

    // const handleChange = (e: ) => {
    //     props.onChange(e)
    // }

    // RETURN

    return (
        <div className="EntryText">
            {props.label && (
                <div className="info">
                    <label htmlFor="" className="Label">
                        {props.label}
                    </label>
                </div>
            )}
            <div className="InputWrapper">
                <input
                    // onChange={handleChange}
                    name={props.name}
                    id={props.id}
                    type={props.type}
                    aria-label={props.label}
                    className="InputBox"
                    placeholder={props.placeholder}
                    required={props.isRequired}
                    onChange={props.onChange}
                    autoFocus={props.isAutoFocused}
                />
                {props.Icon && props.Icon.name && (
                    <span className="material-symbols-outlined Icon">{props.Icon.name}</span>
                )}
            </div>
        </div>
    );
};
