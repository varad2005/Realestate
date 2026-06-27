import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const HomeWrapper = lazy(() => import('@/pages/Home/HomePage').then(m => ({ default: m.HomeWrapper })));
const BuyPage = lazy(() => import('@/pages/BuyPage').then(m => ({ default: m.BuyPage })));
const RentPage = lazy(() => import('@/pages/TenantsPage').then(m => ({ default: m.TenantsPage })));
const NewLaunchPage = lazy(() => import('@/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const CommercialPage = lazy(() => import('@/pages/CommercialPage').then(m => ({ default: m.CommercialPage })));
const PlotsPage = lazy(() => import('@/pages/PlotsPage').then(m => ({ default: m.PlotsPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const PopularAreasPage = lazy(() => import('@/pages/PopularAreasPage').then(m => ({ default: m.PopularAreasPage })));
const LuxuryHomesPage = lazy(() => import('@/pages/LuxuryHomesPage').then(m => ({ default: m.LuxuryHomesPage })));
const BudgetHomesPage = lazy(() => import('@/pages/BudgetHomesPage').then(m => ({ default: m.BudgetHomesPage })));
const ReadyToMovePage = lazy(() => import('@/pages/ReadyToMovePage').then(m => ({ default: m.ReadyToMovePage })));
const BuyersPage = lazy(() => import('@/pages/BuyersPage').then(m => ({ default: m.BuyersPage })));
const TenantsPage = lazy(() => import('@/pages/TenantsPage').then(m => ({ default: m.TenantsPage })));
const OwnersPage = lazy(() => import('@/pages/OwnersPage').then(m => ({ default: m.OwnersPage })));
const DealersPage = lazy(() => import('@/pages/DealersPage').then(m => ({ default: m.DealersPage })));
const InsightsPage = lazy(() => import('@/pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const PropertyDetailPage = lazy(() => import('@/features/property').then(m => ({ default: m.PropertyDetailPage })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));
const PostPropertyPage = lazy(() => import('@/features/post/PostPropertyPage').then(m => ({ default: m.PostPropertyPage })));
const LoginPage = lazy(() => import('@/features/auth').then(m => ({ default: m.LoginPage })));
const ProfilePage = lazy(() => import('@/features/auth').then(m => ({ default: m.ProfilePage })));
const MyListingsPage = lazy(() => import('@/pages/owner/MyListingsPage').then(m => ({ default: m.MyListingsPage })));
const SavedListingsPage = lazy(() => import('@/pages/SavedListingsPage').then(m => ({ default: m.SavedListingsPage })));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminPropertiesPage = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminPropertiesPage })));
const AdminUsersPage = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminUsersPage })));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminReviewsPage = lazy(() => import('@/pages/admin/AdminReviewsPage').then(m => ({ default: m.AdminReviewsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminActivityPage = lazy(() => import('@/pages/admin/AdminActivityPage').then(m => ({ default: m.AdminActivityPage })));
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage').then(m => ({ default: m.AdminProfilePage })));
const AdminBannersPage = lazy(() => import('@/pages/admin/AdminBannersPage').then(m => ({ default: m.AdminBannersPage })));
const AdminAddonsPage = lazy(() => import('@/pages/admin/AdminAddonsPage').then(m => ({ default: m.AdminAddonsPage })));
const AdminAddonOrdersPage = lazy(() => import('@/pages/admin/AdminAddonOrdersPage').then(m => ({ default: m.AdminAddonOrdersPage })));

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F5F5F6]">
    <div className="w-10 h-10 border-4 border-[#FF3F6C]/20 border-t-[#FF3F6C] rounded-full animate-spin"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Fallback />}><HomeWrapper /></Suspense>,
      },
      {
        path: 'buy/:city?',
        element: <Suspense fallback={<Fallback />}><BuyPage /></Suspense>,
      },
      {
        path: 'rent',
        element: <Suspense fallback={<Fallback />}><RentPage /></Suspense>,
      },
      {
        path: 'new-launch',
        element: <Suspense fallback={<Fallback />}><NewLaunchPage /></Suspense>,
      },
      {
        path: 'commercial',
        element: <Suspense fallback={<Fallback />}><CommercialPage /></Suspense>,
      },
      {
        path: 'plots',
        element: <Suspense fallback={<Fallback />}><PlotsPage /></Suspense>,
      },
      {
        path: 'projects',
        element: <Suspense fallback={<Fallback />}><ProjectsPage /></Suspense>,
      },
      {
        path: 'popular-areas',
        element: <Suspense fallback={<Fallback />}><PopularAreasPage /></Suspense>,
      },
      {
        path: 'luxury-homes',
        element: <Suspense fallback={<Fallback />}><LuxuryHomesPage /></Suspense>,
      },
      {
        path: 'budget-homes',
        element: <Suspense fallback={<Fallback />}><BudgetHomesPage /></Suspense>,
      },
      {
        path: 'ready-to-move',
        element: <Suspense fallback={<Fallback />}><ReadyToMovePage /></Suspense>,
      },
      {
        path: 'buyers',
        element: <Suspense fallback={<Fallback />}><BuyersPage /></Suspense>,
      },
      {
        path: 'tenants',
        element: <Suspense fallback={<Fallback />}><TenantsPage /></Suspense>,
      },
      {
        path: 'owners',
        element: <Suspense fallback={<Fallback />}><OwnersPage /></Suspense>,
      },
      {
        path: 'dealers',
        element: <Suspense fallback={<Fallback />}><DealersPage /></Suspense>,
      },
      {
        path: 'insights',
        element: <Suspense fallback={<Fallback />}><InsightsPage /></Suspense>,
      },
      {
        path: 'property/:id',
        element: <Suspense fallback={<Fallback />}><PropertyDetailPage /></Suspense>,
      },
      {
        path: 'post-property',
        element: (
          <ProtectedRoute role={['owner', 'dealer']}>
            <Suspense fallback={<Fallback />}><PostPropertyPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Fallback />}><ProfilePage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-listings',
        element: (
          <ProtectedRoute role={['owner', 'dealer']}>
            <Suspense fallback={<Fallback />}><MyListingsPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'saved-listings',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Fallback />}><SavedListingsPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Suspense fallback={<Fallback />}><NotFound /></Suspense>,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <Suspense fallback={<Fallback />}><AdminLayout /></Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Suspense fallback={<Fallback />}><Dashboard /></Suspense>
      },
      {
        path: 'properties',
        element: <Suspense fallback={<Fallback />}><AdminPropertiesPage /></Suspense>
      },
      {
        path: 'users',
        element: <Suspense fallback={<Fallback />}><AdminUsersPage /></Suspense>
      },
      {
        path: 'reports',
        element: <Suspense fallback={<Fallback />}><AdminReportsPage /></Suspense>
      },
      {
        path: 'reviews',
        element: <Suspense fallback={<Fallback />}><AdminReviewsPage /></Suspense>
      },
      {
        path: 'settings',
        element: <Suspense fallback={<Fallback />}><AdminSettingsPage /></Suspense>
      },
      {
        path: 'activity',
        element: <Suspense fallback={<Fallback />}><AdminActivityPage /></Suspense>
      },
      {
        path: 'profile',
        element: <Suspense fallback={<Fallback />}><AdminProfilePage /></Suspense>
      },
      {
        path: 'banners',
        element: <Suspense fallback={<Fallback />}><AdminBannersPage /></Suspense>
      },
      {
        path: 'addons',
        element: <Suspense fallback={<Fallback />}><AdminAddonsPage /></Suspense>
      },
      {
        path: 'addon-orders',
        element: <Suspense fallback={<Fallback />}><AdminAddonOrdersPage /></Suspense>
      }
    ]
  },
  {
    path: '/login',
    element: <Suspense fallback={<Fallback />}><LoginPage /></Suspense>,
  },
]);
