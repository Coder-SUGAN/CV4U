import React from 'react';
import { CVData } from '../../types';
import { formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const SimpleTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;
  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg p-10 max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300" style={{backgroundColor: `${accentColor}1A`}}>
      {/* Header */}
      <header className="text-left mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{personalDetails.fullName}</h1>
        <p className="text-lg text-gray-600 font-medium mt-1">{personalDetails.jobTitle}</p>
        <div className="text-xs text-gray-500 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <ContactIcon type="email" text={personalDetails.email} className="!text-xs !gap-1.5" />
            <ContactIcon type="phone" text={personalDetails.phone} className="!text-xs !gap-1.5" />
            <ContactIcon type="address" text={personalDetails.address} className="!text-xs !gap-1.5" />
            <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} className="!text-xs !gap-1.5" />
        </div>
      </header>
      
      <main>
        <Section title="Summary">
          <p className="text-gray-700 text-sm">{summary}</p>
        </Section>
        
        <Section title="Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap">
                <h3 className="text-md font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-xs font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
              </div>
              <h4 className="text-sm font-medium text-gray-500 italic mb-2">{exp.company}</h4>
              <div className="text-sm">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </Section>
        
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap">
                <h3 className="text-md font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-xs font-medium text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
              </div>
              <h4 className="text-sm font-medium text-gray-600 italic">{edu.school}</h4>
            </div>
          ))}
        </Section>

        <Section title="Skills">
             <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
                {skillsList.map((skill, i) => skill && <li key={i}>• {skill}</li>)}
             </ul>
        </Section>

        {languages && languages.length > 0 && (
            <Section title="Languages">
                <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
                    {languages.map(lang => (
                        <li key={lang.id}><strong>{lang.name}:</strong> {lang.proficiency}</li>
                    ))}
                </ul>
            </Section>
        )}

        {customSections && customSections.map(sec => (
            <Section key={sec.id} title={sec.title}>
                <div className="text-sm text-gray-700">{formatDescription(sec.description)}</div>
            </Section>
        ))}
      </main>
    </div>
  );
};


const Section: React.FC<{ title: string; children: React.ReactNode; className?: string;}> = ({ title, children, className }) => (
    <section className={`mb-6 print-section ${className}`}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

export default SimpleTemplate;