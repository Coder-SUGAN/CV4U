import React from 'react';
import { CVData } from '../../types';
import { formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string;}> = ({ title, children, className }) => (
    <section className={`mb-6 print-section ${className}`}>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);


const CreativeTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;

  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg p-0 max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300">
      {/* Header */}
      <header className="p-10" style={{backgroundColor: `${accentColor}33`}}>
        <div className="flex items-center space-x-6">
            {personalDetails.photo && (
                <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-32 h-32 rounded-full object-cover" />
            )}
            <div>
                <h1 className="text-4xl font-bold text-gray-800" style={{fontFamily: "'Merriweather', serif"}}>{personalDetails.fullName}</h1>
                <p className="text-xl text-gray-600 font-medium mt-1">{personalDetails.jobTitle}</p>
            </div>
        </div>
        <div className="flex justify-start flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-4 pl-36">
          <ContactIcon type="email" text={personalDetails.email} />
          <ContactIcon type="phone" text={personalDetails.phone} />
          <ContactIcon type="address" text={personalDetails.address} />
          <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} />
        </div>
      </header>
      
      <main className="p-10 grid grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="col-span-1">
            <Section title="Summary">
                <p className="text-gray-700 text-sm">{summary}</p>
            </Section>
            <Section title="Skills">
                <ul className="text-sm text-gray-700 list-disc list-inside">
                    {skillsList.map((skill, i) => skill && <li key={i}>{skill}</li>)}
                </ul>
            </Section>
            {languages && languages.length > 0 && (
                <Section title="Languages">
                    <ul className="text-sm text-gray-700">
                        {languages.map(lang => (
                            <li key={lang.id} className="mb-1">
                                <strong>{lang.name}:</strong> {lang.proficiency}
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
        
        {/* Right Column */}
        <div className="col-span-2">
            <Section title="Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-baseline flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                            <p className="text-sm font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                        </div>
                        <h4 className="text-md font-medium italic text-gray-600 mb-2">{exp.company}</h4>
                        <div className="text-sm">{formatDescription(exp.description)}</div>
                    </div>
                ))}
            </Section>
             <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                            <p className="text-sm font-medium text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        </div>
                        <h4 className="text-md font-medium text-gray-600 italic">{edu.school}</h4>
                    </div>
                ))}
            </Section>
            {customSections && customSections.map(sec => (
                <Section key={sec.id} title={sec.title}>
                    <div className="text-sm text-gray-700">{formatDescription(sec.description)}</div>
                </Section>
            ))}
        </div>
      </main>
    </div>
  );
};

export default CreativeTemplate;
