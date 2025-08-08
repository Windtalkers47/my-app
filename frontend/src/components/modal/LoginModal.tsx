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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 fade-in">
      <div className="cafe-card p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="cafe-heading">
            {step === 'login' && 'เข้าสู่ระบบ'}
            {step === 'register' && 'สมัครสมาชิก'}
            {step === 'forgot' && 'ลืมรหัสผ่าน'}
          </h2>
          <button 
            className="text-2xl text-cafe-text-light hover:text-cafe-primary"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {step === 'login' && (
          <div className="space-y-4">
            <div>
              <label className="cafe-label mb-2">อีเมล</label>
              <input 
                className="cafe-input w-full"
                placeholder="กรอกอีเมลของคุณ"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="cafe-label mb-2">รหัสผ่าน</label>
              <input 
                className="cafe-input w-full"
                type="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
              
            <button 
              className="btn-cafe w-full py-3 mt-4"
              onClick={handleLogin}
            >
              เข้าสู่ระบบ
            </button>
            
            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep('register')} 
                className="cafe-text text-cafe-primary hover:underline"
              >
                สมัครสมาชิก
              </button>
              <button 
                onClick={() => setStep('forgot')} 
                className="cafe-text text-cafe-primary hover:underline"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
          </div>
        )}

        {step === 'register' && (
          <div className="space-y-4">
            <div>
              <label className="cafe-label mb-2">อีเมล</label>
              <input 
                className="cafe-input w-full"
                placeholder="กรอกอีเมลของคุณ"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)} 
              />
            </div>

            <div>
              <label className="cafe-label mb-2">รหัสผ่าน</label>
              <input 
                className="cafe-input w-full" 
                type="password"
                placeholder="สร้างรหัสผ่าน"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            
            <button 
              className="btn-cafe w-full py-3 mt-4"
              onClick={handleRegister}
            >
              สร้างบัญชี
            </button>

            <div className="text-center pt-4">
              <button 
                onClick={() => setStep('login')} 
                className="cafe-text text-cafe-primary hover:underline"
              >
                กลับสู่หน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        )}

        {step === 'forgot' && (
          <div className="space-y-4">
            <div>
              <label className="cafe-label mb-2">อีเมล</label>
              <input 
                className="cafe-input w-full" 
                placeholder="กรอกอีเมลของคุณ"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <button 
              className="btn-cafe w-full py-3 mt-4"
              onClick={handleForgotPassword}
            >
              ส่งลิงก์รีเซ็ต
            </button>
            
            <div className="text-center pt-4">
              <button 
                onClick={() => setStep('login')} 
                className="cafe-text text-cafe-primary hover:underline"
              >
                กลับสู่หน้าเข้าสู่ระบบ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}