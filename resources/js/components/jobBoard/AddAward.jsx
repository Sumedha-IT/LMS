import { Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect } from 'react';
import * as Yup from "yup";
import { monthOption } from '../../utils/jsonData';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateStudentAwardDataMutation, useAddStudentAwardDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    validStartMonth: Yup.string().required('Month is required'),
    validStartYear: Yup.number().nullable().required('Year is required').typeError('Year must be a valid number'),
});
const AddAward = ({ open, onClose, awards, awardsUpdate, onDataChange }) => {
    const [updateAwardData] = useUpdateStudentAwardDataMutation();
    const [addAwardata] = useAddStudentAwardDataMutation();
    const formik = useFormik({
        initialValues: {
            name: awards.name,
            description: awards.description,
            validStartMonth: awards?.issueAt ? awards?.issueAt.substr(5, 2) : "",
            validStartYear: awards?.issueAt ? new Date(awards.issueAt).getFullYear() : null,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let startYear = values.validStartYear;  // This will be a number (or null)
                let payload = {
                    data: {
                        name: values.name,
                        description: values.description,
                        issueAt: `${startYear ? startYear : ''}-${values.validStartMonth}-01`
                    }
                }
                let result;
                if (awards && awards.hasOwnProperty('id')) {
                    result = await updateAwardData({ payload, awardId: awards.id, }).unwrap();
                } else {
                    result = await addAwardata({ payload }).unwrap();
                    onDataChange();
                }
                if (result.success === true) {
                    toast.success("Success");
                    awardsUpdate(result.data.awards);
                    formik.resetForm();
                    onClose();
                } else {
                    toast.error(result.error?.message);
                }
            } catch (error) {
                toast.error(error?.data.message);
                console.log(error);
            }
        },
    });

    useEffect(() => {
        if (awards) {
            formik.setValues({
                name: awards?.name || "",
                description: awards?.description || "",
                validStartMonth: awards?.issueAt ? awards?.issueAt.substr(5, 2) : "",
                validStartYear: awards?.issueAt ? new Date(awards.issueAt).getFullYear() : null,
            });
        }
    }, [awards, onClose]);
    const handleStartYearChange = (date) => {
        if (date) {
            formik.setFieldValue('validStartYear', date.getFullYear());
        } else {
            formik.setFieldValue('validStartYear', null); // Explicitly set to null if no date is selected
        }
    };

    return (
        <Dialog open={open} onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    width: '50%',
                },
            }}>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="flex flex-col">
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Name<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="name"
                            label="Name of the name"
                            name="name"
                            margin="normal"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </div>
                    <div className="flex items-center my-2 gap-4">
                        <label className="text-center">Description<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Course Duration<span className="text-[red]">*</span></label>

                        {/* Start Month */}
                        <FormControl className='w-1/4' margin="normal">
                            <InputLabel>Start Month</InputLabel>
                            <Select
                                label="Start Month"
                                name="validStartMonth"
                                value={formik.values.validStartMonth || ""}
                                onChange={formik.handleChange}
                                error={formik.touched.validStartMonth && Boolean(formik.errors.validStartMonth)}
                                helperText={formik.touched.validStartMonth && formik.errors.validStartMonth}
                            >
                                {monthOption.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Start Year */}
                        <FormControl className='w-1/4' margin="normal">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year']}
                                    label="Start Year"
                                    value={formik.values.validStartYear ? new Date(formik.values.validStartYear, 0) : null} // Convert number to Date or null
                                    onChange={handleStartYearChange}
                                    error={formik.touched.validStartYear && Boolean(formik.errors.validStartYear)}
                                    helperText={formik.touched.validStartYear && formik.errors.validStartYear}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={formik.handleSubmit} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddAward
