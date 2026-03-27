import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Briefcase, BookOpen, Tag, Save, Camera, FileText, Building2, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, API } from '../context/AuthContext';
import { cn } from '../utils/cn';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import MainLayout from '../layouts/MainLayout';
import DashboardSidebar from '../layouts/DashboardSidebar';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const SectionCard = ({ title, icon: Icon, children, isDark }) => (
  <div className={cn(
    'rounded-[2rem] border p-8 transition-all duration-300 relative overflow-hidden',
    isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl shadow-brand-purple/5' : 'bg-white border-brand-purple/10 hover:shadow-xl hover:shadow-brand-purple/5 shadow-sm'
  )}>
    <div className="flex items-center gap-3 mb-8">
      {Icon && (
        <div className={cn('p-2.5 rounded-xl', isDark ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-purple/5 text-brand-purple')}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h2 className={cn('text-lg font-bold tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>{title}</h2>
    </div>
    {children}
  </div>
);

const ProfilePage = () => {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience: '',
    education: '',
    skills: [],
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        experience: user.experience || '',
        education: user.education || '',
        skills: user.skills || [],
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        companyDescription: user.companyDescription || '',
      });
    }
  }, [user]);

  const update = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) update('skills', [...form.skills, s]);
    setSkillInput('');
  };
  const removeSkill = (s) => update('skills', form.skills.filter(sk => sk !== s));

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile synchronized! ✅');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePicture', file);
    setLoading(true);
    try {
      const res = await API.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(res.data.user);
      toast.success('Identity photo updated! 📸');
    } catch {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <MainLayout>
      <div className={cn('min-h-screen pt-32 transition-colors duration-500 relative z-10', isDark ? 'bg-[#08070B]' : 'bg-[#F8FAFC]')}>
        <div className="container-custom pb-24">
          <div className="flex flex-col lg:flex-row gap-10">
            <DashboardSidebar />
            
            <div className="flex-1 min-w-0">
              {/* Premium Profile Hero */}
              <div className={cn(
                'relative p-8 lg:p-12 mb-10 rounded-[2.5rem] border overflow-hidden transition-all duration-300',
                isDark ? 'bg-[#0D0C14] border-brand-purple/35 shadow-2xl' : 'bg-white border-brand-purple/10 shadow-sm'
              )}>
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group/avatar">
                    <div className={cn(
                      'w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] p-1.5 transition-all duration-500 group-hover/avatar:scale-105',
                      'bg-gradient-to-br from-brand-purple via-brand-pink to-brand-orange shadow-2xl shadow-brand-purple/20'
                    )}>
                      <div className={cn('w-full h-full rounded-[2.2rem] flex items-center justify-center text-white text-4xl font-black overflow-hidden relative', isDark ? 'bg-[#08070B]' : 'bg-white')}>
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
                        ) : (
                          <span className="gradient-text">{getInitials(user.name)}</span>
                        )}
                      </div>
                    </div>
                    <label className={cn(
                      'absolute -bottom-2 -right-2 w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer shadow-xl transform hover:scale-110 active:scale-90',
                      isDark ? 'bg-brand-purple border-[#08070B] text-white' : 'bg-brand-purple border-white text-white'
                    )}>
                      <Camera className="w-5 h-5" />
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <h1 className={cn('text-3xl lg:text-4xl font-black tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
                        {user.name}
                      </h1>
                      <div className={cn(
                        'inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border',
                        isDark ? 'bg-brand-purple/10 border-brand-purple/30 text-brand-purple' : 'bg-brand-purple bg-opacity-5 border-brand-purple/20 text-brand-purple'
                      )}>
                        {user.role} Identity
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[13px] font-medium">
                      <div className={cn('flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        <Mail className="w-4 h-4 text-brand-purple/60" /> {user.email}
                      </div>
                      {user.location && (
                        <div className={cn('flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                          <MapPin className="w-4 h-4 text-brand-pink/60" /> {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[150px]">
                    <div className={cn('p-4 rounded-2xl border text-center', isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100')}>
                      <span className="block text-xl font-bold text-brand-purple mb-0.5">92%</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Strength</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                {/* Tactical Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Personal & Bio */}
                  <div className="space-y-8">
                    <SectionCard title="Contact Framework" icon={User} isDark={isDark}>
                      <div className="space-y-5">
                        <Input label="Professional Name" value={form.name} onChange={e => update('name', e.target.value)} icon={<User className="w-4 h-4" />} />
                        <Input label="Registry Email" type="email" value={form.email} icon={<Mail className="w-4 h-4" />} disabled />
                        <Input label="Tactical Phone" value={form.phone} onChange={e => update('phone', e.target.value)} icon={<Phone className="w-4 h-4" />} placeholder="+91 9876543210" />
                        <Input label="Discovery Location" value={form.location} onChange={e => update('location', e.target.value)} icon={<MapPin className="w-4 h-4" />} placeholder="City, State" />
                      </div>
                    </SectionCard>

                    <SectionCard title="Professional Narrative" icon={FileText} isDark={isDark}>
                      <textarea
                        value={form.bio}
                        onChange={e => update('bio', e.target.value)}
                        rows={6}
                        placeholder="Define your career trajectory and value proposition..."
                        maxLength={500}
                        className={cn(
                          'w-full rounded-2xl px-5 py-4 text-[14px] leading-relaxed resize-none outline-none border transition-all duration-300 font-medium',
                          isDark 
                            ? 'bg-[#12111A] border-brand-purple/20 text-gray-100 placeholder-gray-600 focus:border-brand-purple/60' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-purple/40'
                        )}
                      />
                      <div className="flex justify-between items-center mt-3 px-1">
                        <span className="text-[10px] font-bold text-brand-purple/50 uppercase tracking-widest">Bio Component</span>
                        <span className={cn('text-[10px] font-bold uppercase tracking-widest', isDark ? 'text-gray-600' : 'text-gray-400')}>{form.bio.length}/500</span>
                      </div>
                    </SectionCard>
                  </div>

                  {/* Right Column: Experience, Skills, Company */}
                  <div className="space-y-8">
                    {user.role === 'jobseeker' ? (
                      <>
                        <SectionCard title="Experience Matrix" icon={Briefcase} isDark={isDark}>
                          <div className="space-y-5">
                            <Input label="Years of Tenure" value={form.experience} onChange={e => update('experience', e.target.value)} icon={<Briefcase className="w-4 h-4" />} placeholder="e.g. 3 years" />
                            <Input label="Primary Education" value={form.education} onChange={e => update('education', e.target.value)} icon={<BookOpen className="w-4 h-4" />} placeholder="e.g. B.Tech CS" />
                          </div>
                        </SectionCard>

                        <SectionCard title="Technical Arsenal" icon={Tag} isDark={isDark}>
                          <div className="flex gap-3 mb-6">
                            <input
                              type="text"
                              value={skillInput}
                              onChange={e => setSkillInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                              placeholder="Inject skill..."
                              className={cn(
                                'flex-1 rounded-xl px-4 py-3 text-sm font-bold outline-none border transition-all',
                                isDark ? 'bg-[#12111A] border-brand-purple/20 text-white placeholder-gray-600 focus:border-brand-purple/50' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-purple/30'
                              )}
                            />
                            <button
                              type="button"
                              onClick={addSkill}
                              className="px-6 rounded-xl bg-brand-purple text-white text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95 shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                            {form.skills.map(skill => (
                              <div
                                key={skill}
                                className={cn(
                                  'group/tag flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all duration-300',
                                  isDark 
                                    ? 'bg-brand-purple/5 border-brand-purple/30 text-brand-purple hover:border-brand-purple/60 shadow-lg shadow-black/20' 
                                    : 'bg-white border-brand-purple/10 text-brand-purple hover:border-brand-purple/30 shadow-sm'
                                )}
                              >
                                {skill}
                                <button type="button" onClick={() => removeSkill(skill)} className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all font-bold text-sm">×</button>
                              </div>
                            ))}
                            {form.skills.length === 0 && (
                              <div className="w-full py-8 border-2 border-dashed border-brand-purple/10 rounded-2xl flex flex-col items-center justify-center gap-3">
                                <Tag className="w-6 h-6 text-brand-purple/20" />
                                <p className={cn('text-[11px] font-bold uppercase tracking-widest', isDark ? 'text-gray-600' : 'text-gray-400')}>Arsenal Empty</p>
                              </div>
                            )}
                          </div>
                        </SectionCard>
                      </>
                    ) : (
                      <SectionCard title="Venture Overview" icon={Building2} isDark={isDark}>
                        <div className="space-y-6">
                          <Input label="Entity Name" value={form.companyName} onChange={e => update('companyName', e.target.value)} icon={<Building2 className="w-4 h-4" />} />
                          <Input label="Digital Identity (URL)" type="url" value={form.companyWebsite} onChange={e => update('companyWebsite', e.target.value)} icon={<Layers className="w-4 h-4" />} placeholder="https://company.com" />
                          <div>
                            <label className={cn('text-sm font-bold uppercase tracking-widest mb-2 block opacity-60 text-[10px]', isDark ? 'text-gray-300' : 'text-gray-600')}>Venture Mission</label>
                            <textarea
                              value={form.companyDescription}
                              onChange={e => update('companyDescription', e.target.value)}
                              rows={5}
                              className={cn(
                                'w-full rounded-2xl px-5 py-4 text-[14px] leading-relaxed resize-none outline-none border transition-all duration-300 font-medium',
                                isDark ? 'bg-[#12111A] border-brand-purple/20 text-gray-100 focus:border-brand-purple/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-brand-purple'
                              )}
                            />
                          </div>
                        </div>
                      </SectionCard>
                    )}
                  </div>
                </div>

                {/* Tactical Footer */}
                <div className={cn(
                  'mt-12 p-6 rounded-[2rem] border backdrop-blur-md z-30 flex flex-col md:flex-row gap-6 justify-between items-center',
                  isDark ? 'bg-[#0D0C14]/80 border-brand-purple/30 shadow-2xl shadow-black/40' : 'bg-white/80 border-brand-purple/10 shadow-lg shadow-brand-purple/5'
                )}>
                  <div className="flex flex-col">
                    <p className={cn('text-[11px] font-bold uppercase tracking-widest', isDark ? 'text-white' : 'text-gray-900')}>
                      Identity Security Protocol
                    </p>
                    <p className={cn('text-[10px] font-medium opacity-50', isDark ? 'text-gray-300' : 'text-gray-600')}>
                      Last synchronized moments ago
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'w-full md:w-auto px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3',
                      'bg-gradient-to-r from-brand-purple to-brand-pink shadow-lg shadow-brand-purple/30 hover:shadow-brand-purple/50 hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0'
                    )}
                  >
                    {loading ? 'Processing...' : (
                      <>
                        <Save className="w-4 h-4" /> Synchronize Identity
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
