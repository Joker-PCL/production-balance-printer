// This file was generated by SquareLine Studio
// SquareLine Studio version: SquareLine Studio 1.4.2
// LVGL version: 8.3.11
// Project name: Printer

#include "../ui.h"

void ui_LoadingPage_screen_init(void)
{
    ui_LoadingPage = lv_obj_create(NULL);
    lv_obj_clear_flag(ui_LoadingPage, LV_OBJ_FLAG_SCROLLABLE);      /// Flags
    lv_obj_set_style_bg_color(ui_LoadingPage, lv_color_hex(0x53E1FD), LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_bg_opa(ui_LoadingPage, 255, LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_bg_grad_color(ui_LoadingPage, lv_color_hex(0xFFFFFF), LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_bg_grad_dir(ui_LoadingPage, LV_GRAD_DIR_VER, LV_PART_MAIN | LV_STATE_DEFAULT);

    ui_Spinner1 = lv_spinner_create(ui_LoadingPage, 1000, 90);
    lv_obj_set_width(ui_Spinner1, 224);
    lv_obj_set_height(ui_Spinner1, 218);
    lv_obj_set_x(ui_Spinner1, 0);
    lv_obj_set_y(ui_Spinner1, -49);
    lv_obj_set_align(ui_Spinner1, LV_ALIGN_CENTER);
    lv_obj_clear_flag(ui_Spinner1, LV_OBJ_FLAG_CLICKABLE);      /// Flags
    lv_obj_set_style_arc_color(ui_Spinner1, lv_color_hex(0xFFFFFF), LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_arc_opa(ui_Spinner1, 100, LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_arc_width(ui_Spinner1, 20, LV_PART_MAIN | LV_STATE_DEFAULT);

    lv_obj_set_style_arc_color(ui_Spinner1, lv_color_hex(0x406CFF), LV_PART_INDICATOR | LV_STATE_DEFAULT);
    lv_obj_set_style_arc_opa(ui_Spinner1, 255, LV_PART_INDICATOR | LV_STATE_DEFAULT);
    lv_obj_set_style_arc_width(ui_Spinner1, 20, LV_PART_INDICATOR | LV_STATE_DEFAULT);

    ui_Image6 = lv_img_create(ui_Spinner1);
    lv_img_set_src(ui_Image6, &ui_img_polipharm2_png);
    lv_obj_set_width(ui_Image6, LV_SIZE_CONTENT);   /// 267
    lv_obj_set_height(ui_Image6, LV_SIZE_CONTENT);    /// 267
    lv_obj_set_x(ui_Image6, -3);
    lv_obj_set_y(ui_Image6, 0);
    lv_obj_set_align(ui_Image6, LV_ALIGN_CENTER);
    lv_obj_add_flag(ui_Image6, LV_OBJ_FLAG_ADV_HITTEST);     /// Flags
    lv_obj_clear_flag(ui_Image6, LV_OBJ_FLAG_SCROLLABLE);      /// Flags
    lv_img_set_zoom(ui_Image6, 150);

    ui_Label13 = lv_label_create(ui_LoadingPage);
    lv_obj_set_width(ui_Label13, LV_SIZE_CONTENT);   /// 1
    lv_obj_set_height(ui_Label13, LV_SIZE_CONTENT);    /// 1
    lv_obj_set_x(ui_Label13, 0);
    lv_obj_set_y(ui_Label13, 142);
    lv_obj_set_align(ui_Label13, LV_ALIGN_CENTER);
    lv_label_set_text(ui_Label13, "Create by engineering department");
    lv_obj_set_style_text_color(ui_Label13, lv_color_hex(0x808080), LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_text_opa(ui_Label13, 255, LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_text_font(ui_Label13, &ui_font_sukhumvit25, LV_PART_MAIN | LV_STATE_DEFAULT);

    ui_LoadingLabel = lv_label_create(ui_LoadingPage);
    lv_obj_set_width(ui_LoadingLabel, LV_SIZE_CONTENT);   /// 1
    lv_obj_set_height(ui_LoadingLabel, LV_SIZE_CONTENT);    /// 1
    lv_obj_set_x(ui_LoadingLabel, 0);
    lv_obj_set_y(ui_LoadingLabel, 106);
    lv_obj_set_align(ui_LoadingLabel, LV_ALIGN_CENTER);
    lv_label_set_text(ui_LoadingLabel, "Connecting to wifi...");
    lv_obj_set_style_text_color(ui_LoadingLabel, lv_color_hex(0xF4660A), LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_text_opa(ui_LoadingLabel, 255, LV_PART_MAIN | LV_STATE_DEFAULT);
    lv_obj_set_style_text_font(ui_LoadingLabel, &ui_font_sukhumvit25, LV_PART_MAIN | LV_STATE_DEFAULT);

}
