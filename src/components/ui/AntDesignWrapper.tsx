/**
 * This is a centralized wrapper for importing Ant Design components
 * It ensures React is properly loaded before Ant Design is initialized
 */
import React from 'react';

// Initialize React properly first
window.React = React;

// Then lazily import Ant Design
export const AntD = React.lazy(() => import('antd'));

// Export individual components with proper React context
export const AntDesign = {
  // Use these components in your app instead of direct imports from 'antd'
  get Card() { return AntD.Card; },
  get Table() { return AntD.Table; },
  get Button() { return AntD.Button; },
  get Input() { return AntD.Input; },
  get Select() { return AntD.Select; },
  get DatePicker() { return AntD.DatePicker; },
  get TimePicker() { return AntD.TimePicker; },
  get Checkbox() { return AntD.Checkbox; },
  get Radio() { return AntD.Radio; },
  get Switch() { return AntD.Switch; },
  get Form() { return AntD.Form; },
  get Layout() { return AntD.Layout; },
  get Menu() { return AntD.Menu; },
  get Dropdown() { return AntD.Dropdown; },
  get Modal() { return AntD.Modal; },
  get message() { return AntD.message; },
  get notification() { return AntD.notification; },
  get Tooltip() { return AntD.Tooltip; },
  get Popover() { return AntD.Popover; },
  get Tabs() { return AntD.Tabs; },
  get Tag() { return AntD.Tag; },
  get Space() { return AntD.Space; },
  get Typography() { return AntD.Typography; },
  // Add other Ant Design components as needed
};

export default AntDesign;
