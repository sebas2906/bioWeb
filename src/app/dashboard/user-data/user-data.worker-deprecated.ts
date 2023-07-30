/// <reference lib="webworker" />
declare var mqtt: any
import { Chart, registerables } from 'chart.js'
import { PM6750GeneralData } from './types';

importScripts('https://cdn.jsdelivr.net/npm/chart.js')//chart js
importScripts('https://unpkg.com/mqtt/dist/mqtt.min.js')//mqtt js


let last_package = '';
let chart = [];
let extended_buffer = [[], [], [], [], []];
let canvas = [];

let pm6750_data: PM6750GeneralData = {
  ECG: {
    ECG_data: {
      I: 0,
      II: 0,
      III: 0,
      aVR: 0,
      aVL: 0,
      aVF: 0,
      V: 0,
      Sum: 0
    },
    ECG_status: {
      signal_intensity: '',
      lead_status: false,
      ecg_wave_form_gain: '',
      ecg_filter_mode: '',
      lead_mode: 0,
      heart_rate: 0,
      resp_rate: 0,
      resp_amplitude: 0,
      ST_level: 0,
      arr_code: 0
    }
  },
  NIBP: {
    patient_mode: '',
    test_result: '',
    cuff_presure: '',
    sys_pressure: 0,
    mean_pressure: 0,
    dia_pressure: 0
  },
  SPO2: {
    status: '',
    sat_value: 0,
    pulse_rate: 0,
    amplitude: 0
  },
  TEMP: {
    status: false,
    temp_int: 0,
    temp_dec: 0,
    value: 0
  },
  Firmware: {
    version: '',
  },
  Hardware: {
    version: ''
  }
}

//let canvas_saved = undefined;
let chart_counter = 0;
let binary_status = '';
Chart.register(...registerables);

initMQTT();

addEventListener('message', ({ data }) => {
  console.log('WEB WORKER')
  /*  const response = `worker response to ${data}`;
   postMessage(response); */
  const { _canvas, _config, width } = data;
  if (_canvas) {
    canvas.push(_canvas);
    let config = _config;
    //canvas_saved = canvas;
    chart.push((new Chart(canvas[chart_counter], config)));
    for (let j = 0; j < 1000; j++) {
      chart[chart_counter].data.labels.push(j);
      if (chart_counter != 0 && j == 200) break;
    }
    // Resizing the chart must be done manually, since OffscreenCanvas does not include event listeners.
    canvas[chart_counter].width = width;
    canvas[chart_counter].height = 120;
    chart[chart_counter].resize();
    if (canvas[chart_counter]) {
      chart_counter++;
    }
  }
  if (!_canvas && canvas.length) {
    canvas.forEach((c, index) => {
      c.width = width;
      c.heigth = 120;
      chart[index].resize();
    });
    //chart[chart_counter].resize();
  }

  // console.log(chart)
  //  console.log(config)
});

/**
 * Devuelve una trama de datos formateada desde un buffer de entrada en hexadecimal,
 * este metodo es especializado para el PM6750
 * @param {string} data_buffer buffer de entrada
 * @returns devuelve un parámetro con toda la información disponible  por cada trama
 */
function parsePM6750Data(data_buffer, callback) {
  if (!data_buffer.includes("55aa")) {
    callback(null, null, 'el paquete no incluye ningun header "55aa"');
    return false;
  }
  let packages = data_buffer.split("55aa");
  if (!data_buffer.startsWith("55aa") && last_package != '') {//si no contiene el header y hay un posible paquete anterior 
    packages.splice(0, 1, last_package + packages[0]);
    //console.log('\x1b[33m paquete concatenado \x1b[0m', packages[0]);
  } else if (!data_buffer.startsWith("55aa")) {//desechamos la primera trama si esta no contiene el header
    packages.shift();
  }
  last_package = '';
  //comprobamos mediante checksum que cada paquete sea correcto y filtramos
  packages.forEach(p => {
    if (!p.length) return;
    //let package_arr = p.split(" ");
    let package_arr_number = splitString(p, 2, true);
    //limpiamos de espacios en blanco
    //package_arr = package_arr.filter(p => p != '');
    //  console.log(package_arr)
    //let package_arr_number = package_arr.map(p => parseInt(p, 16));
    let package_length = package_arr_number[0];
    let checksum_ref = package_arr_number[package_arr_number.length - 1];
    if (!(package_length >= 3 && package_length <= 255)) {//si el tamano del paquete es invalido
      callback(null, null, 'tamaño de paquete inválido');
      return false;
    }
    if (package_arr_number.length != package_length) {//si el tamano es incorrecto
      last_package = p;//probablemente el siguiente conjunto de paquetes contenga el resto
      console.warn('posible paquete incompleto, esperando siguiente paquete para concatenar... ', last_package)
      callback(null, null, null, 'posible paquete incompleto, esperando siguiente paquete para concatenar...');
      return false;
    }
    package_arr_number.pop();
    let checksum_number = ~(package_arr_number.reduce((a, b) => a + b));
    let checksum_32_bits = dec2bin(checksum_number);
    let checksum_8_bits = checksum_32_bits.slice(checksum_32_bits.length - 8, checksum_32_bits.length);//corto los ultimos 8 bits
    let checksum = parseInt(checksum_8_bits, 2);
    if (checksum != checksum_ref) {
      callback(null, null, 'checksum inválido');
      return false;//si el checksum falla  
    }
    package_arr_number.shift();
    callback(package_arr_number, p);
  });
  //   return filtered_packages;
}

/**
 * Devuelve un arreglo de caracteres segun una cantidad numerica correspondiente a cada elemento del arreglo final
 * @param {*} str string de entrada
 * @param {*} numChars cantidad de caracteres de cada espacio del arreglo final
 * @param {*} hex_to_number true to return data from hex to number
 * @returns
 */
function splitString(str, numChars, hex_to_number = false) {
  const outputArr = [];
  let startIndex = 0;

  while (startIndex < str.length) {
    let _str = str.slice(startIndex, startIndex + numChars)
    if (hex_to_number) {
      let numeric_value = parseInt(_str, 16);
      // if ((numeric_value > 250) && startIndex!=2) return [];//cumple solo si es diferente al selector del paquete
      outputArr.push(numeric_value);
    } else {
      outputArr.push(_str);
    }
    startIndex += numChars;
  }
  return outputArr;
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

/**
 * 
 * @param channel Deprecated
 * @param data valor a graficar
 * @param chart arreglo de graficas
 * @param size tamano en x de la grafica
 * @param chart_select numero de grafica a seleccionar
 * @param x_offset ofset en X
 */
function printData(channel, data, chart, size, chart_select, x_offset = 0) {
  limitBufferRange(extended_buffer[chart_select], data, size * 3);
  chart[chart_select].data.datasets[0].data = extended_buffer[chart_select].slice((extended_buffer[chart_select].length - (extended_buffer[chart_select].length / 3)) - x_offset, extended_buffer[chart_select].length - x_offset);//almacenamos la ultima tercera parte
}

// Función para convertir un arreglo de bytes en una cadena de caracteres hexadecimal
function bytesToHexString(byteArray) {
  return Array.from(byteArray, (byte: any) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function convertToBinary(number: number) {
  let num = number;
  let binary = (num % 2).toString();
  for (; num > 1;) {
    num = parseInt((num / 2).toString());
    binary = (num % 2) + (binary);
  }
  return binary;
}

/**
 * Si el arreglo supera el limite definido entonces elimina el primer valor y agrega el siguiente al ultimo manteniendo el maximo valor
 * @param {number[]} buffer arreglo
 * @param {number} value el valor a asignar
 * @param {number} max_values maximo numero de elementos que debe contener el arreglo
 * @returns 
 */
function limitBufferRange(buffer, value, max_values) {
  if (buffer.length >= max_values) {
    buffer.shift();
  }
  buffer.push(value);
}

function initMQTT() {
  const client = (mqtt).connect('ws://mqtt.eclipseprojects.io/mqtt', {
    host: 'mqtt.eclipseprojects.io',
    port: 80
  })
  client.on('connect', function () {
    console.log('%cMQTT server conectado', 'color: green');
    client.subscribe("/sensor/ecg007", function (err) {
      if (!err) {
        // client.publish('presence', 'Hello mqtt')
      }
    })
    client.subscribe("/sensor/pm6750", function (err) {
      if (!err) {
        // client.publish('presence', 'Hello mqtt')
      }
    })
  });
  client.on('message', async (topic, message) => {
    switch (topic) {
      case '/sensor/pm6750':
        // Aquí tienes los datos en formato de bytes

        // Convierte los datos de bytes a una cadena de caracteres en hexadecimal
        const hexString = bytesToHexString(message);
       // console.log(hexString)
        // console.log(message.toString());
        parsePM6750Data(hexString, (data) => {
          if (!data) return;
          //console.log(data);
          switch (data[0]) {
            case 1://ECG
              data.shift();
              let sumatory = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
              printData(0, sumatory, chart, 1000, 0, 0);
              pm6750_data.ECG.ECG_data.I = data[0];
              pm6750_data.ECG.ECG_data.II = data[1];
              pm6750_data.ECG.ECG_data.III = data[2];
              pm6750_data.ECG.ECG_data.aVR = data[3];
              pm6750_data.ECG.ECG_data.aVL = data[4];
              pm6750_data.ECG.ECG_data.aVF = data[5];
              pm6750_data.ECG.ECG_data.V = data[6];
              pm6750_data.ECG.ECG_data.Sum = sumatory;
              break;
            case 2://ECG Params
              data.shift();
              binary_status = convertToBinary(data[0]);
              pm6750_data.ECG.ECG_status.signal_intensity = binary_status[binary_status.length - (0 + 1)];//bit0
              pm6750_data.ECG.ECG_status.lead_status = binary_status[binary_status.length - (1 + 1)] == "0" ? true : false;//bit1
              pm6750_data.ECG.ECG_status.ecg_wave_form_gain = binary_status.slice(((binary_status.length - 1) - 3), ((binary_status.length - 1) - 1));//bit 2 y 3
              pm6750_data.ECG.ECG_status.ecg_filter_mode = binary_status.slice(((binary_status.length - 1) - 5), ((binary_status.length - 1) - 3));//bit 4 y 5
              pm6750_data.ECG.ECG_status.lead_mode = binary_status.slice(((binary_status.length - 1) - 7), ((binary_status.length - 1) - 5)) == '11' ? 5 : 3;
              pm6750_data.ECG.ECG_status.heart_rate = data[1];
              pm6750_data.ECG.ECG_status.resp_rate = data[2];
              pm6750_data.ECG.ECG_status.ST_level = data[3];
              pm6750_data.ECG.ECG_status.arr_code = data[4]
              break;
            case 3://NIBP Params
              data.shift();
              binary_status = convertToBinary(data[0]);
              let patient_mode = binary_status.slice(((binary_status.length - 1) - 1),((binary_status.length - 1) +1));//bit 0 y 1
              if (patient_mode == '00') {
                pm6750_data.NIBP.patient_mode = 'Adulto';
              } else if (patient_mode == '01') {
                pm6750_data.NIBP.patient_mode = 'Niño';
              } else {
                pm6750_data.NIBP.patient_mode = '';
              }
              pm6750_data.NIBP.test_result = binary_status.slice(((binary_status.length - 1) - 5), ((binary_status.length - 1) - 1));//bit 2 y 5
              pm6750_data.NIBP.cuff_presure = data[1];
              pm6750_data.NIBP.sys_pressure = data[2];
              pm6750_data.NIBP.mean_pressure = data[3];
              pm6750_data.NIBP.dia_pressure = data[4];
              break;
            case 4://SPO2 Params
              data.shift();
              binary_status = convertToBinary(data[0]);
              if (binary_status == "0") {
                pm6750_data.SPO2.status = "Normal";
              } else if (binary_status == "01") {
                pm6750_data.SPO2.status = "Desconectado";
              } else if (binary_status == "10") {
                pm6750_data.SPO2.status = "Dedo no insertado";
              } else if (binary_status == "11") {
                pm6750_data.SPO2.status = "Buscando señal de pulso";
              } else if (binary_status == "100") {
                pm6750_data.SPO2.status = "No se encontró señal de pulso";
              }
              pm6750_data.SPO2.sat_value = data[1];
              pm6750_data.SPO2.pulse_rate = data[2];
              break;
            case 5://Temp Params
              data.shift();
              pm6750_data.TEMP.status = data[0] == '0' ? true : false;
              pm6750_data.TEMP.temp_int = data[1];
              pm6750_data.TEMP.temp_dec = data[2];
              let temp = Number(data[1] + '.' + data[2]);
              pm6750_data.TEMP.value = temp
              // console.log(temp)
              break;
            case 252://Firmware version
              data.shift();
              pm6750_data.Firmware.version = data.join('');
              break;
            case 254://SPO2 amplitude
              data.shift();
              pm6750_data.SPO2.amplitude = data[0];
              printData(0, data[0], chart, 200, 2);
              break;
            case 255://Resp Waveform
              data.shift();
              pm6750_data.ECG.ECG_status.resp_amplitude = data[0];
              printData(0, data[0], chart, 200, 1);
              break;
            default:
              //   console.log(data)
              break;
          }
        });
        break;
      default:
        break;
    }
  });
}
//actualizacion de graficas
setInterval(() => {
  chart.forEach(c => {
    c?.update();
  });
}, 10)


//actualizacion de parametros generales
setInterval(() => {
  //console.log('Data: ', pm6750_data)
  //console.log(extended_buffer)
  postMessage(JSON.stringify(pm6750_data));
}, 1000);