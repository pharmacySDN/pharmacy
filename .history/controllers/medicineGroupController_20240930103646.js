const MedicineGroup = require('../models/MedicineGroup');

exports.getAllMedicineGroups = async (req, res) => {
  try {
    const medicineGroups = await MedicineGroup.find();
    res.render('medicineGroups/index', { medicineGroups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMedicineGroup = async (req, res) => {
  const medicineGroup = new MedicineGroup({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newMedicineGroup = await medicineGroup.save();
    res.redirect('/api/medicineGroup');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateMedicineGroup = async (req, res) => {
  try {
    const updatedMedicineGroup = await MedicineGroup.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    res.redirect('/medicine-groups');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMedicineGroup = async (req, res) => {
  try {
    await MedicineGroup.findByIdAndDelete(req.params.id);
    res.redirect('/medicine-groups');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
