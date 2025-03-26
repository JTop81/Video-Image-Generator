import React, { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid2 as Grid,
    Typography,
} from "@mui/material";
import { VideoRequest } from "../../../pages/app/createVideo";
type ChooseTransitionProps = {
    handleSubmit: () => void;
    setVideoRequest: React.Dispatch<React.SetStateAction<VideoRequest>>;
    handleBack: () => void;
}
const ChooseTransition = ({ handleSubmit, setVideoRequest, handleBack }: ChooseTransitionProps) => {
    const [template, setTemplate] = useState("");
    // Handle template selection
    const handleTemplateSelect = (name: string) => {
        setTemplate(name)
        setVideoRequest((prev) => ({
            ...prev,
            template: name
        }));
    };

    return (
        <div className="flex flex-col w-full">
            <Typography variant="h4">Choose Your Template</Typography>
            <br />
            <Grid
                container
                spacing={{
                    xs: 2,
                    md: 3,
                }}
                columns={{
                    xs: 4,
                    sm: 8,
                    md: 12,
                }}
                sx={{
                    display: "flex",
                    flexDirection: "row", // Ensure children are in a single row
                    justifyContent: "space-between", // Adjust spacing between items
                    flexWrap: "nowrap", // Prevent wrapping to the next line
                }}
            >
                {[{ id: 1, name: "Static" }, { id: 2, name: "Classic Fade" }, { id: 3, name: "Modern Slide" }].map((val) => (
                    <Grid
                        item
                        xs={2}
                        sm={4}
                        md={4}
                        key={val.id}
                        component="div"
                    >
                        <Card
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                cursor: "pointer",
                                backgroundColor: template === val.name && "orange",
                            }}
                            onClick={() => handleTemplateSelect(`${val.name}`)}
                        >
                            <CardMedia
                                component="img"
                                image={`https://picsum.photos/1000/1000?random=${val.id}`}
                                alt={`Template ${val.id}`}
                                sx={{ aspectRatio: 2 / 1 }}
                            />
                            <CardContent>
                                <Typography>{val.name}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <div className="flex justify-between mt-5">
                <Button
                    variant='contained'
                    sx={{ mr: 1 }}
                    onClick={handleBack}
                >
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={!template} variant='contained'>
                    Start generate
                </Button>
            </div>
        </div>
    )
}

export default ChooseTransition;
