import * as React from 'react';
import { Component } from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button } from '@mui/material';

class Editor extends Component {
    state = {hasImage: false, imageFile: null};


    handleGetImage = (image) => {
        console.log("in Parent");
        this.imageFile = image;
        console.log(this.imageFile);
        this.setState({hasImage: true});
    }

    render() {
        return (
            <div className="side" id="sideRight">
                <EditorTopMenu getImage={this.handleGetImage}/>
                <div className="editorContainer">
                    <EditorLeftMenu/>
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

        const image = event.target.files[0];
        console.log("In Top Menu");
        console.log(image);

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
        console.log("IN Canvas");
        console.log(this.props.image);
        if(this.props.image != null){
            var selectedFile = this.props.image;
            var reader = new FileReader();
            var img = new Image();

            var imgtag = document.getElementById("myimage");
            var canvas = document.getElementById("imageCanavas");
 
            var ctx = canvas.getContext("2d");

            

            reader.onload = function(event) {
                img.src = event.target.result;
                ctx.canvas.width  = img.naturalWidth;
                ctx.canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            };

            reader.readAsDataURL(selectedFile);
        }
    }

    render() {
        return (
            <div className="canvasContainer">
                <img id="myimage" height="200"></img>
                {this.handleImage()}
                <canvas id="imageCanavas"/>
            </div>
        );
    }

}

export default Editor;