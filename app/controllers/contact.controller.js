//Create new contact

const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    try {
        if (!req.body?.name) {
            return next(new ApiError(400, "Name cannot be empty"));
        }
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.status(201).send(document);
    } catch (error) {
        if (
            (error.message && error.message.includes("No duplicate")) ||
            (error.code && error.code === 11000)
        ) {
            return next(new ApiError(400, "No duplicate"));
        }
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }
};


exports.findAll = async (req, res, next) => {
    let contacts = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            contacts = await contactService.findByName(name);
        } else {
            contacts = await contactService.find({});
        }
      
    } catch (error) {
        return next(new ApiError(500, "No contacts found"));
    }
      return res.send(contacts);
     
};
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const contact = await contactService.findById(req.params.id);
        if (!contact) {
            return next(new ApiError(404, "Contact not found"));
        }
        res.send(contact);
    } catch (error) {
        return next(new ApiError(500, "Error retrieving contact"));
    }
};

exports.update = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const updated = await contactService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "Contact not found"));
        }
        res.send(updated);
    } catch (error) {
        return next(new ApiError(500, "Error updating contact"));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deleted = await contactService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "Contact not found"));
        }
        res.send({ message: "Contact deleted successfully" });
    } catch (error) {
        return next(new ApiError(500, "Error deleting contact"));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        res.send({ message: `${deletedCount} contacts deleted` });
    } catch (error) {
        return next(new ApiError(500, "Error deleting all contacts"));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const favorites = await contactService.findAllFavorite();
        res.send(favorites);
    } catch (error) {
        return next(new ApiError(500, "Error retrieving favorite contacts"));
    }
};

