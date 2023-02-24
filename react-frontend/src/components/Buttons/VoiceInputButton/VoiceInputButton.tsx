import {AudioMutedOutlined, AudioOutlined} from "@ant-design/icons";
import {theme} from "antd";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {useEffect} from "react";

type VoiceInputButtonProps = {
    onTranscript: (transcript: string) => void;
}

export const VoiceInputButton = ({onTranscript}: VoiceInputButtonProps) => {
    const {token} = theme.useToken();
    const {listening, transcript, resetTranscript} = useSpeechRecognition();

    useEffect(() => {
        if(transcript) onTranscript(transcript)
    }, [transcript])

    useEffect(() => {
        if(!listening) {
            resetTranscript();
        }
    }, [listening])

    return listening ?
        <AudioMutedOutlined
            style={{color: token.colorPrimaryText}}
            onClick={SpeechRecognition.stopListening}/> :
        <AudioOutlined
            style={{color: token.colorPrimaryText}}
            onClick={() => SpeechRecognition.startListening({continuous: true, language: 'en-US'})}/>
}