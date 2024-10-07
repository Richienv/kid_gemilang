import { Part } from '../types';

export const parts: Part[] = [
  {
    id: '1',
    name: 'Disc Kopling',
    category: 'Transmisi',
    partNumber: 'DC-001',
    compatibleVehicles: ['Isuzu MU-X', 'Toyota Hilux'],
    price: 2999000,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    stockAvailability: 15,
    description: 'Disc kopling performa tinggi dirancang untuk aplikasi berat pada kendaraan Isuzu MU-X dan Toyota Hilux.',
    specifications: {
      'Material': 'Senyawa organik',
      'Diameter': '240mm',
      'Jumlah Gigi': '21',
      'Kapasitas Torsi': '400 Nm'
    },
    additionalImages: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ]
  },
  {
    id: '2',
    name: 'Bantalan Tekan',
    category: 'Transmisi',
    partNumber: 'RB-002',
    compatibleVehicles: ['Isuzu MU-X', 'Toyota Hilux', 'Ford Ranger'],
    price: 749000,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    stockAvailability: 30,
    description: 'Bantalan tekan tahan lama kompatibel dengan berbagai kendaraan double cabin. Menjamin operasi kopling yang halus.',
    specifications: {
      'Tipe': 'Self-centering',
      'Diameter Dalam': '28mm',
      'Diameter Luar': '52mm',
      'Lebar': '15mm'
    },
    additionalImages: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ]
  },
  {
    id: '3',
    name: 'Shock Absorber',
    category: 'Suspensi',
    partNumber: 'SA-003',
    compatibleVehicles: ['Toyota Hilux', 'Ford Ranger', 'Nissan Navara'],
    price: 1349000,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    stockAvailability: 20,
    description: 'Shock absorber heavy-duty dirancang untuk meningkatkan stabilitas dan kenyamanan di berbagai kendaraan double cabin.',
    specifications: {
      'Tipe': 'Gas-charged',
      'Panjang Terbuka': '560mm',
      'Panjang Tertutup': '345mm',
      'Tipe Pemasangan': 'Eye/Eye'
    },
    additionalImages: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    ]
  },
];