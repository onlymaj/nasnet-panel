import React from 'react';
import { useCollapsibleSidebarContext } from '@nasnet/ui/layouts';
import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Router, Settings } from 'lucide-react';
import { cn } from '@nasnet/ui/utils';
interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}
interface NavSection {
  titleKey: string;
  items: NavItem[];
}
const NAV_LABELS: Record<string, string> = {
  Overview: 'Overview',
  Monitoring: 'Monitoring',
  Configuration: 'Configuration',
  Advanced: 'Advanced',
  Dashboard: 'Dashboard',
  Routers: 'Routers',
  Traffic: 'Traffic',
  Network: 'Network',
  WiFi: 'WiFi',
  Security: 'Security',
  Services: 'Services',
  Diagnostics: 'Diagnostics',
  Internet: 'Internet',
  Settings: 'Settings',
};
const NAV_SECTIONS: NavSection[] = [
  {
    titleKey: 'Overview',
    items: [
      {
        key: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
      {
        key: 'Routers',
        href: '/routers',
        icon: Router,
      },
    ],
  },
  {
    titleKey: 'Advanced',
    items: [
      {
        key: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];
export function AppSidebar() {
  const { isCollapsed } = useCollapsibleSidebarContext();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  return (
    <nav
      aria-label={'Main navigation'}
      className="gap-component-sm px-component-sm flex h-full flex-col overflow-y-auto py-4 pb-8"
    >
      {NAV_SECTIONS.map((section) => (
        <div
          key={section.titleKey}
          className="mb-4"
        >
          {!isCollapsed && (
            <p className="font-display text-secondary mb-1 px-3 text-xs font-semibold uppercase tracking-wider">
              {NAV_LABELS[section.titleKey] ?? section.titleKey}
            </p>
          )}
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive =
                item.href === '/' ? currentPath === '/' : currentPath.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.key}>
                  <Link
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 text-sm font-medium transition-all duration-150',
                      'min-h-[44px]',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
                      isActive ?
                        'bg-primary/15 text-primary border-primary -ml-[3px] border-l-[3px]'
                      : 'text-foreground',
                      isCollapsed ? 'justify-center px-2' : ''
                    )}
                    title={isCollapsed ? (NAV_LABELS[item.key] ?? item.key) : undefined}
                  >
                    <Icon
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span>{NAV_LABELS[item.key] ?? item.key}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
