import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { axiosGet } from '../services/Services';
import { useGetCoursesQuery, useGetSubjectsQuery } from '../store/service/admin/AdminService';

const validationSchema = Yup.object({
  examDate: Yup.date().required('Exam date is required'),
  title: Yup.string().required('Title is required'),
  subjectName: Yup.string().required('Subject name is required'),
  batch: Yup.string().required('Batch name is required'),
  // classYear: Yup.string().required('Batch year is required'),
  startTime: Yup.string().required('Start time is required'),
  endTime: Yup.string().required('End time is required'),
});

const ExamScheduling = ({ onExamSchedule }) => {
  const [invigilators, setInvigilators] = useState([{ name: '', contact: '' }]);
  // const [subjectList, setSubjectList] = useState(null);
  // const [courseList, setCourseList] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { data: courseList } = useGetSubjectsQuery();
  const { data: subjectList } = useGetCoursesQuery();
  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      examDate: '',
      title: '',
      subjectName: '',
      batch: '',
      startTime: '',
      endTime: '',
      examInstructions: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setConfirmationOpen(true);  // Show confirmation modal
    },
  });

  // const Getdata = async () => {
  //   try {
  //     // let data = await axiosGet('courses')
  //     // console.log("This is your data", data)
  //     const [coursesResponse, studentsResponse] = await Promise.all([
  //       axiosGet('courses'),  // First API call
  //       axiosGet('subjects')  // Second API call
  //     ]);

  //     setSubjectList(coursesResponse.data.data)
  //     setCourseList(studentsResponse.data.data)
  //   } catch (e) {
  //     console.log(e)
  //   }

  // }

  useEffect(() => {
    // Getdata()
  }, [])

  // console.log(subjectList, courseList);
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
    // onExamSchedule(examDetails);
    console.log(examDetails)
    nav('/addquestion');
  };

  const handleCancelSubmit = () => {
    setConfirmationOpen(false);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center  px-8">
      <div className="md:px-0 px-6">
        <div className="w-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-3 text-center">Schedule an Exam</h2>
          <form onSubmit={formik.handleSubmit} className="grid gap-6">

            {/* {/ Flexbox layout for label and input fields /} */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Exam Date <span className="text-[red]">*</span></label>

              <TextField
                fullWidth
                id="examDate"
                name="examDate"
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
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/3">Title <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/3">Subject Name <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="subjectName"
                name="subjectName"
                select
                value={formik.values.subjectName}
                onChange={formik.handleChange}
                error={formik.touched.subjectName && Boolean(formik.errors.subjectName)}
                helperText={formik.touched.subjectName && formik.errors.subjectName}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                disabled={!subjectList || subjectList.length === 0}  // Disable until data is available
              >
                {/* Show menu items only when subjectList is available */}
                {subjectList && subjectList?.data?.length > 0 ? (
                  subjectList?.data.map((subject) => (
                    <MenuItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Loading Subjects...
                  </MenuItem>
                )}
              </TextField>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-1/3">Batch <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="batch"
                name="batch"
                select
                value={formik.values.batch}
                onChange={formik.handleChange}
                error={formik.touched.batch && Boolean(formik.errors.batch)}
                helperText={formik.touched.batch && formik.errors.batch}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                disabled={!courseList || courseList.length === 0}  // Disable until data is available
              >
                {/* Show menu items only when courseList is available */}
                {courseList && courseList?.data.length > 0 ? (
                  courseList?.data.map((course) => (
                    <MenuItem key={course.id} value={course.name}>
                      {course.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Loading Courses...
                  </MenuItem>
                )}
              </TextField>
            </div>

            {/* <div className="flex items-center gap-4">
              <label className="w-1/3">Batch Year <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="classYear"
                name="classYear"
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
            </div> */}

            {/* {/ Start Time Field /} */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Start Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="startTime"
                name="startTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startTime}
                onChange={formik.handleChange}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

            {/* {/ End Time Field /} */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">End Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="endTime"
                name="endTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endTime}
                onChange={formik.handleChange}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>


            <div className="flex items-center gap-4">
              <label className="w-1/3">Exam Instructions </label>
              <TextField
                fullWidth
                id="examInstructions"
                name="examInstructions"
                type='text'
                value={formik.values.examInstructions}
                onChange={formik.handleChange}
                error={formik.touched.examInstructions && Boolean(formik.errors.examInstructions)}
                helperText={formik.touched.examInstructions && formik.errors.examInstructions}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                multiline   // This enables the textarea behavior
                rows={4}    // Number of rows for the textarea
              />
            </div>

            {/* <div className="flex gap-4">
              <div className="w-1/3">
                <label>Max. Attempts</label>
                <TextField
                  fullWidth
                  id="maxAttempts"
                  name="maxAttempts"
                  type="number"
                  value={formik.values.maxAttempts}
                  onChange={formik.handleChange}
                  error={formik.touched.maxAttempts && Boolean(formik.errors.maxAttempts)}
                  helperText={formik.touched.maxAttempts && formik.errors.maxAttempts}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
              </div>
              <div className="w-1/3">
                <label>Min. Marks</label>
                <TextField
                  fullWidth
                  id="minMarks"
                  name="minMarks"
                  type="number"
                  value={formik.values.minMarks}
                  onChange={formik.handleChange}
                  error={formik.touched.minMarks && Boolean(formik.errors.minMarks)}
                  helperText={formik.touched.minMarks && formik.errors.minMarks}
                  InputProps={{
                    readOnly: isReadOnly,
                  }}
                />
              </div>
              <div className="w-1/3">
                <label>No. of Questions</label>
                <TextField
                  fullWidth
                  id="numQuestions"
                  name="numQuestions"
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
            </div> */}

            <div className="flex items-center gap-4">
              <label className="w-1/3">Invigilators</label>
              <div className="w-full">
                {invigilators.map((invigilator, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={invigilator.name}
                      onChange={(e) => handleInvigilatorChange(index, e)}
                      InputProps={{
                        readOnly: isReadOnly,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Contact"
                      name="contact"
                      value={invigilator.contact}
                      onChange={(e) => handleInvigilatorChange(index, e)}
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
                    variant="outlined"
                    color="primary"
                    onClick={addInvigilatorFields}
                    startIcon={<AddIcon />}
                  >
                    Add Invigilator
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className=''
                color="primary"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>

        {/* {/ Confirmation Dialog /} */}
        <Dialog
          open={confirmationOpen}
          onClose={handleCancelSubmit}
          aria-labelledby="confirmation-dialog-title"
          aria-describedby="confirmation-dialog-description"
        >
          <DialogTitle id="confirmation-dialog-title">Confirm Submission</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirmation-dialog-description">
              Are you sure you want to submit this exam schedule?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSubmit} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ExamScheduling;
