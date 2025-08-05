import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Phone, Mail, MapPin, Calendar, FileText, Clock, Shield, TrendingUp, Truck, AlertTriangle, CheckCircle, Edit, ArrowLeft } from 'lucide-react';

// Mock driver data
const mockDrivers = [
  {
    id: 'drv-001',
    name: 'John Doe',
    email: 'john.doe@matanuska.com',
    phone: '+233 20 123 4567',
    address: '123 Accra Road, Tema, Ghana',
    dateOfBirth: '1985-05-15',
    dateJoined: '2020-03-10',
    licenseNumber: 'GH-DL-123456',
    licenseExpiry: '2026-03-14',
    licenseClass: 'Commercial',
    status: 'active',
    performance: {
      rating: 4.8,
      tripsCompleted: 156,
      kmDriven: 32450,
      fuelEfficiency: 8.3,
      incidents: 0,
      safetyScore: 95,
      avgTripTime: 4.2
    },
    certifications: [
      { name: 'Defensive Driving', issueDate: '2021-04-15', expiry: '2023-04-15', status: 'expired' },
      { name: 'Hazardous Materials', issueDate: '2022-01-20', expiry: '2024-01-20', status: 'active' }
    ],
    recentTrips: [
      { id: 'trip-001', date: '2025-07-15', route: 'Accra to Kumasi', distance: 270, duration: '4h 15m' },
      { id: 'trip-002', date: '2025-07-10', route: 'Kumasi to Tamale', distance: 390, duration: '6h 30m' }
    ],
    vehicles: ['Fleet-001', 'Fleet-003'],
    documents: [
      { id: 'doc-001', name: 'License', type: 'pdf', uploadDate: '2022-05-10' },
      { id: 'doc-002', name: 'Medical Certificate', type: 'pdf', uploadDate: '2022-06-15' }
    ]
  },
  {
    id: 'drv-002',
    name: 'Jane Smith',
    email: 'jane.smith@matanuska.com',
    phone: '+233 20 987 6543',
    address: '456 Kumasi Road, Accra, Ghana',
    dateOfBirth: '1990-08-22',
    dateJoined: '2021-02-15',
    licenseNumber: 'GH-DL-789012',
    licenseExpiry: '2025-05-19',
    licenseClass: 'Commercial',
    status: 'active',
    performance: {
      rating: 4.5,
      tripsCompleted: 85,
      kmDriven: 17820,
      fuelEfficiency: 7.9,
      incidents: 1,
      safetyScore: 88,
      avgTripTime: 4.5
    },
    certifications: [
      { name: 'Defensive Driving', issueDate: '2021-06-10', expiry: '2023-06-10', status: 'expired' },
      { name: 'First Aid', issueDate: '2022-03-05', expiry: '2024-03-05', status: 'active' }
    ],
    recentTrips: [
      { id: 'trip-003', date: '2025-07-12', route: 'Accra to Takoradi', distance: 230, duration: '3h 45m' },
      { id: 'trip-004', date: '2025-07-05', route: 'Takoradi to Cape Coast', distance: 90, duration: '1h 30m' }
    ],
    vehicles: ['Fleet-002'],
    documents: [
      { id: 'doc-003', name: 'License', type: 'pdf', uploadDate: '2022-07-12' },
      { id: 'doc-004', name: 'Training Certificate', type: 'pdf', uploadDate: '2022-08-01' }
    ]
  }
];

interface DriverDetailsProps {}

const DriverDetails: React.FC<DriverDetailsProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundDriver = mockDrivers.find(d => d.id === id);
      setDriver(foundDriver || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Driver not found. The ID "{id}" doesn't match any driver in our records.
              </p>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/drivers/profiles')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Drivers
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/drivers/profiles')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{driver.name}</h1>
            <p className="text-gray-600">Driver ID: {driver.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export Profile
          </Button>
          <Button
            onClick={() => navigate(`/drivers/profiles/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Info */}
        <Card>
          <CardHeader title="Driver Information" />
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">
                  {driver.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{driver.name}</h3>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {driver.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center py-2">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">{driver.phone}</span>
              </div>
              <div className="flex items-center py-2">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">{driver.email}</span>
              </div>
              <div className="flex items-center py-2">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">{driver.address}</span>
              </div>
              <div className="flex items-center py-2">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">Birth Date: {driver.dateOfBirth}</span>
              </div>
              <div className="flex items-center py-2">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">Joined: {driver.dateJoined}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Vehicles</h4>
              <div className="flex flex-wrap gap-2">
                {driver.vehicles.map((vehicle: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                    <Truck className="w-3 h-3 mr-1" />
                    {vehicle}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Info */}
        <Card>
          <CardHeader title="License Information" />
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-800">License Number</span>
                <span className="text-sm font-bold">{driver.licenseNumber}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-blue-800">Class</span>
                <span className="text-sm">{driver.licenseClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-800">Expires</span>
                <span className="text-sm">{driver.licenseExpiry}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
              <ul className="space-y-3">
                {driver.certifications.map((cert: any, index: number) => (
                  <li key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{cert.name}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Issued: {cert.issueDate} • Expires: {cert.expiry}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
              <ul className="space-y-2">
                {driver.documents.map((doc: any) => (
                  <li key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      {doc.name}
                    </span>
                    <span className="text-blue-600 hover:underline cursor-pointer">View</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader title="Performance & Safety" />
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-700">{driver.performance.safetyScore}</span>
                <span className="text-xs text-blue-500">Safety Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Rating</div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{driver.performance.rating}/5</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Trips</div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{driver.performance.tripsCompleted}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Distance</div>
                <div className="flex items-center">
                  <span className="font-semibold">{driver.performance.kmDriven.toLocaleString()} km</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Fuel Efficiency</div>
                <div className="flex items-center">
                  <span className="font-semibold">{driver.performance.fuelEfficiency} L/100km</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Incidents</div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{driver.performance.incidents}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Avg Trip Time</div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="font-semibold">{driver.performance.avgTripTime} hrs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Trips</h4>
              <ul className="space-y-2">
                {driver.recentTrips.map((trip: any) => (
                  <li key={trip.id} className="border-l-2 border-blue-500 pl-3 py-1">
                    <div className="text-sm font-medium">{trip.route}</div>
                    <div className="text-xs text-gray-500">
                      {trip.date} • {trip.distance} km • {trip.duration}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 text-center">
                <Button variant="outline" size="sm" className="w-full">
                  View All Trips
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader title="Activity Timeline" />
          <CardContent>
            <div className="flow-root">
              <ul className="-mb-8">
                <li className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <Truck className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-800">Completed trip <span className="font-medium">Accra to Kumasi</span></p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>Jul 15, 2025</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative pb-8">
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <FileText className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-800">Updated driver documentation</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>Jul 10, 2025</time>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="relative">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                        <Shield className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-800">Completed safety training</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <time>Jul 5, 2025</time>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" size="sm">
                View Full History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDetails;
