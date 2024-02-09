import './MainPageStyles.css'; // Import your custom CSS file for styling
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function LandingPage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">
                    <Link to="/editor">Editor</Link>
                </Col>
                <Col className="bg-skyblue d-flex align-items-center justify-content-center">
                    <Link to="/memes">Memes</Link>
                </Col>
                <Col className="bg-gold d-flex align-items-center justify-content-center">
                    <Link to="/profile">Profile</Link>
                </Col>
            </Row>
        </Container>
    );
}

export default LandingPage;
