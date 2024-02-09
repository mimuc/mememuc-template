import './MainPageStyles.css'; // Import your custom CSS file for styling
import { Container, Row, Col } from 'react-bootstrap';
import { Route } from 'react-router-dom';
import ViewPage from './View/ViewPage';

function LandingPage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Editor 1</Col>
                <Col className="bg-skyblue d-flex align-items-center justify-content-center" href>
                    <Route path="/new-ViewPage" component={ViewPage} />
                </Col>
                <Col className="bg-gold d-flex align-items-center justify-content-center">Profile</Col>
            </Row>
        </Container>
    );
}

export default LandingPage;
