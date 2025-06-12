import HomePage from '@/components/pages/HomePage';

export const routes = [
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks/*',
    icon: 'CheckSquare',
icon: 'CheckSquare',
    component: HomePage
  }
];

export const routeArray = Object.values(routes);