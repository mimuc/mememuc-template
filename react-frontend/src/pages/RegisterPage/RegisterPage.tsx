import {Button, Col, Form, Input, Row, theme, Typography} from "antd";
import {Link} from "react-router-dom";

const {Title, Text} = Typography;

export const RegisterPage = () => {
    const {token} = theme.useToken();

    const handleFinish = (values: any) => {
        console.log(values);

        // Check passwords

        // Check username
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
                    <Form.Item required>
                        <Input placeholder={'Username'}/>
                    </Form.Item>
                    <Form.Item required>
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
