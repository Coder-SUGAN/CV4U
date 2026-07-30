import React from 'react';

// Shared Section Component
export const CVSection: React.FC<{ title: string; children: React.ReactNode; className?: string; accentColor?: string; }> = ({ title, children, className = '', accentColor = '#3b82f6' }) => (
    <section className={`mb-6 print-section ${className}`}>
        <h2 className="text-xl font-bold border-b-2 pb-1 mb-3" style={{ color: accentColor, borderColor: accentColor }}>{title}</h2>
        {children}
    </section>
);

// Shared Date Formatter
export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    if (dateString.toLowerCase() === 'present') return 'Present';
    try {
        const parts = dateString.split('-');
        if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
            return parts[0]; // Just a year
        }
        if (parts.length === 2) {
            const [year, month] = parts;
            const date = new Date(Number(year), Number(month) - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
    } catch (e) {
        // fall through
    }
    return dateString;
};

// Shared Description Formatter
export const formatDescription = (text: string) => {
    if(!text) return null;
    return text.split('\n').map((line, index) => (
        <p key={index} className="text-gray-700 text-sm mb-1">{line.trim()}</p>
    ));
};

export const ContactIcon: React.FC<{ type: 'email' | 'phone' | 'address' | 'linkedin'; text: string; link?: string; className?: string }> = ({ type, text, link, className = '' }) => {
    if (!text || !text.trim()) return null;

    const content = (
        <div className={`flex items-center text-sm ${className}`}>
            <span className="truncate">{text}</span>
        </div>
    );
    
    const cleanText = text.trim();

    if (type === 'email') {
        return <a href={`mailto:${cleanText}`} target="_blank" rel="noopener noreferrer" className="text-current hover:underline transition-colors">{content}</a>
    }
    if (type === 'phone') {
        return <a href={`tel:${cleanText.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-current hover:underline transition-colors">{content}</a>
    }
    if (type === 'linkedin') {
        const targetLink = link || cleanText;
        if (targetLink) {
            const href = targetLink.startsWith('http') ? targetLink : `https://${targetLink}`;
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-current hover:underline transition-colors">{content}</a>
        }
    }

    // For address or other types
    return content;
};
