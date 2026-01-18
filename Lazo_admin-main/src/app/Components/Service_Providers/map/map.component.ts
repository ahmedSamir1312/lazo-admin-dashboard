import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as L from 'leaflet';
import { Subject, takeUntil } from 'rxjs';

// Interfaces
interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  from?: string;
  lat_lng?: string;
}

interface SearchResult {
  lat: number;
  long: number;
  location: string;
}

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private map!: L.Map;
  private marker!: L.Marker;

  searchQuery: string = '';
  Location_name: string = '';

  lat: number = 24.774265;
  lon: number = 46.738586;
  result?: SearchResult;

  data?: { data: LocationData };
  event?: Subject<SearchResult>;

  constructor(private http: HttpClient, public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
    this.initializeMap();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.remove();
    }
  }

  private loadInitialData(): void {
    if (this.data?.data) {
      const locationData = this.data.data;

      if (locationData.address && locationData.from !== 'cities') {
        this.Location_name = locationData.address;
        const parts = locationData.lat_lng?.split(',') || [];
        if (parts.length === 2) {
          this.lon = parseFloat(parts[0]);
          this.lat = parseFloat(parts[1]);
        }
      }

      if (locationData.from === 'cities') {
        this.lon = locationData.lng;
        this.lat = locationData.lat;
      }

      if (this.map) {
        this.updateMapView(this.lat, this.lon);
      }
    }
  }

  private customIcon = L.icon({
    iconUrl: 'assets/images/location-map.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  private initializeMap(): void {
    this.map = L.map('map').setView([this.lat, this.lon], 13);

    this.marker = L.marker([this.lat, this.lon], {
      icon: this.customIcon,
      draggable: true,
    }).addTo(this.map);

    this.reverseGeocode(this.lat, this.lon);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Click event for map
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.updateLocation(event.latlng.lat, event.latlng.lng);
    });

    // Drag event for marker
    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });
  }

  private updateMapView(lat: number, lon: number): void {
    this.map.setView([lat, lon], 13);

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lon], {
      icon: this.customIcon,
      draggable: true,
    }).addTo(this.map);
  }

  private updateLocation(lat: number, lon: number): void {
    this.lat = lat;
    this.lon = lon;
    this.reverseGeocode(lat, lon);
    this.updateMapView(lat, lon);
  }

  searchLocation(query: string): void {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=1`;

    this.http
      .get<NominatimResponse[]>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            const location = response[0];
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);
            this.updateLocation(lat, lon);
            this.Location_name = location.display_name;
          } else {
            alert('Location not found');
          }
        },
        error: (error) => {
          console.error('Search error:', error);
          alert('Error searching location');
        },
      });
  }

  locateUser(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.updateLocation(lat, lon);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to retrieve your location');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  private reverseGeocode(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    this.http
      .get<NominatimResponse>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.Location_name = response.display_name;
        },
        error: (error) => {
          console.error('Reverse geocode error:', error);
          this.Location_name = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`;
        },
      });
  }

  close(): void {
    if (!this.Location_name) {
      alert('Please select a location first');
      return;
    }

    this.result = {
      lat: this.lat,
      long: this.lon,
      location: this.Location_name,
    };

    // Emit data back to parent if event subject exists
    if (this.event) {
      this.event.next(this.result);
      this.event.complete();
    }

    this.bsModalRef.hide();
  }
}
