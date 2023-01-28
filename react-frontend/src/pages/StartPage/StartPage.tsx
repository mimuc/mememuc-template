import {Typography} from "antd";
import {TemplateList} from "src/components";

const {Title} = Typography;

export const StartPage = () => {
    return (
        <>
            {/* Filter templates */}
            <Title level={2}>Templates</Title>
            <TemplateList/>
        </>
    )
        ;
}