import API from './axios.service'


export const applyToJob = async (jobId: string, data: any) => (await API.post(`/applications/${jobId}`, data)).data;

export const getMyApplications = async () => (await API.get("/applications/me")).data;

