import { v1 as uuid } from 'uuid'
import patientData from '../../data/patients';
import { Patient, NewPatient, PublicPatient, Entry } from '../types';
import { parseGender, toNewPatient, toNewEntry } from '../utils';

const getPatients = (): PublicPatient[] => {
  const patients = patientData.map(p => ({
    name: p.name,
    id: p.id,
    dateOfBirth: p.dateOfBirth,
    gender: parseGender(p.gender),
    occupation: p.occupation
  }))
  
  return patients
}

const postPatient = (entry: NewPatient): Patient => {
  const newPatient = toNewPatient(entry);
  const patient = {...newPatient, entries:[], id: uuid()}

  patientData.push(patient);
  return patient;
}

const getPatient = (id: string): Patient => {
  const match = patientData.filter(p => p.id === id)[0];
  return { ...match, gender: parseGender(match.gender) };
}

const postEntry = (entry: Entry, PatientId: string) => {
  const trueEntry = toNewEntry(entry, uuid());
  const patient = patientData.find(p => p.id === PatientId)
  if (!patient) {
    throw new Error('invalid patient id!');
  }
  patient.entries.push(trueEntry)
  return trueEntry;
}

export default {
  getPatients,
  postPatient,
  getPatient,
  postEntry
};