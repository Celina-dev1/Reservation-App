import React from "react";
import { formatAsTime } from "../utils/date-time";


function ListReservations({reservations, handleCancelRes}) {
    return (
        <div>
            <table className="table table-striped table-dark">
                <thead>
                <tr>
                    <th scope="col">Reservation Time</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Number of Guests</th>
                    <th scope="col">Reservation Status</th>
                    <th scope="col">Seat Reservation</th>
                    <th scope="col">Edit Reservation</th>
                    <th scope="col">Cancel Reservation</th>
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
                    <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                    <td>{reservation.status === "booked" ? <a href={`/reservations/${reservation.reservation_id}/seat`}>Seat</a> : null}</td>
                    <td>{reservation.status === "booked" ? <a href={`/reservations/${reservation.reservation_id}/edit`}>Edit</a> : null}</td>
                    <td>{reservation.status === "booked" ? <button onClick={() => handleCancelRes(reservation.reservation_id)} data-reservation-id-cancel={reservation.reservation_id}>Cancel</button> : null}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListReservations;