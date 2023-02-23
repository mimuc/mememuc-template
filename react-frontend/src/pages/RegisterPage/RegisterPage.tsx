import {Link} from "react-router-dom";
import {Button, Col, Form, Input, Row, theme, Typography} from "antd";

const {Title, Text} = Typography;

export const RegisterPage = () => {
    const {token} = theme.useToken();

    const handleFinish = async (values: any) => {
        console.log("vals", values);

        // Check passwords

        // Check username

        const response = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: values.username, displayName: values.displayName, password: values.password}),
        });
        console.log(response)
    }

    // TODO: allow only some characters in username
    // TODO: check if username is already taken
    // TODO: add password strength indicator
    // TODO: add password confirmation
    // TODO: add register logic
    return (
        <Row>
            <Col offset={8} span={6}>
                <Title>Register</Title>
                <Form onFinish={handleFinish}>
                    <Form.Item required name="username">
                        <Input placeholder={'Username'}/>
                    </Form.Item>
                    <Form.Item required name="displayName">
                        <Input placeholder={'Display Name'}/>
                    </Form.Item>
                    <Form.Item required name="password">
                        <Input placeholder={'Password'}/>
                    </Form.Item>
                    <Form.Item required>
                        <Input placeholder={'Confirm Password'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'} block>
                            Register
                        </Button>
                        <Text style={{display: 'block', textAlign: 'center', marginTop: token.marginLG}}>
                            or <Link to={'/login'}>Login</Link>
                        </Text>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};
