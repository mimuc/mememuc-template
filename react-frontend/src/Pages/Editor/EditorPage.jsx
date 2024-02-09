import { Container, Row, Col } from 'react-bootstrap';

function EditorPage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Editor is displayed here</Col>
            </Row>
        </Container>
    );
}

export default EditorPage;
