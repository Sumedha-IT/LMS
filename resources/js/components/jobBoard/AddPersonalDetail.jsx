import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import * as Yup from "yup";

import { toast } from 'react-toastify';
import { useUpdateStudentJobProfileDataMutation,useGetCountryAndStatesQuery } from '../../store/service/user/UserService';
const validationSchema = Yup.object({
    birthday: Yup.date().required('Exam date is required'),
    address: Yup.string().required('Address URL is required'),
    country: Yup.string().required('country is required'),
    state: Yup.string().required('state is required'),
});


const AddPersonalDetail = ({ studentProfileData, open, onClose, onProfileUpdate }) => {
    const [updateProfileData] = useUpdateStudentJobProfileDataMutation();
    const [countryStates,setContryStates] = useState([])
    const {data} = useGetCountryAndStatesQuery();
    const [inputValue, setInputValue] = useState('');
    const [languages, setLanguages] = useState([]); 
    const formik = useFormik({
        initialValues: {
            birthday: studentProfileData?.birthday || "",
            languagesKnown: studentProfileData?.languagesKnown || [],
            address: studentProfileData?.address || "",
            country: studentProfileData?.country || "",
            state: studentProfileData?.state || "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
           
            let payload = { data: { ...values } }
            let result = await updateProfileData({ payload }).unwrap();
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
                birthday: studentProfileData?.birthday || "",
                languagesKnown: studentProfileData?.languagesKnown || [],
                address: studentProfileData?.address || "",
                country: studentProfileData?.country || "",
                state: studentProfileData?.state || "",
            });
            setLanguages(studentProfileData?.languagesKnown)
            setContryStates(data.data)
        }
    }, [studentProfileData, onClose])
    const getStatesForCountry = (country) => {
        return countryStates.find((item) => item.country === country)?.states;
    };

     const states = getStatesForCountry(formik.values.country) || [];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
          // Add the language and clear the input field
          setLanguages((prevLanguages) => {
            const newLanguages = [...prevLanguages, inputValue.trim()];
            formik.setFieldValue('languagesKnown', newLanguages);  // Update Formik value
            return newLanguages;
          });
          setInputValue('');  // Clear the input field
        }
      };
    
      // Handle removing a language
      const handleRemoveLanguage = (languageToRemove) => {
        const updatedLanguages = languages.filter((language) => language !== languageToRemove);
        setLanguages(updatedLanguages);
        formik.setFieldValue('languagesKnown', updatedLanguages);  // Update Formik value
      };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Add Personal Detail</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} className="grid gap-6">
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">DOB <span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="birthday"
                            name="birthday"
                            type="date"
                            value={formik.values.birthday}
                            onChange={formik.handleChange}
                            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                            helperText={formik.touched.birthday && formik.errors.birthday}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Languages <span className="text-[red]">*</span></label>
                        <div className="w-full ">
                            <TextField
                                fullWidth
                                id="languagesKnown"
                                label="Languages Known"
                                name="languagesKnown"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                error={formik.touched.languagesKnown && Boolean(formik.errors.languagesKnown)}
                                helperText={formik.touched.languagesKnown && formik.errors.languagesKnown}
                                variant="outlined"
                                margin="normal"
                            />
                              {languages.map((language, index) => (
                                <Chip
                                sx={{gap:1, ml:1}}
                                    key={index}
                                    label={language}
                                    onDelete={() => handleRemoveLanguage(language)}
                                    color="primary"
                                    size="small"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">address<span className="text-[red]">*</span></label>
                        <TextField
                            fullWidth
                            id="address"
                            label=" address"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            helperText={formik.touched.address && formik.errors.address}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">Country<span className="text-[red]">*</span></label>
                        <Select
                            fullWidth
                            id="country"
                            name="country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            error={formik.touched.country && Boolean(formik.errors.country)}
                        >
                            {countryStates.map((option) => (
                                <MenuItem key={option.country} value={option.country}>
                                    {option.country}
                                </MenuItem>
                            ))}

                        </Select>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="w-1/3">State<span className="text-[red]">*</span></label>
                        <Select
                            fullWidth
                            name="state"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            error={formik.touched.state && Boolean(formik.errors.state)}
                        >
                           

                            {states.length === 0 ? (
                                <MenuItem value="">Select a country first</MenuItem>
                            ) : (
                                states.map((state) => (
                                    <MenuItem key={state} value={state}>
                                        {state}
                                    </MenuItem>
                                ))
                            )}

                        </Select>
                    </div>

                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={formik.handleSubmit} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog >
    )
}

export default AddPersonalDetail

