import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useUpdateStudentJobProfileDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';

const AddSocialLink = ({ open, onClose, socialName, onDataChange }) => {

    const [updateProfileData] = useUpdateStudentJobProfileDataMutation();
    console.log(socialName)
    const [socialMediaUrl, setSocialUrl] = useState({ url: '' });

    const handleLinkChange = (event) => {
        setSocialUrl({
            ...socialName,
            url: event.target.value
        });
    };
    useEffect(() => {
        setSocialUrl({ url: socialName.url })

    }, [socialName])

    const handleSave = async () => {
        try {
            let payload = { data: { socialLinks: socialMediaUrl } }
            let result = await updateProfileData({ payload }).unwrap();
            if (result.success === true) {
                toast.success("success")
                onDataChange();
                onClose();
            } else {
                toast.error(result.error?.message || result?.message)
            }

        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Add Link to your {socialName.type} Account
            </DialogTitle>
            <DialogContent>
                <TextField
                    id='name'
                    name='name'
                    label="Add link"
                    placeholder="Paste your link here"
                    fullWidth
                    value={socialMediaUrl.url}
                    onChange={handleLinkChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddSocialLink
