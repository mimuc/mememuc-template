import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


interface historyAndTemplatesViewState {
    valueRendered: boolean
}

class HistoryAndTemplatesView extends Component<historyAndTemplatesViewState> {
    constructor(props) {
        super(props);
        this.state = {
            valueRendered: true
        };
        this.btnClickedCallback = this.btnClickedCallback.bind(this);
    }

    btnClickedCallback(value, event) {
        this.setState({ valueRendered: value });
        event.stopPropagation();
    }

    render() {
        return (
            <div className="side" id="sideLeft">
                <HistoryAndTemplatesMenu btnClickCallback={this.btnClickedCallback} />
                <HistoryAndTemplatesList isHistory={this.state.valueRendered} />
            </div>
        )
    }
}

interface historyAndTemplatesMenuProps {
    btnClickCallback: any
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

    render() {
        return (
            <div className="MemeMenu">
                <button type="button" id="historyBtn" onClick={(e) => this.props.btnClickCallback(true, e)} className={(this.state.activeListView === "History") ? "active" : "notActive"}>HISTORY</button>
                <button type="button" id="templateBtn" onClick={(e) => this.props.btnClickCallback(false, e)} className={(this.state.activeListView === "Templates") ? "active" : "notActive"}>TEMPLATES</button>
            </div>
        );
    }
}


interface historyAndTemplateListProps {
    isHistory: boolean
}

interface historyAndTemplateListState {
    showHistory: boolean,
    memeList: any[]
}

class HistoryAndTemplatesList extends Component<historyAndTemplateListProps, historyAndTemplateListState> {

    constructor(props) {
        super(props);
        this.state = {
            showHistory: this.props.isHistory,
            memeList: []
        };
        this.loadMemeList();
        this.resetMemeList = this.resetMemeList.bind(this);
    }

    resetMemeList(isHistory) {
        console.log(isHistory);
        this.setState({ showHistory: isHistory, memeList: [] }, this.stateSet)
    }

    stateSet() {
        console.log("current state: ");
        console.log(this.state);
        this.loadMemeList();
    }

    componentDidUpdate(prevProps: Readonly<historyAndTemplateListProps>, prevState: Readonly<historyAndTemplateListState>, snapshot?: any): void {
        if (prevProps.isHistory !== this.props.isHistory) {
            console.log("Checking props: ");
            console.log(this.props);
            this.resetMemeList(this.props.isHistory);
        }
    }

    loadMemeList() {
        console.log("MEME List loading.... ")
        console.log(this.state.showHistory);
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
                console.log(res);
                this.setState({ memeList: res });
            });
        } else {
            console.log("Catching api meme data");
            fetch('http://localhost:3001/memesApi/all', {
                method: 'GET',
            }).then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res) => {
                console.log(res);
                this.setState({ memeList: res });
            });
        }
    }

    render() {
        return (
            <div className="MemeList">
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
                            <MemeTile
                                uid={meme.id}
                                key={meme.id}
                                base64Image={meme.url}
                                title={meme.name}
                                likes={0}
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
    uid: string,
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
        console.log("Height = " + height + " width = " + width);

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
            </div>
        );
    }
}

export default HistoryAndTemplatesView;