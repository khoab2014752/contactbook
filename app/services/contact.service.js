const { ObjectId } = require('mongodb');

class ContactService {
    constructor(client) {
        this.contacts = client.db().collection("contacts");
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite === true, // ensure boolean
        };
        Object.keys(contact).forEach(
            (key) => {
                if (contact[key] === undefined) {
                    delete contact[key];
                }
            }
        );
        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const existing = await this.contacts.findOne({ email: contact.email, phone: contact.phone });
        if (existing) {
        throw new Error("No duplicate");
        }
        const result = await this.contacts.insertOne(contact);
        return result.ops ? result.ops[0] : contact;
    }



    async find(filter = {}) {
        const cursor = await this.contacts.find(filter);
        return cursor.toArray();
    }

    async findByName(name) {
        return await this.findAll({
            name: { $regex: new RegExp(name), $options: "i" }
        });
    }

    async findById(id) {
        return this.contacts.findOne({ _id: new ObjectId(id) });
    }

    async update(id, payload) {
        const update = this.extractContactData(payload);
        const result = await this.contacts.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.contacts.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
         });
        return result;
    }

    async deleteAll() {
        const result = await this.contacts.deleteMany({});
        return result.deletedCount;
    }

    async findAllFavorite() {
        return this.find({ favorite: true });
    }
}

module.exports = ContactService;
