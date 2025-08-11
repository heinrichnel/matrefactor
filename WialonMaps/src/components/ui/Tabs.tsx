import { ReactNode } from 'react';

interface TabProps {
  id: string;
  label: string;
  active?: boolean;
  onClick?: (id: string) => void;
}

interface TabsProps {
  children?: ReactNode;
  tabs: TabProps[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const Tab = ({ id, label, active = false, onClick }: TabProps) => {
  return (
    <button
      onClick={() => onClick?.(id)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        active
          ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-2">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={onTabChange}
          />
        ))}
      </nav>
    </div>
  );
};
