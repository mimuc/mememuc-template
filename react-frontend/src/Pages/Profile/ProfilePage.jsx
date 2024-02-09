import { Container, Row, Col } from 'react-bootstrap';

function ProfilePage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Profiles are displayed here</Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;
