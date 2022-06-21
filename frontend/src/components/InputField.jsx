import { forwardRef, useRef, useEffect } from "react";

const InputField = ({ type, id, placeholder, value, setValue }, ref) => {

    const localRef = useRef(null);
    const inputRef = ref || localRef;

    return (
        <>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className="form-control"
                ref={inputRef} // ref for focusing purposes
                autoComplete="off"
                onChange={e => setValue(e.target.value)}
                value={value || ""}
                required>
            </input>
        </>
    )
}

export default forwardRef(InputField);