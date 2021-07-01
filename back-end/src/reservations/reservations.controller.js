/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
 function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id"
  ]);

  const invalidFields = Object.keys(data).filter(
    field => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
};

 async function reservationIdExists(req, res, next) {
   const { reservation_id } = req.params;
   const reservation = await service.read(reservation_id);
   if (reservation) {
     res.locals.reservation = reservation;
     return next();
   }
   next({
     status: 404,
     message: `Reservation ${reservation_id} not found`,
   });
 };
 
 function statusNotFinished(req, res, next) {
   if (res.locals.reservation.status === "finished") {
     next({
       status: 400,
       message: `finished reservations cannot be updated`,
     });
   }
   return next();
 };
 
 function newStatusValid(req, res, next) {
   const { data: { status } } = req.body;
   const validStatus = ["booked", "seated", "finished", "cancelled"]
   if (validStatus.includes(status)) {
     return next();
   }
   next({
     status: 400,
     message: `Status update ${status} not allowed for this reservation`,
   });
 };
 
 function bodyDataHas(propertyName) {
   return function (req, res, next) {
     const { data = {} } = req.body;
     if (data[propertyName]) {
       return next();
     }
     next({ status: 400, message: `Must include a ${propertyName}` });
   };
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

 function isTime(req, res, next){
  const { data = {} } = req.body;
 
  if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data['reservation_time']) || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data['reservation_time']) ){
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}
 
 function dateIsFutureDate(req, res, next) {
   const date = req.body.data.reservation_date;
   const resDate = new Date(date);
   const today = new Date();
 
   if (resDate >= today) {
     return next();
   }
   next({
     status: 400,
     message: "reservation_date must be in the future",
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
 
 function isOpenHours(req, res, next){
  const { data: { reservation_time } } = req.body; 
  const hour = parseInt(reservation_time.split(":")[0]);
  const mins = parseInt(reservation_time.split(":")[1]);

  if (hour < 10 || (hour === 10 && mins <= 30)){
    next({
      status: 400,
      message: "reservation_time must be between 10:30AM and 9:30PM",
    });
  }

  else if (hour > 21 || (hour === 21 && mins > 30)){
    next({
      status: 400,
      message: "reservation_time must be between 10:30AM and 9:30PM",
    });
  }
  return next();
}
 
 function peoplePropertyIsValid(req, res, next) {
   const { data: { people } } = req.body;
   // Convert to actual data type
   const peopleNum = parseInt(people);
   if (isNaN(peopleNum) || peopleNum < 1) {
       next({
           status: 400,
           message: "Number of people is invalid",
           }); 
   }
   return next();
 };
 
 function initialStatusValid(req, res, next){
   const { data: { status } } = req.body;
   if(status == "seated" || status == "finished"){
     next({
       status: 400,
       message: `${status} is not a valid status`
     })
   }
   return next();
 };
 
 async function create(req, res, next) {
   const data = await service.create(req.body.data)
   
   res.status(201).json({ data })  
 };
 
 async function list(req, res) {
   const { date, mobile_number } = req.query;
   if (date) {
     const data = await service.list(date);
     res.json({
     data,
     });
   }
   else if (mobile_number) {
     const data = await service.search(mobile_number);
     res.json({
       data,
       });
   }
 };
 
 function read(req, res) {
   res.json({ data: res.locals.reservation });
 };
 
 async function updateRes(req, res) {
   const updatedRes = {
     ...req.body.data,
     reservation_id: res.locals.reservation.reservation_id,
   };
 
   await service.update(res.locals.reservation.reservation_id, updatedRes);
 
   const updated = await service.read(res.locals.reservation.reservation_id)
   
   res.json({ data: updated });
 };
 
 async function updateStatus(req, res) {
   const updatedRes = {
     ...res.locals.reservation,
     ...req.body.data,
   };
 
   await service.update(res.locals.reservation.reservation_id, updatedRes);
 
   const updated = await service.read(res.locals.reservation.reservation_id)
   
   res.json({ data: updated });
 };
 
const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");
 
 module.exports = {
   create: [
    hasValidFields,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    firstNamePropertyIsValid,
    lastNamePropertyIsValid,
    mobileNumberPropertyIsValid,
    isTime,
    dateIsFutureDate,
    dayNotTuesday,
    isOpenHours,
    peoplePropertyIsValid,
    initialStatusValid,
    asyncErrorBoundary(create),
   ],
   list: asyncErrorBoundary(list),
   read: [
    asyncErrorBoundary(reservationIdExists), 
    read
   ],
   updateRes: [
    asyncErrorBoundary(reservationIdExists), 
    hasValidFields,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    firstNamePropertyIsValid,
    lastNamePropertyIsValid,
    mobileNumberPropertyIsValid,
    isTime,
    dateIsFutureDate,
    dayNotTuesday,
    isOpenHours,
    peoplePropertyIsValid,
    initialStatusValid,
    asyncErrorBoundary(updateRes),
   ],
   updateStatus: [
    asyncErrorBoundary(reservationIdExists),
    statusNotFinished,
    newStatusValid,
    asyncErrorBoundary(updateStatus),
   ]
 };