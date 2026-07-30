import React from 'react';
import { CVData, Template, FontFamily } from '../types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import StylishTemplate from './templates/StylishTemplate';
import SimpleTemplate from './templates/SimpleTemplate';


interface CVPreviewProps {
  cvData: CVData;
  template: Template;
  font: FontFamily;
}

const CVPreview: React.FC<CVPreviewProps> = ({ cvData, template, font }) => {
  const fontClass = `font-${font}`;
  const { accentColor } = cvData;

  const renderTemplate = () => {
    const props = { cvData, accentColor };
    switch (template) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'professional':
        return <ProfessionalTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'stylish':
        return <StylishTemplate {...props} />;
      case 'simple':
        return <SimpleTemplate {...props} />;
      default:
        return <CreativeTemplate {...props} />;
    }
  };

  return (
    <div className="sticky top-8">
        <div className={fontClass}>
            {renderTemplate()}
        </div>
    </div>
  );
};

export default CVPreview;