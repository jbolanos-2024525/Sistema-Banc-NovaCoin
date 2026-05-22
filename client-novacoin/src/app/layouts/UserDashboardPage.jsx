import { Outlet } from 'react-router-dom';
import { UserSidebar } from '../../features/auth/components/UserSidebar.jsx';

export const UserDashboardPage = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <UserSidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};
