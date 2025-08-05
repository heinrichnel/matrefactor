import React from 'react';


interface LocationDetailPanelProps {
  locationId: string;
  onClose: () => void;
}

interface Location {
  id: string;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface LocationDetailPanelState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export default class LocationDetailPanel extends React.Component<LocationDetailPanelProps, LocationDetailPanelState> {
  constructor(props: LocationDetailPanelProps) {
    super(props);
    this.state = {
      location: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchLocationData();
  }

  componentDidUpdate(prevProps: LocationDetailPanelProps) {
    if (prevProps.locationId !== this.props.locationId) {
      this.fetchLocationData();
    }
  }

  fetchLocationData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await fetch(`/api/locations/${this.props.locationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Location = await response.json();
      this.setState({ location: data, loading: false });
    } catch (error: any) {
      this.setState({ error: error.message, loading: false });
    }
  };

  render() {
    const { location, loading, error } = this.state;

    if (loading) {
      return <div>Loading location details...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!location) {
      return <div>Location not found.</div>;
    }

    return (
      <div>
        <h2>{location.name}</h2>
        <p>Address: {location.address}</p>
        <p>Description: {location.description}</p>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
        <button onClick={this.props.onClose}>Close</button>
      </div>
    );
  }
}
