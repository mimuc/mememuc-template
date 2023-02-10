//this function gathers the memes from the selected API
export const getAllMemes = async () => {
    const response = await fetch('https://api.imgflip.com/get_memes');
    return await response.json();
};