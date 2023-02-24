import React, { useState } from "react";
import Draggable from "react-draggable";

export default function Text (){
    const [edit, setEdit] = useState(false);
    const [val, setVal] = useState("Double Click to Edit"); 
    const [fontSize, setFontSize] = useState(20);
    const [fontColor, setFontColor] = useState("black");
    const [fontFamily, setFontFamily] = useState("Arial");

    const textStyle = {
        fontSize: `${fontSize}px`,
        color: fontColor,
        fontFamily: fontFamily
    };

    return (
        <Draggable> 
            {edit ? (
                <div>
                    <input 
                        onDoubleClick={e => setEdit(false)} 
                        value={val} 
                        onChange={(e) => setVal(e.target.value)} 
                    />
                    <label>
                        Font size:
                        <input 
                            type="number" 
                            value={fontSize} 
                            onChange={(e) => setFontSize(Number(e.target.value))}
                        />
                    </label>
                    <label>
                        Font color:
                        <input 
                            type="color" 
                            value={fontColor} 
                            onChange={(e) => setFontColor(e.target.value)}
                        />
                    </label>
                    <label>
                        Font family:
                        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                        </select>
                    </label>
                </div>
            ) : (
                <h1 style={textStyle} onDoubleClick={e => setEdit(true)}> { val } </h1>
            )}
        </Draggable> 
    );
};

