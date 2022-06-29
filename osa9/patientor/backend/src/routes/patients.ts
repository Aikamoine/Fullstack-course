import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients())
})

router.post('/', (req, res) => {
  try {
    res.json(patientService.postPatient(req.body))
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message
    }
    res.status(400).send(errorMessage)
  } 
})

router.get('/:id', (req, res) => {
  try {
    res.json(patientService.getPatient(req.params.id))
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message
    }
    res.status(400).send(errorMessage)
  }
})

router.post('/:id/entries', (req, res) => {
  try {
    res.json(patientService.postEntry(req.body, req.params.id))
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: '
    if (error instanceof Error) {
      errorMessage += error.message
    }
    res.status(400).send(errorMessage)
  }
})

export default router