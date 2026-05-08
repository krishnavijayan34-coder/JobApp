export const jobs = [
  {
    id:1,
    title:'Frontend Developer',
    company:'Google',
    location:'Bangalore',
    salary:'₹8-12 LPA',
    type:'Full-time'
  },
  {
    id:2,
    title:'UI/UX Designer',
    company:'Flipkart',
    location:'Mumbai',
    salary:'₹6-10 LPA',
    type:'Remote'
  },
  {
    id:3,
    title:'Labview programmer',
    company:'cdac',
    location:'Trivandrum',
    salary:'₹4-7 LPA',
    type:'Remote'
  },
  {
    id:4,
    title:'Project Engineer',
    company:'LBS',
    location:'Kochi',
    salary:'₹6-10 LPA',
    type:'Full-time'
  }
];

export const getAllJobs = () => {
  return jobs;
};

export const getJobById = (id) => {
  return jobs.find(job => job.id === id);
};

export const createJob = (job) => {
  jobs.push(job);
};

export const updateJob = (id, updatedJob) => {
  const index = jobs.findIndex(job => job.id === id);
  jobs[index] = updatedJob;
};

export const deleteJob = (id) => {
  const index = jobs.findIndex(job => job.id === id);

  if(index !== -1){
    jobs.splice(index,1);
  }
};