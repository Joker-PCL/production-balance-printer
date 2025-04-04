// This file was generated by SquareLine Studio
// SquareLine Studio version: SquareLine Studio 1.4.2
// LVGL version: 8.3.11
// Project name: Printer

#ifndef _PRINTER_UI_H
#define _PRINTER_UI_H

#ifdef __cplusplus
extern "C" {
#endif

#if defined __has_include
#if __has_include("lvgl.h")
#include "lvgl.h"
#elif __has_include("lvgl/lvgl.h")
#include "lvgl/lvgl.h"
#else
#include "lvgl.h"
#endif
#else
#include "lvgl.h"
#endif

#include "ui_helpers.h"
#include "ui_events.h"

// SCREEN: ui_LoadingPage
void ui_LoadingPage_screen_init(void);
extern lv_obj_t * ui_LoadingPage;
extern lv_obj_t * ui_Spinner1;
extern lv_obj_t * ui_Image6;
extern lv_obj_t * ui_Label13;
extern lv_obj_t * ui_LoadingLabel;
// SCREEN: ui_DetailsPage
void ui_DetailsPage_screen_init(void);
extern lv_obj_t * ui_DetailsPage;
extern lv_obj_t * ui_Image7;
extern lv_obj_t * ui_Label22;
extern lv_obj_t * ui_SerialNumber;
extern lv_obj_t * ui_MachineName;
extern lv_obj_t * ui_UpdateDetails;
extern lv_obj_t * ui_Label23;
extern lv_obj_t * ui_Home;
extern lv_obj_t * ui_Label24;
// SCREEN: ui_LoginPage
void ui_LoginPage_screen_init(void);
extern lv_obj_t * ui_LoginPage;
extern lv_obj_t * ui_Image2;
extern lv_obj_t * ui_Label12;
extern lv_obj_t * ui_PnEmployeeID1;
extern lv_obj_t * ui_EmployeeIDValue1;
extern lv_obj_t * ui_Label4;
extern lv_obj_t * ui_PnEmployeeID2;
extern lv_obj_t * ui_EmployeeIDValue2;
extern lv_obj_t * ui_Label9;
extern lv_obj_t * ui_Login;
extern lv_obj_t * ui_Label11;
extern lv_obj_t * ui_PnLoginKeyboard;
extern lv_obj_t * ui_LoginKeyboard;
extern lv_obj_t * ui_LoginInput;
// SCREEN: ui_MainPage
void ui_MainPage_screen_init(void);
extern lv_obj_t * ui_MainPage;
extern lv_obj_t * ui_Header;
extern lv_obj_t * ui_Logout;
extern lv_obj_t * ui_Image5;
extern lv_obj_t * ui_Date;
extern lv_obj_t * ui_Time;
extern lv_obj_t * ui_Panel4;
extern lv_obj_t * ui_Label3;
extern lv_obj_t * ui_EmployeeID1;
extern lv_obj_t * ui_Image1;
extern lv_obj_t * ui_Panel5;
extern lv_obj_t * ui_Label6;
extern lv_obj_t * ui_EmployeeID2;
extern lv_obj_t * ui_Mode;
extern lv_obj_t * ui_Label8;
extern lv_obj_t * ui_ModeLabel;
extern lv_obj_t * ui_GramPanel;
extern lv_obj_t * ui_Label2;
extern lv_obj_t * ui_Panel3;
extern lv_obj_t * ui_Panel6;
extern lv_obj_t * ui_CurrentWeight;
extern lv_obj_t * ui_GramUnit;
extern lv_obj_t * ui_Label16;
extern lv_obj_t * ui_OkGramCount;
extern lv_obj_t * ui_Label17;
extern lv_obj_t * ui_NgGramCount;
extern lv_obj_t * ui_ResetGramCount;
extern lv_obj_t * ui_Label18;
extern lv_obj_t * ui_Image4;
extern lv_obj_t * ui_SetMinWeight;
extern lv_obj_t * ui_MinWeight;
extern lv_obj_t * ui_Label10;
extern lv_obj_t * ui_SetMaxWeight;
extern lv_obj_t * ui_MaxWeight;
extern lv_obj_t * ui_Label7;
extern lv_obj_t * ui_LedGramResult;
extern lv_obj_t * ui_GramResult;
extern lv_obj_t * ui_PrintLogo;
extern lv_obj_t * ui_PcsPanel;
extern lv_obj_t * ui_Label5;
extern lv_obj_t * ui_Panel2;
extern lv_obj_t * ui_CurrentPcs;
extern lv_obj_t * ui_PcsUnit;
extern lv_obj_t * ui_OkPcsCount;
extern lv_obj_t * ui_Label20;
extern lv_obj_t * ui_Label21;
extern lv_obj_t * ui_NgPcsCount;
extern lv_obj_t * ui_ResetPcsCount;
extern lv_obj_t * ui_Label19;
extern lv_obj_t * ui_LedPcsResult;
extern lv_obj_t * ui_PcsResult;
extern lv_obj_t * ui_SetPcs;
extern lv_obj_t * ui_PcsMonitor;
extern lv_obj_t * ui_Label15;
extern lv_obj_t * ui_Image3;
extern lv_obj_t * ui_Label1;
extern lv_obj_t * ui_PrintPcs;
extern lv_obj_t * ui_Label14;
extern lv_obj_t * ui_PNKEYBOARD;
extern lv_obj_t * ui_Keyboard;
extern lv_obj_t * ui_input;
extern lv_obj_t * ui____initial_actions0;


LV_IMG_DECLARE(ui_img_polipharm2_png);    // assets/polipharm2.png
LV_IMG_DECLARE(ui_img_logout5_png);    // assets/logout5.png
LV_IMG_DECLARE(ui_img_scale_png);    // assets/scale.png



LV_FONT_DECLARE(ui_font_Chakra100);
LV_FONT_DECLARE(ui_font_Chakra130);
LV_FONT_DECLARE(ui_font_Chakra50);
LV_FONT_DECLARE(ui_font_Kanit50);
LV_FONT_DECLARE(ui_font_sukhumvit25);
LV_FONT_DECLARE(ui_font_sukhumvit30);



void ui_init(void);

#ifdef __cplusplus
} /*extern "C"*/
#endif

#endif
