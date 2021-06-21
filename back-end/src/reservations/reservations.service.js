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

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .first();
};

function updateStatus(updatedRes) {
    return knex("reservations")
        .where({ reservation_id: updatedRes.reservation_id })
        .update(updatedRes);
        
  }


module.exports = {
    list,
    create,
    read,
    updateStatus,
};