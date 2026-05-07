import API from "./axios.service";


export const getJobs = async (params: any) => {
  const res = await API.get("/jobs", { params });
  return res.data;
};
export const createJob = async (data: any) => (await API.post("/jobs", data)).data;


export const getJobById = async (id: string) => {
  const res = await API.get(`/jobs/${id}`);
  return res.data;
};


export const applyToJob = async (jobId: string, data: any) => {
  const res = await API.post(`/applications/${jobId}`, data);
  return res.data;
};


