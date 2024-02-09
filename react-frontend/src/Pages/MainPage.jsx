import './MainPageStyles.css'; // Import your custom CSS file for styling
import { Container, Row, Col } from 'react-bootstrap';

function LandingPage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Editor 1</Col>
                <Col className="bg-skyblue d-flex align-items-center justify-content-center">View</Col>
                <Col className="bg-gold d-flex align-items-center justify-content-center">Profile</Col>
            </Row>
        </Container>
    );
}

export default LandingPage;
