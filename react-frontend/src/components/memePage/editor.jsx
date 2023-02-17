import * as React from 'react';
import { Component } from 'react';
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { Input } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { color } from '@mui/system';
import Camera from './Camera';
import SpeechToText from './speechToText';
//Vgl. https://mui.com/material-ui/react-text-field/
//

class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCamera: this.props.showCamera,
            handleScreenshot: this.props.handleScreenshot
        };
    }

    render() {
        return (
            <div className='popup'>
                {this.state.showCamera && <Camera showCamera={this.state.showCamera} handleScreenshot={this.state.handleScreenshot} />}
            </div>
        )
    }
}


class Editor extends Component {


    constructor(props) {
        super(props);
        this.state = {
            hasImage: false,
            imageFile: null,
            image: null, imageWidth: 0, imageHeight: 0,
            memeToEdit : null,
            xPosT1: 0, yPosT1: 0, xPosT2: 0, yPosT2: 0,
            text1:"", text2:"",
            boldT1: "", boldT2: "", italicT1: "", italicT2: "", colorT1: "", colorT2: "", imageOption: "",
            showCameraPopUp: false,
            oldStateHistory: true,
            isHistory: this.props.updateSetIsHistory,
            prevProps: null
        };
        this.handleGetImage = this.handleGetImage.bind(this);
        this.saveMeme = this.saveMeme.bind(this);
        this.downloadMeme = this.downloadMeme.bind(this);
        this.handleTextInfo = this.handleTextInfo.bind(this);
        this.handleImageInfo = this.handleImageInfo.bind(this);
        this.handleImageUploaded = props.handleImageUploaded;
        this.handleWebcamButtonClicked = this.handleWebcamButtonClicked.bind(this);
        this.handleMemeEditClicked = this.handleMemeEditClicked.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.state.prevProps = prevProps.receivedMemeData;
        console.log("Component did update");
        console.log(this.state.isHistory);
        console.log("HistoryView: " + this.props.updateSetIsHistory);
        console.log("old:" + this.state.oldStateHistory);
        console.log(prevProps.receivedMemeData);
        console.log(this.props.receivedMemeData);
        console.log("Text1: "+ this.state.text1);
        console.log("xPos: " + this.state.xPosT1);
        if (prevProps.receivedMemeData.uid === undefined) {
            prevProps.receivedMemeData.uid = -1;
            console.log("Call CLicked");
            console.log("receivedMemeData: ");
            console.log(this.props.receivedMemeData);
            this.handleMemeEditClicked(this.props.receivedMemeData);
        }
        if(prevProps.receivedMemeData.uid !== this.props.receivedMemeData.uid) {
            console.log("Call CLicked");
            console.log("receivedMemeData: ");
            console.log(this.props.receivedMemeData);
            this.handleMemeEditClicked(this.props.receivedMemeData);
        }
        else if(this.state.oldStateHistory !== this.props.updateSetIsHistory){
            console.log("Seiten Wechsel");
            this.handleMemeEditClicked(null);
        }
        /*else if(prevProps.receivedMemeData === this.props.receivedMemeData) {
            console.log("Fucking shit");
        }*/
    }


    handleGetImage = (image) => {
        this.state.imageFile = image;
        this.state.imageOption = "ImageFile";
        this.setState({ hasImage: true });
    }

    saveMeme = (endpoint) => {
        var image = this.state.image;
        var imgWidth = this.state.imageWidth;
        var imgHeight = this.state.imageHeight;
        var state = this.state;
        var memeData = {
            image,
            imgWidth,
            imgHeight,
            text1: document.getElementById("inputField").value,
            text1XPos: state.xPosT1,
            text1YPos: state.yPosT1,
            text1Bold: state.boldT1,
            text1Italic: state.italicT1,
            text1Color: state.colorT1,
            text2: document.getElementById("inputField2").value,
            text2XPos: state.xPosT2,
            text2YPos: state.yPosT2,
            text2Bold: state.boldT2,
            text2Italic: state.italicT2,
            text2Color: state.colorT2,
            title: document.getElementById("titleInput").value,
        }
        console.log(memeData);
        fetch("http://localhost:3001/createdMemes/" + endpoint, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(memeData),
            credentials: "include"
        }).then((res) => {
            console.log(res.status);
            this.handleImageUploaded();
        });

        //console.log(memeData);
    }

    downloadMeme = () => {
        var title = document.getElementById("titleInput");
        var mergeCanvas = document.getElementById("mergingCanvas");
        var imageCanvas = document.getElementById("imageCanavas");
        var textCanvas1 = document.getElementById("textCanvas");
        var textCanvas2 = document.getElementById("textCanvas2");

        var ctxMerge = mergeCanvas.getContext("2d");
        ctxMerge.drawImage(imageCanvas, 0, 0);
        ctxMerge.drawImage(textCanvas1, 0, 0);
        ctxMerge.drawImage(textCanvas2, 0, 0);

        var url = mergeCanvas.toDataURL("image/png");
        var link = document.createElement('a');
        if (title.value !== "") {
            link.download = title.value + '.png';
        } else {
            link.download = 'meme.png';
        }
        link.href = url;
        link.click();
    }

    handleTextInfo(textNr, xPos, yPos, bold, italic, color, text) {
        console.log("Text data: ");
        console.log(textNr + " " + text + " " + xPos + " " + yPos + " " + bold + " " + italic + " " + color);
        
        if (textNr === "Text 1") {
            this.state.text1 = text;
            this.state.xPosT1 = xPos;
            this.state.yPosT1 = yPos;
            this.state.boldT1 = bold;
            this.state.italicT1 = italic;
            this.state.colorT1 = color;
        } else if (textNr === "Text 2") {
            this.state.text2 = text;
            this.state.xPosT2 = xPos;
            this.state.yPosT2 = yPos;
            this.state.boldT2 = bold;
            this.state.italicT2 = italic;
            this.state.colorT2 = color;
        }
        
    }

    handleImageInfo(image, width, height) {
        this.state.image = image;
        this.state.imageWidth = width;
        this.state.imageHeight = height;
    }

    handleWebcamGotScreenshot(image) {
        this.state.imageFile = image;
        this.state.imageOption = "CameraImage";
        this.setState({ showCameraPopUp: false , hasImage: true });
    }

    handleWebcamButtonClicked() {
        console.log("Showing webcam popup!");
        this.setState({ showCameraPopUp: true });
    }

    handleMemeEditClicked(memeData){
            console.log("edit clicked");
            //console.log(memeData);
            if(memeData === null){
                console.log("setting states default");
                this.state.imageFile = "";
                this.state.image = "";
                memeData = {
                    image: null,
                    imgWidth: 0,
                    imgHeight: 0,
                    text1: "",
                    text1XPos: 0,
                    text1YPos: 0,
                    text1Bold: "",
                    text1Italic: "",
                    text1Color:"",
                    text2: "",
                    text2XPos: 0,
                    text2YPos: 0,
                    text2Bold: "",
                    text2Italic: "",
                    text2Color: "",
                    title: "",
                }
            }else{
                this.state.imageFile = memeData.base64Image;
                if(this.props.updateSetIsHistory === false){
                    memeData.text1 = this.state.text1;
                    memeData.text1XPos = this.state.xPosT1;
                    memeData.text1YPos = this.state.yPosT1;
                    memeData.text1Bold = this.state.boldT1;
                    memeData.text1Italic = this.state.italicT1;
                    memeData.text1Color = this.state.colorT1;
                    memeData.text2 = this.state.text2;
                    memeData.text2XPos = this.state.xPosT2;
                    memeData.text2YPos = this.state.yPosT2;
                    memeData.text2Bold = this.state.boldT2;
                    memeData.text2Italic = this.state.italicT2;
                    memeData.text2Color = this.state.colorT2;
                }
                
            }
            //console.log(memeData);
            this.state.memeToEdit = memeData;
            this.state.imageOption = "editMeme";
            this.state.oldStateHistory = this.props.updateSetIsHistory;
            this.setState({ hasImage: true });
        
    }

    render() {
        return (
            <div className="side" id="sideRight">
                {this.state.showCameraPopUp && <PopUp showCamera={true} handleScreenshot={(image) => { this.handleWebcamGotScreenshot(image) }} />}
                <EditorTopMenu handleMemeEditClicked={this.handleMemeEditClicked} getImage={this.handleGetImage} downloadMeme={this.downloadMeme} saveMeme={this.saveMeme} webcamButtonClicked={this.handleWebcamButtonClicked} />
                <div className="editorContainer">
                    <EditorCanvas setImage={this.state.hasImage} image={this.state.imageFile} setMeme={this.handleMeme} handleTextInfo={this.handleTextInfo} handleImageInfo={this.handleImageInfo} imageOption={this.state.imageOption} memeToEdit={this.state.memeToEdit}/>
                </div>
            </div>
        )
    };
}



class EditorTopMenu extends Component {
    constructor(props) {
        super(props)
    }

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


    //<Camera onClick={() => console.log("Webcam")}/>
    render() {
        return (
            <div className="upperBtns">
                <input
                    style={{ display: 'none' }}
                    type="file"
                    onChange={this.imageUploadHandler}
                    ref={fileInput => this.fileInput = fileInput} />
                <Fab className="upperBtn" id="btnFileUpload" variant="extended" size="medium" color="background" onClick={() => this.fileInput.click()}>
                    <FileUploadIcon />
                </Fab>
                <Fab className="upperBtn" id="btnCameraUpload" variant="extended" size="medium" color="background" onClick={this.props.webcamButtonClicked}>
                    <CameraAltIcon />
                </Fab>
                <Fab className="upperBtn" id="btn2" variant="extended" size="medium" color="primary" onClick={this.props.downloadMeme}>
                    <SaveAltIcon />
                </Fab>
                <Fab className="upperBtn" id="btnSave" variant="extended" size="large" color="primary" onClick={() => { this.props.saveMeme('insert')}} >
                    <SaveIcon />
                </Fab>
                <Fab className="upperBtn" id="btnDraft" variant="extended" size="large" color="primary" onClick={() => { this.props.saveMeme('insert-draft')}}>
                    <ArchiveIcon />
                </Fab>
            </div>
        );
    }
}

class EditorCanvas extends Component {
    //Set image, texts and x and y positions as states!!!
    constructor(props) {
        super(props);
        this.state = { imageCanvas: false, update: 0 };
        this.handleImage = this.handleImage.bind(this)
        this.handleTextData = this.handleTextData.bind(this);
    }



    handleImage = () => {
        console.log("Reload...");
        if(this.props.image === ""){
            console.log("Remove images");
            var canvas = document.getElementById("imageCanavas");
            var imageCtx = canvas.getContext("2d");
            var width = canvas.width;
            var height = canvas.height;
            imageCtx.clearRect(0, 0, width, height);
            imageCtx.canvas.width = 0;
            imageCtx.canvas.height = 0;
            var mergingCanavas = document.getElementById("mergingCanvas");
            var mergeCtx = mergingCanavas.getContext("2d");
            mergeCtx.clearRect(0, 0, width, height);
            var canvases = document.getElementsByClassName("canvasText");
            var canvasTextCtx = canvases[0].getContext("2d");
            canvasTextCtx.clearRect(0, 0, width, height);
            var canvasTextCtx2 = canvases[1].getContext("2d");
            canvasTextCtx2.clearRect(0, 0, width, height);
            this.props.handleImageInfo("", 0, 0);
            
            //ctxText.clearRect(0, 0, canvasText.width, canvasText.height);
        }
        if ((this.props.image != null) && !(this.props.image === "")) {
            console.log("NOT WANTED");
            const MAX_HEIGHT = 777;
            const MAX_WIDTH = 1090;
            var scaleFactor = 1;
            var canvas = document.getElementById("imageCanavas");
            var mergingCanavas = document.getElementById("mergingCanvas");
            var mergeCtx = mergingCanavas.getContext("2d");
            var ctx = canvas.getContext("2d");
            var props = this.props;
            var selectedFile = this.props.image;
            var reader = new FileReader();
            var img = new Image();
            
            
            var canvas = document.getElementById("imageCanavas");
            var mergingCanavas = document.getElementById("mergingCanvas");
            var mergeCtx = mergingCanavas.getContext("2d");
            var ctx = canvas.getContext("2d");
            var props = this.props;

            if(this.props.imageOption === "ImageFile"){
                reader.onload = function (event) {
                    img.src = event.target.result;
                    if (img.height > img.width) {
                        scaleFactor = MAX_HEIGHT / img.height;
                        img.height = MAX_HEIGHT;
                        img.width = img.width * scaleFactor;
            
                    } else if (img.height === img.width) {
                        img.width = MAX_HEIGHT;
                        img.height = MAX_HEIGHT;
            
                    } else if (img.height < img.width) {
                        scaleFactor = MAX_WIDTH / img.width;
                        if (img.height * scaleFactor > MAX_HEIGHT) {
                            scaleFactor = MAX_HEIGHT / img.height;
                            img.height = MAX_HEIGHT;
                            img.width = img.width * scaleFactor;
                        } else {
                            img.width = MAX_WIDTH;
                            img.height = img.height * scaleFactor;
                        }
            
                    }
                    ctx.canvas.width = img.width;
                    ctx.canvas.height = img.height;
                    mergeCtx.canvas.width = img.width;
                    mergeCtx.canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var imgString = canvas.toDataURL();
                    props.handleImageInfo(imgString, img.width, img.height);
                    
                };

                reader.readAsDataURL(selectedFile);
            }else if((this.props.imageOption === "CameraImage") || (this.props.imageOption === "editMeme")){
                if(this.props.imageOption === "editMeme"){
                    document.getElementById("titleInput").value = this.props.memeToEdit.title;
                }
                img.onload = function(){
                    if (img.height > img.width) {
                        scaleFactor = MAX_HEIGHT / img.height;
                        img.height = MAX_HEIGHT;
                        img.width = img.width * scaleFactor;
            
                    } else if (img.height === img.width) {
                        img.width = MAX_HEIGHT;
                        img.height = MAX_HEIGHT;
            
                    } else if (img.height < img.width) {
                        scaleFactor = MAX_WIDTH / img.width;
                        if (img.height * scaleFactor > MAX_HEIGHT) {
                            scaleFactor = MAX_HEIGHT / img.height;
                            img.height = MAX_HEIGHT;
                            img.width = img.width * scaleFactor;
                        } else {
                            img.width = MAX_WIDTH;
                            img.height = img.height * scaleFactor;
                        }
            
                    }
                    ctx.canvas.width = img.width;
                    ctx.canvas.height = img.height;
                    mergeCtx.canvas.width = img.width;
                    mergeCtx.canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var imgString = canvas.toDataURL();
                    props.handleImageInfo(imgString, img.width, img.height);
                }
                img.src = selectedFile;
            }
        }

    }

    handleTextData(textNr, xPos, yPos, bold, italic, color, text) {
        this.props.handleTextInfo(textNr, xPos, yPos, bold, italic, color, text);
    }

    speechHandler(speech) {
        document.getElementById("titleInput").value = speech;
    }



    render() {
        return (
            <div className="editCanvasView">
                <div className="canvasContainer">
                    <canvas id="mergingCanvas" className="canvasImage" />
                    <canvas id="imageCanavas" className="canvasImage" />
                    {this.handleImage()}
                </div>
                <div className="leftBtns">

                    <div id="canvasEditors">
                        <div className='inline'>
                            <p className="inputFieldDescription">ADD TITLE:</p>
                            <SpeechToText speechHandler={this.speechHandler}/>
                        </div>
                        <Input placeholder="Title" type="string" id="titleInput" />
                        <p className="inputFieldDescription"></p>
                        <CanvasText idNameEdit="setPositionIcon1" idNameTextInput="inputField" nameTextPlaceHolder="Text 1" idNameTextCanvas="textCanvas" updateText={this.state.update} idNameX="xpositionInputField1" idNameY="ypositionInputField1" image={this.props.image} classNameCanvas="canvasText" boldIcon="iconsTextFormatting" italicIcon="italicIconsTextFormatting" colorIcon="colorIconsTextFormatting" handleTextData={this.handleTextData} imageOption={this.props.imageOption} text={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1:""} textXPos={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1XPos:""} textYPos={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1YPos:""} bold={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1Bold:""} italic={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1Italic:""} color={(this.props.memeToEdit!==null)?this.props.memeToEdit.text1Color:""}></CanvasText>
                        <CanvasText idNameEdit="setPositionIcon2" idNameTextInput="inputField2" nameTextPlaceHolder="Text 2" idNameTextCanvas="textCanvas2" updateText={this.state.update} idNameX="xpositionInputField2" idNameY="ypositionInputField2" image={this.props.image} classNameCanvas="canvasText2" boldIcon="iconsTextFormatting2" italicIcon="italicIconsTextFormatting2" colorIcon="colorIconsTextFormatting2" handleTextData={this.handleTextData} imageOption={this.props.imageOption} text={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2:""} textXPos={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2XPos:""} textYPos={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2YPos:""} bold={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2Bold:""} italic={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2Italic:""} color={(this.props.memeToEdit!==null)?this.props.memeToEdit.text2Color:""}></CanvasText>

                    </div>
                </div>
            </div>
        );

    }

}




class CanvasText extends Component {
    constructor(props) {
        super(props);
        this.state = { imageCanvas: null, positionSelector: "notSelected", bold: "", italic: "", color: "#000" };
        this.handleUpdateTextData = this.handleUpdateTextData.bind(this)
        this.handlePositionSelect = this.handlePositionSelect.bind(this)
        this.handleCanvasClick = this.handleCanvasClick.bind(this)
        this.handleTextCanvas = this.handleTextCanvas.bind(this)
        this.handleBoldness = this.handleBoldness.bind(this)
        this.handleItalic = this.handleItalic.bind(this)
        this.handleColor = this.handleColor.bind(this)
        this.speechHandler = this.speechHandler.bind(this)
    }



    handleTextCanvas = () => {
        if (this.props.image != null) {
            var selectedFile = this.props.image;
            var reader = new FileReader();
            var img = new Image();
            const MAX_HEIGHT = 777;
            const MAX_WIDTH = 1090;
            var scaleFactor = 1;

            var textCanvas = document.getElementById(this.props.idNameTextCanvas);
            var ctxText = textCanvas.getContext("2d");
            var handleUpdateTextData = this.handleUpdateTextData;
            var props = this.props;
            var state = this.state;

            if(this.props.imageOption === "ImageFile"){
                reader.onload = function (event) {
                    img.src = event.target.result;

                    if (img.height > img.width) {
                        scaleFactor = MAX_HEIGHT / img.height;
                        img.height = MAX_HEIGHT;
                        img.width = img.width * scaleFactor;

                    } else if (img.height === img.width) {
                        img.width = MAX_HEIGHT;
                        img.height = MAX_HEIGHT;

                    } else if (img.height < img.width) {
                        scaleFactor = MAX_WIDTH / img.width;
                        if (img.height * scaleFactor > MAX_HEIGHT) {
                            scaleFactor = MAX_HEIGHT / img.height;
                            img.height = MAX_HEIGHT;
                            img.width = img.width * scaleFactor;
                        } else {
                            img.width = MAX_WIDTH;
                            img.height = img.height * scaleFactor;
                        }

                    }
                    ctxText.canvas.width = img.width;
                    ctxText.canvas.height = img.height;
                };
                reader.readAsDataURL(selectedFile);
            }else if((this.props.imageOption === "CameraImage") || (this.props.imageOption === "editMeme")){
                img.onload = function(){
                    if (img.height > img.width) {
                        scaleFactor = MAX_HEIGHT / img.height;
                        img.height = MAX_HEIGHT;
                        img.width = img.width * scaleFactor;

                    } else if (img.height === img.width) {
                        img.width = MAX_HEIGHT;
                        img.height = MAX_HEIGHT;

                    } else if (img.height < img.width) {
                        scaleFactor = MAX_WIDTH / img.width;
                        if (img.height * scaleFactor > MAX_HEIGHT) {
                            scaleFactor = MAX_HEIGHT / img.height;
                            img.height = MAX_HEIGHT;
                            img.width = img.width * scaleFactor;
                        } else {
                            img.width = MAX_WIDTH;
                            img.height = img.height * scaleFactor;
                        }

                    }
                    ctxText.canvas.width = img.width;
                    ctxText.canvas.height = img.height;


                    if(props.imageOption === "editMeme"){
                        state.bold = props.bold;
                        state.italic = props.italic;
                        state.color = props.color;
                        var boldIcon = document.getElementById(props.boldIcon);
                        if(props.bold === "bold"){
                            boldIcon.style.backgroundColor = "#444";
                        }else {
                            boldIcon.style.backgroundColor = "#222";
                        }
                        var italicIcon = document.getElementById(props.italicIcon);
                        if(props.italic === "italic"){
                            italicIcon.style.backgroundColor = "#444";
                        }else {
                            italicIcon.style.backgroundColor = "#222";
                        }
                        var colorIcon = document.getElementById(props.colorIcon);
                        if (props.color === "#FFF") {
                            colorIcon.style.backgroundColor = "#FFF";
                        } else {
                            colorIcon.style.backgroundColor = "#000";
                        }
                        document.getElementById(props.idNameTextInput).value = props.text;
                        document.getElementById(props.idNameX).value = props.textXPos;
                        document.getElementById(props.idNameY).value = props.textYPos;
                        handleUpdateTextData();
                    }
                }
                img.src = selectedFile;

                
            }
        }

    }

    handleCanvasClick = event => {
        const canvas = document.getElementById(this.props.idNameTextCanvas);
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (this.state.positionSelector === "Selected") {
            var xp1 = document.getElementById(this.props.idNameX);
            var yp1 = document.getElementById(this.props.idNameY);
            xp1.value = Math.trunc(x);
            yp1.value = Math.trunc(y);
        }

        this.handleUpdateTextData();
    }


    handleUpdateTextData() {
        if (this.props.image != null) {
            const canvasText = document.getElementById(this.props.idNameTextCanvas);

            const ctxText = canvasText.getContext("2d");
            ctxText.clearRect(0, 0, canvasText.width, canvasText.height);


            const text1 = document.getElementById(this.props.idNameTextInput);
            const xPos1 = document.getElementById(this.props.idNameX);
            const yPos1 = document.getElementById(this.props.idNameY);
            ctxText.font = this.state.bold + " " + this.state.italic + " 48px Arial"; // italic bold 
            ctxText.fillStyle = this.state.color;
            var x = Math.trunc(xPos1.value);
            var y = Math.trunc(yPos1.value);
            ctxText.fillText(text1.value, x, y);
            this.props.handleTextData(this.props.nameTextPlaceHolder, x, y, this.state.bold, this.state.italic, this.state.color, text1.value);
        }

    }


    handlePositionSelect() {
        var icon = document.getElementById(this.props.idNameEdit);
        var canvases = document.getElementsByClassName("canvasText");
        if ((this.state.positionSelector === "notSelected")) {
            this.state.positionSelector = "Selected";
            icon.style.backgroundColor = "#444";
            for (let i = 0; i < canvases.length; i++) {
                if (canvases[i].id === this.props.idNameTextCanvas) {
                    canvases[i].style['pointer-events'] = "auto";
                } else {
                    canvases[i].style['pointer-events'] = "none";
                }
            }
        } else {
            this.state.positionSelector = "notSelected";
            icon.style.backgroundColor = "#222";
        }

    }

    handleBoldness() {
        var boldIcon = document.getElementById(this.props.boldIcon);
        if (this.state.bold === "") {
            this.state.bold = "bold";
            boldIcon.style.backgroundColor = "#444";
        } else {
            this.state.bold = "";
            boldIcon.style.backgroundColor = "#222";
        }
        this.handleUpdateTextData();
    }

    handleItalic() {
        var italicIcon = document.getElementById(this.props.italicIcon);
        if (this.state.italic === "") {
            this.state.italic = "italic";
            italicIcon.style.backgroundColor = "#444";
        } else {
            this.state.italic = "";
            italicIcon.style.backgroundColor = "#222";
        }
        this.handleUpdateTextData();
    }


    handleColor() {
        var colorIcon = document.getElementById(this.props.colorIcon);
        if (this.state.color === "#000") {
            this.state.color = "#FFF";
            colorIcon.style.backgroundColor = "#FFF";
        } else {
            this.state.color = "#000";
            colorIcon.style.backgroundColor = "#000";
        }
        this.handleUpdateTextData();
    }

    speechHandler(speech) {
        document.getElementById(this.props.idNameTextInput).value = speech;
    }


    render() {
        return (
            <div >
                <canvas id={this.props.idNameTextCanvas} className="canvasText" onClick={this.handleCanvasClick} />
                {this.handleTextCanvas()}
                <p className="inputFieldDescription">ADD TEXT: </p>
                <div className="textFormattingContainer">
                    <FormatBoldIcon color="primary" className="formatIcon" id={this.props.boldIcon} onClick={this.handleBoldness}></FormatBoldIcon>
                    <FormatItalicIcon color="primary" className="formatIcon" id={this.props.italicIcon} onClick={this.handleItalic}></FormatItalicIcon>
                    <FormatColorTextIcon color="primary" className="formatIcon" id={this.props.colorIcon} onClick={this.handleColor}></FormatColorTextIcon>
                    <SpeechToText id="speechInline" speechHandler={this.speechHandler}/>
                </div>
                <Input placeholder={this.props.nameTextPlaceHolder} type="string" id={this.props.idNameTextInput} />
                <div className="positionInputContainer">
                    <EditIcon color="primary" id={this.props.idNameEdit} onClick={this.handlePositionSelect} ></EditIcon>
                    <div className='positionInputHolder'>
                        <Input placeholder="0px" className="xPos1" id={this.props.idNameX} />
                        <p className="positionInputLabel">X pos</p>
                    </div>
                    <div className='positionInputHolder'>
                        <Input placeholder="0px" className="yPos1" id={this.props.idNameY} />
                        <p className="positionInputLabel">Y pos</p>
                    </div>
                </div>
                <button id="updateButton" onClick={this.handleUpdateTextData}>UPDATE</button>
            </div>
        );
    }
}

export default Editor;