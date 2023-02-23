import {useNavigate, useRouteError} from 'react-router-dom';
import {Button} from "antd";

export const ErrorPage = () => {
    const navigate = useNavigate();
    const error: any = useRouteError();
    let errorMessage;

    const handleBack = () => {
        if (window.history.length > 0 && window.history.state) {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    if (error.status === 404) {
        errorMessage = "This page does not exist.";
    } else if (error.status === 401) {
        errorMessage = "You are not authorized to view this page.";
    } else {
        errorMessage = "An unknown error occurred.";
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: 200, height: '100vh'}}>
            <div>
                <h1>{error.status} Error</h1>
                <p>{errorMessage}</p>
                <Button onClick={handleBack}>
                    Back
                </Button>
            </div>
        </div>
    );
};
