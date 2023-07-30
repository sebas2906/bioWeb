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
        value: number
    },
    Firmware: {
        version: string,
    },
    Hardware: {
        version: string
    }
}

export interface PM6750Commands {
    ecg_params_dis: string,
    ecg_params_en: string,
    nibp_params_dis: string,
    nibp_params_en: string,
    spo2_params_en: string,
    spo2_params_dis: string,
    temp_params_en: string,
    temp_params_dis: string,
    ecg_lead_3: string,
    ecg_lead_5: string,
    ecg_wave_025_gain: string,
    ecg_wave_05_gain: string,
    ecg_wave_1_gain: string,
    ecg_wave_2_gain: string,
    ecg_filter_mode_op: string,
    ecg_filter_mode_mo: string,
    ecg_filter_mode_di: string,
    nibp_patient_mode_adult: string,
    nibp_patient_mode_child: string,
    nibp_pressure_header: string,
    resp_wave_gain_025: string,
    resp_wave_gain_05: string,
    resp_wave_gain_1: string,
    resp_wave_gain_2: string,
    ecg_waveform_en: string,
    ecg_waveform_dis: string,
    spo2_waveform_en: string,
    spo2_waveform_dis: string,
    resp_waveform_en: string,
    resp_waveform_dis: string,
}