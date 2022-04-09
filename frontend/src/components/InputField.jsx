import { forwardRef, useEffect } from "react";

const InputField = ({ type, id, value, setValue }, ref) => {

    return (
        <>
            <input
                type={type}
                id={id}
                className="form-control"
                ref={ref} // ref for focusing purposes
                autoComplete="off"
                onChange={e => setValue(e.target.value)}
                value={value}
                required>
            </input>
        </>
    )
}

export default forwardRef(InputField);