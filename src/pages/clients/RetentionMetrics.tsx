import { Building, Link as LinkIcon, Network, Plus, Save, Trash2, Users, X } from "lucide-react";
import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { Select, TextArea } from "../../components/ui/FormElements";
import Modal from "../../components/ui/Modal";
import { useAppContext } from "../../context/AppContext";
import type { ClientRelationship } from "../../types/client";
import { Client, CLIENT_RELATIONSHIP_TYPES } from "../../types/client";
import { formatDate } from "../../utils/helpers";

interface ClientRelationshipsProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

interface RelationshipNode {
  source: string;
  target: string;
  type: string;
  relationship?: ClientRelationship;
  direction?: "inverse";
}

const ClientRelationships: React.FC<ClientRelationshipsProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  isModal = false,
  isOpen = false,
  onClose = () => {},
}) => {
  const { addClientRelationship, removeClientRelationship } = useAppContext();

  const [showAddRelationshipModal, setShowAddRelationshipModal] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    relatedClientId: "",
    relationType: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the selected client
  const selectedClient = clients.find((client) => client.id === selectedClientId);

  // Filter out clients that already have a relationship with the selected client
  // and the selected client itself
  const availableClients = selectedClientId
    ? clients.filter(
        (client) =>
          client.id !== selectedClientId &&
          !selectedClient?.relationships.some((rel) => rel.relatedClientId === client.id)
      )
    : [];

  // Get all relationships for visualization
  const getAllRelationships = (): RelationshipNode[] => {
    const directRelationships =
      selectedClient?.relationships.map((rel) => ({
        source: selectedClientId!, // non-null asserted
        target: rel.relatedClientId,
        type: rel.relationType,
        relationship: rel,
        direction: undefined, // uniform shape
      })) || [];

    const inverseRelationships = selectedClientId
      ? clients.flatMap((client) =>
          client.relationships
            .filter((rel) => rel.relatedClientId === selectedClientId)
            .map((rel) => ({
              source: client.id,
              target: selectedClientId!, // non-null asserted
              type: rel.relationType,
              relationship: rel,
              direction: "inverse" as const,
            }))
        )
      : [];

    return [...directRelationships, ...inverseRelationships];
  };

  const relationships = getAllRelationships();

  // Validate new relationship form
  const validateNewRelationship = () => {
    const newErrors: Record<string, string> = {};

    if (!newRelationship.relatedClientId) {
      newErrors.relatedClientId = "Please select a client";
    }

    if (!newRelationship.relationType) {
      newErrors.relationType = "Please select a relationship type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new relationship
  const handleAddRelationship = async () => {
    if (!validateNewRelationship() || !selectedClientId) return;

    try {
      setIsSubmitting(true);

      await addClientRelationship(
        selectedClientId,
        newRelationship.relatedClientId,
        newRelationship.relationType,
        newRelationship.notes
      );

      // Reset the form
      setNewRelationship({
        relatedClientId: "",
        relationType: "",
        notes: "",
      });

      setShowAddRelationshipModal(false);
    } catch (error) {
      console.error("Error adding client relationship:", error);
      setErrors({
        submit: `Failed to add relationship: ${error instanceof Error ? error.message : "An unknown error occurred"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle removing a relationship
  const handleRemoveRelationship = async (relationshipId: string) => {
    if (!selectedClientId) return;

    if (confirm("Are you sure you want to remove this relationship?")) {
      try {
        await removeClientRelationship(selectedClientId, relationshipId);
      } catch (error) {
        console.error("Error removing client relationship:", error);
        alert(
          `Failed to remove relationship: ${error instanceof Error ? error.message : "An unknown error occurred"}`
        );
      }
    }
  };

  // Get client name by ID
  const getClientNameById = (clientId: string) => {
    return clients.find((client) => client.id === clientId)?.name || "Unknown Client";
  };

  // Get relationship type label
  const getRelationshipTypeLabel = (type: string) => {
    return CLIENT_RELATIONSHIP_TYPES.find((t) => t.value === type)?.label || type;
  };

  // Format relationship description
  const formatRelationship = (relationship: {
    source: string;
    target: string;
    type: string;
    direction?: string;
  }) => {
    const sourceName = getClientNameById(relationship.source);
    const targetName = getClientNameById(relationship.target);

    if (relationship.direction === "inverse") {
      // Display inverse relationships differently
      switch (relationship.type) {
        case "parent":
          return `${sourceName} is a parent company of ${targetName}`;
        case "subsidiary":
          return `${sourceName} is a subsidiary of ${targetName}`;
        case "partner":
          return `${sourceName} is a business partner of ${targetName}`;
        case "competitor":
          return `${sourceName} is a competitor of ${targetName}`;
        default:
          return `${sourceName} has a relationship with ${targetName}`;
      }
    } else {
      // Direct relationships
      switch (relationship.type) {
        case "parent":
          return `${sourceName} has ${targetName} as a parent company`;
        case "subsidiary":
          return `${sourceName} has ${targetName} as a subsidiary`;
        case "partner":
          return `${sourceName} has ${targetName} as a business partner`;
        case "competitor":
          return `${sourceName} has ${targetName} as a competitor`;
        default:
          return `${sourceName} has a relationship with ${targetName}`;
      }
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Client Selection */}
      {!selectedClientId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Building className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="mt-2 text-lg font-medium text-blue-800">Select a Client</h3>
          <p className="mt-1 text-blue-600">
            Please select a client from the client list to view and manage their relationships.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clients.slice(0, 8).map((client) => (
              <button
                key={client.id}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                onClick={() => onSelectClient(client.id)}
              >
                <Building className="mx-auto h-6 w-6 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
              </button>
            ))}
          </div>
          {clients.length > 8 && (
            <p className="mt-4 text-sm text-gray-500">+ {clients.length - 8} more clients</p>
          )}
        </div>
      )}

      {/* Relationships Visualization */}
      {selectedClientId && (
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Network className="w-6 h-6 text-blue-500 mr-2" />
              Relationships for {selectedClient?.name}
            </h2>
            <Button
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddRelationshipModal(true)}
              disabled={availableClients.length === 0}
            >
              Add Relationship
            </Button>
          </div>

          {/* Relationship Map Visualization */}
          <Card className="mb-6">
            <CardHeader title="Relationship Map" />
            <CardContent>
              {relationships.length > 0 ? (
                <div className="bg-blue-50 rounded-lg p-8">
                  <div className="flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-500">
                      <p className="font-bold text-center">{selectedClient?.name}</p>
                      <p className="text-xs text-gray-500 text-center">
                        {selectedClient?.type === "internal" ? "Internal" : "External"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {relationships.map((rel, index) => {
                      const relatedClientId =
                        rel.source === selectedClientId ? rel.target : rel.source;
                      const relatedClient = clients.find((c) => c.id === relatedClientId);

                      if (!relatedClient) return null;

                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className={`w-full bg-white rounded-lg shadow-md p-4 border ${
                              rel.type === "parent"
                                ? "border-purple-500"
                                : rel.type === "subsidiary"
                                  ? "border-green-500"
                                  : rel.type === "partner"
                                    ? "border-blue-500"
                                    : "border-red-500"
                            }`}
                          >
                            <p className="font-bold text-center">{relatedClient.name}</p>
                            <p className="text-xs text-gray-500 text-center">
                              {relatedClient.type === "internal" ? "Internal" : "External"}
                            </p>
                            <p
                              className={`text-xs mt-2 text-center ${
                                rel.type === "parent"
                                  ? "text-purple-600"
                                  : rel.type === "subsidiary"
                                    ? "text-green-600"
                                    : rel.type === "partner"
                                      ? "text-blue-600"
                                      : "text-red-600"
                              }`}
                            >
                              {getRelationshipTypeLabel(rel.type)}
                            </p>
                          </div>

                          <div className="mt-2 flex justify-center">
                            {rel.direction !== "inverse" && rel.relationship && (
                              <Button
                                size="xs"
                                variant="outline"
                                icon={<Trash2 className="w-3 h-3" />}
                                onClick={() =>
                                  rel.relationship && handleRemoveRelationship(rel.relationship.id)
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No relationships defined
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Add relationships to visualize connections between clients.
                  </p>
                  <div className="mt-6">
                    <Button
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() => setShowAddRelationshipModal(true)}
                      disabled={availableClients.length === 0}
                    >
                      Add Relationship
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Relationship List */}
          <Card>
            <CardHeader
              title="Relationship Details"
              action={
                <Button
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddRelationshipModal(true)}
                  disabled={availableClients.length === 0}
                >
                  Add
                </Button>
              }
            />
            <CardContent>
              {relationships.length > 0 ? (
                <div className="space-y-4">
                  {relationships.map((rel, index) => {
                    const relatedClientId =
                      rel.source === selectedClientId ? rel.target : rel.source;
                    const relatedClient = clients.find((c) => c.id === relatedClientId);
                    const canRemove = rel.direction !== "inverse" && rel.relationship;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <Building className="w-5 h-5 text-gray-500" />
                            <span className="font-medium">
                              {relatedClient?.name || "Unknown Client"}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                rel.type === "parent"
                                  ? "bg-purple-100 text-purple-800"
                                  : rel.type === "subsidiary"
                                    ? "bg-green-100 text-green-800"
                                    : rel.type === "partner"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getRelationshipTypeLabel(rel.type)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 ml-7">
                            {formatRelationship(rel)}
                            {rel.relationship?.notes && ` • ${rel.relationship.notes}`}
                          </p>
                          {rel.relationship && (
                            <p className="text-xs text-gray-400 ml-7">
                              Created on {formatDate(rel.relationship.createdAt)}
                            </p>
                          )}
                        </div>

                        {canRemove && (
                          <Button
                            size="xs"
                            variant="outline"
                            icon={<Trash2 className="w-3 h-3" />}
                            onClick={() =>
                              rel.relationship && handleRemoveRelationship(rel.relationship.id)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No relationships found</h3>
                  <p className="mt-1 text-gray-500">
                    This client doesn't have any defined relationships with other clients.
                  </p>
                  <div className="mt-6">
                    <Button
                      icon={<Plus className="w-4 h-4" />}
                      onClick={() => setShowAddRelationshipModal(true)}
                      disabled={availableClients.length === 0}
                    >
                      Add Relationship
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* No Available Clients Warning */}
          {availableClients.length === 0 && clients.length > 1 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                This client already has relationships with all other clients in the system. Add more
                clients to create additional relationships.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Relationship Modal */}
      <Modal
        isOpen={showAddRelationshipModal}
        onClose={() => {
          setShowAddRelationshipModal(false);
          setNewRelationship({
            relatedClientId: "",
            relationType: "",
            notes: "",
          });
          setErrors({});
        }}
        title="Add New Relationship"
        maxWidth="md"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <LinkIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Create Client Relationship</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Define a relationship between {selectedClient?.name} and another client in your
                  system.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Related Client *"
              value={newRelationship.relatedClientId}
              onChange={(e) =>
                setNewRelationship((prev) => ({ ...prev, relatedClientId: e.target.value }))
              }
              options={[
                { label: "Select a client...", value: "" },
                ...availableClients.map((client) => ({ label: client.name, value: client.id })),
              ]}
              error={errors.relatedClientId}
            />

            <Select
              label="Relationship Type *"
              value={newRelationship.relationType}
              onChange={(e) =>
                setNewRelationship((prev) => ({ ...prev, relationType: e.target.value }))
              }
              options={[
                { label: "Select relationship type...", value: "" },
                ...CLIENT_RELATIONSHIP_TYPES.map((type) => ({
                  label: type.label,
                  value: type.value,
                })),
              ]}
              error={errors.relationType}
            />

            <TextArea
              label="Notes (Optional)"
              value={newRelationship.notes}
              onChange={(e) => setNewRelationship((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes about this relationship..."
              rows={3}
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddRelationshipModal(false);
                setNewRelationship({
                  relatedClientId: "",
                  relationType: "",
                  notes: "",
                });
                setErrors({});
              }}
              icon={<X className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRelationship}
              icon={<Save className="w-4 h-4" />}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Add Relationship
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  // If this component is being used as a modal
  if (isModal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Client Relationships" maxWidth="2xl">
        {content}
      </Modal>
    );
  }

  // Otherwise, render as a normal page
  return content;
};

export default RetentionMetrics;
