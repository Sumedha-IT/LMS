import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from "yup";
import { monthOption, courses } from '../../utils/jsonData';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useUpdateStudentEducationDataMutation, useAddStudentEducationDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    institute: Yup.string().required('Name of the Institute is required').min(3, 'Name must be at least 3 characters'),
    degreeType: Yup.string().required('Degree Type is required'),
    course: Yup.string().required('Course is required'),
    validStartMonth: Yup.string().required('Start Month is required'),
    validStartYear: Yup.number().nullable().required('Start Year is required').typeError('Start Year must be a valid number'),
    validEndMonth: Yup.string().required('End Month is required'),
    validEndYear: Yup.number().nullable().required('End Year is required').typeError('End Year must be a valid number'),
    result:Yup.number().typeError('Result must be a number').integer('Result must be an integer') .required('Result is required'),
});

const AddEducation = ({ educationData, open, onClose, onEductionsUpdate, onDataChange }) => {
    const [UpdateEducationData] = useUpdateStudentEducationDataMutation();
    const [AddEducationData] = useAddStudentEducationDataMutation();

    const formik = useFormik({
        initialValues: {
            institute: educationData.institute,
            degreeType: educationData.degreeType,
            course: educationData.course,
            validStartMonth: educationData?.startedAt ? educationData?.startedAt.substr(5, 2) : "",
            validStartYear: educationData?.startedAt ? new Date(educationData.startedAt).getFullYear() : null,  // Ensure it's null if no value
            validEndMonth: educationData?.endsAt ? educationData?.endsAt.substr(5, 2) : "",
            validEndYear: educationData?.endsAt ? new Date(educationData.endsAt).getFullYear() : null,  // Ensure it's null if no value
            result: educationData.result,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                let startYear = values.validStartYear;  // This will be a number (or null)
                let endYear = values.validEndYear;      // This will be a number (or null)
                let payload = {
                    data: {
                        institute: values.institute,
                        degreeType: values.degreeType,
                        course: values.course,
                        gradeType: "percentage",
                        result: values.result,
                        startedAt: `${startYear ? startYear : ''}-${values.validStartMonth}-01`, // Handle null year case
                        endsAt: `${endYear ? endYear : ''}-${values.validEndMonth}-28`,       // Handle null year case
                    }
                }
                let result;
                if (educationData && educationData.hasOwnProperty('id')) {
                    result = await UpdateEducationData({ id: educationData.id,  payload }).unwrap();
                } else {
                    result = await AddEducationData({  payload }).unwrap();
                    onDataChange();
                }
                if (result.success === true) {
                    toast.success("Success");
                    onEductionsUpdate(result.data.profileEducation);
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
        if (educationData) {
            formik.setValues({
                institute: educationData?.institute || "",
                degreeType: educationData?.degreeType || "",
                course: educationData?.course || "",
                validStartMonth: educationData?.startedAt ? educationData?.startedAt.substr(5, 2) : "",
                validStartYear: educationData?.startedAt ? new Date(educationData.startedAt).getFullYear() : null,
                validEndMonth: educationData?.endsAt ? educationData?.endsAt.substr(5, 2) : "",
                validEndYear: educationData?.endsAt ? new Date(educationData.endsAt).getFullYear() : null,
                result: educationData?.result || "",
            });
        }
    }, [educationData, onClose]);

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
    const getStatesForCountry = (country) => {
        console.log(country)
        const countryObj = courses.find((item) => item.value === country);
        return countryObj ? countryObj.course : [];
    };

    const courceName = getStatesForCountry(formik.values.degreeType);


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add Education</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="flex flex-col">
                    {/* Institute Name */}
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Name of the Institute<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="institute"
                            label="Name of the Institute"
                            name="institute"
                            margin="normal"
                            value={formik.values.institute}
                            onChange={formik.handleChange}
                            error={formik.touched.institute && Boolean(formik.errors.institute)}
                            helperText={formik.touched.institute && formik.errors.institute}
                        />
                    </div>

                    {/* Degree Type */}
                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Type of Degree<span className="text-[red]">*</span></label>
                        <Select
                            fullWidth
                            id="degreeType"
                            name="degreeType"
                            value={formik.values.degreeType}
                            onChange={formik.handleChange}
                            error={formik.touched.degreeType && Boolean(formik.errors.degreeType)}
                            helperText={formik.touched.degreeType && formik.errors.degreeType}
                            inputProps={{
                                'aria-label': 'Degree Type'
                            }}
                        >
                             {courses.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))} 
                        </Select>
                    </div>

                    {/* Course Name */}
                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Course Name<span className="text-[red]">*</span></label>
                        <Select
                            fullWidth
                            id="course"
                            name="course"
                            value={formik.values.course}
                            onChange={formik.handleChange}
                            error={formik.touched.course && Boolean(formik.errors.course)}
                            helperText={formik.touched.course && formik.errors.course}
                        >
                             {courceName.length === 0 ? (
                                <MenuItem value="">Select a country first</MenuItem>
                            ) : (
                                courceName.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </div>

                    {/* Start and End Year */}
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

                    {/* Result */}
                    <div className="flex items-center gap-4">
                        <label className='w-1/3'>Percentage<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="result"
                            label="Result"
                            name="result"
                            margin="normal"
                            value={formik.values.result}
                            onChange={formik.handleChange}
                            error={formik.touched.result && Boolean(formik.errors.result)}
                            helperText={formik.touched.result && formik.errors.result}
                        />
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={formik.handleSubmit} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEducation;






