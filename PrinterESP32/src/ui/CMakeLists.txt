SET(SOURCES screens/ui_LoadingPage.c
    screens/ui_DetailsPage.c
    screens/ui_LoginPage.c
    screens/ui_MainPage.c
    ui.c
    components/ui_comp_hook.c
    ui_helpers.c
    images/ui_img_polipharm2_png.c
    images/ui_img_logout5_png.c
    images/ui_img_scale_png.c
    fonts/ui_font_Chakra100.c
    fonts/ui_font_Chakra130.c
    fonts/ui_font_Chakra50.c
    fonts/ui_font_Kanit50.c
    fonts/ui_font_sukhumvit25.c
    fonts/ui_font_sukhumvit30.c)

add_library(ui ${SOURCES})
