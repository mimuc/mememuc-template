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

class HistoryAndTemplatesList extends Component {
    state={};

    render() {
        return (
            <div className="MemeList">  
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
                <MemeTile/>
            </div>
        );
    }
}

class MemeTile extends Component {
    state={};

    render() {
        return (
            <div id="MemeTile"> 
                <img className="ImageMeme"></img>  
                <p className="TitleMeme">Title: </p>
                <p className="InfoMeme">Info: </p>
            </div>
        );
    }
}

export default HistoryAndTemplatesView;