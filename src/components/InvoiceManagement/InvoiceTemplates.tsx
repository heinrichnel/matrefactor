import React from 'react';

/**
 * Component for managing invoice templates
 */
const InvoiceTemplatesPage: React.FC = () => {
  // Mock template data
  const invoiceTemplates = [
    {
      id: 'template-1',
      name: 'Standard Invoice',
      description: 'Default template for general invoicing purposes',
      lastModified: '2023-06-15',
      isDefault: true
    },
    {
      id: 'template-2',
      name: 'Premium Service',
      description: 'Template for premium service clients with detailed line items',
      lastModified: '2023-05-22',
      isDefault: false
    },
    {
      id: 'template-3',
      name: 'Contract Work',
      description: 'Specialized template for contract-based billing',
      lastModified: '2023-04-10',
      isDefault: false
    },
    {
      id: 'template-4',
      name: 'Monthly Retainer',
      description: 'Template for recurring monthly retainer billing',
      lastModified: '2023-07-01',
      isDefault: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice Templates</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick}>
            Create New Template
          </button>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}>
            Import Template
          </button>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invoiceTemplates.map((template) => (
          <div key={template.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-medium">{template.name}</h2>
              {template.isDefault && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <div className="flex items-center text-xs text-gray-500 mb-4">
              <span>Last modified: {template.lastModified}</span>
            </div>
            
            {/* Preview Image Placeholder */}
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-4">
              <span className="text-gray-400">Template Preview</span>
            </div>
            
            <div className="flex justify-between">
              <div className="space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={onClick}>Edit</button>
                <button className="text-gray-600 hover:text-gray-800 text-sm" onClick={onClick}>Duplicate</button>
              </div>
              <div className="space-x-2">
                {!template.isDefault && (
                  <button className="text-green-600 hover:text-green-800 text-sm" onClick={onClick}>
                    Set as Default
                  </button>
                )}
                <button className="text-red-600 hover:text-red-800 text-sm" onClick={onClick}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New Template Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-5 rounded-lg flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl text-gray-500">+</span>
          </div>
          <h3 className="text-lg font-medium">Create New Template</h3>
          <p className="text-gray-500 text-center mt-2">
            Design a new invoice template for your business
          </p>
        </div>
      </div>
      
      {/* Template Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Template Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Default Template</h3>
            <p className="text-sm text-gray-600 mb-3">
              Choose which template should be used by default when creating new invoices.
            </p>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Standard Invoice</option>
              <option>Premium Service</option>
              <option>Contract Work</option>
              <option>Monthly Retainer</option>
            </select>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Auto-numbering Format</h3>
            <p className="text-sm text-gray-600 mb-3">
              Set the format for automatically generated invoice numbers.
            </p>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="INV-{YYYY}{MM}-{####}"
              defaultValue="INV-{YYYY}{MM}-{####}"
            />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Company Information</h3>
            <p className="text-sm text-gray-600 mb-3">
              Information that will appear on all invoices by default.
            </p>
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}>
              Edit Company Information
            </button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600 mb-3">
              Default terms and conditions to include on invoices.
            </p>
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}>
              Edit Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplatesPage;
