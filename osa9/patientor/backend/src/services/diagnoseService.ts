import diagnosisData from '../../data/diagnoses.json';
import { Diagnose } from '../types';

const diagnoses: Diagnose[] = diagnosisData

const getDiagnoses = (): Diagnose[] => {
  return diagnoses
}

export default {
  getDiagnoses
}
