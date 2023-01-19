import * as React from 'react';
import { Component } from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';
import { Input } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

class Editor extends Component {
    state = {hasImage: false, imageFile: null};


    handleGetImage = (image) => {
        this.imageFile = image;
        this.setState({hasImage: true});
    }

    render() {
        return (
            <div className="side" id="sideRight">
                <EditorTopMenu getImage={this.handleGetImage}/>
                <div className="editorContainer">
                    <EditorCanvas setImage={this.state.hasImage} image={this.imageFile}/>
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
        this.props.getImage(event.target.files[0]);
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
    

    handleImage = () => {
        if(this.props.image != null){
            var selectedFile = this.props.image;
            var reader = new FileReader();
            var img = new Image();
            const MAX_HEIGHT = 777;
            const MAX_WIDTH = 1090;
            var scaleFactor = 1;

            var canvas = document.getElementById("imageCanavas");
            var textCanvas = document.getElementById("textCanavas");
            var ctx = canvas.getContext("2d");
            var ctxText = textCanvas.getContext("2d");

            reader.onload = function(event) {
                img.src = event.target.result;

                if(img.height > img.width){
                    scaleFactor = MAX_HEIGHT / img.height;
                    img.height = MAX_HEIGHT;
                    img.width = img.width * scaleFactor;

                } else if(img.height === img.width){
                    img.width = MAX_HEIGHT;
                    img.height = MAX_HEIGHT;

                } else if(img.height < img.width){
                    scaleFactor = MAX_WIDTH / img.width;
                    if(img.height * scaleFactor > MAX_HEIGHT){
                        scaleFactor = MAX_HEIGHT / img.height;
                        img.height = MAX_HEIGHT;
                        img.width = img.width * scaleFactor;
                    }else{
                        img.width = MAX_WIDTH;
                        img.height = img.height * scaleFactor;
                    }
                    
                }
                ctx.canvas.width  = img.width;
                ctx.canvas.height = img.height;
                ctxText.canvas.width = img.width;
                ctxText.canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            };

            reader.readAsDataURL(selectedFile);
        }
    }

    handleUpdateTextData(){
            console.log("clicked on update");
            const canvasText = document.getElementById("textCanavas");
            const ctxText = canvasText.getContext("2d");
            ctxText.clearRect(0,0,canvasText.width, canvasText.height);
            
            const text1 = document.getElementById("inputField");
            const text2 = document.getElementById("inputField2");
            const xPos1 = document.getElementById("xpositionInputField1");
            const yPos1 = document.getElementById("ypositionInputField1");
            const xPos2 = document.getElementById("xpositionInputField2");
            const yPos2 = document.getElementById("ypositionInputField2");
            ctxText.font = "48px serif";
            ctxText.fillText(text1.value, xPos1.value, yPos1.value);
            ctxText.fillText(text2.value, xPos2.value, yPos2.value);
    }

    render() {
        return (
            <div className="editCanvasView">
                <div className="canvasContainer">
                    {this.handleImage()}
                    <canvas id="imageCanavas" className="canvasImage"/>
                    <canvas id="textCanavas" className="canvasText"/>
                </div>
                <div className="leftBtns">
                    <div id="canvasEditors">
                        <p className="inputFieldDescription">ADD TEXTS: </p>
                        <Input placeholder="Text 1" type="string" className='InputText1' id="inputField" />
                        <div className="positionInputContainer">
                            <div className='positionInputHolder'>
                                <Input placeholder="0px" className="xPos1" id="xpositionInputField1" />
                                <p className="positionInputLabel">X pos</p>
                            </div>
                            <div className='positionInputHolder'>
                                <Input placeholder="0px" className="yPos1" id="ypositionInputField1" />
                                <p className="positionInputLabel">Y pos</p>
                            </div>
                        </div>
                        <Input placeholder="Text 2" className='InputText2' id="inputField2" />
                        <div className="positionInputContainer">
                            <div className='positionInputHolder'>
                                <Input placeholder="0px" className="xPos2" id="xpositionInputField2" />
                                <p className="positionInputLabel">X pos</p>
                            </div>
                            <div className='positionInputHolder'>
                                <Input placeholder="0px" className="yPos2" id="ypositionInputField2" />
                                <p className="positionInputLabel">Y pos</p>
                            </div>
                        </div>
                        <button id="updateButton" onClick={this.handleUpdateTextData}>UPDATE</button>
                    </div>
                </div>
             </div>
        );
    }

}

export default Editor;