import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { ProjectList } from '@/features/projects/pages/ProjectList';
import { TaskList } from '@/features/tasks/pages/TaskList';
import { TaskDetails } from '@/features/tasks/pages/TaskDetails';
import { UserList } from '@/features/users/pages/UserList';
import { UserCenter } from '@/features/users/pages/UserCenter';
import { RoleList } from '@/features/roles/pages/RoleList';
import { LeaveList } from '@/features/leave/pages/LeaveList';
import { IncidentList } from '@/features/incidents/pages/IncidentList';
import { Profile } from '@/features/profile/pages/Profile';
import { TaskStatusList } from '@/features/task-status/pages/TaskStatusList';
import { TaskTypeList } from '@/features/task-type/pages/TaskTypeList';
import { PriorityList } from '@/features/priority/pages/PriorityList';
import { SMTPList } from '@/features/smtp/pages/SMTPList';
import { SettingsHub } from '@/features/settings/pages/SettingsHub';
import { Scheduler } from '@/features/scheduler/pages/Scheduler';
import { ReportsDashboard } from '@/features/reports/pages/ReportsDashboard';
import { TimeTrackingReport } from '@/features/reports/pages/TimeTrackingReport';
import { LogSession } from '@/features/dashboard/pages/LogSession';
import { MainLayout } from '@/layouts/main-layout';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Initializing workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Projects Routes */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        }
      />

      {/* Tasks Routes */}
      <Route path="/tasks">
        <Route
          index
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/details"
          element={
            <ProtectedRoute>
              <TaskDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="log-session"
          element={
            <ProtectedRoute>
              <LogSession />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Users Routes */}
      <Route path="/users">
        <Route
          index
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/center"
          element={
            <ProtectedRoute>
              <UserCenter />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Roles Routes */}
      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <RoleList />
          </ProtectedRoute>
        }
      />

      {/* Leave Routes */}
      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <LeaveList />
          </ProtectedRoute>
        }
      />

      {/* Incidents Routes */}
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentList />
          </ProtectedRoute>
        }
      />

      {/* Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Task Status Routes */}
      <Route
        path="/task-status"
        element={
          <ProtectedRoute>
            <TaskStatusList />
          </ProtectedRoute>
        }
      />

      {/* Task Type Routes */}
      <Route
        path="/task-type"
        element={
          <ProtectedRoute>
            <TaskTypeList />
          </ProtectedRoute>
        }
      />

      {/* Priority Routes */}
      <Route
        path="/priority"
        element={
          <ProtectedRoute>
            <PriorityList />
          </ProtectedRoute>
        }
      />

      {/* SMTP Routes */}
      <Route
        path="/smtp"
        element={
          <ProtectedRoute>
            <SMTPList />
          </ProtectedRoute>
        }
      />

      {/* Settings Hub */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheduler"
        element={
          <ProtectedRoute>
            <Scheduler />
          </ProtectedRoute>
        }
      />

      {/* Reports Routes */}
      <Route path="/reports">
        <Route
          index
          element={
            <ProtectedRoute>
              <ReportsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="time-tracking"
          element={
            <ProtectedRoute>
              <TimeTrackingReport />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
