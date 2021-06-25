import React from "react";

function ListTables({ tables, handleFinish }) {
    return (
        <div>
            <table className="table table-striped table-dark">
                <thead>
                <tr>
                    <th scope="col">Table Name</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Status</th>
                    <th scope="col">Finish</th>
                </tr>
                </thead>
                <tbody>
                {tables.map((table) => (
                    <tr key={table.table_id}>
                    <td>{table.table_name}</td>
                    <td>{table.capacity}</td>
                    <td data-table-id-status={table.table_id}>{table.reservation_id === null ? "free" : "occupied"}</td>
                    <td>{table.reservation_id !== null ? <button data-table-id-finish={table.table_id} onClick={() => handleFinish(table)}>Finish</button> : null}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ListTables;