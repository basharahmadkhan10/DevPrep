/** @format */

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});

// Generate Interview Report
export const generateInterviewReport = async ({
  resume,
  selfDescription,
  jobDescription,
  accessToken,
}) => {
  const formData = new FormData();

  formData.append("resume", resume);
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);

  console.log("ACCESS TOKEN:", accessToken);

  const response = await api.post(
    "/api/v1/interview/report",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// Get Report By ID
export const generateInterviewReportById = async (
  id,
  accessToken
) => {
  const response = await api.get(
    `/api/v1/interview/report/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

// Get All Reports
export const getAllInterviewReport = async (accessToken) => {
  const response = await api.get(
    "/api/v1/interview",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};