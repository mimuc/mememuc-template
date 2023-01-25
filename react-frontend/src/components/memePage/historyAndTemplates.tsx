import * as React from 'react';
import { Component } from 'react';
import Button from '@mui/material/Button';

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
            })
        } else {
            // TODO: fetch data for template
        }
    }

    render() {
        return (
            <div className="MemeList">
                {
                    this.state.memeList.map((meme) => {
                        return <MemeTile key={meme} base64Image={meme.image} title={meme.title}/>
                    })
                }
            </div>
        );
    }
}


interface MemeTileProps {
    base64Image: string;
    title: string;
}
class MemeTile extends Component<MemeTileProps> {

    constructor(props) {
        super(props);
        this.state = {};
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
            </div>
        );
    }
}

export default HistoryAndTemplatesView;