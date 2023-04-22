import { Icon } from '@iconify/react';
import cashRegister from '@iconify-icons/mdi/cash-register';
import silverwareForkKnife from '@iconify-icons/mdi/silverware-fork-knife';
import basketFill from '@iconify-icons/mdi/basket-fill';
import formatColumns from '@iconify-icons/mdi/format-columns';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Зал',
    path: '/cash-box',
    icon: getIcon(cashRegister)
  },
  {
    title: 'Приготовление',
    path: '/cooking-tracking',
    icon: getIcon(silverwareForkKnife)
  },
  {
    title: 'Выдача',
    path: '/issue-tracking',
    icon: getIcon(basketFill)
  },
  {
    title: 'Табло',
    path: '/issue-screen',
    icon: getIcon(formatColumns)
  }
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon(lockFill)
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon(personAddFill)
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon(alertTriangleFill)
  // }
];

export default sidebarConfig;
