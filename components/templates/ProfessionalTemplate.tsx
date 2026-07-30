import React from 'react';
import { CVData } from '../../types';
import { formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const ProfessionalTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;

  const skillsList = skills.split(',').map(skill => skill.trim());

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300 text-gray-800">
      <header className="text-white p-8 rounded-t-lg flex items-center gap-6" style={{backgroundColor: accentColor}}>
        {personalDetails.photo && (
            <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-32 h-32 rounded-full object-cover border-4 border-white/50" />
        )}
        <div>
            <h1 className="text-4xl font-bold tracking-wide">{personalDetails.fullName}</h1>
            <p className="text-xl font-light mt-1 opacity-90">{personalDetails.jobTitle}</p>
        </div>
      </header>
      
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-1/3 bg-gray-100 p-6 md:rounded-bl-lg">
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider mb-3">Contact</h2>
            <div className="space-y-2 text-gray-600">
              <ContactIcon type="email" text={personalDetails.email} />
              <ContactIcon type="phone" text={personalDetails.phone} />
              <ContactIcon type="address" text={personalDetails.address} />
              <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} />
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider mb-3">Skills</h2>
            <div className="text-sm text-gray-700 space-y-1">
              {skillsList.map((skill, index) => (
                skill && <p key={index} className="flex items-start"><span className="mr-2 mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{backgroundColor: accentColor}}></span>{skill}</p>
              ))}
            </div>
          </section>
          {/* Languages */}
          {languages && languages.length > 0 && (
            <section className="mt-6">
                <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wider mb-3">Languages</h2>
                <div className="text-sm text-gray-700 space-y-1">
                {languages.map(lang => (
                    <p key={lang.id} className="flex items-start"><span className="mr-2 mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{backgroundColor: accentColor}}></span>{lang.name} ({lang.proficiency})</p>
                ))}
                </div>
            </section>
          )}
        </aside>

        <main className="w-full md:w-2/3 p-6">
          <section className="mb-6 print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Summary</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
          </section>

          <section className="mb-6 print-section">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                  <p className="text-sm font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                </div>
                <h4 className="text-md font-medium mb-2" style={{color: accentColor}}>{exp.company}</h4>
                <div className="text-sm text-gray-700 leading-relaxed">{formatDescription(exp.description)}</div>
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
                <h4 className="text-md font-medium text-gray-600">{edu.school}</h4>
              </div>
            ))}
          </section>
           {/* Custom Sections */}
          {customSections && customSections.map(sec => (
            <section key={sec.id} className="mb-6 print-section">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-3">{sec.title}</h2>
                <div className="text-sm text-gray-700 leading-relaxed">{formatDescription(sec.description)}</div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;