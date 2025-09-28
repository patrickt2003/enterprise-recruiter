# Project Description

The submitted project is a B2B web-based applicant management system designed for HR enterprises. It enables companies to streamline and automate their applicant evaluation process through AI-powered tools and structured interview stages.

---

# Core Functionality

## Applicant Tracking via Kanban
Each open job posting is associated with a 4-stage Kanban board.  

In the first stage, all applicants are listed and automatically ranked based on their CV.

## AI Voice Agent Interview
In the second stage, an AI-powered voice agent calls the applicant. (see second repo)  

The purpose of this interview is to evaluate the applicant’s motivation for the role.

## Video Interview with Anti-Cheating System
Applicants who advance proceed to a video interview. (see third repo)  

The interview integrates an in-house developed eye-tracking software to ensure authenticity and prevent cheating.

## Completion of the Application Process
Applicants who successfully pass all stages are considered to have completed the structured application pipeline.

---

# Technology Stack
- Web Application Framework: **Vite (with Lovable)**

---

# Installation and Setup

### Option 1: Access Live Version
The Web App is live on Vercel:  
https://enterprise-recruiter.vercel.app/  

To access it with existing data, use:  
- **username:** patrick.trost@whu.edu  
- **password:** abcdef  

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/your-team/enterprise-recruiter.git

# Navigate into the project directory
cd enterprise-recruiter

# Install dependencies
npm install

# Start the development server
npm run dev
