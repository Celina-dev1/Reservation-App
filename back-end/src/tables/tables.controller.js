/**
 * List handler for table resources
 */
 const service = require("./tables.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationsService = require("../reservations/reservations.service");

  async function tableIdExists(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if (table) {
      res.locals.table = table;
      return next();
    }
    next({
      status: 404,
      message: `Table not found`,
    });
  };

  function bodyHasResIdProperty(req, res, next) {
    const { data: { reservation_id } } = req.body;
    if (reservation_id) {
      return next();
    }
    next({
      status: 400,
      message: "reservation_id required",
    });
  };

  function tableIsUnoccupied(req, res, next) {
      if (res.locals.table.reservation_id === null) {
          return next();
      }
      next({
        status: 400,
        message: "table is already occupied",
      });
  };

  async function resIdExists(req, res, next) {
    const { data: { reservation_id } } = req.body;
    const reservation = await reservationsService.read(reservation_id);

    if (reservation) {
        res.locals.reservation = reservation;
        return next();
    }
    next({
        status: 404,
        message: `reservation ${reservation_id} not found`,
      });
  };

  function sufficientCapacity(req, res, next) {
    if (res.locals.reservation.people <= res.locals.table.capacity) {
        return next();
    }
    next({
        status: 400,
        message: "table capacity is not sufficient",
      });
  };

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

  async function update(req, res) {
    const updatedTable = {
      ...req.body.data,
      table_id: res.locals.table.table_id,
    };
  
    await service.update(updatedTable);

    const updated = await service.read(updatedTable.table_id)
    
    res.json({ data: updated });
}

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
    update: [
        asyncErrorBoundary(tableIdExists),
        bodyHasData,
        bodyHasResIdProperty,
        tableIsUnoccupied,
        asyncErrorBoundary(resIdExists),
        sufficientCapacity,
        update,
    ]
  };