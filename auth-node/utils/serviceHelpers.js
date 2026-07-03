export const createRecord = async (Model, data, entityName) => {
    try {
        const record = new Model(data);
        await record.save();
        return record;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error(`Ya existe un(a) ${entityName} con estos datos`);
        }
        throw error;
    }
};

export const findById = async (Model, id, entityName, populateOpts = null) => {
    if (!id) throw new Error(`ID de ${entityName} es requerido`);

    let query = Model.findById(id);
    if (populateOpts) query = query.populate(...(Array.isArray(populateOpts) ? populateOpts : [populateOpts]));

    const record = await query.lean();
    if (!record) throw new Error(`${entityName} no encontrado/a`);

    return record;
};

export const findAll = async (Model, filters = {}, { activeField = 'Estado', activeValue = true, sortField = 'createdAt', populateOpts = null } = {}) => {
    const query = { [activeField]: activeValue, ...filters };

    let chain = Model.find(query);
    if (populateOpts) chain = chain.populate(...(Array.isArray(populateOpts) ? populateOpts : [populateOpts]));
    chain = chain.sort({ [sortField]: -1 }).lean();

    return await chain;
};

export const updateRecord = async (Model, id, data, allowedFields, entityName) => {
    if (!id) throw new Error(`ID de ${entityName} es requerido`);

    const updates = {};
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updates[key] = data[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
    }

    const record = await Model.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!record) throw new Error(`${entityName} no encontrado/a`);

    return record;
};

export const softDelete = async (Model, id, entityName, activeField = 'Estado') => {
    if (!id) throw new Error(`ID de ${entityName} es requerido`);

    const record = await Model.findByIdAndUpdate(
        id,
        { [activeField]: activeField === 'Estado' ? false : false },
        { new: true }
    );

    if (!record) throw new Error(`${entityName} no encontrado/a`);

    return record;
};

export const changeStatus = async (Model, id, newStatus, validStatuses, statusField, entityName) => {
    if (!id) throw new Error(`ID de ${entityName} es requerido`);
    if (!validStatuses.includes(newStatus)) {
        throw new Error('Estado no válido');
    }

    const record = await Model.findByIdAndUpdate(
        id,
        { [statusField]: newStatus },
        { new: true, runValidators: true }
    );

    if (!record) throw new Error(`${entityName} no encontrado/a`);

    return record;
};
