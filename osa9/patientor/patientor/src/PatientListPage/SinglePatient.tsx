import { useParams } from "react-router-dom";
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Entry, Patient, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry } from "../types";
import { useStateValue } from '../state';
import { Button, Dialog, DialogContent, DialogTitle, Divider } from '@material-ui/core';
import React from "react";
import { Alert } from '@material-ui/lab';
import AddEntryForm, { EntryFormValues } from "./addEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{`Error: ${error}`}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <div>{entry.date} hospital visit</div>
      <div><i>{entry.description}</i></div>
      <div>
        discharge {entry.discharge.date}: {entry.discharge.criteria}
      </div>
      <div>diagnose by {entry.specialist}</div>
      <p></p>
    </div>
  );
};

const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({
  entry,
}) => {
  const healthRatings = ['Healthy', 'LowRisk', 'HighRisk', 'CriticalRisk'];

  return (
    <div>
      <div>{entry.date} health check</div>
      <div><i>{entry.description}</i></div>
      <div>health rating: {healthRatings[entry.healthCheckRating]}</div>
      <div>diagnose by {entry.specialist}</div>
      <p></p>
    </div>
  );
};

const OccupationalHealthcareEntryDetails: React.FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <div>
      <div>{entry.date} occupational healthcare visit, employer { entry.employerName }</div>
      <div><i>{entry.description}</i></div>
      <div>diagnose by {entry.specialist}</div>
      <p></p>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
     return <OccupationalHealthcareEntryDetails entry={entry} />;
    default:
      return <>entry type not found</>;
  }
};

const SinglePatient = () => {
  const id = String(useParams().id);
  const [{ patientDetails }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
  
  const submitNewEntry = async (values: EntryFormValues) => {
    console.log('submit', values);
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        { ...values, id: id, healthCheckRating: Number(values.healthCheckRating)}
      );
      console.log('new entry', newEntry);
      dispatch({ type: 'ADD_ENTRY', payload: { ...newEntry, id: newEntry.id + "/" + id } });
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error) || 'Unrecognized axios error'
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  const getPatient = async (id: string) => {
    console.log('getting patient');
    try {
      const { data: patient } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch({ type: 'ADD_PATIENT_DETAILS', payload: patient });
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage += ' Error: ' + String(error.response.data.message);
      }
      console.error(errorMessage);
    }
  };

  if (!patientDetails[id]) {
    void getPatient(id);
  }
  const patient = patientDetails[id];
 
  if (patient) {
    return (
      <div>
        <p></p>
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <h2>
          {patient.name}{' '}
          <Button variant="contained" onClick={() => openModal()}>
            Add new Entry
          </Button>
        </h2>
        <div>gender: {patient.gender}</div>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
        <p></p>
        <h3>entries</h3>
        {patient.entries.map((e) => (
          <EntryDetails key={e.id} entry={e}></EntryDetails>
        ))}
      </div>
    );
  }
  return (<div>loading...</div>);

};

export default SinglePatient;