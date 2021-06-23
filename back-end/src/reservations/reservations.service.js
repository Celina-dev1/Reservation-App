const knex = require("../db/connection");

async function list(date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .andWhereNot({"status": "cancelled"})
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

function update(reservation_id, updatedRes) {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update(updatedRes, "*")
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
    update,
    search,
};