import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { today, previous, next, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  // const params = useParams();
  
  // if (params.date) {
  //   date = params.date;
  // }
  const history = useHistory();
  const query = useQuery();
  const queryDate = query.get("date")
  if (queryDate) {
    date = queryDate;
  }

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        {/* <Link to={`/dashboard/${previous(date)}`} className="btn">
          Previous
        </Link> */}
        <button onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
        {/* <Link to={`/dashboard/${next(date)}`} className="btn">
          Next
        </Link> */}
        <button onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
        {/* <Link to={`/dashboard/${today()}`} className="btn">
          Today
        </Link> */}
        <button onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
      </div>
      <ErrorAlert error={reservationsError} />
      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th scope="col">Reservation Time</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone Number</th>
            <th scope="col">Number of Guests</th>
            <th scope="col">Seat Reservation</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.reservation_id}>
              <td>{formatAsTime(reservation.reservation_time)}</td>
              <td>{reservation.first_name}</td>
              <td>{reservation.last_name}</td>
              <td>{reservation.mobile_number}</td>
              <td>{reservation.people}</td>
              <td><a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a></td>
            </tr>
          ))}
        </tbody>
      </table>

      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.table_id}>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td data-table-id-status={table.table_id}>{table.reservation_id === null ? "Free" : "Occupied"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Dashboard;
