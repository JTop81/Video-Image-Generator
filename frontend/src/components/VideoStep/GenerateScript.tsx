import React, { useCallback, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    TextareaAutosize,
} from "@mui/material";
import { GiStarSwirl } from "react-icons/gi";
import axios from "axios";
import { VideoRequest } from "../../../pages/app/createVideo";
type GenerateScriptProps = {
    setVideoRequest: React.Dispatch<React.SetStateAction<VideoRequest>>;
    handleNext: () => void;
}
const GenerateScript = ({ setVideoRequest, handleNext }: GenerateScriptProps) => {
    const [prompt, setPrompt] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateText = useCallback(async () => {

        console.log("text: ", prompt)
        setIsLoading(true);
        try {
            const response = await axios.post('/api/speech/generateText', { prompt });
            setText(response.data.data.data)
        } catch (err: any) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setText, prompt])

    return (
        <div className="flex flex-col justify-center items-center w-full mx-auto"
        >
            <TextField
                fullWidth
                color="secondary"
                sx={{
                    input: { color: 'white' },  // Set text color to white
                    label: { color: 'white' },  // Set label color to white
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' }, // Set border color
                        '&:hover fieldset': { borderColor: 'white' }, // Set border color on hover
                        '&.Mui-focused fieldset': { borderColor: 'white' } // Set border color when focused
                    }
                }}
                label="Prompt or Keyword"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                inputProps={{ maxLength: 120 }}
                helperText={`Generate a text from a topic or prompt. ${prompt.length}/120 characters`}
                margin="normal"
            />

            <Button
                fullWidth
                disabled={isLoading}
                onClick={generateText}
                variant="contained"
                style={{ backgroundColor: "#8b5cf6" }}
                startIcon={<GiStarSwirl size={24} />}
            >
                Automatic Generated Script
            </Button>
            <TextareaAutosize className="mt-10 overflow-auto" minRows={15} maxRows={15} ref={null} value={text} onChange={(e) => setText(e.target.value)} autoFocus style={{ width: "100%", borderRadius: "5px", padding: "10px" }} placeholder="Enter your text here in the language you want..." />
            <div className="flex ml-auto mt-5">
                <Button disabled={!prompt} onClick={() => {
                    handleNext();
                    setVideoRequest((prev) => ({
                        ...prev,
                        prompt
                    }))
                }} variant='contained'>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default GenerateScript;