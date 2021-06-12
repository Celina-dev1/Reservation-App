/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
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

function bodyHasFirstNameProperty(req, res, next) {
  const { data: { first_name } } = req.body;
  if (first_name) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a first_name",
  });
};

function firstNamePropertyIsValid(req, res, next) {
  const { data: { first_name } } = req.body;
  const invalidResult = [''];
  if (invalidResult.includes(first_name)) {
      next({
          status: 400,
          message: "First name is invalid",
          }); 
  }
  return next();
};

function bodyHasLastNameProperty(req, res, next) {
  const { data: { last_name } } = req.body;
  if (last_name) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a last_name",
  });
};

function lastNamePropertyIsValid(req, res, next) {
  const { data: { last_name } } = req.body;
  const invalidResult = [''];
  if (invalidResult.includes(last_name)) {
      next({
          status: 400,
          message: "Last name is invalid",
          }); 
  }
  return next();
};

function bodyHasMobileNumberProperty(req, res, next) {
  const { data: { mobile_number } } = req.body;
  if (mobile_number) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a mobile_number",
  });
};

function mobileNumberPropertyIsValid(req, res, next) {
  const { data: { mobile_number } } = req.body;
  const justNums = mobile_number.replace(/\D/g, '');
  if (!justNums.length === 10) {
      next({
          status: 400,
          message: "Mobile number is invalid",
          }); 
  }
  return next();
};

function bodyHasDateProperty(req, res, next) {
  const { data: { reservation_date } } = req.body;
  if (reservation_date) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_date",
  });
};

function dateIsFutureDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const resDate = new Date(date);
  const today = new Date();

  if (resDate >= today) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be in the future",
    }); 
};

function dayNotTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const resDate = new Date(date);

  if (resDate.getUTCDay() === 2) {
    next({
      status: 400,
      message: "Restaurant is closed on Tuesdays",
      });
  }
  return next(); 
};

function bodyHasTimeProperty(req, res, next) {
  const { data: { reservation_time } } = req.body;
  if (reservation_time) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include a reservation_time",
  });
};

function bodyHasPeopleProperty(req, res, next) {
  const { data: { people } } = req.body;
  if (people) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must include number of people",
  });
};

function peoplePropertyIsValid(req, res, next) {
  const { data: { people } } = req.body;
  if (typeof(people) !== 'number' || people < 1) {
      next({
          status: 400,
          message: "Number of people is invalid",
          }); 
  }
  return next();
};

async function list(req, res) {
  const data = await service.list(req.query.date);
    res.json({
    data,
    });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data)
  
  res.status(201).json({ data })
    
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyHasData,
    bodyHasFirstNameProperty,
    firstNamePropertyIsValid,
    bodyHasLastNameProperty,
    lastNamePropertyIsValid,
    bodyHasMobileNumberProperty,
    mobileNumberPropertyIsValid,
    bodyHasDateProperty,
    dateIsFutureDate,
    dayNotTuesday,
    bodyHasTimeProperty,
    bodyHasPeopleProperty,
    peoplePropertyIsValid,
    asyncErrorBoundary(create),
  ],
};
