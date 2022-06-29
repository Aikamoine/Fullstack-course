import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Field, Formik, Form } from 'formik';

import { TextField, DiagnosisSelection, SelectHealthRatingField } from '../AddPatientModal/FormField';
import { HealthCheckEntry, HealthCheckRating } from '../types';
import { useStateValue } from '../state';

export type EntryFormValues = Omit<HealthCheckEntry, 'id'>;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

type healthCheckOption = {
  value: HealthCheckRating;
  label: string;
};


const healthCheckOptions: healthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: 'Healthy' },
  { value: HealthCheckRating.LowRisk, label: 'Low risk' },
  { value: HealthCheckRating.HighRisk, label: 'High risk' },
  { value: HealthCheckRating.CriticalRisk, label: 'Critical risk' },
];

export const AddEntryform = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        description: '',
        date: '',
        specialist: '',
        type: 'HealthCheck',
        healthCheckRating: 0
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <SelectHealthRatingField
              label="Health check rating"
              name="healthCheckRating"
              options={healthCheckOptions}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: 'left' }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryform;
