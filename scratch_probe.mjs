import fs from "fs";

const API_URL = "https://devprep-backend-hpnv.onrender.com/api/v1";

async function test() {
  try {
    console.log("1. Authenticating on Render...");
    const testEmail = `probe_${Date.now()}@example.com`;
    const testPass = "TestPassword@123";

    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Tester${Date.now()}`,
        email: testEmail,
        password: testPass,
      }),
    });

    const regData = await regRes.json();
    console.log("Auth status:", regRes.status);
    const token = regData.data?.accessToken;
    if (!token) {
      console.log("No token:", regData);
      return;
    }

    console.log("2. Creating valid PDF with text...");
    // Create valid PDF with text content
    const pdfContent = `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 170 >>
stream
BT
/F1 12 Tf
72 712 Td
(Bashar Ahmad Khan) Tj
0 -20 Td
(Software Engineer - Full Stack Developer) Tj
0 -20 Td
(Skills: JavaScript, TypeScript, React.js, Node.js, Express, MongoDB, Docker, Git) Tj
0 -20 Td
(Experience: Built AI Interview Preparation Platform using MERN stack and Groq API) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000333 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
555
%%EOF`;

    const pdfBlob = new Blob([Buffer.from(pdfContent)], { type: "application/pdf" });
    const form = new FormData();
    form.append("resume", pdfBlob, "resume.pdf");
    form.append("jobDescription", "Senior Full Stack Developer with React, Node.js, Express, MongoDB, and System Design experience.");
    form.append("selfDescription", "2 years MERN stack experience.");

    console.log("3. Sending POST /interview/report to Render...");
    const reportRes = await fetch(`${API_URL}/interview/report`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    console.log("Render Report API Status:", reportRes.status);
    const reportData = await reportRes.json();
    console.log("Response:", JSON.stringify(reportData, null, 2));
  } catch (e) {
    console.log("Fetch error:", e.message);
  }
}

test();
