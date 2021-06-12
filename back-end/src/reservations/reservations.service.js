const knex = require("../db/connection");

async function list(date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": date})
        .orderBy("reservation_time");
};

function create(reservation) {
    return knex("reservations")
      .insert(reservation)
      .returning("*")
      .then((createRecords) => createRecords[0]);
};


module.exports = {
    list,
    create,
};