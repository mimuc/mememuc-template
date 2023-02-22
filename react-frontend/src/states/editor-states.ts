import {MutableRefObject} from "react";
import {createGlobalState} from "react-use";
import {ImageShapeInterface, ShapeInterface, TextShapeInterface} from "src/types";

// TODO: remove this
const Text1: TextShapeInterface = {
    id: '1',
    x: 0,
    y: 0,
    type: 'text',
    text: 'Hello World',
    fontSize: 20,
    fill: 'red'
};

const Text2: TextShapeInterface = {
    id: '2',
    x: 50,
    y: 50,
    type: 'text',
    text: 'Hello World',
    fontSize: 20,
    fill: 'green'
};

const Image1: ImageShapeInterface = {
    id: '3',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    type: 'image',
    url: 'https://i.imgflip.com/7buw1v.jpg',
}

export const useEditorState = createGlobalState<ShapeInterface[]>([Text1, Text2, Image1]);
export const useStageRef = createGlobalState<MutableRefObject<any>>();
export const useSelectedShapeIdState = createGlobalState<string | null>(null);