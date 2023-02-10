import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';
import { Fab, IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CreateIcon from '@mui/icons-material/Create';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import TextRotateVerticalIcon from '@mui/icons-material/TextRotateVertical';
import SpeechToText from './speechToText';


interface historyAndTemplatesViewState {
    valueRendered: boolean,
    sortRandom: boolean,
    sortAlphabetically: boolean,
    sortSearch: String
}

interface historyAndTemplatesViewProps {
    updateTrigger: number,
    handleEditMeme: any,
    updateIsHistory: any
}

class HistoryAndTemplatesView extends Component<historyAndTemplatesViewProps, historyAndTemplatesViewState> {
    constructor(props) {
        super(props);
        this.state = {
            valueRendered: true,
            sortRandom: false,
            sortAlphabetically: false,
            sortSearch: ""
        };
        this.btnClickedCallback = this.btnClickedCallback.bind(this);
        this.sortCallback = this.sortCallback.bind(this);
        this.shuffleFinished = this.shuffleFinished.bind(this);
    }

    handleEditMeme(memeData) {
        //console.log("In History and TemplatesView-handleEditMeme");
        // console.log(memeData);
        this.props.handleEditMeme(memeData);
    }

    btnClickedCallback(value, event) {
        this.props.updateIsHistory(value);
        this.setState({ valueRendered: value });
        event.stopPropagation();
    }

    sortCallback(mode, value) {
        //console.log("Sort using: " + value);
        if (mode === "random") {
            document.getElementById("alphabetShuffleBtn").disabled = true;
            document.getElementById("randomShuffleBtn").disabled = true;
            this.setState({
                sortRandom: true
            }, this.shuffleFinished);
        } else if (mode === "alphabet") {
            document.getElementById("alphabetShuffleBtn").disabled = true;
            document.getElementById("randomShuffleBtn").disabled = true;
            this.setState({
                sortAlphabetically: true
            }, this.shuffleFinished);
        } else if (mode === "Search") {
            if(value === "") { return; }
            console.log(value);
            this.setState({
                sortSearch: value
            }, this.shuffleFinished)
        }
    }

    //This method resets the shuffle state, so that you can click on the shuffle Buttons again. For performance purposes, this is only allowed after 3 seconds
    shuffleFinished() {
        setTimeout(() => {
            this.setState({
                sortRandom: false,
                sortAlphabetically: false,
                sortSearch: ""
            })
            document.getElementById("alphabetShuffleBtn").disabled = false;
            document.getElementById("randomShuffleBtn").disabled = false;
        }, 3000);
    }

    render() {
        return (
            <div className="side" id="sideLeft">
                <HistoryAndTemplatesMenu modeSwitchBtnCallback={this.btnClickedCallback} shuffleCallback={this.sortCallback} />
                <HistoryAndTemplatesList updateTrigger={this.props.updateTrigger} handleEditMeme={this.handleEditMeme.bind(this)} isHistory={this.state.valueRendered} sortRandomly={this.state.sortRandom} sortAlphabetically={this.state.sortAlphabetically} sortSearch={this.state.sortSearch}/>
            </div>
        )
    }
}

interface historyAndTemplatesMenuProps {
    modeSwitchBtnCallback: any,
    shuffleCallback: any
}

interface historyAndTemplateMenuState {
    activeListView: String,
    searchInput: String
}

class HistoryAndTemplatesMenu extends Component<historyAndTemplatesMenuProps, historyAndTemplateMenuState> {

    constructor(props) {
        super(props);
        this.state = {
            activeListView: "History",
            searchInput: ""
        }
    }

    btnClicked(isHistoryValue, event) {
        isHistoryValue ? (this.setState({ activeListView: "History" })) : (this.setState({ activeListView: "Templates" }));
        this.props.modeSwitchBtnCallback(isHistoryValue, event)
    }

    handleInputChange(event) {
        this.setState({
            searchInput: event.target.value
        })
    }

    render() {
        return (
            <>
                <div className="MemeMenu">
                    <button type="button" id="historyBtn" onClick={(e) => this.btnClicked(true, e)} className={(this.state.activeListView === "History") ? "active" : "notActive"}>HISTORY</button>
                    <button type="button" id="templateBtn" onClick={(e) => this.btnClicked(false, e)} className={(this.state.activeListView === "Templates") ? "active" : "notActive"}>TEMPLATES</button>
                </div>
                <div className="ShuffleMenu">
                    <p id="shuffleText">Sort:</p>
                    <Fab className="shuffleBtn" variant="extended" size="small" id="randomShuffleBtn" onClick={() => this.props.shuffleCallback("random", null)}>
                        <ShuffleIcon></ShuffleIcon>Randomly
                    </Fab>
                    <Fab className="shuffleBtn" variant="extended" size="small" id="alphabetShuffleBtn" onClick={() => this.props.shuffleCallback("alphabet", null)}>
                        <TextRotateVerticalIcon></TextRotateVerticalIcon>Alphabetically
                    </Fab>
                </div>
                <div className="searchMenu">
                    <input id="searchFieldInput" placeholder="Filter for memes" className="searchInput" onChange={this.handleInputChange.bind(this)}></input>
                    <Fab className="searchBtn" variant="extended" size="small" id="searchFieldBtn" onClick={() => this.props.shuffleCallback("Search", this.state.searchInput)}>Search</Fab>
                </div>
            </>
        );
    }
}

interface historyAndTemplateListProps {
    isHistory: boolean,
    sortRandomly: boolean,
    sortAlphabetically: boolean,
    sortSearch: String,
    updateTrigger: number,
    handleEditMeme: any,
}

interface historyAndTemplateListState {
    showHistory: boolean,
    memeList: any[],
    limit: number,
    offset: number
    page: number,
    loading: boolean,
    error: boolean,
    hasMore: boolean,
    loadingText: string
}

class HistoryAndTemplatesList extends Component<historyAndTemplateListProps, historyAndTemplateListState> {
    private intersectionRef: React.RefObject<any>;
    private observer;
    private currentlyIntersecting: boolean;

    // private alphabeticalShuffleMemes;

    // Change limit to how many memes you want to get
    constructor(props) {
        super(props);
        this.state = {
            showHistory: this.props.isHistory,
            memeList: [],
            limit: 6,
            offset: 0,
            page: 0,
            loading: false,
            error: false,
            hasMore: true,
            loadingText: "loading..."
        };
        this.resetMemeList = this.resetMemeList.bind(this);
        this.randomSortMemes = this.randomSortMemes.bind(this);
        this.alphabeticalSortMemes = this.alphabeticalSortMemes.bind(this);
        this.filterMemes = this.filterMemes.bind(this);
        this.intersectionRef = React.createRef();
        this.observer = new IntersectionObserver(this.reloadIntersectionCallback.bind(this));
        this.currentlyIntersecting = false;
    }

    resetMemeList(isHistory) {
        console.log("Resetting Meme List, now showing: " + isHistory);
        this.setState({ showHistory: isHistory, memeList: [], page: 0, hasMore: true, offset: 0 }, () => this.loadNextMemes());
    }

    componentDidUpdate(prevProps: Readonly<historyAndTemplateListProps>, prevState: Readonly<historyAndTemplateListState>, snapshot?: any): void {
        if (prevProps.isHistory !== this.props.isHistory) {
            //console.log("Checking props: ");
            //console.log(this.props);
            this.resetMemeList(this.props.isHistory);
        }
        if ((prevProps.sortAlphabetically !== this.props.sortAlphabetically) && this.props.sortAlphabetically) {
            this.alphabeticalSortMemes();
        }
        if ((prevProps.sortRandomly !== this.props.sortRandomly) && this.props.sortRandomly) {
            this.randomSortMemes();
        }
        if (prevProps.updateTrigger !== this.props.updateTrigger) {
            this.resetMemeList(this.props.isHistory);
        }
        if ((prevProps.sortSearch !== this.props.sortSearch) && (this.props.sortSearch !== "")) {
            console.log("Sorting memes after: " + this.props.sortSearch);
            this.filterMemes();
        }
    }

    randomSortMemes() {
        let memeListCopy = this.state.memeList;
        for (let i = memeListCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [memeListCopy[i], memeListCopy[j]] = [memeListCopy[j], memeListCopy[i]];
        }
        //console.log("Shuffled everything randomly...");
        this.setState({
            memeList: memeListCopy
        });
    }

    filterMemes() {
        let searchString = this.props.sortSearch;
        let memeListCopy = this.state.memeList,
         newMemeList = [];
        memeListCopy.forEach(element => {
            if(this.state.showHistory) {
                if(element.title.includes(searchString) || element.text1.includes(searchString) || element.text2.includes(searchString)) {
                    console.log(element);
                    newMemeList.push(element);
                }
            } else {
                if(element.name.includes(searchString)) {
                    console.log(element);
                    newMemeList.push(element);
                }
            }
        });
        this.setState({
            memeList: newMemeList
        });
    }

    componentDidMount() {
        this.loadNextMemes();
    }

    loadNextMemes() {
        //console.log("current state: ");
        //console.log(this.state);
        console.log("Loading even more memes...");
        if (this.state.hasMore && !this.state.loading) {
            this.setState({ loading: true, error: false }, this.getNextMemes.bind(this));
        }
    }

    getNextMemes() {
        let data = {
            page: this.state.page,
            pageSize: 6, // TODO: Select 2*visible
        }
        //console.log(data);
        // console.log(data);
        if (this.state.showHistory) {
            fetch('http://localhost:3001/createdMemes/next', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(data)
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res) => {
                // this.setState({memeList: res});
                //console.log(res);
                for (let i = 0; i < this.state.memeList.length; i++) {
                    if (this.state.memeList[i]._id === res.nextMemes[0]._id) {
                        //console.log("Meme already in list");
                        return;
                    }
                }
                this.setState({
                    memeList: [...this.state.memeList, ...res.nextMemes],
                    loading: false,
                    error: false,
                    hasMore: res.hasMore,
                    page: this.state.page + 1,
                });
                if (!res.hasMore) {
                    this.setState({
                        loadingText: "All memes loaded."
                    });
                }
                this.currentlyIntersecting = false;
            })
                .catch((err) => {
                    this.setState({ loading: false, error: true });
                    console.log(err);
                    this.currentlyIntersecting = false;
                });
        } else {
            console.log("Catching memes from api");
            const limit = this.state.limit;
            const offset = this.state.offset;
            const endpoint = `https://api.imgflip.com/get_memes`;
            let hasMore = true;
            console.log("Backend: get new memePage");
            //console.log(req.body);
            console.log(offset);
        
        
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
                //console.log("Got data with length: " + res.length);
                //console.log(res);
                this.setState({
                    memeList: [...this.state.memeList, ...res.resultMemes],
                    loading: false,
                    error: false,
                    hasMore: res.hasMore,
                    offset: (this.state.offset + this.state.limit),
                    page: this.state.page + 1,
                });

                this.currentlyIntersecting = false;
            });
        }
    }

    alphabeticalSortMemes() {
        let memeListCopy = this.state.memeList,
            shuffleAttribute = "title";
        if (!this.state.showHistory) {
            shuffleAttribute = "name"
        }
        memeListCopy.sort((a, b) => (a[shuffleAttribute] > b[shuffleAttribute] ? 1 : -1))
        this.setState({
            memeList: memeListCopy
        })
    }

    reloadIntersectionCallback(entries) {
        //console.log("intersecting...");
        if (entries[0].isIntersecting && this.state.hasMore) {
            //console.log("Intersecting");
            //console.log(this.intersectionRef.current);
            this.observer.unobserve(this.intersectionRef.current);
            if (!this.currentlyIntersecting) {
                this.currentlyIntersecting = true;
                this.loadNextMemes();
            }
        }
        if (!this.state.hasMore) {
            console.log("There are no more memes to load :(");
        }
    }

    initialIntersectionCallback(uid) {
        let string = "MemeTile-" + uid;
        this.intersectionRef.current = document.getElementById(string);
        //console.log("Last Element id = " + uid);
        //console.log(this.intersectionRef.current);
        if (this.state.loading) return;
        // if (this.interSectionRef.current) this.interSectionRef.current.disconnect();
        this.observer = new IntersectionObserver(this.reloadIntersectionCallback.bind(this));
        try {
            this.observer.observe(this.intersectionRef.current);
        } catch (e) {
            console.log("not working");
        }
        //console.log(this.observer);
    }

    onEditMeme(memeData) {
        //console.log("In on Edit Meme");
        //console.log(memeData);
        this.props.handleEditMeme(memeData);
    }

    render() {
        // this.state.memeList.reverse();
        return (
            <div className="MemeList" key="MemeListDiv">
                {
                    this.state.memeList.map((meme, index) => {
                        if (index === this.state.memeList.length - 3) {
                            return <div key={meme.id}>
                                {this.state.showHistory ? (
                                    <MemeTile
                                        uid={meme._id}
                                        callback={this.initialIntersectionCallback.bind(this)}
                                        key={meme._id}
                                        base64Image={meme.image}
                                        title={meme.title}
                                        likes={meme.likes}
                                        text1={meme.text1}
                                        text1XPos={meme.text1XPos}
                                        text1YPos={meme.text1YPos}
                                        text1Bold={meme.text1Bold}
                                        text1Italic={meme.text1Italic}
                                        text1Color={meme.text1Color}
                                        text2={meme.text2}
                                        text2Bold={meme.text2Bold}
                                        text2XPos={meme.text2XPos}
                                        text2YPos={meme.text2YPos}
                                        text2Italic={meme.text2Italic}
                                        text2Color={meme.text2Color}
                                        onEditClicked={this.onEditMeme.bind(this)}
                                    />) : (
                                    <MemeTemplateTile
                                        uid={meme.id}
                                        key={meme.id}
                                        callback={this.initialIntersectionCallback.bind(this)}
                                        imageUrl={meme.url}
                                        title={meme.name}
                                        onEditClicked={this.onEditMeme.bind(this)}
                                    />)
                                };
                            </div>
                        } else {
                            return <div key={meme.id}>
                                {
                                    this.state.showHistory ? (
                                        <MemeTile
                                            uid={meme._id}
                                            callback={-1}
                                            key={meme}
                                            base64Image={meme.image}
                                            title={meme.title}
                                            likes={meme.likes}
                                            text1={meme.text1}
                                            text1XPos={meme.text1XPos}
                                            text1YPos={meme.text1YPos}
                                            text1Bold={meme.text1Bold}
                                            text1Italic={meme.text1Italic}
                                            text1Color={meme.text1Color}
                                            text2={meme.text2}
                                            text2Bold={meme.text2Bold}
                                            text2XPos={meme.text2XPos}
                                            text2YPos={meme.text2YPos}
                                            text2Italic={meme.text2Italic}
                                            text2Color={meme.text2Color}
                                            onEditClicked={this.onEditMeme.bind(this)}
                                        />
                                    ) : (
                                        <MemeTemplateTile
                                            uid={meme.id}
                                            key={meme.id}
                                            callback={null}
                                            imageUrl={meme.url}
                                            title={meme.name}
                                            onEditClicked={this.onEditMeme.bind(this)}
                                        />
                                    )
                                };
                            </div>
                        }
                    })
                }
                <div id="loadingText">{this.state.loading && this.state.loadingText}</div>
                <div>{this.state.error && 'ERROR!'}</div>
            </div>
        )
    }
}


interface MemeTileProps {
    callback: any,
    base64Image: string;
    title: string;
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
    text2Color: string,
    onEditClicked: any
}
interface MemeTileState {
    likes: number,
}
class MemeTile extends Component<MemeTileProps, MemeTileState> {

    constructor(props) {
        super(props);
        this.state = { likes: this.props.likes };
    }

    componentDidMount(): void {
        if (this.props.callback != -1) {
            //console.log("Last Meme: ");
            this.props.callback(this.props.uid);
        }
    }

    private updateLikeDisplay() {
        this.setState({ likes: this.state.likes + 1 });
    }

    increaseLikeCount() {
        //console.log('trying to increase like');
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
                //console.log(res.status);
                this.updateLikeDisplay();
                let listOfLiked = localStorage.getItem('listOfLiked');
                if (listOfLiked === undefined || listOfLiked === null) {
                    localStorage.setItem('listOfLiked', JSON.stringify([this.props.uid]));
                } else {
                    let newlistOfLiked: string[] = JSON.parse(listOfLiked);
                    newlistOfLiked.push(this.props.uid);
                    localStorage.setItem('listOfLiked', JSON.stringify(newlistOfLiked));
                }
            });
        }
    }

    render() {
        let image = new Image();
        image.src = this.props.base64Image;
        let height = image.height;
        let width = image.width;
        let imageCanvas = document.createElement('canvas');
        imageCanvas.height = height;
        imageCanvas.width = width;
        let imageCtx = imageCanvas.getContext('2d');
        imageCtx.drawImage(image, 0, 0);
        //console.log(this.props.text1);
        imageCtx.font = this.props.text1Bold + " " + this.props.text1Italic + " 48px Arial";
        // console.log(imageCtx.font);
        imageCtx.fillStyle = this.props.text1Color;
        imageCtx.fillText(this.props.text1, this.props.text1XPos, this.props.text1YPos);
        // console.log("Text 2 bold: " + this.props.text2Bold);
        imageCtx.font = this.props.text2Bold + " " + this.props.text2Italic + " 48px Arial";
        //console.log(imageCtx.font);
        imageCtx.fillStyle = this.props.text2Color;
        imageCtx.fillText(this.props.text2, this.props.text2XPos, this.props.text2YPos);
        // image.src = imageCanvas.toDataURL("image/png");
        //console.log("Height = " + height + " width = " + width);
        let info: string = "";
        if (this.props.text1) {
            info += "Text 1: " + this.props.text1;
        }
        if (this.props.text2) {
            info += ", Text 2: " + this.props.text2;
        }
        if (!this.props.text1 && !this.props.text2) {
            info += "No text";
        }
        if (info.length > 60) {
            info = info.substring(0, 55) + "...";
        }

        let memeObj = JSON.parse(JSON.stringify(this.props));
        delete memeObj.onEditClicked;
        delete memeObj.callback;
        // console.log(memeObj);
        // let cuid = this.props.uid;

        return (
            <div id={"MemeTile-" + this.props.uid} className="MemeTile">
                <img className="ImageMeme" src={imageCanvas.toDataURL('image/png')} alt={this.props.title}></img>
                <p className="TitleMeme">Title: {this.props.title}</p>
                <p className="InfoMeme">Info: {info}</p>
                <div className="lowerElements">
                    <div className="likeContainer buttonColumn">
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
            </div>
        );
    }
}


interface MemeTemplateTileProps {
    imageUrl: string,
    title: string,
    uid: string,
    callback: any,
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

    componentDidMount(): void {
        if (this.props.callback) {
            this.props.callback(this.props.uid);
        }
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
                this.setState({
                    base64Image: convertedImage
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
            <div id={"MemeTile-" + this.props.uid} className="MemeTile">
                <img className="ImageMeme" src={this.props.imageUrl} alt={this.props.title}></img>
                <p className="TitleMeme">Title: {this.props.title}</p>
                <div className="EditContainer buttonColumn2">
                    <IconButton onClick={this.onEditClick}>
                        <CreateIcon id={"templateCreateIcon"} color={'primary'} />
                    </IconButton>
                </div>
            </div>
        );
    }
}

export default HistoryAndTemplatesView;