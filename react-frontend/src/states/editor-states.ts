import {MutableRefObject} from "react";
import {createGlobalState} from "react-use";
import {ShapeInterface} from "src/types";

export const useEditorState = createGlobalState<ShapeInterface[]>([]);
export const useStageRef = createGlobalState<MutableRefObject<any>>();
export const useSelectedShapeIdState = createGlobalState<string | null>(null);