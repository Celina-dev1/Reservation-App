import React from "react";

function Tables({onFinish, tables = [] }) {

  function finishHandler({
      target: { dataset: { tableIdFinish, reservationIdFinish } } = {},
    }) {
      if (
        tableIdFinish && reservationIdFinish &&
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
          onFinish(tableIdFinish, reservationIdFinish);
      }
  }


  const rows = tables.map((table) => {
      return (
        <div key={table.table_id} className="col-sm-12 col-md-6 col-lg-4">
          <div className="card mb-1">
            <div className="card-body">
              <h5 className="card-title">{table.table_name}</h5>
              <p className="card-text">Capacity: {table.capacity}</p>
              <p className="card-text" data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</p>
              {table.reservation_id ?
                <button 
                  type="button" 
                  className="btn" 
                  data-table-id-finish={table.table_id} 
                  data-reservation-id-finish={table.reservation_id}
                  onClick={finishHandler}
                  >
                  Finish</button> : ("")
              }
            </div>
          </div>
        </div>
      );
    });
    
  return tables.length ? (
    <div className="row">
      {rows}
    </div>
  ) : (
    <div>No Tables. Please add a new table.</div>
  );
}

export default Tables;
