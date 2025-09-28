import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AuthPage from './AuthPage';
import ForgotPasswordPage from './ForgotPasswordPage'; // Import ForgotPasswordPage
import ResetPasswordPage from './ResetPasswordPage'; // Import ResetPasswordPage
import Dashboard, { DashboardHome } from './Dashboard';  // Dashboard layout + home
import AccountPage from './AccountPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import CommunityPage from './CommunityPage';
import ChallengesPage from './ChallengesPage';
import ResourcesPage from './ResourcesPage';  // Import ResourcesPage

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* Forgot Password route */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />   {/* Reset Password route */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="resources" element={<ResourcesPage />} />  {/* Added ResourcesPage route */}
        <Route path="account" element={<AccountPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
