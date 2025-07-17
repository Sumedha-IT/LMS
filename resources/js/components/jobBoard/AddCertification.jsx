import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import * as Yup from "yup";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { monthOption } from '../../utils/jsonData';
import { useAddStudentCertificateDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    certification: Yup.string().required('Certification Name is required'),
    validStartMonth: Yup.string().required('Certification Validity Month is required'),
    validStartYear: Yup.string().required('Certification Validity Year is required'),
    validEndMonth: Yup.string().required('Certification Validity Month is required'),
    validEndYear: Yup.string().required('Certification Validity Year is required'),
    certificateUrl: Yup.mixed()
        .required('A document file is required')
        .test('fileType', 'Only PDF, DOC, or DOCX files are allowed', (value) =>
            value && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)
        )
        .test('fileSize', 'File size must be less than 5 MB', (value) =>
            value && value.size <= 5 * 1024 * 1024 // 5 MB
        ),
});


const AddCertification = ({ certificateData, open, onClose, onCertificateUpdate, onDataChange }) => {
    const [AddCertificateData] = useAddStudentCertificateDataMutation();
    const formik = useFormik({
        initialValues: {
            certification: certificateData?.name || '',
            validStartMonth: certificateData?.fromDate ? certificateData?.fromDate.substr(5, 2) : '',
            validStartYear: certificateData?.fromDate ? new Date(certificateData.fromDate).getFullYear() : null,
            validEndMonth: certificateData?.toDate ? certificateData?.toDate.substr(5, 2) : '',
            validEndYear: certificateData?.toDate ? new Date(certificateData.toDate).getFullYear() : null,
            certificateUrl: certificateData?.fileId || '',  // Store fileId if available
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                let startYear = values.validStartYear;
                let endYear = values.validEndYear;
                formData.append('name', values.certification);
                formData.append('fromDate', `${startYear}-${values.validStartMonth}-01`);
                formData.append('toDate', `${endYear}-${values.validStartMonth}-28`);
                let result;
                if (values.certificateUrl) formData.append('file', values.certificateUrl);
                if (certificateData && certificateData.hasOwnProperty('id')) {
                    formData.append('id', certificateData?.id);
                    result = await AddCertificateData({  formData }).unwrap();
                } else {
                    result = await AddCertificateData({  formData }).unwrap();
                    onDataChange();
                }
                if (result.success === true) {
                    toast.success("Success");
                    onCertificateUpdate(result.data.certificate);
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
        if (certificateData) {
            formik.setValues({
                certification: certificateData?.name || "",
                validStartMonth: certificateData?.fromDate ? certificateData?.fromDate.substr(5, 2) : "",
                validStartYear: certificateData?.fromDate ? new Date(certificateData.fromDate).getFullYear() : null,
                validEndMonth: certificateData?.toDate ? certificateData?.toDate.substr(5, 2) : "",
                validEndYear: certificateData?.toDate ? new Date(certificateData.toDate).getFullYear() : null,
                certificateUrl: certificateData?.fileId || "",
            });
        }
    }, [certificateData, onClose]);


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
            <DialogTitle>Add Certification</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="grid gap-6 mt-2">
                    {/* Certification Name */}
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Certification Name<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="certification"
                            label="Name of the Certification"
                            name="certification"
                            value={formik.values.certification}
                            onChange={formik.handleChange}
                            error={formik.touched.certification && Boolean(formik.errors.certification)}
                            helperText={formik.touched.certification && formik.errors.certification}
                        />
                    </div>

                    {/* Course Duration */}
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Certification Duration<span className="text-[red]">*</span></label>

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


                    {/* Certification URL */}
                    <div className="flex items-center">
                        {/* <FormControl fullWidth margin="normal"> */}
                        <label className="w-1/4">Certification URL<span className="text-[red]">*</span></label>
                        <div className="mt-2">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                id="certificateUrl"
                                name="certificateUrl"
                                onChange={(e) => {
                                    const file = e.currentTarget.files[0];
                                    formik.setFieldValue('certificateUrl', file);  // Update Formik state with the file
                                }}
                                className="opacity-0 w-0"
                            />
                            {/* Material-UI button styled label for file input */}
                            <label
                                htmlFor="certificateUrl"
                                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-600"
                            >
                                {formik.values?.certificateUrl ? "Change File" : "No file chosen"}
                            </label>

                            {/* Display the selected file name or "No file chosen" */}
                            {/* <Box mt={1}> */}
                            {formik.values?.certificateUrl && formik.values?.certificateUrl.name ? (
                                <>
                                    {formik.values.certificateUrl.name}
                                </>
                            ) : formik.values?.certificateUrl ? (
                                `${formik.values.certificateUrl}.pdf`
                            ) : (
                                "no file chosen"
                            )}

                            {formik.touched.certificateUrl && formik.errors.certificateUrl && (
                                <FormHelperText error>{formik.errors.certificateUrl}</FormHelperText>
                            )}
                        </div>
                    </div>

                </form>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions>
                <Button onClick={() => {
                    formik.resetForm(); // Reset the form when cancel is clicked
                    onClose();  // Close the dialog
                }} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={formik.handleSubmit} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCertification;
