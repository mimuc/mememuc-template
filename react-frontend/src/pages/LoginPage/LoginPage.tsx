import {Button, Col, Form, Input, Row, theme, Typography} from "antd";
import {Link} from "react-router-dom";

const {Title, Text} = Typography;

export const LoginPage = () => {
    const {token} = theme.useToken();
    const handleFinish = (values: any) => {
        console.log(values);
    }

    // TODO: allow to login with username
    return (
        <Row>
            <Col offset={8} span={6}>
                <Title>Login</Title>
                <Form name={'login'} onFinish={handleFinish}>
                    <Form.Item required>
                        <Input placeholder={'Username'}/>
                    </Form.Item>
                    <Form.Item required>
                        <Input placeholder={'Password'}/>
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
    );
};
