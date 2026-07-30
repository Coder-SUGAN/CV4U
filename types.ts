export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  photo?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface CustomSection {
    id: string;
    title: string;
    description: string;
}

export interface CVData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  languages: Language[];
  customSections: CustomSection[];
  accentColor: string;
}

export type Template = 'classic' | 'modern' | 'professional' | 'creative' | 'stylish' | 'simple';
export type FontFamily = 'roboto' | 'lato' | 'montserrat' | 'merriweather';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt: string;
}
