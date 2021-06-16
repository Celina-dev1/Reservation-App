/**
 * List handler for table resources
 */
 const service = require("./tables.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

 function bodyHasData(req, res, next) {
    const body = req.body.data;
    if (body) {
      return next();
    }
    next({
      status: 400,
      message: "No data received",
    });
  };
  
  function bodyHasTableNameProperty(req, res, next) {
    const { data: { table_name } } = req.body;
    if (table_name) {
      return next();
    }
    next({
      status: 400,
      message: "table_name required",
    });
  };
  
  function tableNamePropertyIsValid(req, res, next) {
    const { data: { table_name } } = req.body;
    if (table_name.length < 2) {
        next({
            status: 400,
            message: "table_name must be at least 2 characters",
            }); 
    }
    return next();
  };

  function bodyHasCapacityProperty(req, res, next) {
    const { data: { capacity } } = req.body;
    if (capacity) {
      return next();
    }
    next({
      status: 400,
      message: "Table capacity is required",
    });
  };
  
  function capacityPropertyIsValid(req, res, next) {
    const { data: { capacity } } = req.body;
    
    if (isNaN(capacity) || capacity < 1) {
        next({
            status: 400,
            message: "minimum table capacity is 1",
            }); 
    }
    return next();
  };

 async function list(req, res) {
    const data = await service.list();
      res.json({
      data,
      });
  };
  
  async function create(req, res, next) {
    const data = await service.create(req.body.data)
    
    res.status(201).json({ data })
      
  };

  module.exports = {
    list: asyncErrorBoundary(list),
    create: [
      bodyHasData,
      bodyHasTableNameProperty,
      tableNamePropertyIsValid,
      bodyHasCapacityProperty,
      capacityPropertyIsValid,
      asyncErrorBoundary(create),
    ],
  };