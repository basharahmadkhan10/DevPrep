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

  const { accessToken } = useAuth();

  const generateReport = async ({
    resume,
    selfDescription,
    jobDescription,
  }) => {
    setLoading(true);
    
    try {
      let token = accessToken;
      
      // If no token in context, try localStorage (for mobile)
      if (!token) {
        token = localStorage.getItem('accessToken');
        console.log("Using token from localStorage:", token ? "YES" : "NO");
      }
      
      if (!token) {
        throw new Error("Please login again");
      }
      
      const response = await generateInterviewReport({
        resume,
        selfDescription,
        jobDescription,
        accessToken: token,
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
      let token = accessToken;
      
      if (!token) {
        token = localStorage.getItem('accessToken');
      }
      
      if (!token) {
        throw new Error("Please login again");
      }
      
      const response = await generateInterviewReportById({
        id,
        accessToken: token,
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
