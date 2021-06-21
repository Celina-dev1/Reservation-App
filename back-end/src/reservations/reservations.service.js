const knex = require("../db/connection");

async function list(date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
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

function updateStatus(reservation_id, updatedStatus) {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update(updatedStatus, "*")
        //.then((updateRecords) => updateRecords[0]);
};

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
};


module.exports = {
    list,
    create,
    read,
    updateStatus,
    search,
};