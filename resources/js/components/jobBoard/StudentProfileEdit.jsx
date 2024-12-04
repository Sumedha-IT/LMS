import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import * as Yup from "yup";
import { useUpdateStudentJobProfileDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name must not exceed 50 characters'),
    currentLocation: Yup.string(),
    experience: Yup.number().required("Experience is required")
});
const StudentProfileEdit = ({ studentProfileData, open, onClose, onProfileUpdate }) => {
    const [updateProfileData] = useUpdateStudentJobProfileDataMutation();
    const formik = useFormik({
        initialValues: {
            name: studentProfileData?.name,
            phone: studentProfileData?.phone,
            email: studentProfileData?.email,
            currentLocation: studentProfileData?.currentLocation,
            experience: +(studentProfileData?.totalExperience) || 0,
            aboutMe: studentProfileData?.aboutMe,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let payload = { data: { ...values } }
            let result = await updateProfileData({  payload }).unwrap();
            if (result.success === true) {
                toast.success("success")
                onProfileUpdate(result.data.profile);
                onClose();
            } else {
                toast.error(result.error?.message)
            }
        },
    });
    useEffect(() => {
        if (studentProfileData) {
            formik.setValues({
                name: studentProfileData?.name,
                phone: studentProfileData?.phone,
                email: studentProfileData?.email,
                currentLocation: studentProfileData?.currentLocation,
                experience: +(studentProfileData?.totalExperience),
                aboutMe: studentProfileData?.aboutMe,
            });
        }
    }, [studentProfileData, onClose])

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Profile Details</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="flex flex-col">
                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Name<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="name"
                            label="Name of the Profile Name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </div>
                    {/* </div> */}
                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Mobile Number</label>
                        <TextField
                            fullWidth
                            id="phone"
                            label="Mobile Number"
                            name="phone"
                            value={formik.values.phone}
                           disabled
                        />
                    </div>

                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Email</label>
                        <TextField
                            fullWidth
                            id="email"
                            label="Enter email"
                            name="email"
                            value={formik.values.email}
                     disabled
                        />
                    </div>

                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Location<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="currentLocation"
                            label="Location"
                            name="currentLocation"
                            value={formik.values.currentLocation}
                            onChange={formik.handleChange}
                            error={formik.touched.currentLocation && Boolean(formik.errors.currentLocation)}
                            helperText={formik.touched.currentLocation && formik.errors.currentLocation}
                        />
                    </div>

                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">Experience<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="experience"
                            label="Experience"
                            name="experience"
                            value={formik.values.experience}
                            disabled
                            onChange={formik.handleChange}
                            error={formik.touched.experience && Boolean(formik.errors.experience)}
                            helperText={formik.touched.experience && formik.errors.experience}
                        />
                    </div>
                    <div className="flex items-center gap-4 my-2">
                        <label className="w-1/3">About Me<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="aboutMe"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            name="aboutMe"
                            value={formik.values.aboutMe}
                            onChange={formik.handleChange}
                            error={formik.touched.aboutMe && Boolean(formik.errors.aboutMe)}
                            helperText={formik.touched.aboutMe && formik.errors.aboutMe}
                        />
                    </div>
                </form>
            </DialogContent>
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

export default StudentProfileEdit
