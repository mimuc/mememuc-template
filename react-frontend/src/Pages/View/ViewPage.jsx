import './ViewPageStyles.css'; // Import your custom CSS file for styling
import { Container, Row, Col } from 'react-bootstrap';

function ViewPage() {
    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                <Col className="bg-coral d-flex align-items-center justify-content-center">Memes are displayed here</Col>
            </Row>
        </Container>
    );
}

export default ViewPage;
