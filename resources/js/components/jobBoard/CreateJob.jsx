import { Button, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from "yup";
import { jobStatus, jobType, officePolicy, jobSource } from '../../utils/jsonData';
import { toast } from 'react-toastify';
import { useAddJobDataMutation, useUpdateJobDataMutation } from '../../store/service/user/UserService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
const validationSchema = Yup.object({
    name: Yup.string().required('Role name is required').min(3, 'Role must be at least 3 characters'),
    company: Yup.string().required('Name of the company is required').min(3, 'Name must be at least 3 characters'),
    status: Yup.string().required('status is required'),
    jobType: Yup.string().required('jobType is required'),
    officePolicy: Yup.string().required('officePolicy is required'),
    location: Yup.string().required('location is required'),
});

const CreateJob = () => {
    const location = useLocation();
    const { jobData } = location?.state || [];
    const [UpdatejobData] = useUpdateJobDataMutation();
    const [AddjobData] = useAddJobDataMutation();
    const { id } = useParams();
    const nav = useNavigate();
    const formik = useFormik({
        initialValues: {
            name: jobData?.name || "",
            company: jobData?.company || "",
            status: jobData?.status || "",
            jobType: jobData?.jobType || "",
            location: jobData?.location || "",
            officePolicy: jobData?.officePolicy || "",
            // jobSource: jobData?.jobSource || "",
            expiredAt: jobData?.expiredAt || "",
            description: jobData?.description || "",
            minExperience: jobData?.minExperience || "",
            maxExperience: jobData?.maxExperience || "",
            salary: jobData?.salary || "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                values.teamIds = [1];
                const payload = { data: values }
                let result;
                if (jobData && jobData.hasOwnProperty('id')) {
                    result = await UpdatejobData({  payload, jobId: jobData.id })
                } else {
                    result = await AddjobData({  payload })
                }
                console.log("dnifhk", result)
                if (result.success === true || result.data.success === true) {
                    toast.success(result.message || result.data.message);
                    formik.resetForm();
                    nav(`/administrator/${id}/job-boards`)

                } else {
                    toast.error(result.error?.message || result?.error.data.message);
                }

            } catch (error) {
                console.error("Error submitting form", error);
                toast.error("Failed to create job. Please try again.");
            }
        },
    });

    useEffect(() => {
        console.log(jobData)
        if (jobData) {
            formik.setValues({
                name: jobData?.name || "",
                company: jobData?.company || "",
                status: jobData?.status || "",
                jobType: jobData?.jobType || "",
                location: jobData?.location || "",
                officePolicy: jobData?.officePolicy || "",
                // jobSource: jobData?.jobSource || "",
                expiredAt: jobData?.expiredAt || "",
                description: jobData?.description || "",
                minExperience: jobData?.minExperience || "",
                maxExperience: jobData?.maxExperience || "",
                salary: jobData?.salary || "",
            });
        }
    }, [jobData]);
    const handleClose = () => {
        nav(`/user/${id}/jobboard`)
    }

    return (
        <div className="bg-gray-100 flex justify-center items-center px-8">
            <div className="md:px-0 px-6 w-full ">
                <div className="w-full p-6 overflow-y-auto">
                    {jobData && jobData?.id ? <h2 className="text-2xl font-bold mb-3 text-center">Edit Job</h2> : <h2 className="text-2xl font-bold mb-3 text-center">Create Job</h2>}
                    <form onSubmit={formik.handleSubmit} className="grid gap-6">
                        {/* company Name */}
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Name of the company<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="company"
                                label="Name of the company"
                                name="company"
                                margin="normal"
                                value={formik.values.company}
                                onChange={formik.handleChange}
                                error={formik.touched.company && Boolean(formik.errors.company)}
                                helperText={formik.touched.company && formik.errors.company}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Role<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="name"
                                label="Name of the Role"
                                name="name"
                                margin="normal"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>

                        {/* Degree Type */}
                        <div className="flex items-center gap-4 my-2">
                            <label className="w-1/3">Type of status<span className="text-[red]">*</span></label>
                            <Select
                                fullWidth
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                                helperText={formik.touched.status && formik.errors.status}
                            >
                                {jobStatus.map((option) => (
                                    <MenuItem key={option.value} value={option.value} >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        {/* jobType Name */}
                        <div className="flex items-center gap-4 my-2">
                            <label className="w-1/3">job Type<span className="text-[red]">*</span></label>
                            <Select
                                fullWidth
                                id="jobType"
                                name="jobType"
                                value={formik.values.jobType}
                                onChange={formik.handleChange}
                                error={formik.touched.jobType && Boolean(formik.errors.jobType)}
                                helperText={formik.touched.jobType && formik.errors.jobType}
                            >
                                {jobType.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Minimum Experience<span className="text-[red]">*</span></label>
                            <TextField
                                type='number'
                                fullWidth
                                id="minExperience"
                                label="Minimum Experience"
                                name="minExperience"
                                margin="normal"
                                value={formik.values.minExperience}
                                onChange={formik.handleChange}
                                error={formik.touched.minExperience && Boolean(formik.errors.minExperience)}
                                helperText={formik.touched.minExperience && formik.errors.minExperience}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Maximum Experience<span className="text-[red]">*</span></label>
                            <TextField
                                type='number'
                                fullWidth
                                id="maxExperience"
                                label="Maximum Experience"
                                name="maxExperience"
                                margin="normal"
                                value={formik.values.maxExperience}
                                onChange={formik.handleChange}
                                error={formik.touched.maxExperience && Boolean(formik.errors.maxExperience)}
                                helperText={formik.touched.maxExperience && formik.errors.maxExperience}
                            />
                        </div>
                        <div className="flex items-center gap-4 my-2">
                            <label className="w-1/3">Office Policy<span className="text-[red]">*</span></label>
                            <Select
                                fullWidth
                                id="officePolicy"
                                name="officePolicy"
                                value={formik.values.officePolicy}
                                onChange={formik.handleChange}
                                error={formik.touched.officePolicy && Boolean(formik.errors.officePolicy)}
                                helperText={formik.touched.officePolicy && formik.errors.officePolicy}
                            >
                                {officePolicy.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Location<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="location"
                                label="Location"
                                name="location"
                                margin="normal"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Description<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="description"
                                label="description"
                                name="description"
                                margin="normal"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Salary<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="salary"
                                label="salary"
                                name="salary"
                                margin="normal"
                                type='number'
                                value={formik.values.salary}
                                onChange={formik.handleChange}
                                error={formik.touched.salary && Boolean(formik.errors.salary)}
                                helperText={formik.touched.salary && formik.errors.salary}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="w-1/3">Job Expired<span className="text-[red]">*</span></label>
                            <TextField
                                fullWidth
                                id="expiredAt"
                                name="expiredAt"
                                margin="normal"
                                type='date'
                                value={formik.values.expiredAt}
                                onChange={formik.handleChange}
                                error={formik.touched.expiredAt && Boolean(formik.errors.expiredAt)}
                                helperText={formik.touched.expiredAt && formik.errors.expiredAt}
                            />
                        </div>
                        {/* <div className="flex items-center gap-4 my-2">
                            <label className="w-1/3">Job Sourcey<span className="text-[red]">*</span></label>
                            <Select
                                fullWidth
                                id="jobSource"
                                name="jobSource"
                                value={formik.values.jobSource}
                                onChange={formik.handleChange}
                                error={formik.touched.jobSource && Boolean(formik.errors.jobSource)}
                                helperText={formik.touched.jobSource && formik.errors.jobSource}
                            >
                                {jobSource.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div> */}
                        <div className="flex justify-end">
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                            >
                                Submit
                            </Button>
                            <Button
                                sx={{ ml: 2 }}
                                color="secondary"
                                variant="outlined"
                                type="button"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateJob;




// try {
//     let startYear = values.validStartYear;  // This will be a number (or null)
//     let endYear = values.validEndYear;      // This will be a number (or null)
//     let payload = {
//         data: {
//             company: values.company,
//             status: values.status,
//             jobType: values.jobType,
//             gradeType: "percentage",
//             result: values.result,
//             startedAt: `${startYear ? startYear : ''}-${values.validStartMonth}-01`, // Handle null year case
//             endsAt: `${endYear ? endYear : ''}-${values.validEndMonth}-28`,       // Handle null year case
//         }
//     }
//     let result;
//     if (jobData && jobData.hasOwnProperty('id')) {
//         result = await UpdatejobData({ id: jobData.id, userId: '7', payload }).unwrap();
//     } else {
//         result = await AddjobData({ userId: '7', payload }).unwrap();
//     }
//     console.log("mohitbhati", result)
//     if (result.success === true) {
//         toast.success("Success");
//         onEductionsUpdate(result.data.profileEducation);
//         onClose();
//     } else {
//         toast.error(result.error?.message);
//     }
// } catch (error) {
//     toast.error(error?.data.message);
//     console.log(error);
// }





