import Home from '../pages/Home';

export const routes = [
  {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks/*',
    icon: 'CheckSquare',
    component: Home
  }
];

export const routeArray = Object.values(routes);