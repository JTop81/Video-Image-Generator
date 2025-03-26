import { useState } from "react";
import Asynchronous from "../ui/Asynchronous";
import {
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    Button,
    duration,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { VideoRequest } from "../../../pages/app/createVideo";
import { convertLengthToDuration } from "../../../utils/common";
type VoiceSelectProps = {
    setVideoRequest: React.Dispatch<React.SetStateAction<VideoRequest>>;
    handleNext: () => void;
    handleBack: ()=> void;
}
const VoiceSelect = ({ setVideoRequest, handleNext, handleBack }: VoiceSelectProps) => {
    const { data: session } = useSession()
    const [voice, setVoice] = useState<string | null>(null);
    const [orientation, setOrientation] = useState<string>("square");
    const [length, setLength] = useState<string>("30 seconds");
    const [durationPerScene, setDurationPerScene] = useState<string>("15 seconds");
    // Options for orientation and length
    const orientationOptions = ["square", "portrait", "landscape"];
    const lengthOptions = ["30 seconds", "1 minute", "1.5 minutes", "2 minutes"];
    const durationPerSceneOptions = ["15 seconds", "10 seconds"];
    const isPro = session && session?.user?.priceName?.name?.trim().toLowerCase() === "premium";
    return (
        <div className="flex flex-col w-full">
            <Asynchronous setVoice={setVoice} />
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Orientation
            </Typography>
            <RadioGroup
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}

            >
                <Grid container spacing={2}>
                    {orientationOptions.map((option) => (
                        <Grid item xs={6} key={option}>
                            <Box display="flex" justifyContent="space-even" alignItems="center">
                                <FormControlLabel
                                    value={option}
                                    control={<Radio />}
                                    label={
                                        <Typography sx={{ color: "white" }}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </Typography>
                                    }
                                    disabled={!isPro && option !== "square"}
                                />
                                {!isPro && option !== "square" && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ ml: 1, color: "orange", fontSize: 10 }}
                                    >
                                        Pro
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Length
            </Typography>
            <RadioGroup
                value={length}
                onChange={(e) => setLength(e.target.value)}
            >
                <Grid container spacing={2}>
                    {lengthOptions.map((option) => (
                        <Grid item xs={6} key={option}>
                            <Box display="flex" justifyContent="space-even" alignItems="center">
                                <FormControlLabel
                                    value={option}
                                    control={<Radio />}
                                    sx={{ color: "white" }}
                                    label={
                                        <Typography sx={{ color: "white" }}>
                                            {option}
                                        </Typography>
                                    }
                                    disabled={
                                        !isPro &&
                                        (option === "1.5 minutes" || option === "2 minutes")
                                    }
                                />
                                {!isPro &&
                                    (option === "1.5 minutes" || option === "2 minutes") && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1, color: "orange", fontSize: 10 }}
                                        >
                                            Pro
                                        </Typography>
                                    )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
            <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                Duration Per Scene
            </Typography>
            <RadioGroup
                value={durationPerScene}
                onChange={(e) => setDurationPerScene(e.target.value)}
            >
                <Grid container spacing={2}>
                    {durationPerSceneOptions.map((option) => (
                        <Grid item xs={6} key={option}>
                            <Box display="flex" justifyContent="space-even" alignItems="center">
                                <FormControlLabel
                                    value={option}
                                    control={<Radio />}
                                    label={
                                        <Typography sx={{ color: "white" }}>
                                            {option}
                                        </Typography>
                                    }
                                    disabled={
                                        !isPro &&
                                        (option === "10 seconds")
                                    }
                                />
                                {!isPro &&
                                    (option === "10 seconds") && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1, color: "orange", fontSize: 10 }}
                                        >
                                            Pro
                                        </Typography>
                                    )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
            <div className="flex mt-5 justify-between">
                <Button
                    variant='contained'
                    sx={{ mr: 1 }}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button onClick={() => {
                    setVideoRequest((prev) => ({
                        ...prev,
                        voice,
                        orientation: orientation,
                        duration: convertLengthToDuration(length),
                        durationPerScene: convertLengthToDuration(durationPerScene),
                    }))
                    handleNext();
                }} disabled={!(voice && orientation && length && durationPerScene)} variant='contained'>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default VoiceSelect;