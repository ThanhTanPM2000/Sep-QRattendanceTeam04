module.exports = (validate) => {
  return (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  };
};
