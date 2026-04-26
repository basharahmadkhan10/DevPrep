/** @format */

import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [interviewReport, setInterviewReport] = useState(null);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider
      value={{
        loading,
        setLoading,

        interviewReport,
        setInterviewReport,

        reports,
        setReports,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};