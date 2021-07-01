import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { listTables, readReservation, seatReservation } from "../utils/api";

function ReservationSeat() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState("");

  useEffect(() => {
    listTables().then(setTables);
  }, []);

  useEffect(() => {
      readReservation(reservation_id)
      .then(setReservation);
   }, [reservation_id]);

  function changeHandler({ target: { value } }) {
    setTableId(value);
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    seatReservation(reservation.reservation_id, tableId)
      .then(() => history.push("/dashboard"));
  }

  return (
    <main className="font">
      {JSON.stringify(reservation)}
      <h1>Seat This Reservation</h1>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="col">
              <select id="table_id" name="table_id" value={tableId} required={true} onChange={changeHandler}>
                <option value="">Choose a Table</option>
                {tables.map((table) => (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn-success mr-2 my-3" type="submit">Submit</button>
          <button className="btn btn-secondary my-3" type="button" onClick={() => history.goBack()}>Cancel</button>
        </fieldset>
      </form>
    </main>
  );
}

export default ReservationSeat;