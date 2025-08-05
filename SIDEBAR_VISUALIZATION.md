# Matanuska Transport Platform - Sidebar Visualization

```
┌─────────────────────────────────────────────────┐
│               MATANUSKA TRANSPORT                │
├─────────────────────────────────────────────────┤
│ 📊 Dashboard                                     │
├─────────────────────────────────────────────────┤
│ 🚚 Trip Management                      [▼]      │
│  ├── Active Trips                                │
│  ├── Completed Trips                             │
│  ├── Route Planning                              │
│  ├── Route Optimization                          │
│  ├── Load Planning                               │
│  ├── Trip Calendar                               │
│  ├── Add New Trip                                │
│  ├── Driver Performance                          │
│  ├── Cost Analysis                               │
│  ├── Fleet Utilization                           │
│  ├── Delivery Confirmations                      │
│  ├── Trip Templates                              │
│  ├── Trip Reports                                │
│  └── Maps & Tracking                   [▶]       │
├─────────────────────────────────────────────────┤
│ 📃 Invoices                            [▼]      │
│  ├── Dashboard                                   │
│  ├── Create New                                  │
│  ├── Pending Invoices                            │
│  ├── Paid Invoices                               │
│  ├── Overdue Invoices                            │
│  ├── Approval Workflow                           │
│  ├── Payment Reminders                           │
│  ├── Credit Notes                                │
│  ├── Invoice Templates                           │
│  ├── Payment Processing                          │
│  └── Tax Reports                                 │
├─────────────────────────────────────────────────┤
│ ⛽ Diesel Management                   [▼]      │
│  ├── Dashboard                                   │
│  ├── Fuel Logs                                   │
│  ├── Add New Entry                               │
│  ├── Fuel Cards                                  │
│  ├── Analytics                                   │
│  ├── Fuel Stations                               │
│  ├── Cost Analysis                               │
│  ├── Efficiency Reports                          │
│  ├── Theft Detection                             │
│  ├── Carbon Footprint                            │
│  └── Driver Behavior                             │
├─────────────────────────────────────────────────┤
│ 👥 Clients                            [▶]       │
├─────────────────────────────────────────────────┤
│ 🧑‍✈️ Drivers                            [▶]       │
├─────────────────────────────────────────────────┤
│ 📋 Compliance                         [▶]       │
├─────────────────────────────────────────────────┤
│ 📈 Analytics                          [▶]       │
├─────────────────────────────────────────────────┤
│ 🔧 Workshop                           [▼]       │
│  ├── Fleet Setup                                 │
│  ├── QR Generator                                │
│  ├── Vehicle Inspections              [▶]        │
│  ├── Job Cards                        [▶]        │
│  ├── Fault Tracking                              │
│  ├── Tyres                            [▶]        │
│  ├── Inventory                        [▶]        │
│  ├── Parts Ordering                              │
│  ├── Purchase Orders                             │
│  ├── Vendors                                     │
│  ├── Analytics                                   │
│  └── Reports                                     │
├─────────────────────────────────────────────────┤
│ 📝 Reports                           [▶]        │
├─────────────────────────────────────────────────┤
│ 🔔 Notifications                                 │
├─────────────────────────────────────────────────┤
│ ⚙️ Settings                                      │
└─────────────────────────────────────────────────┘
```

## Expanded Workshop > Tyres Section (Example of nested submenu)

```
┌─────────────────────────────────────────────────┐
│ 🔧 Workshop > 🛞 Tyres                          │
├─────────────────────────────────────────────────┤
│  ├── Dashboard                                   │
│  ├── Inspection                                  │
│  ├── Inventory                                   │
│  ├── Fleet Map                                   │
│  ├── History                                     │
│  ├── Performance                                 │
│  └── Add New                                     │
└─────────────────────────────────────────────────┘
```

## Implementation Plan

To implement this sidebar structure:

1. Update the `sidebarConfig.ts` file with all menu items shown above
2. Ensure each item has a corresponding:
   - Unique ID
   - Display label
   - Route path
   - Component reference
   - Icon (optional)

3. For nested menus, implement proper parent-child relationships

4. Connect every menu item to its corresponding component using `AppRoutes.tsx`

5. Style the sidebar with proper indentation and expand/collapse functionality

This structure ensures all 407 components are accessible through an intuitive navigation system, making the full functionality of your application available to users.
