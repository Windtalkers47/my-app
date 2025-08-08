import { useState } from 'react';
import apiClient from '../../utils/axiosConfig';

import { encryptPassword } from '../../utils/encrypt';

// Props ไป Navbar
interface Props {
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
}

export default function LoginModal({ onClose, onLoginSuccess }: Props) {
  const [step, setStep] = useState<'login' | 'register' | 'forgot'>('login');

  //#region Logic
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const encryptedPassword = encryptPassword(password);

      const res = await apiClient.post('/api/login', {
        email: email,
        password: encryptedPassword
      });

      onLoginSuccess(res.data.user.role); // ส่ง Role กลับ

      alert('Login successful');
      setStep('login');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(errorMessage);
      console.error('Login error:', error);
    }
  };

  //#endregion

  //#region Register
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleRegister = async () => {
    try {
      const encrypted = encryptPassword(regPassword);

      const res = await apiClient.post('/api/register', {
        email: regEmail,
        password: encrypted
      });

      alert('Registered successfully');
      onLoginSuccess(res.data.role); // ✅ close modal
      setStep('login');
      setEmail('');
      setPassword('');
      window.location.reload(); // ✅ or update global auth state instead
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      alert(errorMessage);
      console.error('Registration error:', error);
    }
  };
  //#endregion

  //#region Forgot Password

  const [forgotEmail, setForgotEmail] = useState('');

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      alert('Please enter your email');
      return;
    }

    try {
      const res = await apiClient.post('/api/forgot-password', {
        email: forgotEmail,
      });

      const data = res.data;

      alert(`Reset link sent. Token: ${data.token}`);
      setStep('login');
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || 'Request failed';
      alert(message);
    }
  };

  //#endregion


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <button className="text-right float-right text-gray-500" onClick={onClose}>✕</button>

        {step === 'login' && (
          <>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <input 
              className="w-full p-2 border mb-3 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <input 
              className="w-full p-2 border mb-3 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              
            <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={handleLogin}>Login</button>
            
            <div className="mt-4 text-sm flex justify-between">
              <span onClick={() => setStep('register')} className="text-blue-600 cursor-pointer">Register</span>
              <span onClick={() => setStep('forgot')} className="text-blue-600 cursor-pointer">Forgot Password?</span>
            </div>
          </>
        )}

        {step === 'register' && (
          <>
            <h2 className="text-xl font-bold mb-4">Register</h2>
            {/* <input className="w-full p-2 border mb-3 rounded" placeholder="Name" /> */}
            <input 
              className="w-full p-2 border mb-3 rounded"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)} />

            <input 
              className="w-full p-2 border mb-3 rounded" 
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              />
            <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700" onClick={handleRegister}>Create Account</button>

            <div className="mt-4 text-sm text-center">
              <span onClick={() => setStep('login')} className="text-blue-600 cursor-pointer">Back to Login</span>
            </div>
          </>
        )}

        {step === 'forgot' && (
          <>
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <input 
              className="w-full p-2 border mb-3 rounded" 
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              />

            <button className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700" onClick={handleForgotPassword}>Send Reset Link</button>
            <div className="mt-4 text-sm text-center">
              <span onClick={() => setStep('login')} className="text-blue-600 cursor-pointer">Back to Login</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}