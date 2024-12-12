import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManageResidents from './pages/ManageResidents';
import ResidentSchedule from './pages/ResidentSchedule';
import Profile from './pages/AdminProfile';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
import EmployeeLogin from './pages/EmployeeLogin';
import UserDashboard from './pages/UserDashboard';
import IndividualSchedulePage from './pages/IndividualSchedulePage';
import TableComponent from './pages/TableComponent';
import DateDetailsPage from './pages/DateDetailsPage';
import UserHomepage from './pages/UserHomepage';
import SubmitRequests from './pages/SubmitRequests';
import LegacySchedule from './pages/LegacySchedule';
import AnalyticsPage from './pages/AnalyticsPage';

const PrivateRoute = ({ children, role }) => {
  // Accessing user and loading from AuthContext
  const { user, loading } = useAuth();

  // If loading is true, we have not yet determined if the user is present.
  // Returning a Loading... message prevents premature redirection.
  if (loading) {
    return <p>Loading...</p>;
  }

  // If user is null or undefined after loading completes, that means we are not authenticated.
  // This leads to a redirect to the home page.
  if (!user) {
    return <Navigate to="/" />;
  }

  // If a role is required and the user's role does not match, redirect to home.
  // This means user is logged in but not authorized.
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // If we reach here, user passes all checks. Render the protected content.
  return children;
};

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#e6f2fa]">
      <AdminSidebar />
      <div className="flex-grow p-6">{children}</div>
    </div>
  );
}

const BACKEND_URL = 'http://localhost:5000';

function App() {
  // State for all your fetched data
  const [data, setData] = useState([]);
  const [times, setTimes] = useState([]);
  const [assignmentsMeta, setAssignmentsMeta] = useState({});
  const [loading, setLoading] = useState(true); // loading state for fetching resident data
  const [error, setError] = useState(null);

  const totalWeeks = 52; 

  useEffect(() => {
    const fetchData = async () => {
      // This useEffect fetches data from backend and sets state accordingly.
      // If this data fails to fetch, or takes a while, note that it doesn't directly
      // influence user authentication—it's separate. However, if these components depend on
      // user info (or vice versa), timing issues could arise.
      try {
        const [datesRes, residentsRes, metadataRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/date_mapping1`).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch dates_mapping');
            return res.json();
          }),
          fetch(`${BACKEND_URL}/api/residents_assignments1/assignments`).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch assignments');
            return res.json();
          }),
          fetch(`${BACKEND_URL}/api/assignments_metadata`).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch assignments_metadata');
            return res.json();
          }),
        ]);

        // Process dates
        const weekNumberToDateRange = { ...datesRes };
        const datesArray = Array.from({ length: totalWeeks }, (_, i) => {
          const weekKey = (i + 1).toString();
          return weekNumberToDateRange[weekKey] || `Week ${weekKey}`;
        });
        setTimes(datesArray);

        // Process assignment metadata
        const assignmentNameToMetadata = Array.isArray(metadataRes)
          ? metadataRes.reduce((acc, item) => {
              acc[item.assignment_name] = {
                time: item.time,
                location: item.location,
                head_teacher: item.head_teacher,
              };
              return acc;
            }, {})
          : Object.keys(metadataRes).reduce((acc, key) => {
              const item = metadataRes[key];
              acc[item.assignment_name] = {
                time: item.time,
                location: item.location,
                head_teacher: item.head_teacher,
              };
              return acc;
            }, {});

        setAssignmentsMeta(assignmentNameToMetadata);

        // Transform resident data for the table
        const transformedData = residentsRes.map((resident) => {
          const assignmentsArray = Array.from({ length: totalWeeks }, (_, i) => {
            const weekIndex = i + 1;
            const assignment = resident.assignments.find(
              (assignment) => assignment.week_number === weekIndex
            );
            return assignment ? assignment.assignment : '-';
          });

          return {
            name: resident.name,
            assignments: assignmentsArray,
          };
        });

        setData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    // Initiate data fetch on mount.
    fetchData();
  }, []);

  // If still loading data, show loading
  // Note: This loading pertains to the data fetching, not Auth loading.
  // If AuthContext is also loading the user, we rely on PrivateRoute checks for that.
  if (loading) {
    return <p>Loading...</p>;
  }

  // If error fetching data, show error
  if (error) {
    return <p>{error}</p>;
  }

  // At this point, data is loaded. Now let's restore the user state.
  // Retrieve initial user from localStorage (if exists)
  const storedUser = localStorage.getItem('user');
  let initialUser = null;
  if (storedUser) {
    try {
      // Parse the user from local storage
      initialUser = JSON.parse(storedUser);
      // If this parse works, initialUser will have something like {username:"admin", role:"admin"}
      // This initialUser will be passed to AuthProvider.
    } catch (e) {
      // If parsing fails, user stays null
      initialUser = null;
    }
  }

  // We wrap everything in AuthProvider. This should accept `initialUser` and set its user state accordingly.
  // If AuthProvider does NOT handle `initialUser` correctly, user might not persist.
  // Also check if AuthProvider sets a 'loading' state until user is confirmed.
  return (
    <AuthProvider initialUser={initialUser}>
      <Router>
        {/* AuthStatePersistor ensures that whenever user changes in AuthContext, localStorage is updated */}
        <div className="flex flex-col min-w-[100vw] min-h-screen">
          <AuthStatePersistor />
          <Routes>
            {/* Public Routes, accessible without login */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/employee" element={<EmployeeLogin />} />

            {/* User Routes - should require at least a logged-in user (if you do that check elsewhere),
               Otherwise, if they're public, they don't cause issues. */}
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/user/home" element={<UserHomepage />} />
            <Route path="/user/submit-requests" element={<SubmitRequests />} />

            {/* Individual and Full Schedule - doesn't seem protected by role, just a view */}
            <Route
              path="/individual-schedule/:residentName"
              element={
                <div className="individual-schedule-page flex items-center justify-center min-h-screen">
                  <div className="calendar-container w-full max-w-5xl">
                    <IndividualSchedulePage
                      residents={data}
                      times={times}
                      assignmentsMeta={assignmentsMeta}
                    />
                  </div>
                </div>
              }
            />
            <Route
              path="/full-schedule"
              element={
                <TableComponent
                  data={data}
                  times={times}
                  assignmentsMeta={assignmentsMeta}
                  weeksPerPage={10}
                />
              }
            />

            {/* Admin Routes - These are protected by PrivateRoute with role="admin" */}
            <Route
              path="/admin"
              element={
                // PrivateRoute checks if loading from Auth is done, user is present and user.role === admin.
                // If user is null or role mismatch, we get redirected to "/".
                // On refresh, if user isn't yet set by AuthProvider, user is temporarily null -> redirect.
                <PrivateRoute role="admin">
                  <Navigate to="/admin/manage-residents" />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-residents"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <ManageResidents />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/resident-schedule"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <ResidentSchedule
                      data={data}
                      times={times}
                      assignmentsMeta={assignmentsMeta}
                      weeksPerPage={10}
                    />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <Profile />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/date/:date"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <DateDetailsPage
                      data={data}
                      times={times}
                      assignmentsMeta={assignmentsMeta}
                    />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/legacy-schedule"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <LegacySchedule
                      data={data}
                      times={times}
                      weeksPerPage={10}
                    />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout>
                    <AnalyticsPage data={data} times={times} />
                  </AdminLayout>
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AuthStatePersistor() {
  const { user } = useAuth();

  useEffect(() => {
    // Whenever user changes, we store or remove them in localStorage.
    // If user logs out, user goes to null and we remove from localStorage.
    // If user logs in, we set them in localStorage.
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return null;
}

export default App;
