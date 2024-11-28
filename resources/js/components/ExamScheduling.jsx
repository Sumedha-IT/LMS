

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
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import {
  useGetBatchesQuery,
  useGetSubjectsQuery,
  useGetInvigilatorsQuery,
  useAddExamDataMutation,
  useUpdateExamDataMutation,
  useGetCurriculumQuery
  
} from '../store/service/admin/AdminService';
import { toast } from 'react-toastify';
import { Select } from '@mui/material';
import { timeOptionsHours, timeOptionsMinutes } from '../utils/jsonData'

const validationSchema = Yup.object({
  examDate: Yup.date()
    .min(dayjs().format('YYYY-MM-DD'), 'Exam date must be in the future') // Date must be after today
    .required('Exam date is required'),

  title: Yup.string().required('Title is required'),
  curriculumId:  Yup.array()
    .of(Yup.string().required('Each curriculum name is required'))
    .required('Curriculum array is required')
    .min(1, 'At least one curriculum is required'),
  batchId: Yup.string().required('Batch name is required'),

  startsAtHours: Yup.string()
    .required('Start hour is required')
    .test('start-required', 'Start time must be selected', function (value) {
      const { startsAtMinutes } = this.parent;
      return value !== '' || startsAtMinutes !== '';  // Ensure time is not zero-zero
    }),

  startsAtMinutes: Yup.string()
    .required('Start minute is required')
    .test('start-min-required', 'Start minute must be selected', function (value) {
      const { startsAtHours } = this.parent;
      return startsAtHours !== '' || value !== '';  // Ensure time is not zero-zero
    }),

  endsAtHours: Yup.string()
    .required('End hour is required')
    .test('is-greater-start', 'End time must be greater than start time', function (value) {
      const { startsAtHours, startsAtMinutes, endsAtMinutes } = this.parent;
      const startTime = `${startsAtHours}:${startsAtMinutes}`;
      const endTime = `${value}:${endsAtMinutes}`;
      return endTime > startTime;  // Validate that end time is after start time
    }),

  endsAtMinutes: Yup.string()
    .required('End minute is required'),

  invigilators: Yup.array()
    .of(
      Yup.object().shape({
        invigilator: Yup.object()
          .nullable()
          .required('At least one invigilator is required.')
      })
    )
    .min(1, 'At least one invigilator is required.')
});


const ExamScheduling = ({ ExamData }) => {
  const [invigilators, setInvigilators] = useState([{ invigilator: null }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { data: courseList } = useGetBatchesQuery();
  const { data: subjectList } = useGetSubjectsQuery();
  const { data: curriculumList } = useGetCurriculumQuery();
  const [AddExamData] = useAddExamDataMutation();
  const [UpdateExamData] = useUpdateExamDataMutation();
  const { data: invigilatorList, isLoading: isInvigilatorLoading } = useGetInvigilatorsQuery();
  const nav = useNavigate();
  const { id } = useParams();
  // const subjectCurricullum = [{"id":1,"name":"abc"},{"id":2,"name":"cdjc"},{"id":3,"name":"sj"}]
  useEffect(() => {
    if (ExamData?.invigilators?.length > 0) {
      const updatedInvigilators = ExamData.invigilators.map((invigilator) => ({
        invigilator: {
          name: invigilator.name,
          email: invigilator.email,
          phone: invigilator.phone,
          id: invigilator.id,
        },
      }));
      setInvigilators(updatedInvigilators);
      formik.setFieldValue('invigilators', updatedInvigilators);
    }
  }, [ExamData]);

  const formik = useFormik({
    initialValues: {
      examDate: ExamData?.examDate || '',
      title: ExamData?.title || '',
      curriculumId: ExamData?.curriculum?.map(c => c.id) || [],   //mapping the curriculum data and set it
      batchId: ExamData?.batchId || '',
      startsAtHours: ExamData?.starts_at ? ExamData.starts_at.split(':')[0] : '',
      startsAtMinutes: ExamData?.starts_at ? ExamData.starts_at.split(':')[1] : '',
      endsAtHours: ExamData?.ends_at ? ExamData.ends_at.split(':')[0] : '',
      endsAtMinutes: ExamData?.ends_at ? ExamData.ends_at.split(':')[1] : '',
      instructions: ExamData?.instructions || '',
      invigilators: invigilators,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setConfirmationOpen(true);
    },
  });

  // Handle Invigilator Select Change
  const handleInvigilatorChange = (index, event) => {
    const { value } = event.target;
    const selectedInvigilator = invigilatorList?.data?.find((inv) => inv.name === value);

    const updatedInvigilators = [...invigilators];
    updatedInvigilators[index] = { invigilator: selectedInvigilator };  // Store the full invigilator object
    setInvigilators(updatedInvigilators);
    formik.setFieldValue('invigilators', updatedInvigilators);
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
  // Submite the form
  const handleConfirmSubmit = async () => {
    setIsReadOnly(true);
    setConfirmationOpen(false);

    // Combine the hours and minutes for start and end time
    const startsAt = `${formik.values.startsAtHours}:${formik.values.startsAtMinutes}`;
    const endsAt = `${formik.values.endsAtHours}:${formik.values.endsAtMinutes}`;

    // Prepare the final exam details
    const examDetails = {
      ...formik.values,
      startsAt,
      endsAt,
      invigilators: invigilators.map((item) => item.invigilator),
    };

    try {
      let result;
      if (ExamData && ExamData.hasOwnProperty('id')) {
        result = await UpdateExamData({ data: { data: examDetails }, id: ExamData.id });
      } else {
        result = await AddExamData({ data: examDetails });
      }
      const { data, error } = result;
      if (result.data?.success === true) {
        localStorage.setItem("examId", data.data?.id)
        nav(`/administrator/${id}/exams/addquestion`);

        toast.success(result.data?.message)
      } else {
        toast.error(error.data.message)
      }
    } catch (e) {
      // console.log(e);
      toast.error(e)
    }
    setIsReadOnly(false);
  };

  const handleCancelSubmit = () => {
    setConfirmationOpen(false);
  };



  return (
    <div className="bg-gray-100 flex justify-center items-center px-8">
      <div className="md:px-0 px-6 w-full ">
        <div className="w-full p-6 overflow-y-auto">
          {ExamData && ExamData?.id ? "" : <h2 className="text-2xl font-bold mb-3 text-center">Schedule an Exam</h2>}
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
                id="curriculumId"
                name="curriculumId"
                select
                value={formik.values.curriculumId}
                onChange={formik.handleChange}
                error={formik.touched.curriculumId && Boolean(formik.errors.curriculumId)}
                helperText={formik.touched.curriculumId && formik.errors.curriculumId}
                InputProps={{
                  readOnly: isReadOnly,
                }}
                SelectProps={{
                  multiple: true, // Enable multi-select
                  renderValue: (selected) => {
                    const selectedNames = (curriculumList?.data || [])
                        .filter(option => selected.includes(option.id))
                        .map(option => option.name);
                    return selectedNames.join(', ');
                },
              }}
              disabled={!curriculumList || curriculumList.length === 0}
              >
                {curriculumList?.data.length > 0 ? (
                  curriculumList.data.map((subject) => (
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
                    <MenuItem key={course.batch_id} value={course.batch_id}>
                      {course.batch_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Batches Available</MenuItem>
                )}
              </TextField>
            </div>

            {/* Start Time */}
            <div className="2xl:flex md:flex sm:flex flex-none items-center gap-4 ">
              <label className="w-1/3">Start Time <span className="text-[red]">*</span></label>
              <div className='flex gap-2 w-full flex-col'>
                <div className='flex gap-2 w-full'>
                  <Select
                    fullWidth
                    id="startsAtHours"
                    name="startsAtHours"
                    value={formik.values.startsAtHours}
                    onChange={formik.handleChange}
                    error={formik.touched.startsAtHours && Boolean(formik.errors.startsAtHours)}
                    disabled={isReadOnly}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          top: '50%',
                          height: '50%',
                          // background: 'black',
                        },
                      },
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      transformOrigin: { vertical: 'top', horizontal: 'left' },
                    }}
                  >
                    {/* Static item for Hours */}
                    <MenuItem disabled>
                      ✔ Hrs
                    </MenuItem>
                    {timeOptionsHours.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    fullWidth
                    id="startsAtMinutes"
                    name="startsAtMinutes"
                    value={formik.values.startsAtMinutes}
                    onChange={formik.handleChange}
                    error={formik.touched.startsAtMinutes && Boolean(formik.errors.startsAtMinutes)}
                  >
                    <MenuItem disabled>✔ Min</MenuItem>
                    {timeOptionsMinutes.map((minute) => (
                      <MenuItem key={minute} value={minute}>
                        {minute}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {formik.touched.startsAtHours && formik.errors.startsAtHours && <div className='text-red-600 ml-3 text-sm'>{formik.errors.startsAtHours}</div>}
              </div>
            </div>

            {/* End Time */}
            <div className="2xl:flex md:flex sm:flex flex-none items-center gap-4">
              <label className="w-1/3">End Time <span className="text-[red]">*</span></label>
              <div className='flex gap-2 w-full flex-col '>
                <div className="flex gap-2 ">
                  <Select
                    fullWidth
                    id="endsAtHours"
                    name="endsAtHours"
                    value={formik.values.endsAtHours}
                    onChange={formik.handleChange}
                    error={formik.touched.endsAtHours && Boolean(formik.errors.endsAtHours)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          top: '40%',
                          height: '40%',
                          // background: 'black',
                        },
                      },
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      transformOrigin: { vertical: 'top', horizontal: 'left' },
                    }}
                  >
                    <MenuItem disabled>✔ Hrs</MenuItem>
                    {timeOptionsHours.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    fullWidth
                    id="endsAtMinutes"
                    name="endsAtMinutes"
                    value={formik.values.endsAtMinutes}
                    onChange={formik.handleChange}
                    error={formik.touched.endsAtMinutes && Boolean(formik.errors.endsAtMinutes)}
                  >
                    <MenuItem disabled>✔ Min</MenuItem>
                    {timeOptionsMinutes.map((minute) => (
                      <MenuItem key={minute} value={minute}>
                        {minute}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {formik.touched.endsAtHours && formik.errors.endsAtHours && <div className='text-red-600 ml-3 text-[12px] sm:text-sm'>{formik.errors.endsAtHours}</div>}
              </div>
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