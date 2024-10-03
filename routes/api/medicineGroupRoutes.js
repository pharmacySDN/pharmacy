const express = require('express');
const router = express.Router();
const medicineGroupController = require('../../controllers/medicineGroupController');
const { hasRole } = require('../../middleware/auth');

router.get('/', medicineGroupController.getAllMedicineGroups);
router.get('/add', hasRole(['admin', 'manager']), medicineGroupController.getAddMedicineGroupForm);
router.post('/', hasRole(['admin', 'manager']), medicineGroupController.createMedicineGroup);
router.get('/edit/:id', hasRole(['admin', 'manager']), medicineGroupController.getEditMedicineGroupForm);
router.put('/:id', hasRole(['admin', 'manager']), medicineGroupController.updateMedicineGroup);
router.delete('/:id', hasRole(['admin']), medicineGroupController.deleteMedicineGroup);

module.exports = router;