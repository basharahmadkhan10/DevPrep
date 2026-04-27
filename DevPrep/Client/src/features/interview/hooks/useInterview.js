/** @format */

import {
  getAllInterviewReport,
  generateInterviewReportById,
  generateInterviewReport,
} from "../services/interview.api.js";

import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { useAuth } from "../../auth/auth.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used within an InterviewProvider"
    );
  }

  const {
    loading,
    setLoading,
    interviewReport,
    setInterviewReport,
    reports,
    setReports,
  } = context;

  // IMPORTANT
  const { accessToken } = useAuth();

const generateReport = async ({
  resume,
  selfDescription,
  jobDescription,
}) => {
  setLoading(true);

  try {
    const response = await generateInterviewReport({
      resume,
      selfDescription,
      jobDescription,
      accessToken,
    });

    console.log("FINAL RESPONSE:", response);

    setInterviewReport(response);

    return response;
  } catch (error) {
    console.log("Generate Report Error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
const getReportById = async (id) => {
  setLoading(true);

  try {
    const response = await generateInterviewReportById({
      id,
      accessToken,
    });

    setInterviewReport(response);

    return response;
  } catch (error) {
    console.log("Fetch Report Error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  return {
    loading,
    interviewReport,
    reports,
    generateReport,
    getReportById
  };
};
