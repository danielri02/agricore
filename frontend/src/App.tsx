
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import RequireAuth from './components/auth/RequireAuth'
import LoginForm from './components/auth/LoginForm'
import FarmGrid from './components/farm/FarmGrid'
import FarmCreate from './components/farm/FarmCreate'
import MaintenanceFlags from './components/farm/MaintenanceFlags'
import EquipmentGrid from './components/equipment/EquipmentGrid'
import EquipmentCreate from './components/equipment/EquipmentCreate'
import ReliabilityRatios from './components/equipment/ReliabilityRatios'
import LowFuelAlerts from './components/equipment/LowFuelAlerts'
import OperatorGrid from './components/operator/OperatorGrid'
import OperatorCreate from './components/operator/OperatorCreate'
import ColocationDiscrepancies from './components/job/ColocationDiscrepancies'
import JobCreate from './components/job/JobCreate'
import JobGrid from './components/job/JobGrid'
import ReportingLines from './components/operator/ReportingLines'
import ReportCreate from './components/report/ReportCreate'
import ReportGrid from './components/report/ReportGrid'
import UserCreate from './components/user/UserCreate'
import UserGrid from './components/user/UserGrid'
import Dashboard from './components/layout/Dashboard'

function App() {

  return <>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route element={<RequireAuth />}>

            <Route element={<AppLayout />}>

              <Route path="/" element={<Dashboard />} />

              <Route path="/farms" element={<FarmGrid />} />
              <Route path="/farms/create" element={<FarmCreate />} />
              <Route path="/farms/maintenance-flags" element={<MaintenanceFlags />} />

              <Route path="/equipment" element={<EquipmentGrid />} />
              <Route path="/equipment/create" element={<EquipmentCreate />} />
              <Route path="/equipment/low-fuel-alerts" element={<LowFuelAlerts />} />
              <Route path="/equipment/reliability-ratios" element={<ReliabilityRatios />} />

              <Route path="/operators" element={<OperatorGrid />} />
              <Route path="/operators/create" element={<OperatorCreate />} />
              <Route path="/operators/reporting-lines" element={<ReportingLines />} />

              <Route path="/jobs" element={<JobGrid />} />
              <Route path="/jobs/create" element={<JobCreate />} />
              <Route path="/jobs/colocation-discrepancies" element={<ColocationDiscrepancies />} />

              <Route path="/reports" element={<ReportGrid />} />
              <Route path="/reports/create" element={<ReportCreate />} />

              <Route path="/users" element={<UserGrid />} />
              <Route path="/users/create" element={<UserCreate />} />

            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </>
}

export default App
