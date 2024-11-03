const express = require('express');
const router = express.Router();
const prescriptionController = require('../../controllers/prescriptionController');
const { hasRole } = require('../../middleware/auth');

router.get('/', prescriptionController.getAllMedicineGroups);
router.get('/add', hasRole(['admin', 'manager']), prescriptionController.getAddMedicineGroupForm);
router.post('/', hasRole(['admin', 'manager']), prescriptionController.createMedicineGroup);
router.get('/edit/:id', hasRole(['admin', 'manager']), prescriptionController.getEditMedicineGroupForm);
router.put('/:id', hasRole(['admin', 'manager']), prescriptionController.updateMedicineGroup);
router.delete('/:id', hasRole(['admin']), prescriptionController.deleteMedicineGroup);

module.exports = router;