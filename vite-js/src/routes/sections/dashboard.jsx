import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';
import ContractCreatePage from 'src/pages/dashboard/clients/contracts-new';
import SettingsView from 'src/sections/settings/view';
import { DataContextProvider } from 'src/context/system-data/DataContext';
import PermissionsRouteContext from 'src/auth/context/permissions/permissions-route-context';
import { element } from 'prop-types';
import HomePage from 'src/pages/home';


// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// ORDER
const MainSpecListPage = lazy(() => import('src/pages/dashboard/settings/pm'));
const ClaimCreatePage = lazy(() => import('src/pages/dashboard/clients/claims-new'));
const MainSpecCreatePage = lazy(() => import('src/pages/dashboard/settings/pm-new'));
const MainSpecEditPage = lazy(() => import('src/pages/dashboard/settings/edit'));

// roles
const RolesListPage = lazy(() => import('src/pages/dashboard/user/roles/roles'));
const RolesCreatePage = lazy(() => import('src/pages/dashboard/user/roles/roles-new'));
const RolesEditPage = lazy(() => import('src/pages/dashboard/user/roles/roles-edit'));
// users
const UsersListPage = lazy(() => import('src/pages/dashboard/user/users/users'));
// car models system settings 
const CarModelsListPage = lazy(() => import('src/pages/dashboard/settings/car_models/car_models'));
const CarModelsCreatePage = lazy(() => import('src/pages/dashboard/settings/car_models/car_models-new'));
const CarModelsEditPage = lazy(() => import('src/pages/dashboard/settings/car_models/car_models-edit'));
// document system settings 
const DocumentListPage = lazy(() => import('src/pages/dashboard/settings/documents/documents'));
const DocumentCreatePage = lazy(() => import('src/pages/dashboard/settings/documents/documents-new'));
const DocumentEditPage = lazy(() => import('src/pages/dashboard/documents/edit'));
// Neighborhood system settings 
const NeighborhoodListPage = lazy(() => import('src/pages/dashboard/settings/neighborhood/neighborhood'));
const NeighborhoodCreatePage = lazy(() => import('src/pages/dashboard/settings/neighborhood/neighborhood-new'));
const NeighborhoodEditPage = lazy(() => import('src/pages/dashboard/settings/neighborhood/neighborhood-edit'));
// system item  settings 
const AdminSystemItemListPage = lazy(() => import('src/pages/dashboard/settings/items/items-admin'));
const SystemItemListPage = lazy(() => import('src/pages/dashboard/settings/items/items'));
const SystemItemCreatePage = lazy(() => import('src/pages/dashboard/settings/items/items-new'));
const SystemItemEditPage = lazy(() => import('src/pages/dashboard/settings/items/items-edit'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UsersCreatePage = lazy(() => import('src/pages/dashboard/user/users/users-new'));
const UsersEditPage = lazy(() => import('src/pages/dashboard/user/users/users-edit'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Vehicles
const VehiclesListPage = lazy(() => import('src/pages/dashboard/vehicle/list'));
const LogListPage = lazy(() => import('src/pages/dashboard/vehicle/log'));
const InputsListPage = lazy(() => import('src/pages/dashboard/vehicle/inputs&costs'));

const VehiclePage = lazy(() => import('src/pages/dashboard/vehicle/details'));
const VehiclesCreatePage = lazy(() => import('src/pages/dashboard/vehicle/new'));
const VehiclesEditPage = lazy(() => import('src/pages/dashboard/vehicle/edit'));
const PMListPage = lazy(() => import('src/pages/dashboard/periodic-maintenance/list'));

// Maintains
const MaintainListPage = lazy(() => import('src/pages/dashboard/maintain/list'));
const MaintainNewPage = lazy(() => import('src/pages/dashboard/maintain/new'));
const MaintainEditPage = lazy(() => import('src/pages/dashboard/maintain/edit'));
const NotificationsMaintainListPage = lazy(
  () => import('src/pages/dashboard/maintain/notifications')
);
const MaintainDetailsPage = lazy(() => import('src/pages/dashboard/maintain/details'));

// Maintains
// const MaintainListPage = lazy(() => import('src/pages/dashboard/maintain/list'));
const ClauseNewPage = lazy(() => import('src/pages/dashboard/clause/new'));
const ClauseEditPage = lazy(() => import('src/pages/dashboard/clause/edit'));
// const NotificationsMaintainListPage = lazy(
//   () => import('src/pages/dashboard/maintain/notifications')
// );
// const MaintainDetailsPage = lazy(() => import('src/pages/dashboard/maintain/details'));

// Documents
const InvoicePreview = lazy(() => import('src/pages/dashboard/documents/preview'));
const DocumentsListPage = lazy(() => import('src/pages/dashboard/documents/list'));
const DocumentsNewPage = lazy(() => import('src/pages/dashboard/documents/new'));
const DocumentsEditPage = lazy(() => import('src/pages/dashboard/documents/edit'));
const NotificationDocumentsListView = lazy(() => import('src/pages/dashboard/documents/alerts'));
const CurrentInMaintainListView = lazy(
  () => import('src/pages/dashboard/maintain/currentInMaintain')
);

// JOB
const DriversDetailsPage = lazy(() => import('src/pages/dashboard/drivers/details'));
const DriversListPage = lazy(() => import('src/pages/dashboard/drivers/list'));
const DriversCreatePage = lazy(() => import('src/pages/dashboard/drivers/new'));
const DriversSalaryPage = lazy(() => import('src/pages/dashboard/drivers/sallery'));
const DriversEditPage = lazy(() => import('src/pages/dashboard/drivers/edit'));
const AlertsDriversCreatePage = lazy(() => import('src/pages/dashboard/drivers/alerts'));

// Clients
const ClientsListPage = lazy(() => import('src/pages/dashboard/clients/list'));
const ClientsDetailsPage = lazy(() => import('src/pages/dashboard/clients/clients-details'));
const ContractsListPage = lazy(() => import('src/pages/dashboard/clients/contracts'));
const ClaimsListPage = lazy(() => import('src/pages/dashboard/clients/claims'));
const ClientsCreatePage = lazy(() => import('src/pages/dashboard/clients/new'));
const ClientEditPage = lazy(() => import('src/pages/dashboard/clients/edit'));
const AlertsClientsListPage = lazy(() => import('src/pages/dashboard/clients/alerts'));

const ContractsDetailsPage = lazy(() => import('src/pages/dashboard/clients/contracts-details'));
// JOB
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

const CompanyPage = lazy(() => import('src/pages/dashboard/company/list'));
const CompanyEditPage = lazy(() => import('src/pages/dashboard/company/edit'));
const CompanyNewPage = lazy(() => import('src/pages/dashboard/company/new'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            {/* <DataContextProvider> */}
              <Outlet />
            {/* </DataContextProvider> */}
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <PermissionsRouteContext action={"read.user"} ><UsersListPage /></PermissionsRouteContext> },
          { path: 'new', element: <PermissionsRouteContext action={"create.user"} ><UsersCreatePage /></PermissionsRouteContext>  },
          { path: ':id/edit', element: <PermissionsRouteContext action={"update.user"} ><UsersEditPage /></PermissionsRouteContext> },
          { path: 'account', element: <UserAccountPage /> },
          { path: 'roles', element: <PermissionsRouteContext action={"read.role"} ><RolesListPage /></PermissionsRouteContext> },
          { path: 'roles/new', element: <PermissionsRouteContext action={"create.role"} ><RolesCreatePage /></PermissionsRouteContext> },
          { path: 'roles/:id/edit', element:<PermissionsRouteContext action={"update.role"} ><RolesEditPage /></PermissionsRouteContext>  },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/orders', element: <OrderListPage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'vehicle',
        children: [
          { element: <PermissionsRouteContext action={"read.car"} ><VehiclesListPage /></PermissionsRouteContext>, index: true },
          { path: 'list', element: <PermissionsRouteContext action={"read.car"} ><VehiclesListPage /></PermissionsRouteContext> },
          { path: 'log', element: <LogListPage /> },
          { path: 'inputs', element: <InputsListPage /> },
          { path: ':id', element: <PermissionsRouteContext action={"read.car"} ><VehiclePage /></PermissionsRouteContext> },
          { path: 'new', element:<PermissionsRouteContext action={"create.car"} > <VehiclesCreatePage /></PermissionsRouteContext> },
          { path: ':id/edit', element: <PermissionsRouteContext action={"update.car"} ><VehiclesEditPage /></PermissionsRouteContext> },
          { path: ':id/pm', element: <PMListPage /> },
        ],
      },
      {
        path: 'maintenance',
        children: [
          { element:<PermissionsRouteContext action={"read.maintenance"} ><MaintainListPage /></PermissionsRouteContext> , index: true },
          { path: 'list', element: <PermissionsRouteContext action={"read.maintenance"} ><MaintainListPage /></PermissionsRouteContext> },
          { path: ':id', element: <PermissionsRouteContext action={"read.maintenance"} ><MaintainDetailsPage /></PermissionsRouteContext> },
          { path: 'new', element: <PermissionsRouteContext action={"create.maintenance"} ><MaintainNewPage /></PermissionsRouteContext> },
          { path: 'notifications', element: <NotificationsMaintainListPage /> },

          { path: ':id/edit', element: <PermissionsRouteContext action={"update.maintenance"} ><MaintainEditPage /></PermissionsRouteContext> },
          { path: ':id/clause', element: <ClauseNewPage /> },

          { path: 'current-in-maintenance', element: <CurrentInMaintainListView /> },
        ],
      },

      {
        path: 'documents',
        children: [
          { element: <DocumentsListPage />, index: true },
          { path: 'preview', element: <InvoicePreview /> },
          { path: 'list', element: <DocumentsListPage /> },
          { path: ':id', element: <VehiclePage /> },
          { path: 'new', element: <DocumentsNewPage /> },
          { path: ':id/edit', element: <DocumentsEditPage /> },
          { path: 'alerts', element: <NotificationDocumentsListView /> },
        ],
      },
      {
        path: 'drivers',
        children: [
          { element: <DriversListPage />, index: true },
          { path: 'list', element: <DriversListPage /> },
          { path: 'salary', element: <DriversSalaryPage /> },
          { path: ':id', element: <DriversDetailsPage /> },
          { path: ':id/edit', element: <DriversEditPage /> },

          { path: 'new', element: <DriversCreatePage /> },
          { path: 'alerts', element: <AlertsDriversCreatePage /> },
        ],
      },

      {
        path: 'clients',
        children: [
          { element: <ClientsListPage />, index: true },
          { path: 'list', element: <ClientsListPage /> },
          { path: 'new', element: <ClientsCreatePage /> },
          { path: ':id/edit', element: <ClientEditPage /> },
          { path: 'contracts', element: <ContractsListPage /> },
          { path: 'contracts/new', element: <ContractCreatePage /> },
          { path: 'contracts/:id', element: <ContractsDetailsPage /> },
          { path: 'claims', element: <ClaimsListPage /> },
          { path: 'claims/new', element: <ClaimCreatePage /> },
          { path: 'alerts', element: <AlertsClientsListPage /> },
          { path: ':id', element: <ClientsDetailsPage /> },
        ],
      },

      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { element: <SettingsView />, index: true },
          { path: "pm", element: <SystemItemListPage collection={{metadata:"Maintenance Specification",type:"maintenance_specification"}} />, index: true },
          { path: 'pm/new', element: <SystemItemCreatePage collection={{metadata:"Maintenance Specification",type:"maintenance_specification"}} /> },
          { path: 'pm/:id/edit', element: <SystemItemEditPage collection={{metadata:"Maintenance Specification",type:"maintenance_specification"}} /> },
          { path: ":model/admin", element: <AdminSystemItemListPage />, index: true },
          { path: "attachment_names", element: <SystemItemListPage collection={{metadata:"Attachment Names",type:"attachment_name"}} />, index: true },
          { path: 'attachment_names/new', element: <SystemItemCreatePage collection={{metadata:"Attachment Names",type:"attachment_name"}} /> },
          { path: 'attachment_names/:id/edit', element: <SystemItemEditPage collection={{metadata:"Attachment Names",type:"attachment_name"}} /> },
          { path: "specs", element: <SystemItemListPage collection={{metadata:"Specs",type:"spec"}} />, index: true },
          { path: 'specs/new', element: <SystemItemCreatePage collection={{metadata:"Specs",type:"spec"}} /> },
          { path: 'specs/:id/edit', element: <SystemItemEditPage collection={{metadata:"Specs",type:"spec"}} /> },
          { path: "license_types", element: <SystemItemListPage collection={{metadata:"License Type",type:"license_type"}} />, index: true },
          { path: 'license_types/new', element: <SystemItemCreatePage collection={{metadata:"License Type",type:"license_type"}} /> },
          { path: 'license_types/:id/edit', element: <SystemItemEditPage collection={{metadata:"License Type",type:"license_type"}} /> },
          { path: "payment_methods", element: <SystemItemListPage collection={{metadata:"Payment Method",type:"payment_method"}} />, index: true },
          { path: 'payment_methods/new', element: <SystemItemCreatePage collection={{metadata:"Payment Method",type:"payment_method"}} /> },
          { path: 'payment_methods/:id/edit', element: <SystemItemEditPage collection={{metadata:"Payment Method",type:"payment_method"}} /> },
          { path: "states", element: <SystemItemListPage collection={{metadata:"States",type:"state"}} />, index: true },
          { path: 'states/new', element: <SystemItemCreatePage collection={{metadata:"States",type:"state"}} /> },
          { path: 'states/:id/edit', element: <SystemItemEditPage collection={{metadata:"States",type:"state"}} /> },
          { path: "colors", element: <SystemItemListPage collection={{metadata:"Colors",type:"color"}} />, index: true },
          { path: 'colors/new', element: <SystemItemCreatePage collection={{metadata:"Colors",type:"color"}} /> },
          { path: 'colors/:id/edit', element: <SystemItemEditPage collection={{metadata:"Colors",type:"color"}} /> },
          { path: "countries", element: <SystemItemListPage collection={{metadata:"Countries",type:"country"}} />, index: true },
          { path: 'countries/new', element: <SystemItemCreatePage collection={{metadata:"Countries",type:"country"}} /> },
          { path: 'countries/:id/edit', element: <SystemItemEditPage /> },
          { path: "car_models", element: <SystemItemListPage collection={{metadata:"Car Model",type:"car_model"}} />, index: true },
          { path: 'car_models/new', element: <SystemItemCreatePage collection={{metadata:"Car Model",type:"car_model"}} /> },
          { path: 'car_models/:id/edit', element: <SystemItemEditPage collection={{metadata:"Car Model",type:"car_model"}} /> },
          { path: "car_companies", element: <SystemItemListPage collection={{metadata:"Car Company",type:"car_company"}} />, index: true },
          { path: 'car_companies/new', element: <SystemItemCreatePage collection={{metadata:"Car Company",type:"car_company"}} /> },
          { path: 'car_companies/:id/edit', element: <SystemItemEditPage collection={{metadata:"Car Company",type:"car_company"}} /> },
          { path: "documents", element: <DocumentListPage />, index: true },
          { path: 'documents/new', element: <DocumentCreatePage /> },
          { path: 'documents/:id/edit', element: <DocumentEditPage /> },
          { path: "neighborhood", element: <SystemItemListPage collection={{metadata:"Neighborhood",type:"neighborhood"}} />, index: true },
          { path: 'neighborhood/new', element: <SystemItemCreatePage collection={{metadata:"Neighborhood",type:"neighborhood"}} /> },
          { path: 'neighborhood/:id/edit', element: <SystemItemEditPage collection={{metadata:"Neighborhood",type:"neighborhood"}} /> },
        ],
      },

      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },

      {
        path: 'company',
        children: [
          { element: <CompanyPage />, index: true },
          { path: 'list', element: <CompanyPage /> },
          { path: ':id', element: <CompanyEditPage /> },
          { path: 'new', element: <CompanyNewPage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
  {
    path:'home',
    element:<HomePage />
  }
];
