const express = require('express');
const router = express.Router();
const medicineGroupController = require('../../controllers/medicineGroupController');

router.get('/', medicineGroupController.getAllMedicineGroups);
router.post('/', medicineGroupController.createMedicineGroup);
router.put('/:id', medicineGroupController.updateMedicineGroup);
router.delete('/:id', medicineGroupController.deleteMedicineGroup);

module.exports = router;
