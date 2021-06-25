import React, { Fragment } from "react";
import ErrorAlert from "./ErrorAlert";

function ListErrors({errors}) {
    if (errors.length > 0) {
        return (
            <Fragment>
                {errors.map((error) => (
                <ErrorAlert error={error}/>))}
            </Fragment>
        )
    }
    return null;
}

export default ListErrors;