import React from 'react';
import { CVData } from '../../types';
import { formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const StylishTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;

  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300 flex text-gray-800">

      {/* Main Content */}
      <main className="w-2/3 p-8 relative">
         <div className="relative mb-8 z-10">
            <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full opacity-70" style={{backgroundColor: '#FBBF24'}}></div>
            <div className="relative">
                <h1 className="text-4xl font-bold text-gray-900">{personalDetails.fullName}</h1>
                <p className="text-xl font-medium mt-1">{personalDetails.jobTitle}</p>
            </div>
         </div>

         <section className="mb-6 print-section">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-700">Summary</h2>
            <p className="text-gray-700 text-sm">{summary}</p>
         </section>

         <section className="mb-6 print-section">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-700">Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-md font-semibold">{exp.jobTitle}</h3>
                  <p className="text-xs font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                </div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">{exp.company}</h4>
                <div className="text-sm">{formatDescription(exp.description)}</div>
              </div>
            ))}
         </section>
        
         <section className="mb-6 print-section">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-700">Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-md font-semibold">{edu.degree}</h3>
                  <p className="text-xs font-medium text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                </div>
                <h4 className="text-sm font-medium text-gray-600">{edu.school}</h4>
              </div>
            ))}
        </section>

        {/* Custom Sections */}
        {customSections && customSections.map(sec => (
            <section key={sec.id} className="mb-6 print-section">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-700">{sec.title}</h2>
                <div className="text-sm text-gray-700">{formatDescription(sec.description)}</div>
            </section>
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="w-1/3 p-8 text-white rounded-r-lg" style={{ backgroundColor: accentColor}}>
        <div className="space-y-8">
            {personalDetails.photo && (
                <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white/50"/>
            )}
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Details</h2>
                <div className="text-sm space-y-2 font-light">
                    <ContactIcon type="email" text={personalDetails.email} />
                    <ContactIcon type="phone" text={personalDetails.phone} />
                    <ContactIcon type="address" text={personalDetails.address} />
                    <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Skills</h2>
                <ul className="flex flex-wrap gap-2">
                    {skillsList.map((skill, index) => (
                        skill && <li key={index} className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{skill}</li>
                    ))}
                </ul>
            </div>
            {languages && languages.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2">Languages</h2>
                    <ul className="text-sm space-y-1 font-light">
                        {languages.map(lang => (
                            <li key={lang.id}>
                                {lang.name} <span className="opacity-80">({lang.proficiency})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </aside>
    </div>
  );
};

export default StylishTemplate;
