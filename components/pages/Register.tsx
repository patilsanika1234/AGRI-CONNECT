
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import { User } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStates } from '../../services/dataService';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.301 8.844 6.942 5 12 5c5.058 0 8.698 3.844 9.964 6.678a1.012 1.012 0 0 1 0 .644C20.699 15.156 17.058 19 12 19c-5.058 0-8.698-3.844-9.964-6.678Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const Register: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Farmer' | 'Admin'>('Farmer');
  const [states, setStates] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    state: '',
    password: '',
    confirmPassword: '',
  });
  const [secretKey, setSecretKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData & { form?: string }>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { t, translateDynamic } = useLanguage();

  useEffect(() => {
    setStates(getStates());
  }, []);

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>_]/.test(formData.password),
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name) newErrors.name = 'Full Name Is Required';
    if (!formData.email) {
      newErrors.email = 'Email Is Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid Email Format';
    }
    if (!formData.state) newErrors.state = 'Please Select Your State';
    if (!formData.password) {
      newErrors.password = 'Password Is Required';
    } else if (!Object.values(passwordCriteria).every(Boolean)) {
      newErrors.password = 'Password Does Not Meet All Security Requirements';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('error_password_mismatch');
    }
    if (activeTab === 'Admin' && secretKey !== 'ADMIN123') {
      (newErrors as any).secretKey = t('invalid_secret_key');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (validate()) {
      const storedUsers: any[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = storedUsers.some((user) => user.email === formData.email);
      if (userExists) {
        setErrors({ email: 'This Email Is Already Registered' });
        return;
      }
      const newUser: User & { password?: string } = {
        name: formData.name,
        email: formData.email,
        state: formData.state,
        role: activeTab,
        password: formData.password
      };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      setSuccessMessage(`Welcome Aboard! ${activeTab} Account Created Successfully.`);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  const inputStyle = "mt-1 block w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 font-medium transition-all shadow-sm";
  const labelStyle = "block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5";

  const RequirementItem = ({ label, satisfied }: { label: string; satisfied: boolean }) => (
    <li className={`flex items-center space-x-2 text-[11px] font-bold uppercase tracking-tight transition-colors ${satisfied ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
      <span className="text-sm">{satisfied ? '✓' : '○'}</span>
      <span>{label}</span>
    </li>
  );

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-12 px-4">
      <Card className="max-w-md w-full !p-0 overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-700 rounded-[2.5rem]">
        <div className="flex w-full">
          <button onClick={() => { setActiveTab('Farmer'); setErrors({}); }} className={`flex-1 py-4 text-xs font-black border-b-2 uppercase tracking-widest transition-all ${activeTab === 'Farmer' ? 'border-primary-500 text-primary-600 bg-primary-50/30' : 'text-gray-400'}`}>Farmer</button>
          <button onClick={() => { setActiveTab('Admin'); setErrors({}); }} className={`flex-1 py-4 text-xs font-black border-b-2 uppercase tracking-widest transition-all ${activeTab === 'Admin' ? 'border-primary-500 text-primary-600 bg-primary-50/30' : 'text-gray-400'}`}>Admin</button>
        </div>
        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase text-center mb-8">
            {activeTab === 'Farmer' ? 'FARMER REGISTRATION' : 'ADMIN REGISTRATION'}
          </h2>

          {successMessage ? (
            <div className="text-center py-10 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/50">
              <p className="font-black text-green-600 dark:text-green-400 text-lg uppercase">{successMessage}</p>
              <p className="text-sm text-green-500 mt-2">Redirecting To Login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelStyle}>{t('full_name_label')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} placeholder="Enter Full Name" />
                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.name}</p>}
              </div>
              <div>
                <label className={labelStyle}>{t('email_label')}</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} placeholder="Name@Example.Com" />
                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.email}</p>}
              </div>
              <div>
                <Select label={t('state_label')} name="state" options={["", ...states]} renderOption={(opt) => opt ? translateDynamic(opt) : 'Select State'} value={formData.state} onChange={handleChange} />
                {errors.state && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.state}</p>}
              </div>
              
              <div>
                <label className={labelStyle}>{t('password_label')}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className={inputStyle} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-primary-500">
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                <ul className="mt-3 grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-800">
                  <RequirementItem label="Min 8 Chars" satisfied={passwordCriteria.length} />
                  <RequirementItem label="1 Uppercase" satisfied={passwordCriteria.uppercase} />
                  <RequirementItem label="1 Number" satisfied={passwordCriteria.number} />
                  <RequirementItem label="1 Special Char" satisfied={passwordCriteria.special} />
                </ul>
                {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.password}</p>}
              </div>

              <div>
                <label className={labelStyle}>{t('confirm_password')}</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputStyle} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-primary-500">
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.confirmPassword}</p>}
              </div>

              {activeTab === 'Admin' && (
                <div>
                  <label className={labelStyle}>{t('secret_key_label')}</label>
                  <input 
                    type="password" 
                    value={secretKey} 
                    onChange={(e) => setSecretKey(e.target.value)} 
                    className={inputStyle} 
                    placeholder="••••••••" 
                    required={activeTab === 'Admin'}
                  />
                  {(errors as any).secretKey && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{(errors as any).secretKey}</p>}
                </div>
              )}

              <Button type="submit" className="w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all">
                {activeTab === 'Farmer' ? 'Register As Farmer' : 'Register As Admin'}
              </Button>
              <div className="text-center pt-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Already Have An Account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 underline underline-offset-4 decoration-2">Login</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Register;
