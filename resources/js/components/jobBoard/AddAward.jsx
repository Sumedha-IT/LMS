import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useUpdateStudentJobProfileDataMutation } from '../../store/service/user/UserService';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';  // Import Quill wrapper
import 'react-quill/dist/quill.snow.css';
const AddAward = ({ open, onClose, awards, awardsUpdate }) => {
    const [updateProfileData] = useUpdateStudentJobProfileDataMutation();
    const [editorContent, setEditorContent] = useState('');
    useEffect(() => {
        if (awards) {
            setEditorContent(awards)
        }
    }, [awards, onClose]);
    // Handle change in editor content
    const handleChange = (value) => {
        setEditorContent(value);
    };

    const handleSubmit = async() => {
        console.log('Editor content submitted:', editorContent);
        let payload = { data: { achievements:editorContent } }
        let result = await updateProfileData({  payload }).unwrap();
        if (result.success === true) {
            toast.success("success")
            awardsUpdate(result.data.profile);
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
                    <label className="text-center">Description<span className="text-[red]">*</span></label>
                    <ReactQuill
                        value={editorContent}
                        onChange={handleChange}
                        theme="snow"
                        style={{ height: '300px' }}
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

export default AddAward
