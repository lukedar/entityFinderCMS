<?php

/**
 * Implements hook_form().
 */
function granulr_admin_form($form, &$form_state) {
  $form['granulr'] = array(
    '#type' => 'fieldset',
    '#title' => t('Granular App Settings'),
  );

  $form['granulr']['brandTitleBarTextColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar text color'),
    '#description' => t('Set the hex for the app title bar color.'),
    '#default_value' => variable_get('titleBarTextColor', ''),
  );

  $form['granulr']['brandTitleBarBackgroundColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar barckground color'),
    '#description' => t('Set the hex for the app title bar background color.'),
    '#default_value' => variable_get('titleBarBackgroundColor', ''),
  );


  $form['granulr']['layoutEntityListings'] = array(
    '#type' => 'text',
    '#title' => t('Layout settings'),
    '#description' => t('Sets the entity listings layout style.'),
    '#default_value' => variable_get('layoutEntityListings', ''),
  );

  // Ensure we post process image uploads.
  $form['#submit'][] = 'granulr_form_form_submit';

  return system_settings_form($form);
}


function granulr_form_form_submit($form, &$form_state) {
  $app_settings = $form_state['values'];
  $brand_setting_prefix = 'brand';
  $layout_setting_prefix = 'layout';
  
  $app_settings_output = array(
    'settings' => array(
      'theme' => array(
        'brand' => array(),
        'layout' => array()
        ),
      ),
    );

  foreach($app_settings as $key => $app_setting) {
    // Set branding endpoint settings.
    if (strpos($key, $brand_setting_prefix) !== false) {
      dpm('yes');
      $app_settings_output['settings']['theme']['brand'][$key] = $app_setting;
    }

    // Set layout endpoiint setting.
    if (strpos($key, $layout_setting_prefix) !== false) {

      dpm('yes');
      $app_settings_output['settings']['theme']['layout'][$key] = $app_setting;
    }

  }

  dpm(drupal_json_encode($app_settings_output));
}
