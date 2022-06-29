import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";
//import { useStateValue } from '../state';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT_DETAILS';
      payload: Patient;
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'ADD_ENTRY';
      payload: Entry;
    }
  | {
      type: 'SET_DIAGNOSES_LIST';
      payload: Diagnosis[];
    };

/*
export const setPatientList = (patientListFromApi: Patient[]) => {
  const [{ patients }] = useStateValue();

  return {
    ...patients,
    patients: {
      ...patientListFromApi.reduce(
        (memo, patient) => ({ ...memo, [patient.id]: patient }),
        {}
      ),
      ...patients.patients,
    },
  };
};
*/

export const reducer = (state: State, action: Action): State => {
  console.log('this is state', state);
  console.log('this is payload', action.payload);
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'ADD_PATIENT':
      console.log('this is add_patient', action.payload);
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'ADD_PATIENT_DETAILS':
      return {
        ...state,
        patientDetails: {
          ...state.patientDetails,
          [action.payload.id]: action.payload,
        },
      };
    case 'SET_DIAGNOSES_LIST':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.patients,
        },
      };
    case 'ADD_ENTRY':
      const ids = action.payload.id.split('/');
      const patientId = ids[1];
      const entryId = ids[0];
      const newEntry = { ...action.payload, id: entryId };
      state.patientDetails[patientId].entries.push(newEntry);
      return { ...state };
    default:
      return state;
  }
};
