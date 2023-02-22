import Cookies from 'js-cookie';
import { useState } from 'react';
import {Button, Col, Form, Input, Row, theme, Typography} from "antd";
import {Link/* , useHistory */} from "react-router-dom";

const {Title, Text} = Typography;



export const LoginPage = () => {
    const { token } = theme.useToken();
    //const history = useHistory();
    const [error, setError] = useState('');
    // TODO: Provide feedback
    // TODO: Forward on success
    const handleFinish = async (values: any) => {
        console.log("LOgging in", values)
        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({username: values.username, password: values.password}),
            });
            console.log(response)

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const data = await response.json();
            Cookies.set('token', data.token);
            //history.push('/dashboard');
        } catch (error) {
            console.error(error);
            //setError(error as string);
        }
    };

    return (
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
                    {error && (
                        <Text type="danger" style={{ display: 'block', textAlign: 'center' }}>
                            {error}
                        </Text>
                    )}
                </Form>
            </Col>
        </Row>
    );
};
