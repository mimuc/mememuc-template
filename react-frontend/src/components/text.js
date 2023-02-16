import React, { useState } from "react";
import Draggable from "react-draggable";

export default function Text (){
    const [edit, setEdit] = useState(false);
    const [val, setVal] = useState("Double Click to Edit"); 

    return (
        <Draggable> 
            {edit ? (<input onDoubleClick={e => setEdit(false)} value={val} onChange={(e) => setVal(e.target.value)} />
            ) : (
            <h1 onDoubleClick={e => setEdit(true)}> { val } </h1>)}
        </Draggable> 
    );
};
