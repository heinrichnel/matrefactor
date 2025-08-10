import { Button, Card, CardContent, CardHeader } from "@/components/ui";
import { FormProvider, useForm } from "react-hook-form";
import ClientDropdown from "../../components/common/ClientDropdown";
import FormClientDropdown from "../../components/common/FormClientDropdown";
import { useClientDropdown } from "../../hooks/useClients";

const ClientSelectionExample = () => {
  // Setup form
  const methods = useForm({
    defaultValues: {
      clientId: "",
      contactPersonId: "",
      // Add more form fields as needed
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const selectedClientId = watch("clientId");

  // Direct use of the hook for demonstration
  const { clients, loading } = useClientDropdown({
    includeContact: true,
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form submitted with:", data);

    // Find the selected client object for demonstration
    const selectedClient = clients.find((c) => c.id === data.clientId);
    console.log("Selected client data:", selectedClient?.data);

    // Here you would typically make an API call or update Firestore
    alert("Form submitted! Check console for details.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Client Selection Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Basic Client Dropdown</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              Simple example of the ClientDropdown component used directly.
            </p>

            <ClientDropdown
              label="Select Client"
              onChange={(clientId) => console.log("Selected client ID:", clientId)}
              includeContact={true}
            />

            <div className="mt-4 text-sm text-gray-600">
              <p>Features:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Loads clients from Firestore</li>
                <li>Searchable dropdown</li>
                <li>Shows contact name alongside client name</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Client Data</h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {loading ? "Loading clients..." : `${clients.length} clients loaded`}
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto border rounded">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.slice(0, 10).map((client) => (
                    <tr key={client.id}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{client.label}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {client.contactPerson || "—"}
                      </td>
                    </tr>
                  ))}
                  {clients.length > 10 && (
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-center text-sm text-gray-500">
                        ...and {clients.length - 10} more clients
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium">Form with Client Selection</h2>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormClientDropdown
                  name="clientId"
                  label="Client"
                  required={true}
                  includeContact={true}
                  placeholder="Select a client for this shipment"
                />

                {/* Additional form fields would go here */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Submit Form</Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSelectionExample;
