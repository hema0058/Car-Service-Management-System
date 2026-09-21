import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServiceRequests, updateServiceRequestStatus, getAllUsers, updateUser } from '../services/api';
import { toast } from 'react-toastify';
import { FiLogOut, FiUsers, FiTool } from 'react-icons/fi';
import { FaMoon, FaSun, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('requests');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();
    const requestsRef = useRef([]);

    // Keep the ref updated with the latest requests to avoid stale closures in our interval
    useEffect(() => {
        requestsRef.current = requests;
    }, [requests]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'ADMIN') {
            navigate('/login');
            return;
        }
        fetchData();

        // Set up polling to check for new requests every 10 seconds
        const intervalId = setInterval(async () => {
            try {
                const reqRes = await getAllServiceRequests();
                const newRequests = reqRes.data;
                
                // Compare new data length with our current data length
                if (newRequests.length > requestsRef.current.length && requestsRef.current.length > 0) {
                    const diff = newRequests.length - requestsRef.current.length;
                    toast.info(`🔔 You have ${diff} new service request${diff > 1 ? 's' : ''}!`);
                }
                
                setRequests(newRequests);
            } catch (err) {
                // Silently handle polling errors to avoid spamming the admin if network drops
                console.error("Polling error", err);
            }
        }, 10000);

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [navigate]);

    const fetchData = async () => {
        try {
            const reqRes = await getAllServiceRequests();
            setRequests(reqRes.data);
            const userRes = await getAllUsers();
            setUsers(userRes.data);
        } catch (err) {
            toast.error('Failed to load data');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateServiceRequestStatus(id, status);
            toast.success('Status updated');
            fetchData();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleEditUser = async (userToEdit) => {
        const newName = prompt("Enter new name:", userToEdit.name);
        if (!newName) return;
        const newPhone = prompt("Enter new phone number:", userToEdit.phone);
        if (!newPhone) return;

        try {
            await updateUser(userToEdit.id, { name: newName, phone: newPhone });
            toast.success('User updated successfully');
            fetchData();
        } catch (err) {
            toast.error('Failed to update user');
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

    // Calculate Analytics
    const totalCustomers = users.filter(u => u.role !== 'ADMIN').length;
    const pendingRequests = requests.filter(r => r.status === 'PENDING').length;
    const totalRevenue = requests.filter(r => r.status === 'COMPLETED').length * 150; // $150 simulated average

    // Apply Filters and Search
    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            req.user?.name?.toLowerCase().includes(searchLower) || 
            req.car?.carNumber?.toLowerCase().includes(searchLower) || 
            req.serviceType?.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
    });



    return (
        <div>
            <nav className="nav-bar">
                <h1>CSMS <span>Admin</span></h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={`btn ${activeTab === 'requests' ? '' : 'btn-danger'}`} style={{ background: activeTab === 'requests' ? 'var(--primary)' : 'transparent' }} onClick={() => setActiveTab('requests')}>
                        <FiTool /> Requests
                    </button>
                    <button className={`btn ${activeTab === 'users' ? '' : 'btn-danger'}`} style={{ background: activeTab === 'users' ? 'var(--primary)' : 'transparent' }} onClick={() => setActiveTab('users')}>
                        <FiUsers /> Users
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
                {/* Analytics Dashboard */}
                <div className="grid" style={{ marginBottom: '2.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Customers</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{totalCustomers}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Pending Requests</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{pendingRequests}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Revenue</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>${totalRevenue}</p>
                    </div>
                </div>

                {activeTab === 'requests' && (
                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Service Requests</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <FaSearch style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by Name, Car, or Service..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--card-border)', borderRadius: '4px', width: '250px' }}
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                                >
                                    <option value="ALL">All Statuses</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>

                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Customer</th>
                                        <th>Car</th>
                                        <th>Service Type</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map(req => (
                                        <tr key={req.id}>
                                            <td>#{req.id}</td>
                                            <td>{req.user?.name}</td>
                                            <td>{req.car?.carModel} ({req.car?.carNumber})</td>
                                            <td>{req.serviceType}</td>
                                            <td>{req.requestDate}</td>
                                            <td>
                                                <span className={`status-badge status-${req.status}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={req.status}
                                                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                                    style={{ padding: '0.25rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--card-border)', borderRadius: '4px' }}
                                                >
                                                    <option value="PENDING" style={{color: 'black'}}>Pending</option>
                                                    <option value="IN_PROGRESS" style={{color: 'black'}}>In Progress</option>
                                                    <option value="COMPLETED" style={{color: 'black'}}>Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredRequests.length === 0 && (
                                        <tr><td colSpan="7" style={{ textAlign: 'center' }}>No requests found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card">
                        <h2>Registered Customers</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.filter(u => u.role !== 'ADMIN').map(u => (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>{u.role}</td>
                                            <td>
                                                <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => handleEditUser(u)}>
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
