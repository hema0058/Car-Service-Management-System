import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { toast } from 'react-toastify';

const Register = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Password Validation: at least 8 characters, case sensitive (at least one upper & lower), and at least one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(user.password)) {
            toast.error('Password must be at least 8 characters long, include uppercase, lowercase, and a number.');
            return;
        }

        try {
            await register(user);
            toast.success('Registration Successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error('Registration failed. Email might exist.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required placeholder="Strong password" />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" onChange={handleChange} required placeholder="+1 234 567 890" />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select name="role" onChange={handleChange} value={user.role} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text)', outline: 'none' }}>
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
