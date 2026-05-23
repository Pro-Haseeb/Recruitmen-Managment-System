# Recruitment Management System (RMS) - Project Overview Report

## 1. Executive Summary
The **Recruitment Management System (RMS)** is a state-of-the-art, premium MERN (MongoDB, Express.js, React.js, Node.js) SaaS-style recruitment portal designed to streamline the modern hiring lifecycle. Featuring a gorgeous dark-themed glassmorphism interface, custom responsive layouts, role-based access security, and full live dynamic integrations, the system bridges the gap between System Owners, Partner Companies/HR Teams, and Job Candidates in real-time.

---

## 2. System Architecture & Directory Layout

The project is structured under an industry-standard modular monorepo structure, cleanly dividing the backend REST APIs and the client single-page application (SPA):

```
Final Year Project/
├── Backend/                       # Express & Node REST APIs
│   ├── config/                    # DB connection & Server configs
│   ├── controllers/               # Business logic (MVC Controllers)
│   │   ├── candidate/             # Job applications & profile actions
│   │   ├── company/               # Recruiter, HR, & jobs management
│   │   └── systemadmin/           # User blocks, analytics & demo controls
│   ├── middlewares/               # Token Auth, File Upload & Roles guards
│   ├── models/                    # MongoDB Mongoose schemas (8 models)
│   ├── routes/                    # Express routing files
│   ├── uploads/                   # Candidate CV/Resume storage directory
│   ├── utils/                     # Email, token generators, and helpers
│   └── server.js                  # Entry point for backend Nodemon server
└── Frontend/                      # Vite + React Client
    ├── public/                    # Public assets & icons
    └── src/
        ├── assets/                # Styling variables & static media
        ├── components/            # Reusable components (DetailOverlays, Paginations)
        ├── context/               # Global states & provider contexts
        ├── layout/                # Responsive layouts (Sidebar, Navbars, AppShell)
        ├── pages/                 # Visual layouts & dashboards
        │   ├── admin/             # System Owner control pages (12 files)
        │   ├── company/           # Partner recruiter logs (6 files)
        │   ├── candidate/         # Jobseeker panels (6 files)
        │   └── public/            # Landing page, Demo request, Auth page
        ├── services/              # Axios service endpoints layer
        ├── App.jsx                # Router & central route control file
        └── main.jsx               # Client initialization entry point
```

---

## 3. Database Schema Design (Mongoose Models)

The backend utilizes MongoDB managed via Mongoose schemas to ensure high performance and structured data relations. There are **8 central models**:

| Schema / Model | Core Properties | Relationship & Purpose |
| :--- | :--- | :--- |
| **`User.js`** | `name`, `email`, `password`, `role` (`system_owner`, `company_admin`, `hr`, `candidate`), `status` (`active`, `blocked`), `profileScore` | Central authentication and directory record. |
| **`company.js`** | `name`, `description`, `industry`, `location`, `ownerId` | Stores profile data of active corporations. |
| **`Job.js`** | `title`, `description`, `location`, `salary`, `skills`, `experienceLevel`, `status` (`active`, `closed`), `companyId` | Job listings, mapped directly to companies. |
| **`Application.js`**| `jobId`, `candidateId`, `resume` (filepath), `status` (`Applied`, `Shortlisted`, `Under Review`, `Rejected`), `appliedAt` | Tracks candidate-job connections and recruitment pipeline. |
| **`Demo.js`** | `name`, `email`, `companyName`, `phone`, `status` (`pending`, `contacted`) | Tracks incoming commercial demo requests. |
| **`Interview.js`** | `applicationId`, `candidateId`, `interviewerId`, `date`, `link`, `notes` | Schedule information for HR-candidate meetings. |
| **`ActivityLog.js`** | `userId`, `action`, `details`, `timestamp` | Tracks administrative and user system modifications. |
| **`Export.js`** | `userId`, `fileType`, `downloadLink`, `createdAt` | Handles data report requests. |

---

## 4. Comprehensive Feature Matrix

### 🔓 4.1. Public Portals & User Onboarding
* **Interactive Landing Page**: A fully responsive landing page highlighting features, partner company stats, and product highlights.
* **Unified Auth Portal (`AuthPage.jsx`)**: Responsive signup and login forms equipped with visual password toggles, automated input validation, and JWT persistence.
* **Commercial Demo Request (`Demo.jsx`)**: Sleek form allowing corporate partners to submit business details directly to the admin backlog.

### 👑 4.2. System Owner (Admin) Dashboard
* **Dynamic SaaS Analytics**: Dynamic count cards pulling from live database stats for **Total Users**, **Companies**, **HR Teams**, **Candidates**, **Active Jobs**, **Applications**, and **Pending Demos** (no mock values).
* **Robust Users Management (`Users.jsx`)**:
  * Real-time list of all system users.
  * Role filters (`company_admin`, `hr`, `candidate`) and dynamic textual name/email search bar.
  * Sleek server-side pagination (5 records per page).
  * **Real-time Block / Unblock**: Admin-level users can instantaneously freeze/unfreeze any user's credentials with live API bindings.
  * Status badges showing clean "Active" / "Blocked" chips.
* **Demo Requests Handling**: Management panel to view business demo requests and change their contact status.

### 🏢 4.3. Company & Recruiter Dashboard
* **Dynamic Recruiter Analytics**: Live summary of active job postings, application submission counts, and hired candidate ratios.
* **All Jobs Ledger (`AllJobs.jsx`)**:
  * Grid display showing the company's active positions.
  * Features the listing title, status badge (Active/Closed), location type, salary bracket, creation date, and dynamic candidate application count.
* **Create Job Form (`CreateJob.jsx`)**: Interactive modal panel enabling recruiters to instantly launch vacancies, detail experience requirements, and list required skills.
* **Applications Center (`Applications.jsx`)**: Logs incoming CV files, allowing HRs to advance candidate status to Shortlisted, Review, or Rejected.
* **HR Team Management (`TeamManagement.jsx`)**: Enables company administrators to register, invite, and view HR staff inside their business roster.

### 🧑‍💼 4.4. Candidate Portal & Job-Seeking Suite
* **Dynamic Candidate Analytics (`Dashboard.jsx`)**:
  * Real-time counters showing candidate's total **Applied Jobs**, **Shortlisted Positions**, and **Scheduled Interviews**.
  * **Interactive Profile Completion Indicator**: Multi-tiered tracker displaying completion rates (with linear loading bars) matching user details.
  * **Recent Application Feed**: Custom dynamic cards showing status indicators of the candidate's last 3 applications.
* **Applied Jobs Log (`AppliedJobs.jsx`)**: Visual tracker where candidates can search, filter, and monitor the recruitment status of their submissions.
* **Standalone Premium Job Details Page (`JobsDetails.jsx`)**:
  * Fully isolated from the dashboard layouts (full screen) to maximize readable area.
  * Dynamic loader pulling directly from `getSingleJob(id)` with smart mock fallbacks.
  * **Interactive CV Uploader**: Integrates drag-and-drop or click triggers, featuring immediate filename displays, verify ticks, and file remove buttons.
  * **Multipart Apply Service**: Bundles `jobId` and file streams into a `multipart/form-data` payload submitting to the server cleanly.

---

## 5. Premium Layout & UI Systems (SaaS Design Aesthetic)

The RMS frontend sets an exceptional standard in modern web design, incorporating visual best practices:
1. **Glassmorphism CSS Engine**: Sidebar and main panels use deep backdrop filters (`blur(20px)`), glowing borders (`rgba(255,255,255,0.05)`), and dynamic scaling transforms (`translateY(-5px)`) for responsive elevation.
2. **Dynamic Centered Viewport Header**: The top header (`Navbar.jsx`) dynamically centers titles in the viewport (e.g. `ADMIN DASHBOARD`, `[COMPANY NAME] DASHBOARD`, `CANDIDATE DASHBOARD`), removing unnecessary brand clutter while preserving essential dropdown menus.
3. **Corner Back Navigation**: Provides a subtle, absolute-positioned `ArrowBackIcon` in the top-left corner of the sidebars, enabling seamless exit transitions to the home page with zero clutter.
4. **Global Detail Overlay System**: A central sidebar slide-out overlay component (`DetailOverlay.jsx`) used across all dashboards, showing detailed profiles, job requirements, or user metadata on row clicks.
5. **Toast Notification System**: Dynamic slide-in snackbar alerts featuring glassmorphism accents, showing real-time success or error responses from the backend server.

---

## 6. Access Control & Security Safeguards

* **JWT Router Guard**: Restricts dashboard access to registered accounts with valid authorization headers.
* **Role Validation Guard (`ProtectedRoute.jsx`)**: Verifies roles dynamically before rendering panels (candidates cannot view company settings; recruiters cannot enter system owner reports).
* **Case Mismatch Guard**: Ensures case-insensitive synchronization between seed setups (e.g., lowercased `system_owner`) and router endpoints, resolving authorization blocks completely.
