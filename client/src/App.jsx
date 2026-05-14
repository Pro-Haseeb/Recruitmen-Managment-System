import React from 'react'
import { Route, Routes } from 'react-router-dom';
//Authentication Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Demo from './pages/Demo';

//Admin Pages
import Admins from './pages/admin/Admins';
import Companies from './pages/admin/Companies';
import Dashboard from './pages/admin/Dashboard';
import DemoRequests from './pages/admin/DemoRequest';
import AdminLayout from './layouts/AdminLayout'; // ---> Layout of Admin Dashboard

//Company Admin Pages
import TeamManagement from './pages/companyAdmin/TeamManagment';

//HR Pages
import CreateJob from './pages/companyAdmin/createJob';

//Candidate
import AllJobs from "./pages/candidate/AllJobs";
import JobDetails from './pages/candidate/JobsDetail';

const App = () => {
  return (
    <>
<Routes>
  
   <Route path='/login' element={<Login/>}/> 
    <Route path='/' element={<Signup/>}/> 
    <Route path='/Demo' element={<Demo/>}/> 

{/* ........ Admin Routes ....... */}
 <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="demo-requests" element={<DemoRequests />} />
  <Route path="companies" element={<Companies />} />
</Route>
{/* .................................... */}

<Route path="/company" element={<AdminLayout />}>
  <Route index element={<TeamManagement/>} />
  <Route path='createjob' element={<CreateJob/>} />
</Route>

<Route path="/Candidate" element={<AdminLayout />}>
  <Route index element={<AllJobs/>} />
  <Route path="jobs/:id" element={<JobDetails />} />
</Route>
    </Routes>
    
    </>
  )
}

export default App