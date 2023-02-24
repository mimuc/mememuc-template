import {authConfig, client} from "./base";
import {ImageShapeInterface, ShapeInterface, TextShapeInterface} from "src/types";
import uuid from "react-uuid";

const toLocalImageUrl = (url: string) => {
    return fetch(url)
        .then(res => res.blob())
        .then(blob => URL.createObjectURL(blob));
}

async function getBase64ImageFromUrl(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

const mapTemplateToShapes = async (rawTemplate: { publicId: string, name: string, texts: any[], images: any[], canvas: { width: number, height: number } }) => {
    const textShapes = rawTemplate.texts.map((txt: any) => {
        const isString = typeof txt === 'string';

        return {
            id: uuid(),
            type: 'text',
            x: isString ? 0 : (txt?.x || 0),
            y: isString ? 0 : (txt?.y || 0),
            text: isString ? txt : txt.text,
            fontSize: isString ? 20 : (txt?.fontSize || 20),
            fill: isString ? 'black' : (txt?.fill || 'black'),
            fontStyle: isString ? 'normal' : (txt?.fontStyle || 'normal'),
        } as TextShapeInterface;
    });

    const imageShapes: ImageShapeInterface[] = [];

    for (const img of rawTemplate.images) {
        const localUrl = await toLocalImageUrl(img.url);
        imageShapes.push({
            id: uuid(),
            type: 'image',
            x: img?.x || 0,
            y: img?.y || 0,
            url: localUrl,
        } as ImageShapeInterface);
    }

    return {
        id: rawTemplate.publicId,
        name: rawTemplate.name,
        shapes: [...imageShapes, ...textShapes],
        canvasSize: rawTemplate.canvas
    };
};

const mapShapesToTemplate = async (shapes: ShapeInterface[]) => {
    const texts = [];
    const images = [];

    for(const shape of shapes) {
        if(shape.type === 'text') {
            const textshape = shape as TextShapeInterface;
            texts.push({
                x: textshape.x,
                y: textshape.y,
                text: textshape.text,
                fontSize: textshape.fontSize,
                fill: textshape.fill,
                fontStyle: textshape.fontStyle
            })
        }
        else if(shape.type === 'image') {
            const imgshape = shape as ImageShapeInterface;
            const imageBase64 = await getBase64ImageFromUrl(imgshape.url);
            images.push({
                x: imgshape.x,
                y: imgshape.y,
                url: imageBase64
            })
        }
    }

    return {
        images,
        texts
    }
}

export const all = async () => {
    console.log("Getting templates...")
    const data = await client.get<any[]>('/templates').then(res => res.data)

    console.log("Templates:", data);

    const templates = [];
    for (const template of data) {
        templates.push(await mapTemplateToShapes(template));
    }

    return templates;
}

export const add = async (name: string, shapes: ShapeInterface[], canvas: { width: number, height: number }) => {
    const {images, texts} = await mapShapesToTemplate(shapes);
    const data = {
        name,
        images,
        texts,
        canvas
    };
    console.log("Template data", data)

    return client.post('/templates', data, authConfig() )
    .then(res => res.data);
}

export const templates = {all, add};