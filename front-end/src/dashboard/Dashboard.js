import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import { today, previous, next, formatAsTime } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const params = useParams();
  
  if (params.date) {
    date = params.date;
  }

  //const [date, setDate] = useState(params.date ? params.date : defaultDate)

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <Link to={`/dashboard/${previous(date)}`} className="btn">
          Previous
        </Link>{" "}
        &nbsp;
        <Link to={`/dashboard/${next(date)}`} className="btn">
          Next
        </Link>{" "}
        &nbsp;
        <Link to={`/dashboard/${today()}`} className="btn">
          Today
        </Link>
      </div>
      <ErrorAlert error={reservationsError} />
      {/* {JSON.stringify(reservations)} */}
      <table class="table table-striped table-dark">
  <thead>
    <tr>
      <th scope="col">Reservation Time</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Phone Number</th>
      <th scope="col">Number of Guests</th>
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
      </tr>
    ))}
  </tbody>
</table>
    </main>
  );
}

export default Dashboard;
