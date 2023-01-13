import * as React from 'react';
import { Component } from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

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
    state = {};


    render() {
        return (
            <div className="upperBtns">
                <Fab className="upperBtn" id="btn1" variant="extended" size="medium" color="primary">
                    Btn1
                </Fab>
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