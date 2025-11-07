import React, { useState } from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

const RHFFileInput = ({ name, helperText, ...other }) => {
    const { control } = useFormContext();
    // const [fileName, setFileName] = useState('');
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <input
                            // {...field}
                            type="file"
                            name={name}
                            id={name}
                            // style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                // setFileName(file);
                                field.onChange(file); // Pass the file to React Hook Form
                                console.log(file)
                                }
                            }}
                            {...other}
                        />

                    </>
                )}
            />
        </>
    );
};


export default RHFFileInput;


{/* <TextField
                        // type="file"
                        // {...field}
                        value={fileName?.name}
                        fullWidth
                        // onChange={(e) => {
                        //     field.onChange(e.target.files[0]); // Pass the file object
                        // }}
                        onClick={() => document.getElementById(name).click()}
                        // onBlur={onBlur}
                        error={!!error}
                        helperText={error ? error?.message : helperText}
                        {...props}
                        readOnly
                        // disabled
                    /> */}