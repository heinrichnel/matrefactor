import { Building, Filter, PlusCircle, Search } from "lucide-react";
import React, { useState } from "react";
import ClientForm from "../../components/forms/client/ClientForm";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    companyName: "ABC Logistics",
    tradingAs: "ABC Transport",
    registrationNumber: "ABC123456",
    vatNumber: "4530123456",
    phone: "011-555-1234",
    email: "info@abclogistics.co.za",
    website: "www.abclogistics.co.za",
    address: {
      street: "123 Freight Lane",
      city: "Johannesburg",
      province: "Gauteng",
      postalCode: "2001",
      country: "South Africa",
    },
    industry: "Logistics",
    paymentTerms: "net30",
    creditLimit: 50000,
    status: "active",
    contacts: [
      {
        name: "John Smith",
        position: "Operations Manager",
        phone: "082-555-1234",
        email: "john@abclogistics.co.za",
        isPrimary: true,
      },
    ],
  },
  {
    id: "2",
    companyName: "XYZ Mining",
    tradingAs: "XYZ Resources",
    registrationNumber: "XYZ789012",
    vatNumber: "4690789012",
    phone: "012-555-6789",
    email: "info@xyzmining.co.za",
    website: "www.xyzmining.co.za",
    address: {
      street: "456 Mineral Avenue",
      city: "Pretoria",
      province: "Gauteng",
      postalCode: "0001",
      country: "South Africa",
    },
    industry: "Mining",
    paymentTerms: "net60",
    creditLimit: 100000,
    status: "active" as const,
  },
  {
    id: "3",
    companyName: "Cape Fresh Produce",
    tradingAs: "Cape Fresh",
    registrationNumber: "CFP345678",
    vatNumber: "4870345678",
    phone: "021-555-9012",
    email: "orders@capefresh.co.za",
    website: "www.capefresh.co.za",
    address: {
      street: "789 Harvest Road",
      city: "Cape Town",
      province: "Western Cape",
      postalCode: "8001",
      country: "South Africa",
    },
    industry: "Agriculture",
    paymentTerms: "cod",
    creditLimit: 25000,
    status: "inactive",
  },
];

const ClientManagementPage: React.FC = () => {
  const [showClientForm, setShowClientForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [clients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);

  // Filter clients based on search query, status filter, and industry filter
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.tradingAs && client.tradingAs.toLowerCase().includes(searchQuery.toLowerCase())) ||
      client.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.vatNumber && client.vatNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesIndustry = industryFilter === "all" || client.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  // Client addition handler - Reserved for future use when ClientForm supports onSubmit callback
  // const handleAddClient = async (clientData: any): Promise<void> => {
  //   setIsSubmitting(true);
  //   setErrorMessage(null);

  //   try {
  //     // In a real app, this would be handled by the form's submit handler
  //     // For the mock version, just simulate a delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     console.log('Adding client:', clientData); // Use clientData to avoid unused warning
  //     setSubmitSuccess(true);
  //     setShowClientForm(false);

  //     // Reset success message after delay
  //     setTimeout(() => {
  //       setSubmitSuccess(null);
  //     }, 5000);
  //   } catch (error) {
  //     console.error("Error adding client:", error);
  //     setErrorMessage("Failed to add client. Please try again.");
  //     setSubmitSuccess(false);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleEditClient = (client: any) => {
    setSelectedClient(client);
    setShowClientForm(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "blacklisted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get a list of unique industries for filtering
  const industries = Array.from(new Set(clients.map((client) => client.industry).filter(Boolean)));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building className="h-6 w-6" /> Client Management
        </h1>

        <Button
          onClick={() => {
            setSelectedClient(null);
            setShowClientForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <PlusCircle size={16} />
          Add New Client
        </Button>
      </div>

      {/* Search and filter section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="blacklisted">Blacklisted</option>
              </select>
            </div>

            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="all">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients list */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Clients</h2>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No clients found</p>
              <p className="text-sm mt-2">
                {searchQuery || statusFilter !== "all" || industryFilter !== "all"
                  ? "Try changing your search or filter criteria"
                  : "Start by adding a new client"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="py-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleEditClient(client)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">
                        {client.companyName}
                        {client.tradingAs && (
                          <span className="text-gray-500 text-sm ml-2">t/a {client.tradingAs}</span>
                        )}
                      </h3>
                      <div className="text-sm text-gray-500">
                        <p>
                          Reg: {client.registrationNumber}{" "}
                          {client.vatNumber && `• VAT: ${client.vatNumber}`}
                        </p>
                        <p>
                          {client.phone} • {client.email}
                        </p>
                        <p>
                          {client.address.street}, {client.address.city}, {client.address.province}
                        </p>
                      </div>
                      <div className="flex mt-2 gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getStatusColor(client.status)}`}
                        >
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                        {client.industry && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                            {client.industry}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <div>
                        <span className="font-medium">Payment Terms:</span>{" "}
                        {client.paymentTerms.replace(/^net/i, "Net ")}
                      </div>
                      {client.creditLimit && (
                        <div className="text-gray-500">
                          Credit Limit: R {client.creditLimit.toLocaleString()}
                        </div>
                      )}
                      {client.contacts && client.contacts.length > 0 && (
                        <div className="mt-2">
                          <div className="font-medium">{client.contacts[0].name}</div>
                          <div className="text-gray-500">{client.contacts[0].position}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client form modal */}
      <Modal
        isOpen={showClientForm}
        onClose={() => setShowClientForm(false)}
        title={selectedClient ? "Edit Client" : "Add New Client"}
        maxWidth="2xl"
      >
        <ClientForm
          isOpen={showClientForm}
          onClose={() => setShowClientForm(false)}
          initialValues={
            (selectedClient && {
              ...selectedClient,
              status: selectedClient.status === "blacklisted" ? "inactive" : selectedClient.status,
            }) ||
            {}
          }
          isEditing={!!selectedClient}
        />
      </Modal>
    </div>
  );
};

export default ClientManagementPage;
