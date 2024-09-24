

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const formik = useFormik({
    initialValues: {
      examDate: '',
      title: '',
      subjectId: '',
      batchId: '',
      startsAt: '',
      endsAt: '',
      instructions: '',
      invigilators: invigilators,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setConfirmationOpen(true);  // Show confirmation modal
    },
  });

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
        nav(`/addquestion`);
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
  };

  const handleCancelSubmit = () => {
    setConfirmationOpen(false);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center px-8 min-h-screen">
      <div className="md:px-0 px-6 w-full ">
        <div className="w-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-3 text-center">Schedule an Exam</h2>
          <form onSubmit={formik.handleSubmit} className="grid gap-6">

            {/* Exam Date */}
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

            {/* Title */}
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

            {/* Subject Name */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Subject Name <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
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
                      {subject.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Subjects Available</MenuItem>
                )}
              </TextField>
            </div>

            {/* Batch */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Batch <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
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
                )}
              </TextField>
            </div>

            {/* Start Time */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">Start Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="startsAt"
                name="startsAt"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startsAt}
                onChange={formik.handleChange}
                error={formik.touched.startsAt && Boolean(formik.errors.startsAt)}
                helperText={formik.touched.startsAt && formik.errors.startsAt}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

            {/* End Time */}
            <div className="flex items-center gap-4">
              <label className="w-1/3">End Time <span className="text-[red]">*</span></label>
              <TextField
                fullWidth
                id="endsAt"
                name="endsAt"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formik.values.endsAt}
                onChange={formik.handleChange}
                error={formik.touched.endsAt && Boolean(formik.errors.endsAt)}
                helperText={formik.touched.endsAt && formik.errors.endsAt}
                InputProps={{
                  readOnly: isReadOnly,
                }}
              />
            </div>

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
                      onChange={(e) => handleInvigilatorChange(index, e)}
                      InputProps={{
                        readOnly: isReadOnly,
                      }}
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

                    <TextField
                      fullWidth
                      label="Contact"
                      name="contact"
                      value={item.invigilator?.phone || ''}
                      InputProps={{
                        readOnly: true, // Contact is auto-filled based on the selected invigilator
                      }}
                    />
                    <div className="w-10">
                      {invigilators.length > 1 && (
                        <IconButton
                          color="secondary"
                          onClick={() => removeInvigilatorFields(index)}
                          disabled={isReadOnly}
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
                className=""
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

        {/* Confirmation Dialog */}
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