import Cookies from 'js-cookie';
import {Link, useNavigate } from "react-router-dom";
import {Button, Col, Form, Input, message, Row, theme, Typography} from "antd";
import {api} from "src/api";

const {Title, Text} = Typography;

export const LoginPage = () => {
    const { token } = theme.useToken();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleFinish = async (values: any) => {
        try {
            const data = await api.auth.login(values.username, values.password);

            // Set token cookie
            Cookies.remove('token');
            Cookies.set('token', data.token, {
                expires: Date.parse(data.expiryTime),
                sameSite: 'lax'
            });

            // Navigate to previous page or home
            if(window.history.length > 0 && window.history.state) navigate(-1);
            else navigate('/');
        } catch (error) {
            messageApi.error('Invalid password or username.');
        }
    };

    return (
        <>
            {contextHolder}
            <Row>
                <Col offset={8} span={6}>
                    <Title>Login</Title>
                    <Form name={'login'} onFinish={handleFinish}>
                        <Form.Item name="username" required rules={[{ required: true, message: 'Please input your username!' }]}>
                            <Input placeholder={'Username'} name="username" />
                        </Form.Item>
                        <Form.Item name="password" required rules={[{ required: true, message: 'Please input your password!' }]}>
                            <Input.Password placeholder={'Password'} name="password" />
                        </Form.Item>
                        <Form.Item>
                            <Button type={'primary'} htmlType={'submit'} block>
                                Login
                            </Button>
                            <Text style={{display: 'block', textAlign: 'center', marginTop: token.marginLG}}>
                                or <Link to={'/register'}>Register</Link>
                            </Text>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </>
    );
};
