import {CanvasEditor} from "src/components";
import {theme, Typography} from "antd";

const {Title} = Typography;

export const EditorPage = () => {
    const {token} = theme.useToken();

    return (
        <>
            {/*<Title level={2}>Templates</Title>*/}
            {/*<div style={{height: 100, backgroundColor: 'gray', marginBottom: token.marginLG}}>*/}
            {/*    Hier sind templates*/}
            {/*</div>*/}
            {/*<Title level={2}>New Meme</Title>*/}
            <CanvasEditor/>
        </>
    )
}

// Default Editor =
// Locally store templates
// Upload and place Images und Text (addable, deleteable, freely movable)
// Upload from url, from file, handdrawn, screenshot and camera
// Select templates (save texts + clear button)
// Save as template
// Freely adjust canvas size


// Save as draft
// Generate buttons


// GIF / Video Editor
// Single Caption freely placeable

// - [ ] Generate with file-size and download and share (local and server)
// - [ ] The user can choose to either create the meme locally on their device or on the
// webserver. Afterwards they are shown the image and provided with a download button.
// - [ ] In addition to intermediate, the user can specify a target file-size before the image
// creating and share buttons are presented below the image. The generated meme should have the
// specified (or lower) file-size.
// - [ ] Redirect link to created meme page
// - [ ] PRivate / unlisted / public