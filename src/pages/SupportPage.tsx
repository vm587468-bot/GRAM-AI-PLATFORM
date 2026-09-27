import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { SupportTicket } from '../types';
import { useAuth } from '../context/AuthContext';

export const SupportPage: React.FC = () => {
  const { currentUser, role } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'payment' | 'logistics' | 'product' | 'general'>('logistics');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [message, setMessage] = useState('');
  const [ticketCreatedNotice, setTicketCreatedNotice] = useState(false);

  // Reply state
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support/tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.tickets && data.tickets.length > 0) {
        setSelectedTicket(data.tickets[0]);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          role,
          subject,
          category,
          message
        })
      });
      const data = await res.json();
      setTickets(prev => [data.ticket, ...prev]);
      setSelectedTicket(data.ticket);
      setSubject('');
      setMessage('');
      setTicketCreatedNotice(true);
      setTimeout(() => setTicketCreatedNotice(false), 3000);
    } catch (err) {
      console.error('Create ticket error', err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: replyText,
          sender: 'user'
        })
      });
      const data = await res.json();
      setSelectedTicket(data.ticket);
      setTickets(prev => prev.map(t => t.id === data.ticket.id ? data.ticket : t));
      setReplyText('');
    } catch (err) {
      console.error('Reply failed', err);
    }
  };

  const villageHubs = [
    { name: 'Mithila Regional Hub', location: 'Madhubani, Bihar', coordinator: 'Suresh Jha', phone: '+91 94310 44521' },
    { name: 'Marwar Craft Node', location: 'Molela, Rajsamand, Rajasthan', coordinator: 'Bhawani Singh', phone: '+91 94140 23411' },
    { name: 'Western Ghats Agro Hub', location: 'Kalpetta, Wayanad, Kerala', coordinator: 'Sujith Kumar', phone: '+91 98471 22910' },
    { name: 'Delta Forest Co-op Kiosk', location: 'Canning, Sundarbans, West Bengal', coordinator: 'Amitava Roy', phone: '+91 98320 89123' }
  ];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-md">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E6B325]">
            <Headphones className="w-3.5 h-3.5" />
            <span>Gram Sahayak Helpdesk & Village Coordinators</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Direct Support for Artisans & Conscious Patrons
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Need help with postal consignment dispatch, UPI escrow settlement, packaging supplies, or GST receipts? We are here for you 7 days a week.
          </p>
        </div>
      </div>

      {/* Immediate Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Channel 1: Toll Free */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Toll-Free Kisan & Artisan Hotline</h3>
            <p className="text-xs text-slate-500 mt-1">Free call from any Indian mobile network</p>
          </div>
          <div className="font-mono text-lg font-bold text-[#2D5A27]">
            1800-419-GRAM
          </div>
          <p className="text-[11px] text-slate-400">Available Mon-Sat: 07:00 AM – 09:00 PM</p>
        </div>

        {/* Channel 2: WhatsApp Direct */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">WhatsApp Regional Hub Assist</h3>
            <p className="text-xs text-slate-500 mt-1">Send photos of damaged parcels or receipts</p>
          </div>
          <div className="font-mono text-base font-bold text-emerald-800">
            +91 94310 44521
          </div>
          <a
            href="https://wa.me/919431044521"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:underline"
          >
            <span>Open WhatsApp Chat</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Channel 3: Email & Resolution Guarantee */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6B325]/20 text-[#C69516] flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Direct Officer Email</h3>
            <p className="text-xs text-slate-500 mt-1">Escalations & Government Scheme Linkages</p>
          </div>
          <div className="text-xs font-semibold text-slate-800">
            helpdesk@gramai.org
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Guaranteed response within 4 hours</p>
        </div>

      </div>

      {/* Ticket Management & Live Coordination Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Create Ticket Form (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Raise a Helpdesk Ticket</h3>
            <p className="text-xs text-slate-500">Assigned directly to your local village nodal coordinator</p>
          </div>

          {ticketCreatedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ticket raised successfully! Coordinator has been notified.</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Subject / Issue Summary *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. In-transit delay for Madhubani order #901"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#2D5A27]"
                >
                  <option value="logistics">Postal / Logistics</option>
                  <option value="payment">UPI / Escrow Payout</option>
                  <option value="product">Packaging & Stock</option>
                  <option value="general">Govt Subsidies</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#2D5A27]"
                >
                  <option value="medium">Medium</option>
                  <option value="high">High (Urgent Dispatch)</option>
                  <option value="low">Low (General Query)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Message Details *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue with order number, pin code, or artisan name..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2D5A27] hover:bg-[#1E3D1A] text-white font-semibold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#E6B325]" />
              <span>Submit Ticket to Village Coordinator</span>
            </button>
          </form>
        </div>

        {/* Active Ticket Conversations (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Your Support Tickets</h3>
              <p className="text-xs text-slate-500">Live communication with Gram Mitra hub officers</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {tickets.length} total tickets
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading support conversations...</div>
          ) : tickets.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#2D5A27]" />
              <p>No open tickets. All dispatches running smoothly!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Ticket selector chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {tickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTicket?.id === t.id
                        ? 'bg-[#2D5A27] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{t.id}</span> · <span className="capitalize">{t.status.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>

              {/* Selected Ticket Conversation Thread */}
              {selectedTicket && (
                <div className="bg-[#F8F5F0] rounded-2xl p-4 border border-[#2D5A27]/15 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedTicket.subject}</h4>
                      <p className="text-[11px] text-slate-500">Created by {selectedTicket.userName} · Category: {selectedTicket.category}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6B325]/20 text-[#2D5A27]">
                      {selectedTicket.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Messages Bubble */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedTicket.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl space-y-1 ${
                          m.sender === 'user'
                            ? 'bg-white ml-6 border border-slate-200'
                            : 'bg-[#2D5A27] text-white mr-6 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-70">
                          <span className="font-semibold">{m.sender === 'user' ? 'You' : 'Gram Mitra Coordinator'}</span>
                          <span>{m.time}</span>
                        </div>
                        <p className="leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-slate-200/60">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your response to the coordinator..."
                      className="flex-1 p-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#2D5A27]"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 py-2 rounded-xl bg-[#2D5A27] text-white text-xs font-semibold hover:bg-[#1E3D1A] disabled:opacity-40 cursor-pointer shadow-xs"
                    >
                      Reply
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Regional Village Cluster Hubs Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Gram AI Physical Cluster Hubs & Kiosks</h3>
          <p className="text-xs text-slate-500">Walk in for free packaging supplies, quality testing, and digital payment onboarding</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {villageHubs.map((hub, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#F8F5F0] border border-slate-200/70 text-xs space-y-1.5">
              <div className="font-bold text-[#2D5A27] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>{hub.name}</span>
              </div>
              <div className="text-slate-700 font-medium">{hub.location}</div>
              <div className="text-[11px] text-slate-500">Lead: {hub.coordinator}</div>
              <div className="text-[11px] font-mono font-semibold text-slate-800">{hub.phone}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
