const Prescription = require('../models/Prescription');
const Product = require('../models/Product');

exports.getAllPrescription = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = 6;

        const prescriptions = await Prescription
            .find()
            .skip(page * per_page - per_page)
            .limit(per_page)
            .exec();

        const count = await Prescription.countDocuments();

        res.render('prescription/index', {
            prescriptions,
            current_page: +page,
            total_page: Math.ceil(count / per_page),
            count: count,
            data: prescriptions
        });
    } catch (error) {
        res.status(500).send('Error fetching medicine groups');
    }
};


exports.getPrescriptionById = async (req, res) => {
    try {
        // Get the prescription ID from the request parameters
        const prescriptionId = req.params.id;

        // Find the prescription by ID and populate the product details
        const prescription = await Prescription.findById(prescriptionId).populate('product.product');

        // If the prescription is not found, send a 404 response
        if (!prescription) {
            return res.status(404).send('Prescription not found');
        }

        // Render the detail view, passing the prescription data
        res.render('prescription/detail', { prescription });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).send('Error fetching prescription details');
    }
};

exports.getAddPrescriptionForm = async (req, res) => {
    try {
        const products = await Product.find(); // Fetch products from the database
        res.render('prescription/add', { products });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
};

exports.getEditPrescriptionForm = async (req, res) => {
    try {
        const prescriptionId = req.params.id;

        // Find the prescription by ID and populate the product details
        const prescription = await Prescription.findById(prescriptionId).populate('product.product');

        // If the prescription is not found, send a 404 response
        if (!prescription) {
            return res.status(404).send('Prescription not found');
        }

        console.log(prescription);


        // Fetch all products to display in the edit form
        const products = await Product.find();

        // Render the edit view, passing both the prescription and products
        res.render('prescription/edit', { prescription, products });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).send('Error fetching prescription details');
    }
};

// In your prescriptionController.js
exports.editPrescription = async (req, res) => {
    try {
        const { name, product, quantity } = req.body;
        const prescriptionId = req.params.id; // Get the prescription ID from the URL

        // Prepare the products array to match the prescription schema
        const productsArray = product.map((prod, index) => ({
            quantity: quantity[index], // Match quantity with product
            product: prod // This should match the ObjectId of the product selected
        }));

        // Find the prescription by ID and update it
        const updatedPrescription = await Prescription.findByIdAndUpdate(
            prescriptionId,
            {
                name,
                product: productsArray // Update with the new products array
            },
            { new: true, runValidators: true } // Options: return the updated document and validate
        );

        // Check if the prescription was found and updated
        if (!updatedPrescription) {
            return res.status(404).send('Prescription not found');
        }

        res.redirect('/api/prescriptions'); // Redirect to the prescriptions list after successful update
    } catch (error) {
        const products = await Product.find(); // Fetch products again for the form
        // Handle errors by rendering the edit prescription form with the error message
        res.status(400).render('prescription/edit', { error: error.message, products, prescription: req.body });
    }
};


exports.deletePrescription = async (req, res) => {
    try {
        await Prescription.findByIdAndDelete(req.params.id);
        res.redirect('/api/prescriptions');
    } catch (error) {
        res.status(500).send('Error deleting medicine group');
    }
};

exports.createPrescription = async (req, res) => {
    try {
        const { name, product, quantity } = req.body;

        // Check if product and quantity are arrays and prepare the products array accordingly
        const productsArray = Array.isArray(product) ?
            product.map((prod, index) => ({
                quantity: quantity[index], // Match each quantity with the product
                product: prod // Match the product ID
            })) :
            [{
                quantity, // If there's only one product, assign the single quantity
                product
            }];

        // Create the new prescription object
        const newPrescription = new Prescription({
            name,
            product: productsArray // Use the products array
        });

        // Save the new prescription to the database
        await newPrescription.save();
        res.redirect('/api/prescriptions');
    } catch (error) {
        // Handle errors by rendering the add prescription form with the error message
        res.status(400).render('/api/prescriptions/add', { error: error.message });
    }
};

exports.searchPrescription = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({
            name: new RegExp(req.query.search, 'i') // Case-insensitive search on name
        }).sort({ name: 1 }); // Sort by name in ascending order

        res.render('prescriptions/index', { prescriptions });
    } catch (error) {
        res.status(500).send('Error searching prescriptions');
    }
};