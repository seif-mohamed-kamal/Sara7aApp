export const findOne = async ({
  model,
  filter = {},
  options = {},
  select = "",
} = {}) => {
  const doc = model.findOne(filter).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const find = async ({
  model,
  options = {},
  filter = {},
  select = "",
} = {}) => {
  const doc = model.find(filter).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }

  if (options?.limit) {
    doc.limit(options.limit);
  }

  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const create = async ({
  model,
  data = [{}],
  options = { validateBeforeSave: true },
}) => {
  return await model.create(data, options);
};

export const createOne = async ({
  model,
  data = {},
  options = { validateBeforeSave: true },
}) => {
  const [doc] = await create({model , data:[data], options});
  return doc
};
