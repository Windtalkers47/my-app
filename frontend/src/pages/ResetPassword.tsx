import { useState } from 'react';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleReset = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message);
      alert('Password reset successful');
    } catch (err) {
      console.error(err);
      alert('Reset failed');
    }
  };

  return (
    <div className="pt-16 bg-cafe-background min-h-screen flex items-center justify-center p-4">
      <div className="cafe-card p-8 max-w-md w-full fade-in">
        <h2 className="cafe-heading mb-6 text-center">รีเซ็ตรหัสผ่าน</h2>
        
        <div className="space-y-4">
          <div>
            <label className="cafe-label mb-2">โทเค็นรีเซ็ต</label>
            <input
              className="cafe-input w-full"
              placeholder="กรอกโทเค็นรีเซ็ตของคุณ"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          
          <div>
            <label className="cafe-label mb-2">รหัสผ่านใหม่</label>
            <input
              className="cafe-input w-full"
              type="password"
              placeholder="รหัสผ่านใหม่"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleReset} 
            className="btn-cafe w-full mt-6 py-3 text-lg"
          >
            รีเซ็ตรหัสผ่าน
          </button>
        </div>
      </div>
    </div>
  );
}

