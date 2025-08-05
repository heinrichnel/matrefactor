import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { sidebarConfig } from "./config/sidebarConfig";
import { CSSProperties } from "react";

// Define sidebar item interface
interface SidebarItem {
  id: string;
  path: string;
  label: string;
  icon?: string;
  component?: React.ComponentType<any>;
  children?: SidebarItem[];
}

// Define test results interface
interface TestResults {
  totalRoutes: number;
  accessibleRoutes: number;
  nestedRoutes: number;
  maxNestingLevel: number;
  sidebarTitle: {
    fontSize: "0.9rem",
    textTransform: "uppercase" as const,
    marginBottom: "0.5rem",
    color: "#a0aec0",
    fontWeight: "bold",
  } as CSSProperties,
    overflow: "hidden",
  } as CSSProperties,
  sidebar: {
    width: "280px",
    backgroundColor: "#1a2236",
    color: "white",
    padding: "1rem",
    overflowY: "auto" as const,
  } as CSSProperties,
  sidebarSection: {
    marginBottom: "1.5rem",
  },
  sidebarTitle: {
    fontSize: "0.9rem",
    textTransform: "uppercase",
    marginBottom: "0.5rem",
    color: "#a0aec0",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#f7fafc",
    overflowY: "auto" as const,
  } as CSSProperties,
  },
  sidebarItemActive: {
    backgroundColor: "#2d3748",
  },
  sidebarItemChild: {
    padding: "0.5rem 0.75rem",
    marginBottom: "0.25rem",
    marginLeft: "1rem",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: "0.9rem",
  },
  content: {
    flex: 1,
    padding: "1rem",
    backgroundColor: "#f7fafc",
    overflowY: "auto",
  },
  header: {
    backgroundColor: "white",
    padding: "1rem",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testControls: {
    marginTop: "1rem",
    padding: "1rem",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
// Group sidebar items into sections for rendering
const groupSidebarItems = (items: SidebarItem[]) => {
  const sections: Record<string, SidebarItem[]> = {
    Dashboard: [],
    "Trip Management": [],
    Invoices: [],
    "Diesel Management": [],
    Clients: [],
    Drivers: [],
    Compliance: [],
    Analytics: [],
    Workshop: [],
    Reports: [],
    Notifications: [],
    Settings: [],
  };
  },
  items.forEach((item: SidebarItem) => {
    if (item.id === "dashboard") {
      sections["Dashboard"].push(item);
    } else if (item.id === "trip-management") {
      sections["Trip Management"].push(item);
    } else if (item.id === "invoices") {
      sections["Invoices"].push(item);
    } else if (item.id === "diesel") {
      sections["Diesel Management"].push(item);
    } else if (item.id === "clients") {
      sections["Clients"].push(item);
    } else if (item.id === "drivers") {
      sections["Drivers"].push(item);
    } else if (item.id === "compliance") {
      sections["Compliance"].push(item);
    } else if (item.id === "analytics") {
      sections["Analytics"].push(item);
    } else if (item.id === "workshop") {
      sections["Workshop"].push(item);
    } else if (item.id === "reports") {
      sections["Reports"].push(item);
    } else if (item.id === "notifications") {
      sections["Notifications"].push(item);
    } else if (item.id === "settings") {
      sections["Settings"].push(item);
    }
  });
      sections["Diesel Management"].push(item);
    } else if (item.id === "clients") {
      sections["Clients"].push(item);
    } else if (item.id === "drivers") {
const SidebarTester = () => {
  const [activePath, setActivePath] = useState("/dashboard");
  const [testResults, setTestResults] = useState<TestResults>({
    totalRoutes: 0,
    accessibleRoutes: 0,
    nestedRoutes: 0,
    maxNestingLevel: 0
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const sections = groupSidebarItems(sidebarConfig as SidebarItem[]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionName]: !expandedSections[sectionName],
    });
  };
  const runRouteTest = () => {
    const results: TestResults = {
      totalRoutes: 0,
      accessibleRoutes: 0,
      nestedRoutes: 0,
      maxNestingLevel: 0,
    };

    const countRoutes = (items: SidebarItem[], level = 1) => {
      items.forEach((item: SidebarItem) => {
        results.totalRoutes++;

        if (item.component) {
          results.accessibleRoutes++;
        }

        if (item.children && item.children.length) {
          results.nestedRoutes += item.children.length;
          results.maxNestingLevel = Math.max(results.maxNestingLevel, level + 1);
          countRoutes(item.children, level + 1);
        }
      });
    };

    countRoutes(sidebarConfig as SidebarItem[]);
    setTestResults(results);
  };

  const renderSidebarItems = (items: SidebarItem[], isChild = false) => {
    return items.map((item: SidebarItem) => (
    };

    const countRoutes = (items, level = 1) => {
      items.forEach((item) => {
        results.totalRoutes++;

        if (item.component) {
          results.accessibleRoutes++;
        }

        if (item.children && item.children.length) {
          results.nestedRoutes += item.children.length;
          results.maxNestingLevel = Math.max(results.maxNestingLevel, level + 1);
          countRoutes(item.children, level + 1);
        }
      });
    };

    countRoutes(sidebarConfig);
    setTestResults(results);
  };

  const renderSidebarItems = (items, isChild = false) => {
    return items.map((item) => (
      <div key={item.id}>
        <div
          style={{
            ...styles[isChild ? "sidebarItemChild" : "sidebarItem"],
            ...(activePath === item.path && styles.sidebarItemActive),
          }}
          onClick={() => handleItemClick(item.path)}
        >
          {item.label}
        </div>
        {item.children && expandedSections[item.label] && renderSidebarItems(item.children, true)}
      </div>
    ));
  };

  return (
    <BrowserRouter>
      <div style={styles.container}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <h1>Navigation Testing</h1>

          {Object.entries(sections).map(
            ([sectionName, items]) =>
              items.length > 0 && (
                <div key={sectionName} style={styles.sidebarSection}>
                  <div style={styles.sidebarTitle} onClick={() => toggleSection(sectionName)}>
                    {sectionName}{" "}
                    {items[0].children ? (expandedSections[sectionName] ? "▼" : "►") : ""}
                  </div>

                  {/* If it's not expanded or doesn't have children, render main item */}
                  {!items[0].children || !expandedSections[sectionName] ? (
                    renderSidebarItems(items)
                  ) : (
                    // If expanded and has children, render the children
                    <>
                      {renderSidebarItems(items)}
                      {expandedSections[sectionName] &&
                        items[0].children &&
                        renderSidebarItems(items[0].children, true)}
                    </>
                  )}
                </div>
              )
          )}
        </div>

        {/* Content */}
        <div style={styles.content}>
          <div style={styles.header}>
            <h1>Routing Test - {activePath}</h1>
          </div>

          <div style={styles.testControls}>
            <h2>Test Controls</h2>
            <button style={styles.button} onClick={() => runRouteTest()}>
              Test Routes
            </button>

            {Object.keys(testResults).length > 0 && (
              <div style={styles.testResult}>
                <h3>Test Results</h3>
                <p>Total Routes: {testResults.totalRoutes}</p>
                <p>Accessible Routes: {testResults.accessibleRoutes}</p>
                <p>Nested Routes: {testResults.nestedRoutes}</p>
                <p>Maximum Nesting Level: {testResults.maxNestingLevel}</p>
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "1rem",
              border: "1px solid #e2e8f0",
              borderRadius: "4px",
              padding: "1rem",
            }}
          >
            <h2>Route Content</h2>
            <div style={{ marginBottom: "1rem" }}>
              <h3>UI Verification Panel</h3>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <button
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#4299e1",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    console.log(
                      (btn as HTMLElement).style.outline = "2px solid red";
                      btn.setAttribute("data-highlighted", "true");
                    );
                    alert(
                      `Found ${document.querySelectorAll('button, a.btn, input[type="submit"]').length} UI interaction elements and ${document.querySelectorAll("form").length} forms on this page`
                    );
                  }}
                >
                  Count UI Elements
                </button>
                <button
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#48bb78",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                      (form as HTMLElement).style.outline = "2px dashed blue";
                      document.querySelectorAll('button, a.btn, input[type="submit"]')
                    );
                    buttons.forEach((btn) => {
                      btn.style.outline = "2px solid red";
                      btn.setAttribute("data-highlighted", "true");
                    });
                    alert(`Highlighted ${buttons.length} interactive elements`);
                  }}
                >
                  Highlight Interactive Elements
                </button>
                <button
                  style={{
                    padding: "0.5rem 0.75rem",
                    backgroundColor: "#ed8936",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const forms = Array.from(document.querySelectorAll("form"));
                    forms.forEach((form) => {
                      form.style.outline = "2px dashed blue";
                      form.setAttribute("data-highlighted", "true");
                    });
                    alert(`Highlighted ${forms.length} forms`);
                  }}
                >
                  Highlight Forms
                </button>
              </div>
            </div>
            <AppRoutes />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default SidebarTester;
