import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';
import { Fab, IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CreateIcon from '@mui/icons-material/Create';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';


interface historyAndTemplatesViewState {
    valueRendered: boolean,
    shuffleRandom: boolean,
    shuffleAlphabetically: boolean
}

class HistoryAndTemplatesView extends Component<historyAndTemplatesViewState> {
    constructor(props) {
        super(props);
        this.state = {
            valueRendered: true,
            shuffleRandom: false,
            shuffleAlphabetically: false
        };
        this.btnClickedCallback = this.btnClickedCallback.bind(this);
        this.shuffleCallback = this.shuffleCallback.bind(this);
        this.shuffleFinished = this.shuffleFinished.bind(this);
    }

    btnClickedCallback(value, event) {
        this.setState({ valueRendered: value });
        event.stopPropagation();
    }

    shuffleCallback(value) {
        console.log(value);
        if (value === "random") {
            document.getElementById("alphabetShuffleBtn").disabled = true;
            document.getElementById("randomShuffleBtn").disabled = true;
            this.setState({
                shuffleRandom: true
            }, this.shuffleFinished);
        } else if (value === "alphabet") {
            document.getElementById("alphabetShuffleBtn").disabled = true;
            document.getElementById("randomShuffleBtn").disabled = true;
            this.setState({
                shuffleAlphabetically: true
            }, this.shuffleFinished);

        }
    }

    //This method resets the shuffle state, so that you can click on the shuffle Buttons again. For performance purposes, this is only allowed after 3 seconds
    shuffleFinished() {
        setTimeout(() => {
            this.setState({
                shuffleRandom: false,
                shuffleAlphabetically: false
            })
            document.getElementById("alphabetShuffleBtn").disabled = false;
            document.getElementById("randomShuffleBtn").disabled = false;
        }, 3000);
    }

    render() {
        return (
            <div className="side" id="sideLeft">
                <HistoryAndTemplatesMenu modeSwitchBtnCallback={this.btnClickedCallback} shuffleCallback={this.shuffleCallback} />
                <HistoryAndTemplatesList isHistory={this.state.valueRendered} shuffleRandomly={this.state.shuffleRandom} shuffleAlphabetically={this.state.shuffleAlphabetically} />
            </div>
        )
    }
}

interface historyAndTemplatesMenuProps {
    modeSwitchBtnCallback: any,
    shuffleCallback: any
}

interface historyAndTemplateMenuState {
    activeListView: String
}

class HistoryAndTemplatesMenu extends Component<historyAndTemplatesMenuProps, historyAndTemplateMenuState> {

    constructor(props) {
        super(props);
        this.state = {
            activeListView: "History"
        }
    }

    btnClicked(isHistoryValue, event) {
        isHistoryValue ? (this.setState({ activeListView: "History" })) : (this.setState({ activeListView: "Templates" }));
        this.props.modeSwitchBtnCallback(isHistoryValue, event)
    }

    render() {
        return (
            <>
                <div className="MemeMenu">
                    <button type="button" id="historyBtn" onClick={(e) => this.btnClicked(true, e)} className={(this.state.activeListView === "History") ? "active" : "notActive"}>HISTORY</button>
                    <button type="button" id="templateBtn" onClick={(e) => this.btnClicked(false, e)} className={(this.state.activeListView === "Templates") ? "active" : "notActive"}>TEMPLATES</button>
                </div>
                <div className="ShuffleMenu">
                    <p id="shuffleText">Shuffle:</p>
                    <Fab className="shuffleBtn" variant="extended" size="small" id="randomShuffleBtn" onClick={() => this.props.shuffleCallback("random")} className={"shuffleBtn"}>
                        <ShuffleIcon></ShuffleIcon>Randomly
                    </Fab>
                    <Fab className="shuffleBtn" variant="extended" size="small" id="alphabetShuffleBtn" onClick={() => this.props.shuffleCallback("alphabet")} className={"shuffleBtn"}>
                        <TextRotateVerticalIcon></TextRotateVerticalIcon>Alphabetically
                    </Fab>
                </div>
            </>
        );
    }
}


interface historyAndTemplateListProps {
    isHistory: boolean
    shuffleRandomly: boolean
    shuffleAlphabetically: boolean
}

interface historyAndTemplateListState {
    showHistory: boolean,
    memeList: any[],
    limit: number,
    offset: number
}

class HistoryAndTemplatesList extends Component<historyAndTemplateListProps, historyAndTemplateListState> {
    constructor(props) {
        super(props);
        this.state = {
            showHistory: this.props.isHistory,
            memeList: [],
            limit: 10,
            offset: 0,
        };
        this.loadMemeList();
        this.resetMemeList = this.resetMemeList.bind(this);
        this.randomShuffleMemes = this.randomShuffleMemes.bind(this);
        this.alphabeticalShuffleMemes = this.alphabeticalShuffleMemes.bind(this);
    }

    resetMemeList(isHistory) {
        console.log("Resetting Meme List");
        console.log(isHistory);
        this.setState({ showHistory: isHistory, memeList: [] }, this.stateSetAfterReset)
    }

    stateSetAfterReset() {
        //console.log("current state: ");
        //console.log(this.state);
        this.loadMemeList();
    }

    componentDidUpdate(prevProps: Readonly<historyAndTemplateListProps>, prevState: Readonly<historyAndTemplateListState>, snapshot?: any): void {
        if (prevProps.isHistory !== this.props.isHistory) {
            //console.log("Checking props: ");
            //console.log(this.props);
            this.resetMemeList(this.props.isHistory);
        }
        if ((prevProps.shuffleAlphabetically !== this.props.shuffleAlphabetically) && this.props.shuffleAlphabetically) {
            console.log("Shuffling per alphabet");
            this.alphabeticalShuffleMemes();
        }
        if ((prevProps.shuffleRandomly !== this.props.shuffleRandomly) && this.props.shuffleRandomly) {
            console.log("Random shuffle...");
            this.randomShuffleMemes();
        }
    }

    randomShuffleMemes() {
        let memeListCopy = this.state.memeList;
        for (let i = memeListCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [memeListCopy[i], memeListCopy[j]] = [memeListCopy[j], memeListCopy[i]];
        }
        //console.log("Shuffled everything randomly...");
        this.setState({
            memeList: memeListCopy
        })
    }

    alphabeticalShuffleMemes() {
        let memeListCopy = this.state.memeList,
            shuffleAttribute = "title";
        if (!this.state.showHistory) { shuffleAttribute = "name" }
        memeListCopy.sort((a, b) => (a[shuffleAttribute] > b[shuffleAttribute] ? 1 : -1))
        this.setState({
            memeList: memeListCopy
        })
    }

    loadMemeList() {
        console.log("Reloading Meme List .... ")
        //console.log(this.state.showHistory);
        if (this.state.showHistory) {
            console.log("Catching old meme data");
            fetch('http://localhost:3001/createdMemes/all', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                credentials: "include",
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res) => {
                console.log("Got data with length: " + res.length);
                //console.log(res);
                this.setState({ memeList: res });
            });
        } else {
            console.log("Catching api meme data");
            fetch('http://localhost:3001/memesApi/page', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    limit: this.state.limit,
                    offset: this.state.offset,
                })
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res) => {
                let newMemeList = this.state.memeList,
                    newOffset = this.state.offset + res.length;
                newMemeList.push(res);
                console.log("Got data with length: " + res.length);
                //console.log(res);
                this.setState({ memeList: newMemeList[0] });
                this.setState({ offset: newOffset });
            });
        }
    }

    onEditClicked(meme) {
        console.log("EDITING meme : \"" + meme.title + "\"");
        //console.log(meme);
        //TODO: Give the meme to the editor
    }

    render() {
        return (
            <div className="MemeList" key="MemeListDiv">
                {this.state.memeList.map((meme) => (
                    <div key={meme.id}>
                        {this.state.showHistory ? (
                            <MemeTile
                                uid={meme._id}
                                key={meme}
                                base64Image={meme.image}
                                title={meme.title}
                                likes={meme.likes}
                            />
                        ) : (
                            <MemeTemplateTile
                                uid={meme.id}
                                key={meme.id}
                                imageUrl={meme.url}
                                title={meme.name}
                                onEditClicked={this.onEditClicked}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    }
}


interface MemeTileProps {
    base64Image: string;
    title: string;
    likes: number,
    uid: string
}
interface MemeTileState {
    likes: number,
}
class MemeTile extends Component<MemeTileProps, MemeTileState> {

    constructor(props) {
        super(props);
        this.state = { likes: this.props.likes };
    }

    private updateLikeDisplay() {
        this.setState({ likes: this.state.likes + 1 });
    }

    increaseLikeCount() {
        console.log('trying to increase like');
        let mUid = this.props.uid;
        let listOfLiked = localStorage.getItem('listOfLiked');
        if (listOfLiked !== undefined && listOfLiked !== null) {
            listOfLiked = JSON.parse(listOfLiked);
            if (!listOfLiked.includes(this.props.uid)) {
                listOfLiked = null;
            }
        }
        if (listOfLiked === undefined || listOfLiked === null) {
            fetch('http://localhost:3001/createdMemes/like', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    uid: mUid,
                })
            }).then((res) => {
                console.log('like increased?');
                console.log(res.status);
                this.updateLikeDisplay();
                let listOfLiked = localStorage.getItem('listOfLiked');
                if (listOfLiked === undefined || listOfLiked === null) {
                    localStorage.setItem('listOfLiked', JSON.stringify([this.props.uid]));
                } else {
                    listOfLiked = JSON.parse(listOfLiked);
                    listOfLiked.push(this.props.uid);
                    localStorage.setItem('listOfLiked', JSON.stringify(listOfLiked));
                }
            });
        }
    }

    render() {
        let image = new Image();
        image.src = this.props.base64Image;
        let height = image.height;
        let width = image.width;
        //console.log("Height = " + height + " width = " + width);

        return (
            <div id="MemeTile">
                <img className="ImageMeme" src={this.props.base64Image} alt={this.props.title}></img>
                <p className="TitleMeme">Title: {this.props.title}</p>
                <p className="InfoMeme">Info: {this.props.title}</p>
                <div className="likeContainer">
                    <IconButton onClick={this.increaseLikeCount.bind(this)}>
                        <ThumbUpIcon color={'success'} />
                    </IconButton>
                    <a className="likeCount">{this.state.likes}</a>
                </div>
                <div className="EditContainer buttonColumn">
                    <IconButton onClick={() => { this.props.onEditClicked(memeObj) }}>
                        <CreateIcon color={'primary'} />
                    </IconButton>
                </div>
            </div>
        );
    }
}


interface MemeTemplateTileProps {
    imageUrl: string,
    title: string,
    uid: string,
    onEditClicked: any,
}
interface MemeTemplateTileState {
    base64Image: string,
    title: string,
    likes: number,
    uid: string,
    text1: string,
    text2: string,
    text1XPos: number,
    text1YPos: number,
    text1Bold: string,
    text1Italic: "",
    text1Color: string,
    text2Bold: string,
    text2XPos: number,
    text2YPos: number,
    text2Italic: string,
    text2Color: string
}
class MemeTemplateTile extends Component<MemeTemplateTileProps, MemeTemplateTileState> {

    constructor(props) {
        super(props);
        this.state = {
            base64Image: "",
            title: this.props.title,
            likes: 0,
            uid: this.props.uid,
            text1: "",
            text2: "",
            text1XPos: 0,
            text1YPos: 0,
            text1Bold: "",
            text1Italic: "",
            text1Color: "",
            text2Bold: "",
            text2XPos: 0,
            text2YPos: 0,
            text2Italic: "",
            text2Color: ""
        };
        this.loadImage = this.loadImage.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onImageLoaded = this.onImageLoaded.bind(this);
    }

    async loadImage(imageUrl) {
        const res = await fetch(imageUrl);
        const imageBlob = await res.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    onEditClick() {
        this.loadImage(this.props.imageUrl).then(
            (convertedImage) => {
                const stringifiedImage = JSON.stringify(convertedImage)
                this.setState({
                    base64Image: stringifiedImage
                }, this.onImageLoaded)
            },
            (error) => {
                console.error(error);
            }
        );
    }

    onImageLoaded() {
        let memeObj = JSON.parse(JSON.stringify(this.state));
        this.props.onEditClicked(memeObj)
    }

    render() {
        return (
            <div id="MemeTile">
                <img className="ImageMeme" src={this.props.imageUrl} alt={this.props.title}></img>
                <p className="TitleMeme">Title: {this.props.title}</p>
                <div className="EditContainer buttonColumn">
                    <IconButton onClick={this.onEditClick}>
                        <CreateIcon color={'primary'} />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default HistoryAndTemplatesView;