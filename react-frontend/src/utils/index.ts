import { TinyColor } from '@ctrl/tinycolor'
import imageCompression from 'browser-image-compression';

/**
 * Converts big numbers to human-readable format, e.g. 1.100 -> '1.1k'
 * https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
 */
export const abbreviateNumber = (number: number) => {
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

    // what tier? (determines SI symbol)
    const tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if (tier === 0) return number;

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

export const getTimeSince = (date: Date) => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - date.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) {
        return "today";
    } else if (daysAgo === 1) {
        return "yesterday";
    } else if (daysAgo < 7) {
        return `${daysAgo} days ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) {
        return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
    }

    const monthsAgo = Math.floor(weeksAgo / 4);
    if (monthsAgo < 12) {
        return `${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
    }

    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''} ago`;
}

/**
 * Verify if the url is an image
 * https://www.zhenghao.io/posts/verify-image-url
 * @param url
 */
export function isImgUrl(url: string) {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url)
}

/**
 * Returns image meta data
 * https://stackoverflow.com/questions/11442712/get-width-height-of-remote-image-from-url
 * @param url
 */
export function getMeta(url: string) {
    return new Promise<{width: number, height: number}>((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject();
        img.src = url;
    });
}

/**
 * Download a file from a url
 * https://stackoverflow.com/a/15832662/512042
 * @param uri
 * @param name
 */
export async function downloadURI(uri: string, name: string, fileType: 'png' | 'jpg', maxSizeInKBytes: number) {
    const response = await fetch(uri);
    const imageData = await response.blob();

    // Image compression
    let compressedDataUrl = uri;

    const options = {
        maxSizeMB: maxSizeInKBytes / 1000,
        useWebWorker: true,
        alwaysKeepResolution: true,
        maxIteration: 50,
        fileType: 'image/' + fileType
    }

    const compressedImage = await imageCompression(imageData as File, options);
    compressedDataUrl = URL.createObjectURL(compressedImage);

    const link = document.createElement('a');
    link.download = `${name}.${fileType}`;
    link.href = compressedDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(compressedDataUrl);
}


/**
 * Return text color based on background color for better contrast
 * https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
 * @param color
 */
export function getTextColor(color: string) {
    if(new TinyColor(color).getLuminance() > 0.179) { // 0.179 -> Mark Ransom answer
        return 'black'
    } else {
        return 'white'
    }
}

