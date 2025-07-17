import { Box, Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useUpdateStudentJobProfileDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';

const AddOtherDetails = ({ open, onClose, otherDetails, otherUpdate }) => {
    const [updateProfileData] = useUpdateStudentJobProfileDataMutation();
    const [editorContent, setEditorContent] = useState('');
    useEffect(() => {
        if (otherDetails) {
            setEditorContent(otherDetails)
        }
    }, [otherDetails, onClose]);
    // Handle change in editor content
    const handleChange = (e) => {
        console.log(e.target.value)
        setEditorContent(e.target.value);
    };

    const handleSubmit = async() => {
        console.log('Editor content submitted:', editorContent);
        let payload = { data: { otherDetails:editorContent } }
        let result = await updateProfileData({  payload }).unwrap();
        if (result.success === true) {
            toast.success("success")
            otherUpdate(result.data.profile);
            onClose();
        } else {
            toast.error(result.error?.message)
        }
    };

    return (

        <Dialog open={open} onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    width: '100%',
                },
            }}>
            <DialogContent>
                <div className="flex items-center my-2 gap-4">
                    <label className="text-center">Other Details<span className="text-[red]">*</span></label>
                    <TextField
                            fullWidth
                            id="description"
                            label="Description"
                            multiline
                            rows={4}
                            variant="outlined"
                            name="description"
                            value={editorContent}
                            onChange={(e)=>handleChange(e)}
                        />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">Cancel</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddOtherDetails
