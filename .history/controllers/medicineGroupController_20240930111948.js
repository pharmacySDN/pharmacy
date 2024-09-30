const MedicineGroup = require('../models/MedicineGroup');

exports.getAllMedicineGroups = async (req, res) => {
  try {
    const medicineGroups = await MedicineGroup.find();
    res.render('medicineGroups/index', { medicineGroups });
  } catch (error) {
    res.status(500).send('Error fetching medicine groups');
  }
};

exports.getAddMedicineGroupForm = (req, res) => {
  res.render('medicineGroups/add');
};

exports.createMedicineGroup = async (req, res) => {
  try {
    const newMedicineGroup = new MedicineGroup(req.body);
    await newMedicineGroup.save();
    res.redirect('/api/medicine-groups');
  } catch (error) {
    res.status(400).render('medicineGroups/add', { error: error.message });
  }
};

exports.getEditMedicineGroupForm = async (req, res) => {
  try {
    const medicineGroup = await MedicineGroup.findById(req.params.id);
    res.render('medicineGroups/edit', { medicineGroup });
  } catch (error) {
    res.status(404).send('Medicine group not found');
  }
};

exports.updateMedicineGroup = async (req, res) => {
  try {
    await MedicineGroup.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/api/medicine-groups');
  } catch (error) {
    res.status(400).render('medicineGroups/edit', { error: error.message });
  }
};

exports.deleteMedicineGroup = async (req, res) => {
  try {
    await MedicineGroup.findByIdAndDelete(req.params.id);
    res.redirect('/api/medicine-groups');
  } catch (error) {
    res.status(500).send('Error deleting medicine group');
  }
};