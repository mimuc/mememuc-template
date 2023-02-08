import React from "react";
import { useSearchParams } from "react-router-dom";

const Editor = () => {
    const [parameters] = useSearchParams();
    console.log(parameters[''])
    return <h1> Editor </h1>
}

export default Editor;