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
  settings: icon('ic_settings'),
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
            title: t('statistics'),
            path: paths.dashboard.root,
            icon: ICONS.analytics,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // {
          //   title: t('vehicles'),
          //   path: paths.dashboard.vehicle.root,
          //   icon: ICONS.car,
          //   permissions:["read.car"],
          //   children: [
          //     { title: t('vehiclesList'), permissions:"read.car", path: paths.dashboard.vehicle.root },
          //     { title: t('logAndNotification'), permissions:"read.car_log", path: paths.dashboard.vehicle.log },
          //     { title: t('costAndInput'), permissions:"read.car", path: paths.dashboard.vehicle.inputs },
          //   ],
          // },
          {
            title: t('products'),
            path: paths.dashboard.product.root,
            icon: ICONS.product,
            children: [
              // { title: t('alerts'), path: paths.dashboard.product.root },
              // { title: t('details'), path: paths.dashboard.product.demo.details, },
              { title: t('list'), path: paths.dashboard.product.root },
              { title: t('create'), path: paths.dashboard.product.new },
            ],
          },
          {
            title: t('orders'),
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              // { title: t('alerts'), path: paths.dashboard.order.root },
              // {title: t('details'),path: paths.dashboard.product.demo.details,},
              // { title: t('create'), path: paths.dashboard.product.new },
              { title: t('list'), path: paths.dashboard.order.root },
            ],
          },

        ],
      },

      // DEMO MENU STATES
      {
        subheader: t('other_cases'),
        items: [
          {
            title: t('users'),
            path: paths.dashboard.user.list,
            icon: ICONS.lock,
            roles: ['admin', 'manager'],
            permissions: ["read.user"],
            children: [
              { title: t('users'), permissions: "read.user", path: paths.dashboard.user.list },
              { title: t('roles'), permissions: "read.role", path: paths.dashboard.user.roles },
            ],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
