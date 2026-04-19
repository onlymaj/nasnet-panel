import type { RouterUser } from '../types';

export const seededRouterUsers = (): RouterUser[] => [
  {
    id: 'usr_admin_ubud',
    routerId: 'rtr_ubud',
    name: 'admin',
    group: 'full',
    disabled: false,
    lastLogin: '2026-04-17T08:12:00.000Z',
  },
  {
    id: 'usr_admin_tehran',
    routerId: 'rtr_tehran',
    name: 'admin',
    group: 'full',
    disabled: false,
    lastLogin: '2026-04-16T21:40:00.000Z',
  },
  {
    id: 'usr_admin_basecamp',
    routerId: 'rtr_basecamp',
    name: 'admin',
    group: 'full',
    disabled: false,
  },
];
