import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

/**
 * Custom hook to fetch client data for dropdown components
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.activeOnly - When true, only fetch active clients
 * @param {boolean} options.includeContact - When true, include contact information in the returned data
 * @param {string} options.sortBy - Field to sort by (default: 'client')
 * @param {boolean} options.descending - Sort in descending order when true
 * @returns {Object} Result object containing clients data and loading state
 */
export function useClientDropdown(options = {}) {
  const {
    activeOnly = true,
    includeContact = false,
    sortBy = 'client',
    descending = false,
  } = options;
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        
        // Build the query
        const clientQuery = collection(db, 'clients');
        const queryConstraints = [];
        
        // Filter for active clients if requested
        if (activeOnly) {
          queryConstraints.push(where('active', '==', true));
        }
        
        // Add sorting
        queryConstraints.push(orderBy(sortBy, descending ? 'desc' : 'asc'));
        
        // Execute query
        const clientsSnapshot = await getDocs(query(clientQuery, ...queryConstraints));
        
        // Process results
        const clientsList = clientsSnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Base client object for dropdown
          const clientObj = {
            id: doc.id,
            value: doc.id,
            label: data.client || 'Unnamed Client',
            // Include full data for reference
            data: data,
          };
          
          // Add contact info if requested
          if (includeContact) {
            clientObj.contactPerson = data.contact || '';
            clientObj.email = data.email || '';
            clientObj.phone = data.telNo1 || data.telNo2 || '';
          }
          
          return clientObj;
        });
        
        setClients(clientsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError(err.message);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, [activeOnly, includeContact, sortBy, descending]);
  
  return { clients, loading, error };
}

/**
 * Custom hook to search clients by name or other properties
 * 
 * @param {string} searchTerm - Term to search for
 * @param {Object} options - Additional options
 * @returns {Object} Search results and loading state
 */
export function useClientSearch(searchTerm = '', options = {}) {
  const {
    limit = 10,
    activeOnly = true,
    fields = ['client', 'contact', 'email'],
  } = options;
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Don't search if term is too short
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }
    
    const searchClients = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        
        // Get all clients (we'll filter client-side)
        let clientQuery = collection(db, 'clients');
        
        if (activeOnly) {
          clientQuery = query(clientQuery, where('active', '==', true));
        }
        
        const snapshot = await getDocs(clientQuery);
        
        // Convert search term to lowercase for case-insensitive matching
        const term = searchTerm.toLowerCase();
        
        // Filter and map results
        const filtered = snapshot.docs
          .filter(doc => {
            const data = doc.data();
            
            // Check if any specified field contains the search term
            return fields.some(field => {
              const value = data[field];
              return value && value.toLowerCase().includes(term);
            });
          })
          .slice(0, limit)
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              value: doc.id,
              label: data.client || 'Unnamed Client',
              data: data
            };
          });
        
        setResults(filtered);
        setError(null);
      } catch (err) {
        console.error('Error searching clients:', err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the search to avoid excessive Firestore reads
    const timer = setTimeout(() => {
      searchClients();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, limit, activeOnly, fields]);
  
  return { results, loading, error };
}

/**
 * Custom hook to get a single client by ID
 * 
 * @param {string} clientId - The ID of the client to fetch
 * @returns {Object} Client data and loading state
 */
export function useClient(clientId) {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!clientId) {
      setClient(null);
      setLoading(false);
      return;
    }
    
    const fetchClient = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        
        // Get client document by ID
        const clientDoc = await db.collection('clients').doc(clientId).get();
        
        if (clientDoc.exists) {
          setClient({
            id: clientDoc.id,
            ...clientDoc.data()
          });
        } else {
          setError(new Error(`Client with ID ${clientId} not found`));
          setClient(null);
        }
      } catch (err) {
        console.error(`Error fetching client ${clientId}:`, err);
        setError(err);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [clientId]);
  
  return { client, loading, error };
}
