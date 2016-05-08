<?php

dpm('hitting admin form');

/**
 * Implements hook_form().
 */
function granulr_admin_form($form, &$form_state) {

  dpm('admin form settintgs');

  $form['granulr'] = array(
    '#type' => 'fieldset',
    '#title' => t('Granular App Settings'),
  );

  $form['granulr']['titleBarTextColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar text color'),
    '#description' => t('Set the hex for the app title bar color.'),
    '#default_value' => variable_get('titleBarTextColor', ''),
  );

  $form['granulr']['titleBarBackgroundColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar barckground color'),
    '#description' => t('Set the hex for the app title bar background color.'),
    '#default_value' => variable_get('titleBarBackgroundColor', ''),
  );

  // Ensure we post process image uploads.
  $form['#submit'][] = 'granulr_form_form_submit';

  return system_settings_form($form);
}


function granulr_form_form_submit($form, &$form_state) {

  dpm('form submit');
}
