// services/interview.api.js
import apiService from "../../auth/services/auth.api.js"; 

export const generateInterviewReport = async ({ resume, selfDescription, jobDescription }) => {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);

  // Use apiService.api — NOT a new axios instance
  const response = await apiService.api.post("/api/v1/interview/report", formData);
  return response.data;
};

export const generateInterviewReportById = async ({ id }) => {
  const response = await apiService.api.get(`/api/v1/interview/report/${id}`);
  return response.data;
};

export const getAllInterviewReport = async () => {
  const response = await apiService.api.get("/api/v1/interview");
  return response.data;
};
