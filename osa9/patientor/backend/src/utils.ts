import { NewPatient, Gender, Entry, HealthCheckRating, Discharge, SickLeave } from "./types"

type Fields = { name: unknown, dateOfBirth: unknown, gender: unknown, occupation: unknown, ssn: unknown };
type EntryFields = {
  description: unknown,
  date: unknown,
  specialist: unknown,
  type: unknown,
  healthCheckRating?: unknown,
  discharge?: unknown,
  employerName?: unknown,
  sickLeave?: unknown
};

export const toNewEntry = ({
  description, date, specialist, type, healthCheckRating, discharge, employerName, sickLeave }: EntryFields, id: string): Entry => {
  console.log(discharge, employerName, sickLeave)
  let baseEntry = {
    id: parseName(id),
    description: parseName(description),
    date: parseDate(date),
    specialist: parseName(specialist),
  };
  switch (type) {
    case 'HealthCheck':
      const checkEntry: Entry = {
        ...baseEntry,
        type: 'HealthCheck',
        healthCheckRating: parseHealthRating(healthCheckRating),
      };
      return checkEntry;
    case 'Hospital':
      const hospitalEntry: Entry = {
        ...baseEntry,
        type: 'Hospital',
        discharge: parseDischarge(discharge)
      };
      return hospitalEntry;
    case 'OccupationalHealthcare':
      const occEntry: Entry = {
        ...baseEntry,
        type: 'OccupationalHealthcare',
        employerName: parseName(employerName),
        sickLeave: parseSickLeave(sickLeave)
      };
      return occEntry
    default:
      throw new Error('unsupported type');
  }
}

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  const isSickLeave = (param: any): param is SickLeave => {
    const { startDate, endDate } = param;
    return startDate && endDate && isDate(startDate) && isDate(endDate);
  };

  if (!isSickLeave(sickLeave)) {
    throw new Error('invalid sickleave data');
  }
  return sickLeave;
};

const parseDischarge = (discharge: unknown): Discharge => {
  const isDischarge = (param: any): param is Discharge => {
    const {date, criteria} = param
    return (date && criteria && isString(date) && isString(criteria))
  }

  if (!isDischarge(discharge)) {
    throw new Error('invalid discharge data');
  }
  return discharge
}

export const parseHealthRating = (rating: unknown): HealthCheckRating => {
  if (!isHealthRating(rating)) {
    throw new Error('invalid health rating');
  }

  return rating;
}

const isHealthRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

export const toNewPatient = ({ name, dateOfBirth, gender, occupation, ssn }: Fields): NewPatient => {
  const newEntry: NewPatient = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    ssn: parseSsn(ssn)
  }
  return newEntry
}

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('incorrect name')
  }

  return name
}

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
}

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('incorrect date of birth')
  }
  return date
}

const isDate = (date: string): boolean => {
  if (!Boolean(Date.parse(date))) {
    return false;
  }

  const withoutDashes = date.replace('-', '').replace('-', '');
  if (!Number(withoutDashes || !(withoutDashes.length === 6) )) {
    return false;
  }

  return true;
}

export const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('invalid gender')
  }

  return gender
}

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
}

const parseOccupation = (occ: unknown): string => {
  if (!occ || !isString(occ)) {
    throw new Error('incorrect occupation')
  }

  return occ
}

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('incorrect social security number')
  }

  return ssn
}