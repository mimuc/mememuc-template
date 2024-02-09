import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function LandingPage() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col" >Editor</div>
                <div className="col">View</div>
                <div className="col">Profile</div>
            </div>
        </div>
    );
}

export default LandingPage;
