import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  car: <Iconify icon="tabler:car" />,
  maintenance: <Iconify icon="map:car-repair" />,
  document: <Iconify icon="carbon:document" />,
  driver: <Iconify icon="healthicons:truck-driver" />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('overview'),
        items: [
          {
            title: t('app'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('company'),
            path: paths.dashboard.company.root,
            icon: ICONS.menuItem,
            children: [
              { title: t('list'), path: paths.dashboard.company.root },
              { title: t('create'), path: paths.dashboard.company.root },
            ],
          },

          {
            title: t('vehicles'),
            path: paths.dashboard.vehicle.root,
            icon: ICONS.car,
            children: [
              { title: t('vehiclesList'), path: paths.dashboard.vehicle.root },
              { title: t('logAndNotification'), path: paths.dashboard.vehicle.log },
              { title: t('costAndInput'), path: paths.dashboard.vehicle.inputs },
            ],
          },
          // USER
          {
            title: t('maintenance'),
            path: paths.dashboard.maintenance.root,
            icon: ICONS.maintenance,
            children: [
              { title: t('maintainList'), path: paths.dashboard.maintenance.root },
              { title: t('allNoti'), path: paths.dashboard.maintenance.notifications },
              { title: t('inMaintenance'), path: paths.dashboard.maintenance.currentInMaintenance },
              // { title: t('list'), path: paths.dashboard.user.list },
              // { title: t('create'), path: paths.dashboard.user.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              // { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          // USER
          {
            title: t('documents'),
            path: paths.dashboard.documents.root,
            icon: ICONS.file,
            children: [
              { title: t('documents'), path: paths.dashboard.documents.root },
              { title: t('allNoti'), path: paths.dashboard.documents.alerts },
              // { title: t('list'), path: paths.dashboard.user.list },
              // { title: t('create'), path: paths.dashboard.user.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              // { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          // PRODUCT
          {
            title: t('drivers'),
            path: paths.dashboard.drivers.root,
            icon: ICONS.driver,
            children: [
              { title: t('driversList'), path: paths.dashboard.drivers.root },
              { title: t('alerts'), path: paths.dashboard.drivers.alerts },
              { title: t('salaries'), path: paths.dashboard.drivers.root },
              // {
              //   title: t('details'),
              //   path: paths.dashboard.product.demo.details,
              // },
              // { title: t('create'), path: paths.dashboard.product.new },
              // { title: t('edit'), path: paths.dashboard.product.demo.edit },
            ],
          },

          // ORDER
          {
            title: t('clients'),
            path: paths.dashboard.clients.root,
            icon: ICONS.user,
            children: [
              { title: t('clients'), path: paths.dashboard.clients.root },
              { title: t('alerts'), path: paths.dashboard.clients.alerts },
              { title: t('contracts'), path: paths.dashboard.clients.contracts },
              { title: t('claims'), path: paths.dashboard.clients.claims },
            ],
          },
        ],
      },

      // DEMO MENU STATES
      {
        subheader: t(t('other_cases')),
        items: [
          {
            title: t('reports'),
            path: paths.dashboard.permission,
            icon: ICONS.blog,
            roles: ['admin', 'manager'],
          },
          {
            // default roles : All roles can see this entry.
            // roles: ['user'] Only users can see this item.
            // roles: ['admin'] Only admin can see this item.
            // roles: ['admin', 'manager'] Only admin/manager can see this item.
            // Reference from 'src/guards/RoleBasedGuard'.
            title: t('users'),
            path: paths.dashboard.user.list,
            icon: ICONS.lock,
            roles: ['admin', 'manager'],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
