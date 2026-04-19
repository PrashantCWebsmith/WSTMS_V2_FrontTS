import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { ProjectList } from '@/features/projects/pages/ProjectList';
import { ProjectForm } from '@/features/projects/pages/ProjectForm';
import { TaskList } from '@/features/tasks/pages/TaskList';
import { TaskForm } from '@/features/tasks/pages/TaskForm';
import { TaskDetails } from '@/features/tasks/pages/TaskDetails';
import { UserList } from '@/features/users/pages/UserList';
import { UserForm } from '@/features/users/pages/UserForm';
import { UserCenter } from '@/features/users/pages/UserCenter';
import { RoleList } from '@/features/roles/pages/RoleList';
import { LeaveList } from '@/features/leave/pages/LeaveList';
import { LeaveForm } from '@/features/leave/pages/LeaveForm';
import { IncidentList } from '@/features/incidents/pages/IncidentList';
import { IncidentForm } from '@/features/incidents/pages/IncidentForm';
import { Profile } from '@/features/profile/pages/Profile';
import { TaskStatusList } from '@/features/task-status/pages/TaskStatusList';
import { TaskStatusForm } from '@/features/task-status/pages/TaskStatusForm';
import { TaskTypeList } from '@/features/task-type/pages/TaskTypeList';
import { TaskTypeForm } from '@/features/task-type/pages/TaskTypeForm';
import { PriorityList } from '@/features/priority/pages/PriorityList';
import { PriorityForm } from '@/features/priority/pages/PriorityForm';
import { SMTPList } from '@/features/smtp/pages/SMTPList';
import { SMTPForm } from '@/features/smtp/pages/SMTPForm';
import { SettingsHub } from '@/features/settings/pages/SettingsHub';
import { Scheduler } from '@/features/scheduler/pages/Scheduler';
import { ReportsDashboard } from '@/features/reports/pages/ReportsDashboard';
import { TimeTrackingReport } from '@/features/reports/pages/TimeTrackingReport';
import { LogSession } from '@/features/dashboard/pages/LogSession';
import { MainLayout } from '@/layouts/main-layout';
import { Loader2 } from 'lucide-react';
import { RoleForm } from '@/features/roles/pages/RoleForm';

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
      <Route path="/projects">
        <Route
          index
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <ProjectForm />
            </ProtectedRoute>
          }
        />
      </Route>

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
          path="new"
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <TaskForm />
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
          path="new"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <UserForm />
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
      <Route path="/roles">
        <Route
          index
          element={
            <ProtectedRoute>
              <RoleList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <RoleForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <RoleForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Leave Routes */}
      <Route path="/leave">
        <Route
          index
          element={
            <ProtectedRoute>
              <LeaveList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <LeaveForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <LeaveForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Incidents Routes */}
      <Route path="/incidents">
        <Route
          index
          element={
            <ProtectedRoute>
              <IncidentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <IncidentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <IncidentForm />
            </ProtectedRoute>
          }
        />
      </Route>

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
      <Route path="/task-status">
        <Route
          index
          element={
            <ProtectedRoute>
              <TaskStatusList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <TaskStatusForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <TaskStatusForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Task Type Routes */}
      <Route path="/task-type">
        <Route
          index
          element={
            <ProtectedRoute>
              <TaskTypeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <TaskTypeForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <TaskTypeForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Priority Routes */}
      <Route path="/priority">
        <Route
          index
          element={
            <ProtectedRoute>
              <PriorityList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <PriorityForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <PriorityForm />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* SMTP Routes */}
      <Route path="/smtp">
        <Route
          index
          element={
            <ProtectedRoute>
              <SMTPList />
            </ProtectedRoute>
          }
        />
        <Route
          path="new"
          element={
            <ProtectedRoute>
              <SMTPForm />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id/edit"
          element={
            <ProtectedRoute>
              <SMTPForm />
            </ProtectedRoute>
          }
        />
      </Route>

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
