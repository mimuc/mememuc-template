import {useRef} from "react";
import {Text, Transformer} from "react-konva";
import {useShape} from "src/hooks";
import {TextShapeInterface} from "src/types";

type TextShapeProps = {
    id: string;
    selected: boolean
    onSelect: (id: string) => void
}

export const TextShape = ({id, selected, onSelect}: TextShapeProps) => {
    // State
    const {shape, updateShape} = useShape<TextShapeInterface>(id);

    // References
    const shapeRef = useRef(null);

    // Handlers
    const handleSelect = () => onSelect(id);
    const handleDragEnd = (e: any) => updateShape({
        x: e.target.x(),
        y: e.target.y()
    })

    // We use onTransform instead of onTransformEnd to avoid skewed text when resizing
    const handleTransform = () => {
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
            width: Math.max(5, currentShape.width() * scaleX),
            height: Math.max(5, currentShape.height() * scaleY),
        })
    }

    if (!shape) return null;

    return (
        <>

            <Text
                {...shape}
                ref={shapeRef}
                draggable
                onClick={handleSelect}
                onTap={handleSelect}
                onDragEnd={handleDragEnd}
                onTransform={handleTransform}
            />
            {selected && (
                <>
                    <Transformer
                        node={shapeRef.current as any}
                        rotateEnabled={false}
                        enabledAnchors={['middle-left', 'middle-right']}
                        boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox}
                    />

                </>
            )}
        </>
    );
}