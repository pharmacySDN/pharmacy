const express = require('express');
const router = express.Router();
const prescriptionController = require('../../controllers/prescriptionController');
const { hasRole } = require('../../middleware/auth');

router.get('/', prescriptionController.getAllPrescription);
router.get('/add', hasRole(['admin', 'manager']), prescriptionController.getAddPrescriptionForm);
router.post('/', hasRole(['admin', 'manager']), prescriptionController.createPrescription);
router.get('/:id', prescriptionController.getPrescriptionById);
router.get('/edit/:id', hasRole(['admin', 'manager']), prescriptionController.getEditPrescriptionForm);
router.post('/edit/:id', hasRole(['admin', 'manager']), prescriptionController.editPrescription);
router.post('/:id', hasRole(['admin']), prescriptionController.deletePrescription);

module.exports = router;