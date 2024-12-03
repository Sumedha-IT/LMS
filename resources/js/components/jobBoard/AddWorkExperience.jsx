import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import * as Yup from "yup";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { monthOption } from '../../utils/jsonData';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAddStudentExperienceDataMutation, useUpdateStudentExperienceDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';
const validationSchema = Yup.object({
    organisation: Yup.string().required('Name of the Institute is required'),
    jobRole: Yup.string().required('Degree is required'),
    jobType: Yup.string().required('Course Type is required'),
});

const AddWorkExperience = ({ experienceData, open, onClose, onExperienceUpdate, onDataChange }) => {
    const [AddExperienceData] = useAddStudentExperienceDataMutation();
    const [UpdateExperienceData] = useUpdateStudentExperienceDataMutation();
    const formik = useFormik({
        initialValues: {
            organisation: experienceData.organisation,
            jobRole: experienceData.jobRole,
            jobType: experienceData.jobType,
            validStartMonth: experienceData?.startedAt ? experienceData?.startedAt.substr(5, 2) : "",
            validStartYear: experienceData?.startedAt ? new Date(experienceData.startedAt).getFullYear() : null,  // Ensure it's null if no value
            validEndMonth: experienceData?.endsAt ? experienceData?.endsAt.substr(5, 2) : "",
            validEndYear: experienceData?.endsAt ? new Date(experienceData.endsAt).getFullYear() : null,  // Ensure it's null if no value
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onClose();
        },
    });

    useEffect(() => {
        if (experienceData) {
            formik.setValues({
                organisation: experienceData?.organisation || "",
                jobRole: experienceData?.jobRole || "",
                jobType: experienceData?.jobType || "",
                validStartMonth: experienceData?.startedAt ? experienceData?.startedAt.substr(5, 2) : "",
                validStartYear: experienceData?.startedAt ? new Date(experienceData.startedAt).getFullYear() : null,  // Ensure it's null if no value
                validEndMonth: experienceData?.endsAt ? experienceData?.endsAt.substr(5, 2) : "",
                validEndYear: experienceData?.endsAt ? new Date(experienceData.endsAt).getFullYear() : null,  // Ensure it's null if no value
            });
        }
    }, [experienceData, onClose])
    const handleSave = async () => {
        try {
            let startYear = formik.values.validStartYear;  // This will be a number (or null)
            let endYear = formik.values.validEndYear;
            let payload = {
                data: {
                    organisation: formik.values.organisation,
                    jobRole: formik.values.jobRole,
                    jobType: formik.values.jobType,
                    startedAt: `${startYear}-${formik.values.validStartMonth}-01`,
                    endsAt: `${endYear}-${formik.values.validEndMonth}-28`,
                }
            }
            let result;
            if (experienceData && experienceData.hasOwnProperty('id')) {
                result = await UpdateExperienceData({ id: experienceData.id,  payload }).unwrap();
            } else {
                result = await AddExperienceData({ payload }).unwrap();
                onDataChange();
            }
            if (result.success === true) {
                toast.success("success")
                onExperienceUpdate(result.data.profileExperience);
                formik.resetForm();
                onClose();
            } else {
                toast.error(result.error?.message)
            }

        } catch (error) {
            console.log(error)
        }
    };
    const handleStartYearChange = (date) => {
        if (date) {
            formik.setFieldValue('validStartYear', date.getFullYear());
        } else {
            formik.setFieldValue('validStartYear', null); // Explicitly set to null if no date is selected
        }
    };

    const handleEndYearChange = (date) => {
        if (date) {
            formik.setFieldValue('validEndYear', date.getFullYear());
        } else {
            formik.setFieldValue('validEndYear', null); // Explicitly set to null if no date is selected
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Add WorkExperience
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="flex flex-col ">
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Name of the Organisation<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="organisation"
                            label="Name of the Organisation"
                            name="organisation"
                            margin="normal"
                            value={formik.values.organisation}
                            onChange={formik.handleChange}
                            error={formik.touched.organisation && Boolean(formik.errors.organisation)}
                            helperText={formik.touched.organisation && formik.errors.organisation}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className='w-1/3'>Position<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="jobRole"
                            label="Job/Degree"
                            value={formik.values.jobRole}
                            onChange={formik.handleChange}
                            error={formik.touched.jobRole && Boolean(formik.errors.jobRole)}
                            helperText={formik.touched.jobRole && formik.errors.jobRole}
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="w-1/3">Job Types<span className="text-[red]">*</span></label>

                        {/* Nature of Employment */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formik.values.jobType === 'full_time'}
                                        onChange={formik.handleChange}
                                        value="full_time"
                                        name="jobType"
                                    />
                                }
                                label="Full time"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formik.values.jobType === 'part_time'}
                                        onChange={formik.handleChange}
                                        value="part_time"
                                        name="jobType"
                                    />
                                }
                                label="Part time"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formik.values.jobType === 'contractual'}
                                        onChange={formik.handleChange}
                                        value="contractual"
                                        name="jobType"
                                    />
                                }
                                label="Contractual"
                            />
                        </div>
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

                        <Typography mt={5}>to</Typography>

                        {/* End Month */}
                        <FormControl className='w-1/4' margin="normal">
                            <InputLabel>End Month</InputLabel>
                            <Select
                                label="End Month"
                                name="validEndMonth"
                                value={formik.values.validEndMonth || ""}
                                onChange={formik.handleChange}
                                error={formik.touched.validEndMonth && Boolean(formik.errors.validEndMonth)}
                                helperText={formik.touched.validEndMonth && formik.errors.validEndMonth}
                            >
                                {monthOption.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* End Year */}
                        <FormControl className='w-1/4' margin="normal">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year']}
                                    label="End Year"
                                    value={formik.values.validEndYear ? new Date(formik.values.validEndYear, 0) : null} // Convert number to Date or null
                                    onChange={handleEndYearChange}
                                    error={formik.touched.validEndYear && Boolean(formik.errors.validEndYear)}
                                    helperText={formik.touched.validEndYear && formik.errors.validEndYear}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                    </div>
                </form>
            </DialogContent >
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddWorkExperience





