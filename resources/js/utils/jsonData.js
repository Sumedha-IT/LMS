
export const bankData = [
  { "text": "Question Bank 1", "value": 1, "marks": 100 },
  { "text": "Question Bank 2", "value": 2, "marks": 100 },
  { "text": "Question Bank 3", "value": 3, "marks": 100 },
  { "text": "Question Bank 4", "value": 4, "marks": 100 },
  { "text": "Question Bank 5", "value": 5, "marks": 100 },
]

export const timeOptionsHours = [
  { label: '12 AM', value: '00' },
  { label: '01 AM', value: '01' },
  { label: '02 AM', value: '02' },
  { label: '03 AM', value: '03' },
  { label: '04 AM', value: '04' },
  { label: '05 AM', value: '05' },
  { label: '06 AM', value: '06' },
  { label: '07 AM', value: '07' },
  { label: '08 AM', value: '08' },
  { label: '09 AM', value: '09' },
  { label: '10 AM', value: '10' },
  { label: '11 AM', value: '11' },
  { label: '12 PM', value: '12' },
  { label: '01 PM', value: '13' },
  { label: '02 PM', value: '14' },
  { label: '03 PM', value: '15' },
  { label: '04 PM', value: '16' },
  { label: '05 PM', value: '17' },
  { label: '06 PM', value: '18' },
  { label: '07 PM', value: '19' },
  { label: '08 PM', value: '20' },
  { label: '09 PM', value: '21' },
  { label: '10 PM', value: '22' },
  { label: '11 PM', value: '23' },
];

export const timeOptionsMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const monthOption = [{ label: 'January', value: '01' },
{ label: 'February', value: '02' },
{ label: 'March', value: '03' },
{ label: 'April', value: '04' },
{ label: 'May', value: '05' },
{ label: 'June', value: '06' },
{ label: 'July', value: '07' },
{ label: 'August', value: '08' },
{ label: 'September', value: '09' },
{ label: 'October', value: '10' },
{ label: 'November', value: '11' },
{ label: 'December', value: '12' }];

export const courses = [
  {
    label: "10th", value: "10", course: ["Mathematics, Physics,Chemistry",
      "Biology,Physics,Chemistry",
      " Mathematics, Economics, Commerce",
      "History, Economics,Civics",
      "Civics, Economics, Commerce"]
  },
  {
    label: "12th", value: "12", course: ["Mathematics, Physics,Chemistry",
      "Biology,Physics,Chemistry",
      " Mathematics, Economics, Commerce",
      "History, Economics,Civics",
      "Civics, Economics, Commerce"]
  },
  {
    label: "Diploma", value: "Diploma", course: ["Chemical Engineering Degree",
      "Mechanical Engineering Degree",
      "Civil Engineering Degree",
      "Computer Science Engineering",
      "Aeronautical Engineering",
      "Biotech Engineering Degree",
      "Aerospace Engineering Degree",
      "Electrical & Electronics  Engineering",
      "Electronics & Communication Engineering"
    ]
  },
  {
    label: "Btech/UG", value: "UG", course: [
      "Chemical Engineering Degree",
      "Mechanical Engineering Degree",
      "Civil Engineering Degree",
      "Computer Science Engineering",
      "Aeronautical Engineering",
      "Biotech Engineering Degree",
      "Aerospace Engineering Degree",
      "Electrical & Electronics  Engineering",
      "Electronics & Communication Engineering"
    ]
  },
  {
    label: "Mtech/PG", value: "PG", course: [
      "Chemical Engineering Degree",
      "Mechanical Engineering Degree",
      "Civil Engineering Degree",
      "Computer Science Engineering",
      "Aeronautical Engineering",
      "Biotech Engineering Degree",
      "Aerospace Engineering Degree",
      "Electrical & Electronics  Engineering",
      "Electronics & Communication Engineering"
    ]
  },
];
export const countryStates = [
  { country: 'USA', state: ['California', 'Florida', 'Texas'] },
  { country: 'Canada', state: ['Ontario', 'Quebec', 'British Columbia'] },
  { country: 'India', state: ['Delhi', 'Madhya Pradesh', 'Punjab'] },
  // Add more countries and their corresponding states as needed
];
export const jobStatus = [
  { label: 'ACTIVE', value: 'ACTIVE', checked: false },
  { label: 'CLOSED', value: 'CLOSED', checked: false },
  { label: 'ONHOLD', value: 'ONHOLD', checked: false },
];

export const applicationStatus = [
  { label: 'Applied', value: 'Applied', checked: false },
  // { label: 'Shortlisted', value: 'Shortlisted', checked: false },
  { label: 'In Interview', value: 'In Interview', checked: false },
  { label: 'Offered', value: 'Offered', checked: false },
  { label: 'Rejected', value: 'Rejected', checked: false },

];
export const jobType = [
  { label: 'internship', value: 'internship', checked: false },
  { label: 'Full Time', value: 'full_time', checked: false },
  { label: 'Part Time', value: 'part_time', checked: false },
  { label: 'contract', value: 'contract', checked: false },
  { label: 'volunteer', value: 'volunteer', checked: false },
]

export const experienceRange = [
  { label: ['0-1'], checked: false },
  { label: ['1-2'], checked: false },
  { label: ['3-4'], checked: false },
  { label: ['5-6'], checked: false },
  { label: ['7-9'], checked: false },
  { label: ['10-15'], checked: false },
  { label: ['15-20'], checked: false }
]


export const jobPostedIn = [
  { label: "7days", value: 7, checked: false },
  { label: "30days", value: 30, checked: false }
]
export const officePolicy = [
  { label: "remote", value: 'wfh', checked: false },
  { label: "hybrid", value: 'hybrid', checked: false },
  { label: "inOffice", value: 'wfo', checked: false }]
export const ctcRange = [
  { label: "0-3L", value: [0, 3], checked: false },
  { label: "3-6L", value: [3, 6], checked: false },
  { label: "6-10L", value: [6, 10], checked: false },
  { label: "15-25L", value: [15, 25], checked: false },
  { label: "25-50L", value: [25, 50], checked: false },
  { label: "50-75L", value: [50, 75], checked: false },
  { label: "75L-1C", value: [75, 100], checked: false },
]
export const jobSource = [
  { label: "sumedhaIT", value: 'sumedhaIT', checked: false },
  { label: "importedJobs", value: 'importedJobs', checked: false },
  { label: "invitedJobs", value: 'invitedJobs', checked: false },]