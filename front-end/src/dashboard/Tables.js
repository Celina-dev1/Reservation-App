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
        <div class="col-sm-12 col-md-6 col-lg-4">
          <div key={table.table_id} class="card mb-1">
            <div class="card-body">
              <h5 class="card-title">{table.table_name}</h5>
              <p class="card-text">Capacity: {table.capacity}</p>
              <p class="card-text" data-table-id-status={table.table_id}>{table.reservation_id ? "Occupied" : "Free"}</p>
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
    <div class="row">
      {rows}
    </div>
  ) : (
    <div>No Tables. Please add a new table.</div>
  );
}

export default Tables;
