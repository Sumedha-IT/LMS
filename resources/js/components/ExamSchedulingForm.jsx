import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import 'tailwindcss/tailwind.css';

const validationSchema = Yup.object({
  examDate: Yup.date().required('Exam date is required'),
  title: Yup.string().required('Title is required'),
  subjectName: Yup.string().required('Subject name is required'),
  classYear: Yup.string().required('Batch year is required'),
  timeSlot: Yup.string().required('Time slot is required'),
  roomNumber: Yup.string().required('Room number is required'),
  maxMarks: Yup.number().required('Maximum marks are required').min(0, 'Marks cannot be negative'),
  minMarks: Yup.number().required('Minimum marks are required').min(0, 'Marks cannot be negative'),
  numQuestions: Yup.number().required('Number of questions is required').min(1, 'There must be at least one question'),
});

const ExamScheduling = ({ onExamSchedule }) => {
  const [invigilators, setInvigilators] = useState([{ name: '', contact: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const formik = useFormik({
    initialValues: {
      examDate: '',
      title: '',
      subjectName: '',
      classYear: '',
      timeSlot: '',
      roomNumber: '',
      maxMarks: '',
      minMarks: '',
      numQuestions: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setConfirmationOpen(true);  // Show confirmation modal
    },
  });

  const handleInvigilatorChange = (index, event) => {
    const { name, value } = event.target;
    const newInvigilators = [...invigilators];
    newInvigilators[index][name] = value;
    setInvigilators(newInvigilators);
  };

  const addInvigilatorFields = () => {
    setInvigilators([...invigilators, { name: '', contact: '' }]);
  };

  const removeInvigilatorFields = (index) => {
    const newInvigilators = invigilators.filter((_, i) => i !== index);
    setInvigilators(newInvigilators);
  };

  const handleConfirmSubmit = () => {
    setIsReadOnly(true);  // Make all fields read-only
    setIsSubmitting(true);
    setConfirmationOpen(false);

    // Proceed with form submission
    const examDetails = {
      ...formik.values,
      invigilators
    };
    onExamSchedule(examDetails);
  };

  const handleCancelSubmit = () => {
    setConfirmationOpen(false);
  };

  return (
    <div className="md:px-0 px-6 ">
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg overflow-y-auto" style={{ maxHeight: '98vh' }}>
        <h2 className="text-2xl font-bold mb-3 text-center">Schedule an Exam</h2>
        <form onSubmit={formik.handleSubmit} className="grid gap-6">
          <TextField
            fullWidth
            id="examDate"
            name="examDate"
            label="Exam Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formik.values.examDate}
            onChange={formik.handleChange}
            error={formik.touched.examDate && Boolean(formik.errors.examDate)}
            helperText={formik.touched.examDate && formik.errors.examDate}
            InputProps={{
              readOnly: isReadOnly,
            }}
          />
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            InputProps={{
              readOnly: isReadOnly,
            }}
          />
          <TextField
            fullWidth
            id="subjectName"
            name="subjectName"
            label="Subject Name"
            select
            value={formik.values.subjectName}
            onChange={formik.handleChange}
            error={formik.touched.subjectName && Boolean(formik.errors.subjectName)}
            helperText={formik.touched.subjectName && formik.errors.subjectName}
            InputProps={{
              readOnly: isReadOnly,
            }}
          >
            <MenuItem value="react">React</MenuItem>
            <MenuItem value="english">English</MenuItem>
            <MenuItem value="hindi">Hindi</MenuItem>
          </TextField>
          <TextField
            fullWidth
            id="classYear"
            name="classYear"
            label="Batch Year"
            select
            value={formik.values.classYear}
            onChange={formik.handleChange}
            error={formik.touched.classYear && Boolean(formik.errors.classYear)}
            helperText={formik.touched.classYear && formik.errors.classYear}
            InputProps={{
              readOnly: isReadOnly,
            }}
          >
            <MenuItem value="1st Year">1st Year</MenuItem>
            <MenuItem value="2nd Year">2nd Year</MenuItem>
            <MenuItem value="3rd Year">3rd Year</MenuItem>
            <MenuItem value="4th Year">4th Year</MenuItem>
          </TextField>
          <TextField
            fullWidth
            id="timeSlot"
            name="timeSlot"
            label="Time Slot"
            type="time"
            InputLabelProps={{ shrink: true }}
            value={formik.values.timeSlot}
            onChange={formik.handleChange}
            error={formik.touched.timeSlot && Boolean(formik.errors.timeSlot)}
            helperText={formik.touched.timeSlot && formik.errors.timeSlot}
            InputProps={{
              readOnly: isReadOnly,
            }}
          />
          <TextField
            fullWidth
            id="roomNumber"
            name="roomNumber"
            label="Room Number"
            value={formik.values.roomNumber}
            onChange={formik.handleChange}
            error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
            helperText={formik.touched.roomNumber && formik.errors.roomNumber}
            InputProps={{
              readOnly: isReadOnly,
            }}
          />
          <div className="flex gap-4">
            <TextField
              fullWidth
              id="maxMarks"
              name="maxMarks"
              label="Max. Marks"
              type="number"
              value={formik.values.maxMarks}
              onChange={formik.handleChange}
              error={formik.touched.maxMarks && Boolean(formik.errors.maxMarks)}
              helperText={formik.touched.maxMarks && formik.errors.maxMarks}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
            <TextField
              fullWidth
              id="minMarks"
              name="minMarks"
              label="Min. Marks"
              type="number"
              value={formik.values.minMarks}
              onChange={formik.handleChange}
              error={formik.touched.minMarks && Boolean(formik.errors.minMarks)}
              helperText={formik.touched.minMarks && formik.errors.minMarks}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
            <TextField
              fullWidth
              id="numQuestions"
              name="numQuestions"
              label="No. of Questions"
              type="number"
              value={formik.values.numQuestions}
              onChange={formik.handleChange}
              error={formik.touched.numQuestions && Boolean(formik.errors.numQuestions)}
              helperText={formik.touched.numQuestions && formik.errors.numQuestions}
              InputProps={{
                readOnly: isReadOnly,
              }}
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invigilators</h3>
            {invigilators.map((invigilator, index) => (
              <div key={index} className="flex items-center gap-4">
                <TextField
                  fullWidth
                  name="name"
                  label="Invigilator Name"
                  value={invigilator.name}
                  onChange={(event) => handleInvigilatorChange(index, event)}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
                <TextField
                  fullWidth
                  name="contact"
                  label="Contact Number"
                  value={invigilator.contact}
                  onChange={(event) => handleInvigilatorChange(index, event)}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
                <div className="w-10">
                  {invigilators.length > 1 && (
                    <IconButton
                      color="secondary"
                      onClick={() => removeInvigilatorFields(index)}
                      disabled={isReadOnly}  // Disable delete button when read-only
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
            {!isReadOnly && (
              <Button
                color="primary"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addInvigilatorFields}
              >
                Add New Invigilator
              </Button>
            )}
          </div>

          <Button color="primary" variant="contained" fullWidth type="submit" disabled={isSubmitting}>
            Schedule Exam
          </Button>
        </form>
      </div>

      <Dialog
        open={confirmationOpen}
        onClose={handleCancelSubmit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Submission"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to submit this exam schedule? Once confirmed, you will not be able to edit the details.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExamScheduling;
