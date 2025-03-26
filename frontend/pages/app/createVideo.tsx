import * as React from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { MdGroupAdd, MdSettings, MdVideoLabel } from 'react-icons/md';
import AppLayout from '@/layouts/app-layout';
import { Box, Button, Typography } from '@mui/material';
import GenerateScript from '@/components/VideoStep/GenerateScript';
import VoiceSelect from '@/components/VideoStep/VoiceSelect';
import ChooseTransition from '@/components/VideoStep/ChooseTransition';
import { useRouter } from 'next/router';

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme }) => ({
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    '& .QontoStepIcon-completedIcon': {
      color: '#784af4',
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: '#784af4',
        },
      },
    ],
  }),
);
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      },
    },
  ],
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement<unknown> } = {
    1: <MdSettings />,
    2: <MdGroupAdd />,
    3: <MdVideoLabel />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Generate prompt or keyword', 'Create an group', 'Create an transition'];
export interface VideoRequest {
  voice: string | null;
  prompt: string;
  orientation: string;
  duration: number;
  durationPerScene: number;
  template: string;
  arrayText: string[]; // Assuming it's an array of strings
}
export default function createVideo() {
  const router = useRouter();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [videoRequest, setVideoRequest] = React.useState<VideoRequest>({
    voice: "",
    prompt: "",
    orientation: "",
    duration: 0,
    durationPerScene: 0,
    template: "",
    arrayText: [], // Add arrayText to the initial state
  });
  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setVideoRequest({
      voice: "",
      prompt: "",
      orientation: "",
      duration: 0,
      durationPerScene: 0,
      template: "",
      arrayText: [],
    })
    setActiveStep(0);
  };

  const handleSubmit = () => {
    const queryParams = videoRequest.prompt
      ? {
        voice: videoRequest.voice,
        prompt: videoRequest.prompt,
        orientation: videoRequest.orientation,
        duration: videoRequest.duration,
        durationPerScene: videoRequest.durationPerScene,
        template: videoRequest.template,
      }
      : {
        arrayText: JSON.stringify(videoRequest.arrayText), // Ensure it's passed as a string
        template: videoRequest.template,
      };
    // Navigate to result page with the appropriate query
    router.push({
      pathname: "/app/result",
      query: queryParams,
    });
  }

  return (
    <AppLayout>
      <Typography variant="h4">Create Video</Typography>
      <br />
      <div className="flex flex-row px-6 gap-4">
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper activeStep={activeStep} connector={<ColorlibConnector />} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}><Typography variant='h6' color='secondary'>{label}</Typography></StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <GenerateScript setVideoRequest={setVideoRequest} handleNext={handleNext} />
                </Box>
              )}
              {activeStep === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <VoiceSelect setVideoRequest={setVideoRequest} handleNext={handleNext} handleBack={handleBack}/>
                </Box>
              )}
              {activeStep === 2 && (
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <ChooseTransition handleSubmit={handleSubmit} setVideoRequest={setVideoRequest} handleBack={handleBack}/>
                </Box>
              )}
            </React.Fragment>
          )}
        </Stack>

      </div>
    </AppLayout>
  );
}
