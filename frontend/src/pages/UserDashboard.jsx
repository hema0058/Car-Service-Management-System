import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserCars, getUserServiceRequests, addCar, createServiceRequest, updateUser } from '../services/api';
import { toast } from 'react-toastify';
import { FiLogOut, FiPlus, FiTool, FiUser } from 'react-icons/fi';
import { FaCar, FaCreditCard, FaMoon, FaSun, FaStar, FaFileInvoice, FaCrown, FaMicrophone } from 'react-icons/fa';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [cars, setCars] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('cars'); // cars, requests, profile
    const navigate = useNavigate();

    // Form states
    const [newCar, setNewCar] = useState({ carBrand: '', carModel: '', carNumber: '' });
    const [newRequest, setNewRequest] = useState({ carId: '', serviceType: '' });
    const [profile, setProfile] = useState({ name: '', phone: '' });

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

    // Extra Features State
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showReceipt, setShowReceipt] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || storedUser.role !== 'CUSTOMER') {
            navigate('/login');
            return;
        }
        setUser(storedUser);
        setProfile({ name: storedUser.name, phone: storedUser.phone });
        fetchData(storedUser.id);
    }, [navigate]);

    const fetchData = async (userId) => {
        try {
            const carRes = await getUserCars(userId);
            setCars(carRes.data);
            const reqRes = await getUserServiceRequests(userId);
            setRequests(reqRes.data);
        } catch (err) {
            toast.error('Failed to load data');
        }
    };

    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            await addCar(user.id, newCar);
            toast.success('Car added successfully');
            setNewCar({ carBrand: '', carModel: '', carNumber: '' });
            fetchData(user.id);
        } catch (err) {
            toast.error('Failed to add car. Car number might exist.');
        }
    };

    const handleRequestService = async (e) => {
        e.preventDefault();
        try {
            await createServiceRequest(user.id, newRequest.carId, { serviceType: newRequest.serviceType });
            toast.success('Service requested successfully');
            setNewRequest({ carId: '', serviceType: '' });
            fetchData(user.id);
            setActiveTab('requests');
        } catch (err) {
            toast.error('Failed to request service');
        }
    };

    const handlePaymentClick = (req) => {
        setPaymentRequest(req);
        setShowPaymentModal(true);
    };

    const processPayment = (e) => {
        e.preventDefault();
        // Simulating a payment process without backend changes
        toast.success(`Payment successful for ${paymentRequest.serviceType}!`);
        // Update local state to hide the pay button
        setRequests(requests.map(r => r.id === paymentRequest.id ? { ...r, isPaid: true } : r));
        setShowPaymentModal(false);
        setPaymentRequest(null);
        setCardDetails({ number: '', name: '', expiry: '', cvv: '' });

        // Trigger Confetti Celebration
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await updateUser(user.id, profile);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            toast.success('Profile updated');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        setIsDarkMode(!isDarkMode);
    };

    const handleRating = (reqId, rating) => {
        setRequests(requests.map(r => r.id === reqId ? { ...r, rating } : r));
        toast.success('Thank you for your feedback!');
    };

    // --- NEW COOL FEATURES LOGIC ---
    // 1. VIP Loyalty Program
    const completedServices = requests.filter(r => r.status === 'COMPLETED').length;
    let loyaltyTier = 'Bronze Member';
    let loyaltyColor = '#cd7f32';
    if (completedServices >= 4) { loyaltyTier = 'Gold VIP'; loyaltyColor = '#fbbf24'; }
    else if (completedServices >= 2) { loyaltyTier = 'Silver Member'; loyaltyColor = '#94a3b8'; }

    // 2. Smart Cost Estimator
    const getEstimate = (service) => {
        if (!service) return null;
        const s = service.toLowerCase();
        if (s.includes('oil')) return '$40 - $60';
        if (s.includes('brake')) return '$150 - $300';
        if (s.includes('tire')) return '$100 - $400';
        if (s.includes('engine')) return '$500+';
        if (s.includes('wash')) return '$20 - $50';
        return 'Pending Inspection';
    };

    // 3. Progress Tracker
    const getProgress = (status) => {
        if (status === 'COMPLETED') return 100;
        if (status === 'IN_PROGRESS') return 66;
        return 33; // PENDING
    };

    // 4. 3D Holographic Mouse Tracking
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    // 5. Voice Recognition
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Voice recognition not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNewRequest({ ...newRequest, serviceType: transcript });
            setIsListening(false);
            toast.success("Voice recognized!");
        };
        recognition.onerror = () => {
            setIsListening(false);
            toast.error("Could not hear you. Please try again.");
        };
        recognition.onend = () => setIsListening(false);
    };

    if (!user) return null;

    return (
        <div>
            <nav className="nav-bar">
                <h1>CSMS <span>Customer</span></h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${activeTab === 'cars' ? '' : 'btn-danger'}`} style={{ background: activeTab === 'cars' ? 'var(--primary)' : 'transparent' }} onClick={() => setActiveTab('cars')}>
                        <FaCar /> My Cars
                    </button>
                    <button className={`btn ${activeTab === 'requests' ? '' : 'btn-danger'}`} style={{ background: activeTab === 'requests' ? 'var(--primary)' : 'transparent' }} onClick={() => setActiveTab('requests')}>
                        <FiTool /> Services
                    </button>
                    <button className={`btn ${activeTab === 'profile' ? '' : 'btn-danger'}`} style={{ background: activeTab === 'profile' ? 'var(--primary)' : 'transparent' }} onClick={() => setActiveTab('profile')}>
                        <FiUser /> Profile
                    </button>
                    <button className="btn btn-danger" style={{ border: 'none' }} onClick={toggleTheme} title="Toggle Theme">
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                    <button className="btn btn-danger" onClick={logout}>
                        <FiLogOut /> Logout
                    </button>
                </div>
            </nav>

            <div className="container">
                {activeTab === 'cars' && (
                    <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="glass-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ flex: '1 1 300px' }}>
                                <h2>Add New Car to Garage</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Register your vehicle to start requesting premium services.</p>
                                <form onSubmit={handleAddCar}>
                                    <div className="input-group">
                                        <label>Brand</label>
                                        <select value={newCar.carBrand} onChange={e => setNewCar({...newCar, carBrand: e.target.value})} required style={{ fontSize: '1.1rem' }}>
                                            <option value="">-- Select Brand --</option>
                                            <option value="Toyota">Toyota</option>
                                            <option value="Honda">Honda</option>
                                            <option value="Ford">Ford</option>
                                            <option value="BMW">BMW</option>
                                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                                            <option value="Audi">Audi</option>
                                            <option value="Hyundai">Hyundai</option>
                                            <option value="Nissan">Nissan</option>
                                            <option value="Tesla">Tesla</option>
                                            <option value="Chevrolet">Chevrolet</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="input-group">
                                        <label>Model</label>
                                        <input type="text" value={newCar.carModel} onChange={e => setNewCar({...newCar, carModel: e.target.value})} required placeholder="e.g. Camry" style={{ fontSize: '1.1rem' }} />
                                    </div>
                                    <div className="input-group">
                                        <label>Car Number (License Plate)</label>
                                        <input type="text" value={newCar.carNumber} onChange={e => setNewCar({...newCar, carNumber: e.target.value})} required placeholder="e.g. ABC-1234" style={{ fontSize: '1.1rem', textTransform: 'uppercase' }} />
                                    </div>
                                    <button type="submit" className="btn" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}><FiPlus /> Add Vehicle</button>
                                </form>
                            </div>
                            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src="/login_car.png" 
                                        alt="Premium Garage" 
                                        style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(99, 102, 241, 0.4)', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }} 
                                    />
                                    {newCar.carBrand && (
                                        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '0.5rem 1.5rem', borderRadius: '30px', border: '1px solid var(--primary)', color: 'white', fontWeight: 'bold', letterSpacing: '2px', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px var(--primary)' }}>
                                            {newCar.carBrand.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="glass-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                            <h2>My Garage</h2>
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {cars.map(car => (
                                    <div key={car.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                        <h3 style={{ marginBottom: '0.5rem' }}>{car.carBrand} {car.carModel}</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>License Plate: {car.carNumber}</p>
                                    </div>
                                ))}
                                {cars.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No cars added yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="grid">
                        <div className="glass-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                            <h2>Request Service</h2>
                            <form onSubmit={handleRequestService} style={{ marginTop: '1.5rem' }}>
                                <div className="input-group">
                                    <label>Select Car</label>
                                    <select value={newRequest.carId} onChange={e => setNewRequest({...newRequest, carId: e.target.value})} required>
                                        <option value="">-- Choose Car --</option>
                                        {cars.map(car => (
                                            <option key={car.id} value={car.id}>{car.carBrand} {car.carModel} ({car.carNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        Service Type
                                        <button type="button" onClick={handleVoiceInput} style={{ background: 'none', border: 'none', color: isListening ? 'var(--danger)' : 'var(--primary)', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaMicrophone className={isListening ? 'listening-anim' : ''} /> {isListening && <span style={{fontSize: '0.8rem'}}>Listening...</span>}
                                        </button>
                                    </label>
                                    <input type="text" value={newRequest.serviceType} onChange={e => setNewRequest({...newRequest, serviceType: e.target.value})} required placeholder="e.g. Oil Change, or click Mic to speak" />
                                    {newRequest.serviceType && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--secondary)' }}>
                                            💡 Live Estimate: <strong>{getEstimate(newRequest.serviceType)}</strong>
                                        </div>
                                    )}
                                </div>
                                <button type="submit" className="btn"><FiTool /> Submit Request</button>
                            </form>
                        </div>
                        <div className="glass-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                            <h2>Service History</h2>
                            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Car</th>
                                            <th>Service</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map(req => (
                                            <tr key={req.id}>
                                                <td>{req.car?.carModel}</td>
                                                <td>{req.serviceType}</td>
                                                <td>{req.requestDate}</td>
                                                <td>
                                                    {/* Visual Progress Tracker */}
                                                    <div style={{ width: '100px', marginBottom: '4px' }}>
                                                        <div style={{ width: '100%', height: '6px', background: 'rgba(150,150,150,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${getProgress(req.status)}%`, height: '100%', background: req.status === 'COMPLETED' ? 'var(--success)' : req.status === 'IN_PROGRESS' ? 'var(--secondary)' : 'var(--warning)', transition: 'width 0.5s ease' }} />
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: req.status === 'COMPLETED' ? 'var(--success)' : req.status === 'IN_PROGRESS' ? 'var(--secondary)' : 'var(--warning)' }}>
                                                        {req.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td>
                                                    {req.status === 'COMPLETED' && !req.isPaid && (
                                                        <button onClick={() => handlePaymentClick(req)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                            <FaCreditCard style={{ marginRight: '0.2rem' }} /> Pay Now
                                                        </button>
                                                    )}
                                                    {req.isPaid && (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                            <button onClick={() => setShowReceipt(req)} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: 'var(--primary)' }}>
                                                                <FaFileInvoice /> View Receipt
                                                            </button>
                                                            <div style={{ display: 'flex', color: 'var(--warning)', cursor: 'pointer', fontSize: '1rem', justifyContent: 'center' }}>
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <FaStar key={star} onClick={() => handleRating(req.id, star)} style={{ opacity: req.rating >= star ? 1 : 0.3 }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {req.status !== 'COMPLETED' && (
                                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {requests.length === 0 && (
                                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No requests found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="glass-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <FaCrown style={{ fontSize: '3.5rem', color: loyaltyColor, filter: `drop-shadow(0 0 15px ${loyaltyColor})` }} />
                            <h2 style={{ border: 'none', marginBottom: '0', marginTop: '1rem', paddingBottom: 0 }}>{loyaltyTier}</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{completedServices} Completed Services • {completedServices * 150} CSMS Points</p>
                        </div>
                        <form onSubmit={handleUpdateProfile} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Email (Read-only)</label>
                                <input type="email" value={user.email} disabled style={{ opacity: 0.5 }} />
                            </div>
                            <button type="submit" className="btn">Update Profile</button>
                        </form>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem', borderBottom: 'none' }}>Secure Payment</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Paying for: <strong style={{color: 'white'}}>{paymentRequest?.serviceType}</strong>
                        </p>
                        <form onSubmit={processPayment}>
                            <div className="input-group">
                                <label>Cardholder Name</label>
                                <input type="text" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} required placeholder="John Doe" />
                            </div>
                            <div className="input-group">
                                <label>Card Number</label>
                                <input type="text" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} required placeholder="0000 0000 0000 0000" maxLength="16" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>Expiry (MM/YY)</label>
                                    <input type="text" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} required placeholder="12/25" maxLength="5" />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label>CVV</label>
                                    <input type="password" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} required placeholder="123" maxLength="3" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn" style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)' }}><FaCreditCard /> Confirm Pay</button>
                                <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Digital Receipt Modal */}
            {showReceipt && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', background: 'var(--bg-color)' }}>
                        <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <h2 style={{ marginBottom: '0.5rem', border: 'none', display: 'block' }}>CSMS Garage</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Official Digital Receipt</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Receipt #:</span> <strong>{showReceipt.id * 1024}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date:</span> <strong>{showReceipt.requestDate}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Customer:</span> <strong>{user.name}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vehicle:</span> <strong>{showReceipt.car?.carBrand} {showReceipt.car?.carModel} ({showReceipt.car?.carNumber})</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                                <span>Service: {showReceipt.serviceType}</span> <strong>$150.00</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                <span>TOTAL PAID</span> <span>$150.00</span>
                            </div>
                        </div>
                        <button className="btn" style={{ width: '100%' }} onClick={() => setShowReceipt(null)}>Close Receipt</button>
                    </div>
                </div>
            )}

            {/* Confetti Animation Elements */}
            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }}>
                    {Array.from({ length: 70 }).map((_, i) => (
                        <div key={i} className="confetti" style={{
                            left: `${Math.random() * 100}vw`,
                            background: ['#6366f1', '#06b6d4', '#10b981', '#fbbf24', '#ef4444'][Math.floor(Math.random() * 5)],
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
