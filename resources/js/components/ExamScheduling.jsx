<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
=======


import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
>>>>>>> Stashed changes
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
<<<<<<< Updated upstream
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
=======
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import {
  useGetBatchesQuery,
  useGetSubjectsQuery,
  useGetInvigilatorsQuery,
  useAddExamDataMutation,
} from '../store/service/admin/AdminService';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  examDate: Yup.date()
    .min(dayjs().format('YYYY-MM-DD'), 'Exam date must be in the future') // Date must be after today
    .required('Exam date is required'),
  title: Yup.string().required('Title is required'),
  subjectId: Yup.string().required('Subject name is required'),
  batchId: Yup.string().required('Batch name is required'),
  startsAt: Yup.string().required('Start time is required'),
  endsAt: Yup.string()
    .required('End time is required')
    .test('is-greater', 'End time must be after start time', function (value) {
      const { startsAt } = this.parent;
      return value > startsAt;
    }),
  invigilators: Yup.array()
    .of(
      Yup.object().shape({
        invigilator: Yup.object()
          .nullable()
          .required('At least one invigilator is required.'),
      })
    )
    .min(1, 'At least one invigilator is required.')
});

const ExamScheduling = () => {
  const [invigilators, setInvigilators] = useState([{ invigilator: null }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { data: courseList } = useGetBatchesQuery();
  const { data: subjectList } = useGetSubjectsQuery();
  const [AddExamData] = useAddExamDataMutation();
  const { data: invigilatorList, isLoading: isInvigilatorLoading } = useGetInvigilatorsQuery();
  const nav = useNavigate();
  const { id } = useParams();
>>>>>>> Stashed changes

  const formik = useFormik({
    initialValues: {
      examDate: '',
      title: '',
<<<<<<< Updated upstream
      subjectName: '',
      batch: '',
      startTime: '',
      endTime: '',
      examInstructions: '',
=======
      subjectId: '',
      batchId: '',
      startsAt: '',
      endsAt: '',
      instructions: '',
      invigilators: invigilators,
>>>>>>> Stashed changes
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setConfirmationOpen(true);  // Show confirmation modal
    },
  });

<<<<<<< Updated upstream
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
=======
  // Handle Invigilator Select Change
  const handleInvigilatorChange = (index, event) => {
    const { value } = event.target;
    const selectedInvigilator = invigilatorList?.data?.find((inv) => inv.name === value);

    const updatedInvigilators = [...invigilators];
    updatedInvigilators[index] = { invigilator: selectedInvigilator };  // Store the full invigilator object
    setInvigilators(updatedInvigilators);
    formik.setFieldValue('invigilators', updatedInvigilators); // Set formik value
  };

  // Add new invigilator row
  const addInvigilatorFields = () => {
    const updatedInvigilators = [...invigilators, { invigilator: null }];
    setInvigilators(updatedInvigilators);
    formik.setFieldValue('invigilators', updatedInvigilators); // Update formik value
  };

  // Remove invigilator row
  const removeInvigilatorFields = (index) => {
    const newInvigilators = invigilators.filter((_, i) => i !== index);
    setInvigilators(newInvigilators);
    formik.setFieldValue('invigilators', newInvigilators); // Update formik value
  };

  const handleConfirmSubmit = async () => {
    setIsReadOnly(true);
    setConfirmationOpen(false);

    const examDetails = {
      ...formik.values,
      invigilators: invigilators.map((item) => item.invigilator),
    };

    try {
      const result = await AddExamData({ data: examDetails });
      console.log(result);
      const { data, error } = result;
      if (result.data?.success === true) {
        localStorage.setItem("examId", data.data?.id)
        nav(`/administrator/${id}/examination/addquestion`);
        toast.success(result.data?.message)
      } else {
        console.log("asdfadsfds", error.data.message)
        toast.error(error.data.message)
      }
    } catch (e) {
      console.log(e);
      toast.error(e)
    }
    setIsReadOnly(false);
>>>>>>> Stashed changes
  };

  const handleCancelSubmit = () => {
    setConfirmationOpen(false);
  };

  return (
<<<<<<< Updated upstream
    <div className="bg-gray-100 flex justify-center items-center  px-8">
      <div className="md:px-0 px-6">
=======
    <div className="bg-gray-100 flex justify-center items-center px-8 min-h-screen">
      <div className="md:px-0 px-6 w-full ">
>>>>>>> Stashed changes
        <div className="w-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-3 text-center">Schedule an Exam</h2>
          <form onSubmit={formik.handleSubmit} className="grid gap-6">

<<<<<<< Updated upstream
            {/* {/ Flexbox layout for label and input fields /} */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Exam Date <span className="text-[red]">*</span></label>

=======
            {/* Exam Date */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Exam Date <span className="text-[red]">*</span></label>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
            {/* Title */}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
            {/* Subject Name */}
>>>>>>> Stashed changes
            <div className="flex items-center gap-4">
              <label className="w-1/3">Subject Name <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
<<<<<<< Updated upstream
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
=======
                id="subjectId"
                name="subjectId"
                select
                value={formik.values.subjectId}
                onChange={formik.handleChange}
                error={formik.touched.subjectId && Boolean(formik.errors.subjectId)}
                helperText={formik.touched.subjectId && formik.errors.subjectId}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                disabled={!subjectList || subjectList.length === 0}
              >
                {subjectList?.data.length > 0 ? (
                  subjectList.data.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
>>>>>>> Stashed changes
                      {subject.name}
                    </MenuItem>
                  ))
                ) : (
<<<<<<< Updated upstream
                  <MenuItem disabled>
                    Loading Subjects...
                  </MenuItem>
=======
                  <MenuItem disabled>No Subjects Available</MenuItem>
>>>>>>> Stashed changes
                )}
              </TextField>
            </div>

<<<<<<< Updated upstream
=======
            {/* Batch */}
>>>>>>> Stashed changes
            <div className="flex items-center gap-4">
              <label className="w-1/3">Batch <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
<<<<<<< Updated upstream
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
=======
                id="batchId"
                name="batchId"
                select
                value={formik.values.batchId}
                onChange={formik.handleChange}
                error={formik.touched.batchId && Boolean(formik.errors.batchId)}
                helperText={formik.touched.batchId && formik.errors.batchId}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                disabled={!courseList || courseList.length === 0}
              >
                {courseList?.data.length > 0 ? (
                  courseList.data.map((course) => (
                    <MenuItem key={course.id} value={course.batch_id}>
                      {course.batch_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Batches Available</MenuItem>
>>>>>>> Stashed changes
                )}
              </TextField>
            </div>

<<<<<<< Updated upstream
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
=======
            {/* Start Time */}
>>>>>>> Stashed changes
            <div className="flex items-center gap-4">
              <label className="w-1/3">Start Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
<<<<<<< Updated upstream
                id="startTime"
                name="startTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startTime}
                onChange={formik.handleChange}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
=======
                id="startsAt"
                name="startsAt"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startsAt}
                onChange={formik.handleChange}
                error={formik.touched.startsAt && Boolean(formik.errors.startsAt)}
                helperText={formik.touched.startsAt && formik.errors.startsAt}
>>>>>>> Stashed changes
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

<<<<<<< Updated upstream
            {/* {/ End Time Field /} */}
=======
            {/* End Time */}
>>>>>>> Stashed changes
            <div className="flex items-center gap-4">
              <label className="w-1/3">End Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
<<<<<<< Updated upstream
                id="endTime"
                name="endTime"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endTime}
                onChange={formik.handleChange}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
=======
                id="endsAt"
                name="endsAt"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endsAt}
                onChange={formik.handleChange}
                error={formik.touched.endsAt && Boolean(formik.errors.endsAt)}
                helperText={formik.touched.endsAt && formik.errors.endsAt}
>>>>>>> Stashed changes
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

<<<<<<< Updated upstream

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
=======
            {/* Exam Instructions */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Exam Instructions</label>
              <TextField
                fullWidth
                id="instructions"
                name="instructions"
                type="text"
                value={formik.values.instructions}
                onChange={formik.handleChange}
                error={formik.touched.instructions && Boolean(formik.errors.instructions)}
                helperText={formik.touched.instructions && formik.errors.instructions}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                multiline
                rows={4}
              />
            </div>

            {/* Invigilator Section */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Invigilators <span className="text-[red]">*</span></label>
              <div className="w-full">
                {invigilators.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <TextField
                      fullWidth
                      select
                      label="Name"
                      name="name"
                      value={item.invigilator?.name || ''}
>>>>>>> Stashed changes
                      onChange={(e) => handleInvigilatorChange(index, e)}
                      InputProps={{
                        readOnly: isReadOnly,
                      }}
<<<<<<< Updated upstream
                    />
=======
                      error={formik.touched.invigilators?.[index]?.invigilator && Boolean(formik.errors.invigilators?.[index]?.invigilator)}
                      helperText={formik.touched.invigilators?.[index]?.invigilator && formik.errors.invigilators?.[index]?.invigilator?.message}
                      disabled={isInvigilatorLoading}
                    >
                      {invigilatorList?.data.length > 0 ? (
                        invigilatorList.data.map((inv) => (
                          <MenuItem key={inv.id} value={inv.name}>
                            {inv.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Invigilators Available</MenuItem>
                      )}
                    </TextField>

>>>>>>> Stashed changes
                    <TextField
                      fullWidth
                      label="Contact"
                      name="contact"
<<<<<<< Updated upstream
                      value={invigilator.contact}
                      onChange={(e) => handleInvigilatorChange(index, e)}
                      InputProps={{
                        readOnly: isReadOnly,
=======
                      value={item.invigilator?.phone || ''}
                      InputProps={{
                        readOnly: true, // Contact is auto-filled based on the selected invigilator
>>>>>>> Stashed changes
                      }}
                    />
                    <div className="w-10">
                      {invigilators.length > 1 && (
                        <IconButton
                          color="secondary"
                          onClick={() => removeInvigilatorFields(index)}
<<<<<<< Updated upstream
                          disabled={isReadOnly}  // Disable delete button when read-only
=======
                          disabled={isReadOnly}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                className=''
=======
                className=""
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        {/* {/ Confirmation Dialog /} */}
=======
        {/* Confirmation Dialog */}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export default ExamScheduling;
=======
export default ExamScheduling;
>>>>>>> Stashed changes
