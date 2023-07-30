import { Component, OnInit } from '@angular/core';
import { PM6750Commands } from 'src/app/dashboard/user-data/types';
import { Pm6750Service } from 'src/app/services/pm6750.service';

@Component({
  selector: 'app-color-switcher',
  templateUrl: './color-switcher.component.html',
  styleUrls: ['./color-switcher.component.scss']
})
export class ColorSwitcherComponent implements OnInit {

  public commands: PM6750Commands = {
    ecg_params_dis: '55aa040101f9',
    ecg_params_en: '55aa040100fa',
    nibp_params_dis: '55aa040200f9',
    nibp_params_en: '55aa040201f8',
    spo2_params_en: '55aa040300f8',
    spo2_params_dis: '55aa040301f7',
    temp_params_en: '55aa040400f7',
    temp_params_dis: '55aa040401f6',
    ecg_lead_3: '55aa040502f4',
    ecg_lead_5: '55aa040504f2',
    ecg_wave_025_gain: '55aa040701f3',
    ecg_wave_05_gain: '55aa040702f2',
    ecg_wave_1_gain: '55aa040703f1',
    ecg_wave_2_gain: '55aa040704f0',
    ecg_filter_mode_op: '55aa040801f2',
    ecg_filter_mode_mo: '55aa040802f1',
    ecg_filter_mode_di: '55aa040803f0',
    nibp_patient_mode_adult: '55aa040901f1',
    nibp_patient_mode_child: '55aa040902f0',
    nibp_pressure_header: '55aa040a',
    resp_wave_gain_025: '55aa040f01fb',
    resp_wave_gain_05: '55aa040f02fa',
    resp_wave_gain_1: '55aa040f03f9',
    resp_wave_gain_2: '55aa040f04f8',
    ecg_waveform_en: '55aa04fb0000',
    ecg_waveform_dis: '55aa04fb01ff',
    spo2_waveform_en: '55aa04fe00fd',
    spo2_waveform_dis: '55aa04fe01fc',
    resp_waveform_en: '55aa04ff00fc',
    resp_waveform_dis: '55aa04ff01fb',
  }

  constructor(private pm6750Service:Pm6750Service) { }

  ngOnInit() {

    $(".switcher-btn").on("click", function () {
      $(".switcher-wrapper").toggleClass("switcher-toggled")
    }), $(".close-switcher").on("click", function () {
      $(".switcher-wrapper").removeClass("switcher-toggled")
    }), $("#lightmode").on("click", function () {
      $("html").attr("class", "light-theme")
    }), $("#darkmode").on("click", function () {
      $("html").attr("class", "dark-theme")
    }), $("#semidark").on("click", function () {
      $("html").attr("class", "semi-dark")
    }), $("#minimaltheme").on("click", function () {
      $("html").attr("class", "minimal-theme")
    }), $("#headercolor1").on("click", function () {
      $("html").addClass("color-header headercolor1"), $("html").removeClass("headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor2").on("click", function () {
      $("html").addClass("color-header headercolor2"), $("html").removeClass("headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor3").on("click", function () {
      $("html").addClass("color-header headercolor3"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor4").on("click", function () {
      $("html").addClass("color-header headercolor4"), $("html").removeClass("headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor5").on("click", function () {
      $("html").addClass("color-header headercolor5"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8")
    }), $("#headercolor6").on("click", function () {
      $("html").addClass("color-header headercolor6"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8")
    }), $("#headercolor7").on("click", function () {
      $("html").addClass("color-header headercolor7"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8")
    }), $("#headercolor8").on("click", function () {
      $("html").addClass("color-header headercolor8"), $("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3")
    })


    // sidebar colors 


    $('#sidebarcolor1').click(theme1);
    $('#sidebarcolor2').click(theme2);
    $('#sidebarcolor3').click(theme3);
    $('#sidebarcolor4').click(theme4);
    $('#sidebarcolor5').click(theme5);
    $('#sidebarcolor6').click(theme6);
    $('#sidebarcolor7').click(theme7);
    $('#sidebarcolor8').click(theme8);

    function theme1() {
      $('html').attr('class', 'color-sidebar sidebarcolor1');
    }

    function theme2() {
      $('html').attr('class', 'color-sidebar sidebarcolor2');
    }

    function theme3() {
      $('html').attr('class', 'color-sidebar sidebarcolor3');
    }

    function theme4() {
      $('html').attr('class', 'color-sidebar sidebarcolor4');
    }

    function theme5() {
      $('html').attr('class', 'color-sidebar sidebarcolor5');
    }

    function theme6() {
      $('html').attr('class', 'color-sidebar sidebarcolor6');
    }

    function theme7() {
      $('html').attr('class', 'color-sidebar sidebarcolor7');
    }

    function theme8() {
      $('html').attr('class', 'color-sidebar sidebarcolor8');
    }

  }

   sendCommand(command:string){
    this.pm6750Service.worker.postMessage({command});
  }

}
