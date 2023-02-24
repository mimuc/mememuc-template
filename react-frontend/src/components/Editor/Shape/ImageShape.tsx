import {useRef} from "react";
import {Image, Transformer} from "react-konva";
import useImage from "use-image";
import {useShape} from "src/hooks";
import {ImageShapeInterface} from "src/types";
import {ShapeProps} from "./props";

export const ImageShape = ({id, selected, onSelect}: ShapeProps) => {
    // State
    const {shape, updateShape} = useShape<ImageShapeInterface>(id);
    const [image] = useImage((shape as ImageShapeInterface).url);

    // References
    const shapeRef = useRef(null);

    // Handlers
    const handleSelect = () => onSelect(id);
    const handleDragEnd = (e: any) => updateShape({
        x: e.target.x(),
        y: e.target.y()
    })
    const handleTransformEnd = () => {
        const currentShape = shapeRef.current as any;
        const scaleX = currentShape.scaleX();
        const scaleY = currentShape.scaleY();

        // Reset scale
        currentShape.scaleX(1);
        currentShape.scaleY(1);

        // Update element
        updateShape({
            x: currentShape.x(),
            y: currentShape.y(),
            width: Math.max(5, Math.round(currentShape.width() * scaleX)),
            height: Math.max(5, Math.round(currentShape.height() * scaleY)),
        })
    }

    // Effects
    if (!shape) return null;

    return (
        <>
            <Image
                {...shape}
                ref={shapeRef}
                image={image as any}
                draggable
                onClick={handleSelect}
                onTap={handleSelect}
                onDragEnd={handleDragEnd}
                onTransformEnd={handleTransformEnd}
            />
            {selected && (
                <Transformer
                    node={shapeRef.current as any}
                    rotateEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox}
                />
            )}
        </>
    )
}