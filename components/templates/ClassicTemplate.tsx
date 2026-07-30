import React from 'react';
import { CVData } from '../../types';
import { CVSection, formatDate, formatDescription, ContactIcon } from './common';

interface TemplateProps {
  cvData: CVData;
  accentColor: string;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ cvData, accentColor }) => {
  const { personalDetails, summary, experience, education, skills, languages, customSections } = cvData;

  return (
    <div id="cv-preview" className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto w-full origin-top scale-90 lg:scale-100 transition-transform duration-300">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-200 pb-4 mb-6 flex flex-col items-center">
        {personalDetails.photo && (
            <img src={personalDetails.photo} alt={personalDetails.fullName} className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-gray-200" />
        )}
        <h1 className="text-4xl font-bold text-gray-800">{personalDetails.fullName}</h1>
        <p className="text-xl font-medium mt-1" style={{ color: accentColor }}>{personalDetails.jobTitle}</p>
        <div className="flex justify-center flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-3">
          <ContactIcon type="email" text={personalDetails.email} />
          <ContactIcon type="phone" text={personalDetails.phone} />
          <ContactIcon type="address" text={personalDetails.address} />
          <ContactIcon type="linkedin" text={personalDetails.linkedin} link={personalDetails.linkedin} />
        </div>
      </header>
      
      <main>
        {/* Summary */}
        <CVSection title="Professional Summary" accentColor={accentColor}>
          <p className="text-gray-700 text-sm">{summary}</p>
        </CVSection>
        
        {/* Experience */}
        <CVSection title="Work Experience" accentColor={accentColor}>
          {experience.map(exp => (
            <div key={exp.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-sm font-medium text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
              </div>
              <h4 className="text-md font-medium italic mb-2" style={{color: accentColor}}>{exp.company}</h4>
              <div className="pl-4 border-l-2 border-gray-200">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </CVSection>
        
        {/* Education */}
        <CVSection title="Education" accentColor={accentColor}>
          {education.map(edu => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline flex-wrap">
                <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                <p className="text-sm font-medium text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
              </div>
              <h4 className="text-md font-medium text-gray-600 italic">{edu.school}</h4>
            </div>
          ))}
        </CVSection>

        {/* Skills */}
        <CVSection title="Skills" accentColor={accentColor}>
            <p className="text-gray-700 text-sm">{skills}</p>
        </CVSection>

        {/* Languages */}
        {languages && languages.length > 0 && (
          <CVSection title="Languages" accentColor={accentColor}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
                {languages.map(lang => (
                    <p key={lang.id}><strong>{lang.name}:</strong> {lang.proficiency}</p>
                ))}
            </div>
          </CVSection>
        )}

        {/* Custom Sections */}
        {customSections && customSections.map(sec => (
          <CVSection key={sec.id} title={sec.title} accentColor={accentColor}>
            <div className="text-gray-700 text-sm">{formatDescription(sec.description)}</div>
          </CVSection>
        ))}
      </main>
    </div>
  );
};

export default ClassicTemplate;