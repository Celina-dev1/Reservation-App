import React from "react";
import { Link } from "react-router-dom";
import { formatAsTime } from "../utils/date-time";

function Reservations({onCancel, reservations = [] }) {
  function cancelHandler({
      target: { dataset: { reservationIdCancel } } = {},
  }) {
      if (
        reservationIdCancel &&
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone."
        )
      ) {
        onCancel(reservationIdCancel);
      }
  }
  const rows = reservations.map((reservation) => {
      return (
        <div key={reservation.reservation_id} className="card mb-1">
          <div class="card-body">
            <h5 class="card-title">{reservation.first_name} {reservation.last_name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">{formatAsTime(reservation.reservation_time)}</h6>
            <p class="card-text">{reservation.mobile_number}</p>
            <p class="card-text">{reservation.reservation_date}</p>
            <p class="card-text">Party Size: {reservation.people}</p>
            <p class="card-text" data-reservation-id-status={reservation.reservation_id}>Status: {reservation.status}</p>
            {reservation.status === "booked" ? (
              <div>
                  <Link className="btn btn-dark m-2" to={`/reservations/${reservation.reservation_id}/seat`}>seat</Link>
                  <Link className="btn btn-secondary m-2" to={`/reservations/${reservation.reservation_id}/edit`}>edit</Link>
                  <button type="button" className="btn cancel btn-danger m-2" data-reservation-id-cancel={reservation.reservation_id} onClick={cancelHandler}>Cancel</button>
              </div>) : ( "" )}
          </div>
        </div>
      );
    })
    
  return reservations.length ? (
    <div>{rows}</div>
  ) : (
    <div>No reservations found</div>
  );
}

export default Reservations;
