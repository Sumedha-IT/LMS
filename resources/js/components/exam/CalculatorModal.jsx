import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Grid } from '@mui/material';

const CalculatorModal = ({ open, onClose }) => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    const handleButtonClick = (value) => {
        setInput((prev) => prev + value);
    };

    const handleClear = () => {
        setInput('');
        setResult('');
    };

    const handleBackspace = () => {
        setInput((prev) => prev.slice(0, -1));
    };

    const handleCalculate = () => {
        try {
            // eslint-disable-next-line no-eval
            const evalResult = eval(input);
            setResult(evalResult);
        } catch {
            setResult('Error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Calculator</DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    <TextField
                        value={input}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        value={result}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        variant="outlined"
                        placeholder="Result"
                    />
                </Box>
                <Grid container spacing={1}>
                    {[['7','8','9','/'],['4','5','6','*'],['1','2','3','-'],['0','.','=','+']].map((row, i) => (
                        <Grid container item spacing={1} key={i}>
                            {row.map((item) => (
                                <Grid item xs={3} key={item}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => {
                                            if (item === '=') handleCalculate();
                                            else handleButtonClick(item);
                                        }}
                                    >
                                        {item}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                    <Grid container item spacing={1}>
                        <Grid item xs={6}>
                            <Button variant="outlined" fullWidth onClick={handleClear}>C</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="outlined" fullWidth onClick={handleBackspace}>⌫</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CalculatorModal; 