import * as React from 'react';
import { Component } from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';

class Editor extends Component {
    state = {};

    render() {
        return (
            <div className="side" id="sideRight">
                <EditorTopMenu/>
                <div className="editorContainer">
                    <EditorLeftMenu/>
                    <EditorCanvas/>
                </div>
            </div>
        )
    };
}

class EditorLeftMenu extends Component {
    state = {};

    render() {
        return (
            <div className="leftBtns">
                <Fab className="leftBtn" id="btn1" size="medium" color="primary">
                </Fab>
                <Fab className="leftBtn" id="btn2" size="medium" color="primary">
                </Fab>
                <Fab className="leftBtn" id="btn3" size="medium" color="primary">
                </Fab>
                <Fab className="leftBtn" id="btn3" size="medium" color="primary">
                </Fab>
                <Fab className="leftBtn" id="btn3" size="medium" color="primary">
                </Fab>
            </div>
        );
    }
}

class EditorTopMenu extends Component {
    state = {
        selectedImage: null
    };

    options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];
    imageUploadHandler = event => {
        this.setState({
            selectedImage: event.target.files[0]
        })

        const image = event.target.files[0];
        // Hier kannst du mit dem Bild weiterarbeiten

        console.log(image);
    }


    render() {
        return (
            <div className="upperBtns">
                <Button className="upperBtn" id="connectedBtnUpload">
                    <input
                        style={{display: 'none'}}
                        type="file"
                        onChange={this.imageUploadHandler}
                        ref={fileInput => this.fileInput = fileInput}/>
                    <Button onClick={() => this.fileInput.click()}>
                        <FileUploadIcon/>
                    </Button>
                    <Button>
                        <ExpandMoreIcon/>
                    </Button>              
                </Button>
                <Fab className="upperBtn" id="btn2" variant="extended" size="medium" color="primary">
                    <SaveAltIcon/>
                </Fab>
                <Fab className="upperBtn" id="btnSave" variant="extended" size="large" color="primary">
                    <SaveIcon/>
                </Fab>
            </div>
        );
    }
}

class EditorCanvas extends Component {
    state = {};

    render() {
        return (
            <div className="canvasContainer">
                <canvas className=""/>
            </div>
        );
    }
}

export default Editor;