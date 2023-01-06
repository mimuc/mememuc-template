import {CSSProperties} from "react";
import {Avatar} from "antd";
import {Template as TemplateType} from "src/types";

type TemplateProps = {
    template: TemplateType;
    style?: CSSProperties;
}

export const Template = ({template, style}: TemplateProps) => {
    return (
        <div style={{display: 'inline-block', ...style}}>
            <Avatar shape={'square'} size={200}></Avatar>
        </div>
    );
}