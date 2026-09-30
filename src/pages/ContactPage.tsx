import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ClipboardCheck, Sparkles, MessageSquare } from 'lucide-react';
import { api, ApiError } from '../lib/api';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setError('');
        setSubmitting(true);
        try {
            // The contact form reuses the inquiries endpoint (and email notification),
            // with the message/subject folded into `notes`.
            await api.submitInquiry({
                customerName: formData.name,
                email: formData.email,
                notes: `Subject: ${formData.subject || 'General inquiry'}\n\n${formData.message}`,
            });
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 4000);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not send your message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            <div className="container-custom">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="badge mb-3">Get in Touch</span>
                    <h1 className="text-3xl sm:text-5xl font-display font-bold text-surface-900 mb-4">Contact Our Travel Experts</h1>
                    <p className="text-surface-500">
                        Have questions about destinations, custom itineraries, transport rates, or airport pickups? Leave us a message.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-surface-900 text-lg">Contact Information</h3>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-750 flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-surface-800">Our Office</h4>
                                    <p className="text-xs text-surface-500 mt-1">Tangalle Beach Road, Tangalle, Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-750 flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-surface-800">Call / WhatsApp</h4>
                                    <p className="text-xs text-surface-500 mt-1">+94 76 767 4827</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-750 flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-surface-800">Email Address</h4>
                                    <p className="text-xs text-surface-500 mt-1">ceylunatravelstours@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Answer card */}
                        <div className="bg-primary-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <Sparkles size={24} className="text-accent-400 mb-3" />
                                <h4 className="font-bold text-white mb-2">Need a Fast Tour Quotation?</h4>
                                <p className="text-xs text-white/70 leading-relaxed mb-4">
                                    For fully-custom itineraries, it's best to use our dedicated Custom Tour Request form.
                                </p>
                                <Link to="/custom-tour-request" className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-300 hover:text-accent-200 transition-colors">
                                    Go to Request Form →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-surface-100 shadow-sm">
                            <h3 className="font-bold text-surface-900 text-lg mb-6 flex items-center gap-2">
                                <MessageSquare size={20} className="text-primary-600" /> Send Us a Message
                            </h3>

                            {submitted ? (
                                <div className="bg-primary-50 border border-primary-200 p-6 rounded-xl text-center space-y-3">
                                    <ClipboardCheck className="text-primary-700 mx-auto" size={36} />
                                    <h4 className="font-bold text-primary-850">Message Sent Successfully!</h4>
                                    <p className="text-xs text-primary-700">Thank you for contacting us. A travel consultant will reply to your email within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Email Address</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Subject</label>
                                        <input
                                            type="text"
                                            placeholder="Planning a 7-day tour, transport queries, etc."
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="label">Your Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Write your details or questions here..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="textarea"
                                            required
                                        ></textarea>
                                    </div>

                                    {error && (
                                        <p className="text-xs text-red-600 font-semibold">{error}</p>
                                    )}

                                    <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto px-8 disabled:opacity-60">
                                        {submitting ? 'Sending…' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
