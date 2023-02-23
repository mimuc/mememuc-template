import {Link} from "react-router-dom";
import {Button, Col, Form, Input, message, Row, theme, Typography} from "antd";
import {api} from "src/api";

const {Title, Text} = Typography;

export const RegisterPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const {token} = theme.useToken();

    const handleFinish = async (values: any) => {
        try {
            await api.auth.register(values.username, values.displayName, values.password);
            messageApi.success(<>Registration successful. <Link to={'/login'}>Login</Link></>);
        } catch (error) {
            messageApi.error('Username already exists.');
        }
    }

    return (
        <>
            {contextHolder}
            <Row>
                <Col offset={8} span={6}>
                    <Title>Register</Title>
                    <Form onFinish={handleFinish}>
                        <Form.Item hasFeedback required name="username" rules={[
                            {required: true, message: 'Please input your username!'},
                            {min: 3, message: 'Username must be at least 3 characters long'},
                            {max: 20, message: 'Username must be at most 20 characters long'},
                            {
                                pattern: /^[a-zA-Z0-9_]+$/,
                                message: 'Username must only contain letters, numbers and underscores'
                            }
                        ]}>
                            <Input placeholder={'Username'}/>
                        </Form.Item>
                        <Form.Item hasFeedback required name="displayName" rules={
                            [
                                {required: true, message: 'Please input your display name!'},
                                {min: 3, message: 'Display name must be at least 3 characters long'},
                                {max: 20, message: 'Display name must be at most 20 characters long'},
                                {
                                    pattern: /^[a-zA-Z0-9_ ]+$/,
                                    message: 'Display name must only contain letters, numbers, underscores and spaces'
                                }
                            ]
                        }>
                            <Input placeholder={'Display Name'}/>
                        </Form.Item>
                        <Form.Item hasFeedback required name="password" rules={[
                            {required: true, message: 'Please input your password!'},
                            {min: 8, message: 'Password must be at least 8 characters long'},
                            {max: 20, message: 'Password must be at most 20 characters long'},
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                message: 'Password must contain at least one lowercase letter, one uppercase letter, one number and one special character'
                            }
                        ]}>
                            <Input.Password placeholder={'Password'}/>
                        </Form.Item>
                        <Form.Item hasFeedback required
                                   name="confirmPassword"
                                   dependencies={['password']}
                                   rules={[
                                       {required: true, message: 'Please confirm your password!'},
                                       ({getFieldValue}) => ({
                                           validator(_, value) {
                                               if (!value || getFieldValue('password') === value) {
                                                   return Promise.resolve();
                                               }
                                               return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                           }
                                       })
                                   ]}
                        >
                            <Input.Password placeholder={'Confirm Password'}/>
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
        </>

    );
};
