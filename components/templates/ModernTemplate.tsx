import React from 'react';
import { CVData } from '../../types';
import { formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const ModernTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;

  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300 flex text-gray-800">
      {/* Left Sidebar */}
      <aside className="w-1/3 p-8" style={{ backgroundColor: `${accentColor}20`}}>
        <div className="text-center mb-10">
            {personalDetails.photo && (
                <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4" style={{borderColor: accentColor}}/>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{personalDetails.fullName}</h1>
            <p className="text-lg font-medium mt-1" style={{color: accentColor}}>{personalDetails.jobTitle}</p>
        </div>
        
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Contact</h2>
                <div className="text-sm space-y-2 text-gray-600">
                    <ContactIcon type="email" text={personalDetails.email} />
                    <ContactIcon type="phone" text={personalDetails.phone} />
                    <ContactIcon type="address" text={personalDetails.address} />
                    <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Skills</h2>
                <ul className="flex flex-wrap gap-2">
                    {skillsList.map((skill, index) => (
                        skill && <li key={index} className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{backgroundColor: `${accentColor}40`, color: accentColor}}>{skill}</li>
                    ))}
                </ul>
            </div>
             {/* Languages */}
            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2" style={{color: accentColor}}>Languages</h2>
                <ul className="text-sm space-y-1 text-gray-600">
                  {languages.map(lang => (
                    <li key={lang.id}>{lang.name} <span className="text-xs">({lang.proficiency})</span></li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8">
         <section className="mb-6 print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Professional Summary</h2>
            <p className="text-gray-700 text-sm">{summary}</p>
         </section>

         <section className="mb-6 print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Work Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                  <p className="text-sm font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                </div>
                <h4 className="text-md font-medium italic mb-2" style={{color: accentColor}}>{exp.company}</h4>
                <div className="pl-4 border-l-2 border-gray-200">{formatDescription(exp.description)}</div>
              </div>
            ))}
         </section>
        
         <section className="print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Education</h2>
            {education.map(edu => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-sm font-medium text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                </div>
                <h4 className="text-md font-medium text-gray-600 italic">{edu.school}</h4>
              </div>
            ))}
        </section>

        {/* Custom Sections */}
        {customSections && customSections.map(sec => (
          <section key={sec.id} className="mb-6 print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">{sec.title}</h2>
            <div className="text-gray-700 text-sm">{formatDescription(sec.description)}</div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default ModernTemplate;