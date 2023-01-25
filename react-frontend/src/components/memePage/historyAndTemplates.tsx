import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';
import {IconButton} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

class HistoryAndTemplatesView extends Component {
    state = {};

    render() {
        return (
            <div className="side" id="sideLeft">
                <HistoryAndTemplatesMenu/>
                <HistoryAndTemplatesList/>
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

}

interface historyAndTemplateListState {
    showHistory: boolean,
    memeList: any[],
}

class HistoryAndTemplatesList extends Component<historyAndTemplateListProps, historyAndTemplateListState> {

    constructor(props) {
        super(props);
        this.state = {
            showHistory: true,
            memeList: [],
        };
        this.loadMemeList();
    }

    showTemplates() {
        if(this.state.showHistory) {
            this.setState({showHistory: false, memeList: []});
            this.loadMemeList();
        }
    }

    showHistory() {
        if(!this.state.showHistory) {
            this.setState({showHistory: true, memeList: []});
            this.loadMemeList();
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
                console.log(res);
                this.setState({memeList: res});
            });
        } else {
            // TODO: fetch data for template
        }
    }

    render() {
        return (
            <div className="MemeList">
                {
                    this.state.memeList.map((meme) => {
                        return <MemeTile uid={meme._id} key={meme} base64Image={meme.image} title={meme.title} likes={meme.likes}/>
                    })
                }
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
        this.state = {likes: this.props.likes};
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
                        <ThumbUpIcon color={'success'}/>
                    </IconButton>
                    <a className="likeCount">{this.state.likes}</a>
                </div>
            </div>
        );
    }
}

export default HistoryAndTemplatesView;