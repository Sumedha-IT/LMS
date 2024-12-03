import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import * as Yup from "yup";
import { useUpdateStudentProjectDataMutation, useAddStudentProjectDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';
import { monthOption } from '../../utils/jsonData';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useParams } from 'react-router-dom';
const validationSchema = Yup.object({
    name: Yup.string().required('Name of the Project is required').min(3, 'Name must be at least 3 characters'),
    description: Yup.string().required('Project Duration is required'),
    validStartMonth: Yup.string().required('Start Month is required'),
    validStartYear: Yup.number().nullable().required('Start Year is required').typeError('Start Year must be a valid number'),
    validEndMonth: Yup.string().required('End Month is required'),
    validEndYear: Yup.number().nullable().required('End Year is required').typeError('End Year must be a valid number'),
});

const AddProject = ({ projectData, open, onClose, onProjectUpdate, onDataChange }) => {
    const [UpdateProjectData] = useUpdateStudentProjectDataMutation();
    const [AddProjectData] = useAddStudentProjectDataMutation();
    const formik = useFormik({
        initialValues: {
            name: projectData.name,
            description: projectData.description,
            validStartMonth: projectData?.startedAt ? projectData?.startedAt.substr(5, 2) : "",
            validStartYear: projectData?.startedAt ? new Date(projectData.startedAt).getFullYear() : null,  // Ensure it's null if no value
            validEndMonth: projectData?.endsAt ? projectData?.endsAt.substr(5, 2) : "",
            validEndYear: projectData?.endsAt ? new Date(projectData.endsAt).getFullYear() : null,  // Ensure it's null if no value
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let startYear = values.validStartYear;  // This will be a number (or null)
                let endYear = values.validEndYear;      // This will be a number (or null)
                let payload = {
                    data: {
                        name: values.name,
                        description: values.description,
                        startedAt: `${startYear ? startYear : ''}-${values.validStartMonth}-01`, // Handle null year case
                        endsAt: `${endYear ? endYear : ''}-${values.validEndMonth}-28`,       // Handle null year case
                    }
                }
                let result;
                if (projectData && projectData.hasOwnProperty('id')) {
                    result = await UpdateProjectData({ id: projectData.id,payload }).unwrap();
                } else {
                    result = await AddProjectData({payload }).unwrap();
                    onDataChange();
                }
                if (result.success === true) {
                    toast.success("Success");
                    onProjectUpdate(result.data.projects);
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
        if (projectData) {
            formik.setValues({
                name: projectData.name || "",
                description: projectData.description || "",
                validStartMonth: projectData?.startedAt ? projectData?.startedAt.substr(5, 2) : "",
                validStartYear: projectData?.startedAt ? new Date(projectData.startedAt).getFullYear() : null,
                validEndMonth: projectData?.endsAt ? projectData?.endsAt.substr(5, 2) : "",
                validEndYear: projectData?.endsAt ? new Date(projectData.endsAt).getFullYear() : null,
            });
        }
    }, [projectData, onClose]);
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
            <DialogTitle>Add Projects</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="grid gap-6">
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Project Title<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="name"
                            label="Project Title"
                            name="name"
                            margin="normal"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Project Description<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="description"
                            label="Project Description"
                            name="description"
                            margin="normal"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Project Duration<span className="text-[red]">*</span></label>

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
                <Button onClick={formik.handleSubmit} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddProject
