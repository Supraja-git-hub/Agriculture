import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCYu3bRCB7uCXPPEyhyzcdk6v_WaaVgXHI",
  authDomain: "agricultural-project-f43ab.firebaseapp.com",
  projectId: "agricultural-project-f43ab",
  storageBucket: "agricultural-project-f43ab.appspot.com",
  messagingSenderId: "766069816475",
  appId: "1:766069816475:web:57031979b73cc06aff5a3e",
  measurementId: "G-XRFPNSWMDH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function Navbar({ userData, handleLogout }) {  
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#4CAF50', color: 'white' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
        <h2>AgriConnect</h2>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {userData && <span>Welcome, {userData?.role === 'merchant' ? 'Merchant' : 'Farmer'}!</span>}
        {userData ? (
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <span>|</span>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Signup() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'farmer'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, formData.email, formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date()
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3 style={{ textAlign: 'center' }}>Signup</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          name="name" 
          placeholder="Name" 
          required 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          required 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <select 
          name="role" 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="farmer">Farmer</option>
          <option value="merchant">Merchant</option>
        </select>
        <button 
          type="submit"
          style={{ padding: '0.75rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

function Login() {
  const [formData, setFormData] = useState({
    email: '', password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3 style={{ textAlign: 'center' }}>Login</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          required 
          onChange={handleChange}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button 
          type="submit"
          style={{ padding: '0.75rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

function WeatherGraph() {
  const weatherData = [
    { day: 'Mon', temp: 28, rain: 10 },
    { day: 'Tue', temp: 30, rain: 5 },
    { day: 'Wed', temp: 32, rain: 0 },
    { day: 'Thu', temp: 31, rain: 0 },
    { day: 'Fri', temp: 29, rain: 20 },
    { day: 'Sat', temp: 27, rain: 40 },
    { day: 'Sun', temp: 26, rain: 60 },
  ];

  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Weekly Weather Forecast</h3>
      <div style={{ display: 'flex', height: '200px', alignItems: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        {weatherData.map((data, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            
            {/* Temperature bar */}
            <div style={{ 
              height: `${data.temp * 5}px`, 
              width: '100%', 
              background: 'linear-gradient(to top, #ff9a00, #ffcc00)',
              borderRadius: '4px 4px 0 0'
            }}></div>

            {/* Rainfall bar */}
            <div style={{ 
              height: `${data.rain}px`, 
              width: '100%', 
              background: 'linear-gradient(to top, #2196F3, #64B5F6)',
              borderRadius: '0 0 4px 4px',
              marginTop: '4px'
            }}></div>

            <div style={{ marginTop: '0.5rem' }}>{data.day}</div>
            <div style={{ fontSize: '0.8rem' }}>{data.temp}°C</div>
            <div style={{ fontSize: '0.8rem', color: '#2196F3' }}>{data.rain}mm</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', background: '#ffcc00', marginRight: '0.5rem' }}></div>
          <span>Temperature (°C)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', background: '#64B5F6', marginRight: '0.5rem' }}></div>
          <span>Rainfall (mm)</span>
        </div>
      </div>
    </div>
  );
}

function SeasonSelector() {
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  
  const seasons = {
    kharif: { name: 'Kharif (June-Sept)', crops: ['Rice', 'Maize', 'Cotton', 'Soybean'] },
    rabi: { name: 'Rabi (Oct-March)', crops: ['Wheat', 'Mustard', 'Barley', 'Gram'] },
    zaid: { name: 'Zaid (March-June)', crops: ['Watermelon', 'Cucumber', 'Moong'] }
  };

  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Season Selector</h3>
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        {Object.keys(seasons).map(season => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season)}
            style={{
              padding: '0.5rem 1rem',
              background: selectedSeason === season ? '#4CAF50' : '#f0f0f0',
              color: selectedSeason === season ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {seasons[season].name}
          </button>
        ))}
      </div>
      
      <div>
        <h4>Recommended Crops for {seasons[selectedSeason].name}:</h4>
        <ul>
          {seasons[selectedSeason].crops.map((crop, index) => (
            <li key={index} style={{ margin: '0.5rem 0' }}>{crop}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CropRecommender() {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Crop Recommender</h3>
      <div style={{ margin: '1rem 0' }}>
        <label>Select your region: </label>
        <select style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          <option>North India</option>
          <option>South India</option>
          <option>East India</option>
          <option>West India</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Pulses'].map((crop, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
            <h4>{crop}</h4>
            <p>Suitable: North & East India</p>
            <p>Yield Potential: 8-10 tons/acre</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SoilPreparation() {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Soil Preparation</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4>Soil Test Results</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>pH Level:</div>
            <div><strong>6.8 (Optimal)</strong></div>
            <div>Nitrogen:</div>
            <div><strong>Medium</strong></div>
            <div>Phosphorus:</div>
            <div><strong>Low</strong></div>
            <div>Potassium:</div>
            <div><strong>High</strong></div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4>Recommended Fertilizers</h4>
          <ul>
            <li>DAP (Diammonium Phosphate) - 50kg/acre</li>
            <li>Urea - 30kg/acre</li>
            <li>Potash - 20kg/acre</li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h4>Preparation Steps</h4>
        <ol>
          <li>Plough the field to 15-20cm depth</li>
          <li>Apply organic compost (2 tons/acre)</li>
          <li>Level the field for uniform irrigation</li>
          <li>Apply recommended fertilizers 7 days before sowing</li>
        </ol>
      </div>
    </div>
  );
}

function SowingScheduler() {
  return (
    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Sowing Scheduler</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4>Current Conditions</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>Soil Temperature:</div>
            <div><strong>28°C</strong></div>
            <div>Soil Moisture:</div>
            <div><strong>65%</strong></div>
            <div>Forecast:</div>
            <div><strong>Light rain in 3 days</strong></div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4>Optimal Sowing Window</h4>
          <p><strong>June 15 - July 10</strong></p>
          <p>Recommended sowing density: 40kg seeds/acre</p>
          <p>Row spacing: 20-25cm</p>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <h4>Sowing Plan</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {['Land Prep', 'Seed Treat', 'Sowing', '1st Irrig', 'Fert App'].map((step, index) => (
            <div key={index} style={{ textAlign: 'center', padding: '1rem', background: '#e8f5e9', borderRadius: '4px' }}>
              <div style={{ fontWeight: 'bold' }}>{step}</div>
              <div>Jun {15 + index*3}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FarmerDashboard({ userData }) {
  const [activeModule, setActiveModule] = useState('dashboard');
  
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'season', name: 'Season Selector', icon: '📅' },
    { id: 'crop', name: 'Crop Recommender', icon: '🌱' },
    { id: 'soil', name: 'Soil Prep', icon: '🌿' },
    { id: 'sowing', name: 'Sowing Scheduler', icon: '⏱' },
    { id: 'weather', name: 'Weather', icon: '🌦' }
  ];

  const renderModule = () => {
    switch(activeModule) {
      case 'season': return <SeasonSelector />;
      case 'crop': return <CropRecommender />;
      case 'soil': return <SoilPreparation />;
      case 'sowing': return <SowingScheduler />;
      case 'weather': return <WeatherGraph />;
      default: 
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Field Status</h3>
                <p>Crop: Rice</p>
                <p>Growth Stage: Seedling</p>
                <p>Days since sowing: 15</p>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3>Recent Activities</h3>
                <ul>
                  <li>Ploughing completed (Jun 10)</li>
                  <li>Fertilizer applied (Jun 12)</li>
                  <li>Sowing completed (Jun 15)</li>
                </ul>
              </div>
            </div>
            <WeatherGraph />
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        background: '#2E7D32', 
        color: 'white',
        padding: '1rem 0'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👨‍🌾</span> {userData?.name || 'Farmer'}
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{userData?.email}</p>
        </div>
        
        <nav style={{ marginTop: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {modules.map(module => (
              <li key={module.id}>
                <button
                  onClick={() => setActiveModule(module.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    background: activeModule === module.id ? '#1B5E20' : 'transparent',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{module.icon}</span>
                  {module.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>
            {modules.find(m => m.id === activeModule)?.name || 'Dashboard'}
          </h2>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

function MarketLinkage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'cereals',
    quantity: '',
    price: '',
    quality: 'Grade A',
    location: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Premium Rice', category: 'cereals', quantity: '100 tons', price: '₹35,000/ton', quality: 'Grade A', location: 'Punjab' },
        { id: 2, name: 'Organic Wheat', category: 'cereals', quantity: '50 tons', price: '₹32,000/ton', quality: 'Grade AA', location: 'Haryana' },
        { id: 3, name: 'Fresh Apples', category: 'fruits', quantity: '200 boxes', price: '₹1,400/box', quality: 'Grade A', location: 'Himachal' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      ...formData,
      quantity: formData.quantity + ' tons',
      price: `₹${parseInt(formData.price).toLocaleString('en-IN')}/ton`
    };

    setProducts([...products, newProduct]);
    setFormData({
      name: '',
      category: 'cereals',
      quantity: '',
      price: '',
      quality: 'Grade A',
      location: ''
    });
    alert('Product listed successfully!');
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Market Linkage</h3>
      
      <div style={{ margin: '2rem 0' }}>
        <h4>List New Product</h4>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label>Product Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <div>
            <label>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="cereals">Cereals</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="spices">Spices</option>
              <option value="pulses">Pulses</option>
            </select>
          </div>
          
          <div>
            <label>Quantity (tons)</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <div>
            <label>Price per unit (₹)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <div>
            <label>Quality Grade</label>
            <select 
              name="quality" 
              value={formData.quality} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              <option value="Grade A">Grade A</option>
              <option value="Grade AA">Grade AA</option>
              <option value="Premium">Premium</option>
              <option value="Organic">Organic</option>
            </select>
          </div>
          
          <div>
            <label>Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
            <button 
              type="submit"
              style={{ padding: '0.75rem 1.5rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              List Product
            </button>
          </div>
        </form>
      </div>
      
      <div>
        <h4>Available Products</h4>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Product</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Category</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Quantity</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Price</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Quality</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.name}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.category}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.quantity}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.price}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.quality}</td>
                    <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{product.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PricingMonitoring() {
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [loading, setLoading] = useState(true);
  
  const crops = {
    rice: { name: 'Rice', unit: 'per ton' },
    wheat: { name: 'Wheat', unit: 'per ton' },
    maize: { name: 'Maize', unit: 'per ton' },
    cotton: { name: 'Cotton', unit: 'per bale' },
    sugarcane: { name: 'Sugarcane', unit: 'per ton' }
  };
  
  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        rice: [
          { market: 'Delhi Mandi', price: '₹36,400', change: '+2%' },
          { market: 'Mumbai APMC', price: '₹35,700', change: '+1.5%' },
          { market: 'Kolkata Market', price: '₹35,350', change: '+0.8%' }
        ],
        wheat: [
          { market: 'Delhi Mandi', price: '₹31,500', change: '+1.2%' },
          { market: 'Punjab Market', price: '₹30,800', change: '+0.5%' },
          { market: 'UP Mandi', price: '₹30,450', change: '-0.3%' }
        ],
        maize: [
          { market: 'Karnataka Market', price: '₹19,600', change: '+3.1%' },
          { market: 'MP Mandi', price: '₹19,250', change: '+2.7%' },
          { market: 'Gujarat APMC', price: '₹18,900', change: '+1.9%' }
        ],
        cotton: [
          { market: 'Gujarat Market', price: '₹12,600/bale', change: '+1.8%' },
          { market: 'Maharashtra APMC', price: '₹12,250/bale', change: '+0.9%' },
          { market: 'Telangana Market', price: '₹11,900/bale', change: '-0.5%' }
        ],
        sugarcane: [
          { market: 'UP Mandi', price: '₹2,800/ton', change: '0%' },
          { market: 'Maharashtra Market', price: '₹2,940/ton', change: '+0.5%' },
          { market: 'Karnataka APMC', price: '₹2,730/ton', change: '-1.2%' }
        ]
      };
      
      setPrices(mockData[selectedCrop]);
      setLoading(false);
    }, 800);
  }, [selectedCrop]);

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Pricing Monitoring</h3>
      
      <div style={{ margin: '1.5rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {Object.keys(crops).map(crop => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            style={{
              padding: '0.75rem 1.5rem',
              background: selectedCrop === crop ? '#2196F3' : '#f0f0f0',
              color: selectedCrop === crop ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {crops[crop].name}
          </button>
        ))}
      </div>
      
      {loading ? (
        <p>Loading prices...</p>
      ) : (
        <div>
          <h4>Current Prices for {crops[selectedCrop].name} ({crops[selectedCrop].unit})</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {prices.map((price, index) => (
              <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', background: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>{price.market}</h4>
                  <span style={{ 
                    background: price.change.startsWith('+') ? '#4CAF50' : price.change.startsWith('-') ? '#F44336' : '#9E9E9E',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem'
                  }}>
                    {price.change}
                  </span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0', color: '#2196F3' }}>
                  {price.price}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    View History
                  </button>
                  <button style={{ padding: '0.5rem 1rem', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Set Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h4>Price Trend (Last 30 Days)</h4>
            <div style={{ height: '300px', background: '#f5f5f5', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem', marginTop: '1rem', borderRadius: '4px' }}>
              {[45, 52, 48, 55, 60, 58, 62, 65, 63, 67, 70, 72, 75, 78, 80, 82, 85, 83, 87, 90, 88, 85, 82, 80, 78, 75, 72, 70].map((value, index) => (
                <div 
                  key={index} 
                  style={{ 
                    height: `${value}%`, 
                    width: '20px', 
                    background: index > 20 ? '#4CAF50' : '#2196F3',
                    position: 'relative'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem' }}>₹{Math.round(35000 * (value/100)).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setComments([
        { id: 1, user: 'Farmer Rajesh', text: 'Looking for buyers for organic wheat. Contact if interested.', date: '2 days ago' },
        { id: 2, user: 'AgriMart Support', text: 'New pricing updates available in the pricing section.', date: '1 week ago' },
        { id: 3, user: 'Merchant Sunil', text: 'Interested in bulk purchase of rice. Please share details.', date: '3 weeks ago' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setComments([
        { id: 1, user: 'Farmer Rajesh', text: 'Looking for buyers for organic wheat. Contact if interested.', date: '2 days ago' },
        { id: 2, user: 'AgriMart Support', text: 'New pricing updates available in the pricing section.', date: '1 week ago' },
        { id: 3, user: 'Merchant Sunil', text: 'Interested in bulk purchase of rice. Please share details.', date: '3 weeks ago' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: comments.length + 1,
      user: 'You',
      text: newComment,
      date: 'Just now'
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>Comments & Discussions</h3>
      
      <form onSubmit={handleSubmit} style={{ margin: '2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button 
            type="submit"
            style={{ padding: '0.75rem 1.5rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Post
          </button>
        </div>
      </form>
      
      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          {comments.map(comment => (
            <div key={comment.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{comment.user}</strong>
                <span style={{ color: '#757575', fontSize: '0.9rem' }}>{comment.date}</span>
              </div>
              <p style={{ margin: 0 }}>{comment.text}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer', marginRight: '1rem' }}>Reply</button>
                <button style={{ background: 'none', border: 'none', color: '#2196F3', cursor: 'pointer' }}>Like</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MerchantDashboard({ userData }) {
  const [activeModule, setActiveModule] = useState('market');
  
  const modules = [
    { id: 'market', name: 'Market Linkage', icon: '📊' },
    { id: 'pricing', name: 'Pricing Monitoring', icon: '💰' },
    { id: 'comments', name: 'Comments', icon: '💬' }
  ];

  const renderModule = () => {
    switch(activeModule) {
      case 'pricing': return <PricingMonitoring />;
      case 'comments': return <Comments />;
      default: return <MarketLinkage />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        background: '#1565C0', 
        color: 'white',
        padding: '1rem 0'
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👨‍💼</span> {userData?.name || 'Merchant'}
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{userData?.email}</p>
        </div>
        
        <nav style={{ marginTop: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {modules.map(module => (
              <li key={module.id}>
                <button
                  onClick={() => setActiveModule(module.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    background: activeModule === module.id ? '#0D47A1' : 'transparent',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{module.icon}</span>
                  {module.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '333' }}>
            {modules.find(m => m.id === activeModule)?.name || 'Market Linkage'}
          </h2>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}

function Welcome({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (user) {
        const docSnap = await getDoc(doc(db, 'users', user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    };
    getUserData();
  }, [user]);

  if (!userData) return <p>Loading user dashboard...</p>;

  return (
    <>
      {userData.role === 'farmer' ? (
        <FarmerDashboard userData={userData} />
      ) : (
        <MerchantDashboard userData={userData} />
      )}
    </>
  );
}

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docSnap = await getDoc(doc(db, 'users', u.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data()); 
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserData(null); 
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar userData={userData} handleLogout={handleLogout} />
      <Routes>
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={
          <PrivateRoute user={user}>
            <Welcome user={user} />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;