import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Users, 
  MessageSquare, 
  Settings, 
  Bot, 
  Clock, 
  User, 
  ChevronRight, 
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './index.css';

/**
 * VaaniAI Admin Dashboard
 * Demo implementation for Hackathon Showcase
 */

function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [activeCalls, setActiveCalls] = useState([
    {
      id: "call_001",
      customer: "Rahul Sharma",
      phone: "+91 98765 43210",
      status: "live",
      transcript: "Hinglish: Bhai mera order kab tak aayega? Kal se delay dikha raha hai.",
      language: "Hinglish",
      memory: "Regular customer, usually asks for express delivery."
    }
  ]);

  const [customerMemory, setCustomerMemory] = useState([
    { name: "Priya Rao", phone: "91234 56780", issues: "3 past refunds", status: "Premium", lang: "Kannada/English" },
    { name: "Amit Patel", phone: "99887 76655", issues: "Pending order #552", status: "Regular", lang: "Hindi" },
    { name: "Ananya", phone: "90011 22334", issues: "Inquiry about store hours", status: "New", lang: "Hinglish" }
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'customers':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="live-feed">
             <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Customer Database</h2>
             <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <Users size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <h3>1,242 Total Customers</h3>
                <p style={{ color: 'var(--text-muted)' }}>Search and manage your permanent customer profiles here.</p>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                {customerMemory.map((c, i) => (
                    <div key={i} className="glass">
                        <h4 style={{ color: 'var(--accent)' }}>{c.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.phone}</p>
                    </div>
                ))}
             </div>
          </motion.div>
        );
      case 'history':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="live-feed">
             <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Call History</h2>
             <div className="glass">
                <p style={{ color: 'var(--text-muted)' }}>Historical logs of all AI-handled calls.</p>
             </div>
             <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SummaryRow name="Suresh Kumar" summary="Refund processed" time="10 mins ago" status="success" />
                <SummaryRow name="Unknown" summary="Business hours inquiry" time="45 mins ago" status="info" />
                <SummaryRow name="Vijay" summary="Order status checked" time="2 hours ago" status="success" />
             </div>
          </motion.div>
        );
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="live-feed">
            <div className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="stretched-text">Live Interactions</h2>
              <div className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--accent)' }}>
                System Status: Healthy
              </div>
            </div>

            <AnimatePresence>
              {activeCalls.map((call) => (
                <motion.div 
                  key={call.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass call-card live"
                >
                  <div className="call-header">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)' }}>
                        <Phone size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem' }}>{call.customer}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{call.phone}</p>
                      </div>
                    </div>
                    <div className="status-badge status-active">
                      LIVE CALL
                    </div>
                  </div>

                  <div className="transcript-snippet">
                    <p>{call.transcript}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <div className="glass" style={{ flex: 1, padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Agent AI Thought</p>
                      <p style={{ fontSize: '0.85rem' }}>Caller sounds anxious. I should check order #4492 in the database and offer express shipping.</p>
                    </div>
                    <div className="glass" style={{ width: 120, padding: '0.75rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Detection</p>
                        <span className="lang-tag">{call.language}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '1rem' }}>Recent Summaries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <SummaryRow 
                name="Suresh Kumar" 
                summary="Processed refund for expired medicine. Order #5521." 
                time="10 mins ago" 
                status="success"
              />
              <SummaryRow 
                name="Unknown Caller" 
                summary="General inquiry about weekend hours. Redirected to timing info." 
                time="45 mins ago" 
                status="info"
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-group glass" style={{ textAlign: 'center', marginBottom: '1rem', background: 'var(--bg-card)', color: 'var(--text-inverse)', padding: '1.5rem 2rem' }}>
          <h1 className="stretched-text" style={{ fontSize: '1.8rem' }}>VAANI<span className="outlined-text">AI</span></h1>
          <p style={{ color: '#888', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', marginTop: '0.5rem' }}>VOICE SUPPORT ENGINE</p>
        </div>
        
        <nav className="nav-list glass" style={{ background: 'var(--bg-card)' }}>
          <NavItem icon={<Activity size={18} />} label="Live Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
          <NavItem icon={<Users size={18} />} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
          <NavItem icon={<MessageSquare size={18} />} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<Bot size={18} />} label="Agent Config" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="glass" style={{ marginTop: 'auto', padding: '1rem', background: 'var(--bg-card)', color: 'var(--text-inverse)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--primary)' }}></div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Raju Pharmacy</p>
              <p style={{ fontSize: '0.75rem', color: '#888' }}>Owner Dashboard</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {renderContent()}

      {/* Customer Memory Panel */}

      {/* Customer Memory Panel */}
      <aside className="memory-panel sidebar">
        <h2 className="stretched-text" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Customer Memory</h2>
        <div className="glass memory-list" style={{ flex: 1, overflowY: 'auto' }}>
          {customerMemory.map((customer, idx) => (
            <div key={idx} className="customer-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p className="customer-name">{customer.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.phone}</p>
                </div>
                <span className="lang-tag" style={{ fontSize: '0.6rem' }}>{customer.lang}</span>
              </div>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                {customer.issues}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                  View Profile <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="glass" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={14} /> Total Profiles Synced: 1,242
            </p>
        </div>
      </aside>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </div>
  );
}

function SummaryRow({ name, summary, time, status }) {
    return (
        <div className="glass" style={{ display: 'flex', padding: '1rem', gap: '1rem', alignItems: 'center' }}>
            <div style={{ color: status === 'success' ? 'var(--accent)' : 'var(--text-muted)' }}>
                {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{name} 
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>• {time}</span>
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{summary}</p>
            </div>
        </div>
    );
}

export default App;
