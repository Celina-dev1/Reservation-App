/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 
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
 
 // function bodyDataHas(propertyName) {
 //   return function (req, res, next) {
 //     const { data = {} } = req.body;
 //     if (data[propertyName]) {
 //       return next();
 //     }
 //     next({ status: 400, message: `Must include a ${propertyName}` });
 //   };
 // };
 
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
 
 function timeIsDuringOpenHours(req, res, next) {
   const { data: { reservation_time, reservation_date } } = req.body;
   const resDate = new Date(reservation_date);
   const today = new Date();
   //if reservation_date is today
   if (resDate === today) {
     //time must be later than the current time of day
     let currentHour = today.getHours();
     let currentMinutes = today.getMinutes();
     const resTime = reservation_time.split(':');
     if (resTime[0] > currentHour || (resTime[0] === currentHour && resTime[1] > currentMinutes)) {
       return next();
     }
     next({
       status: 400,
       message: "Reservation must be at a future time",
     });
   } 
   //otherwise time must be between 10:30am and 9:30pm
   if (reservation_time < "10:30" || reservation_time > "21:30") {
     next({
       status: 400,
       message: "reservation_time must be between 10:30AM and 9:30PM",
     });
   }
   return next();
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
 }
 
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
 
 // const has_first_name = bodyDataHas("first_name");
 // const has_last_name = bodyDataHas("last_name");
 // const has_mobile_number = bodyDataHas("mobile_number");
 // const has_reservation_date = bodyDataHas("reservation_date");
 // const has_reservation_time = bodyDataHas("reservation_time");
 // const has_people = bodyDataHas("people");
 // const has_capacity = bodyDataHas("capacity");
 // const has_table_name = bodyDataHas("table_name");
 // const has_reservation_id = bodyDataHas("reservation_id");
 
 module.exports = {
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
     timeIsDuringOpenHours,
     bodyHasPeopleProperty,
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
     timeIsDuringOpenHours,
     bodyHasPeopleProperty,
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