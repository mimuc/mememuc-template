import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';
import {IconButton} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CreateIcon from '@mui/icons-material/Create';
// import TextToSpeech from './textToSpeech';
import SpeechToText from './speechToText';

interface historyAndTemplatesViewProps {
    updateTrigger: number,
    handleEditMeme: any
}
class HistoryAndTemplatesView extends Component<historyAndTemplatesViewProps> {
    constructor(props) {
        super(props);
    }

    handleEditMeme(memeData) {
        console.log("In History and TemplatesView-handleEditMeme");
        // console.log(memeData);
        this.props.handleEditMeme(memeData);
    }

    render() {
        return (
            <div className="side" id="sideLeft">
                <HistoryAndTemplatesMenu/>
                <HistoryAndTemplatesList updateTrigger={this.props.updateTrigger} handleEditMeme={this.handleEditMeme.bind(this)}/>
            </div>
        )

    }
}

class HistoryAndTemplatesMenu extends Component {

    state={activeListView: "History"};

    setListView(listView){
        this.setState({activeListView: listView})
    }

    render() {
        return (
            <div className="MemeMenu">
                    <button type="button" id="historyBtn" onClick={() => {this.setListView("History")}}  className={(this.state.activeListView==="History")?"active":"notActive"}>HISTORY</button>
                    <button type="button" id="templateBtn" onClick={() => {this.setListView("Templates")}} className={(this.state.activeListView==="Templates")?"active":"notActive"}>TEMPLATES</button>
            </div>
        );
    }
}

interface historyAndTemplateListProps {
    updateTrigger: number,
    handleEditMeme: any,
}

interface historyAndTemplateListState {
    showHistory: boolean,
    memeList: any[],
    page: number,
    loading: boolean,
    error: boolean,
    hasMore: boolean,
    loadingText: string
}

class HistoryAndTemplatesList extends Component<historyAndTemplateListProps, historyAndTemplateListState> {
    private intersectionRef: React.RefObject<any>;
    private observer;

    constructor(props) {
        super(props);
        this.state = {
            showHistory: true,
            memeList: [],
            page: 0,
            loading: false,
            error: false,
            hasMore: true,
            loadingText: "loading..."
        };
        this.intersectionRef = React.createRef();
        this.observer = new IntersectionObserver(this.reloadIntersectionCallback.bind(this));
    }

    componentDidMount() {
        this.loadNextMemes();
    }

    componentDidUpdate(prevProps: Readonly<historyAndTemplateListProps>, prevState: Readonly<historyAndTemplateListState>, snapshot?: any) {
        if (prevProps.updateTrigger !== this.props.updateTrigger) {
            console.log("Memelist updated");
            this.setState({memeList: [], page: 0, hasMore: true}, () => this.loadNextMemes());
        }
    }

    showTemplates() {
        if(this.state.showHistory) {
            this.setState({showHistory: false, memeList: [], page: 0, hasMore: true}, () => this.loadNextMemes());
        }
    }

    showHistory() {
        if(!this.state.showHistory) {
            this.setState({showHistory: true, memeList: [], page: 0, hasMore: true}, () => this.loadNextMemes());
        }
    }

    loadNextMemes() {
        console.log("Loading memes...");
        if (this.state.hasMore && !this.state.loading) {
            this.setState({loading: true, error: false});
            let data = {
                page: this.state.page,
                pageSize: 6, // TODO: Select 2*visible
            }
            console.log(data);
            // console.log(data);
            if(this.state.showHistory) {
                fetch('http://localhost:3001/createdMemes/next', {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                }).then((res) => {
                    if(res.ok) {
                        return res.json();
                    } else {
                        console.log(res.status);
                    }
                }).then((res) => {
                    // console.log(res);
                    // this.setState({memeList: res});
                    console.log(res);
                    for (let i = 0; i < this.state.memeList.length; i++) {
                        if (this.state.memeList[i]._id === res.nextMemes[0]._id) {
                            console.log("Meme already in list");
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
                })
                .catch((err) => {
                    this.setState({loading: false, error: true});
                    console.log(err);
                });
            } else {
                // TODO: Handle for templates
            }
        }
    }

    loadMemeList() {
        if(this.state.showHistory) {
            fetch('http://localhost:3001/createdMemes/all', {
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                credentials: "include",
            }).then((res) => {
                if(res.ok) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res) => {
                // console.log(res);
                this.setState({memeList: res});
            });
        } else {
            // TODO: fetch data for template
        }
    }

    reloadIntersectionCallback(entries) {
        if(entries[0].isIntersecting && this.state.hasMore) {
            console.log("Intersecting");
            console.log(this.intersectionRef.current);
            this.observer.unobserve(this.intersectionRef.current);
            this.loadNextMemes();
        }
        if (!this.state.hasMore) {
            console.log("No more");
        }
    }

    initialIntersectionCallback() {
        this.intersectionRef.current = document.querySelector(".MemeList").lastChild;
        console.log(this.intersectionRef);
        if (this.state.loading) return;
        // if (this.interSectionRef.current) this.interSectionRef.current.disconnect();
        this.observer = new IntersectionObserver(this.reloadIntersectionCallback.bind(this));
        this.observer.observe(this.intersectionRef.current);
    }

    onEditMeme(memeData) {
        console.log("In on Edit Meme");
        //console.log(memeData);
        this.props.handleEditMeme(memeData);
    }

    render() {
        // this.state.memeList.reverse();
        return (
            <div className="MemeList">
                {
                    this.state.memeList.map((meme, index) => {
                        if(index === this.state.memeList.length-3) {
                            return <MemeTile
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
                            />;
                        } else {
                            return <MemeTile
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
                        }
                    })
                }
                <div id="loadingText">{this.state.loading && this.state.loadingText}</div>
                <div>{this.state.error && 'ERROR!'}</div>
            </div>
        );
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
        this.state = {likes: this.props.likes};
        if (this.props.callback != -1) {
            console.log("Last Meme: ");
            console.log(this);
            this.props.callback();
        }
    }

    private updateLikeDisplay() {
        this.setState({likes: this.state.likes + 1});
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
        imageCanvas.width=width;
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
        if(this.props.text2) {
            info += ", Text 2: " + this.props.text2;
        }
        if (!this.props.text1 && !this.props.text2) {
            info += "No text";
        }
        if(info.length > 60) {
            info = info.substring(0, 55) + "...";
        }

        let memeObj = JSON.parse(JSON.stringify(this.props));
        delete memeObj.onEditClicked;
        delete memeObj.callback;
        // console.log(memeObj);

        return (
            <div id="MemeTile">
                <img className="ImageMeme" src={imageCanvas.toDataURL('image/png')} alt={this.props.title}></img>
                <p className="TitleMeme">Title: {this.props.title}</p>
                <p className="InfoMeme">Info: {info}</p>
                <div className="lowerElements">
                    <div className="likeContainer buttonColumn">
                        <IconButton onClick={this.increaseLikeCount.bind(this)}>
                            <ThumbUpIcon color={'success'}/>
                        </IconButton>
                        <a className="likeCount">{this.state.likes}</a>
                    </div>
                    <div className="EditContainer buttonColumn">
                        <IconButton onClick={() => { this.props.onEditClicked(memeObj) }}>
                            <CreateIcon color={'primary'}/>
                        </IconButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default HistoryAndTemplatesView;