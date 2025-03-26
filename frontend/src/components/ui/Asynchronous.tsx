import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { voices } from '../../../utils/common';

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

type AsynchronousProps = {
  setVoice: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Asynchronous({ setVoice }: AsynchronousProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);

      setOptions(voices);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div className='flex w-full'>
      <Autocomplete
        fullWidth
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        onChange={(event, newValue) => setVoice(newValue)}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={(option) => option}
        options={options}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a voice"
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
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
      />
    </div>
  );
}