import {Avatar, Typography} from "antd";
import {UserOutlined} from "@ant-design/icons";

const {Text} = Typography;
export const Profile = () => {
    const user = {name: 'John Doe'}

    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <Avatar size={100}>
                <UserOutlined style={{fontSize: 40}}/>
            </Avatar>
            <Text>{user.name}</Text>
        </div>
    )
}