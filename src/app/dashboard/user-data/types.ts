export interface PM6750GeneralData {
    ECG: {
        ECG_data: {
            I: number,
            II: number,
            III: number,
            aVR: number,
            aVL: number,
            aVF: number,
            V: number,
            Sum: number
        },
        ECG_status: {
            signal_intensity: string,
            lead_status: boolean,
            ecg_wave_form_gain: string,
            ecg_filter_mode: string,
            lead_mode: number,
            heart_rate: number,
            resp_rate: number,
            resp_amplitude: number,
            ST_level: number,
            arr_code: number
        }
    },
    NIBP: {
        patient_mode: string,
        test_result: string,
        cuff_presure: string,
        sys_pressure: number,
        mean_pressure: number,
        dia_pressure: number
    },
    SPO2: {
        status: string,
        sat_value: number,
        pulse_rate: number,
        amplitude: number,
    },
    TEMP: {
        status: boolean,
        temp_int: number,
        temp_dec: number,
        value:number
    },
    Firmware: {
        version: string,
    },
    Hardware: {
        version: string
    }
}