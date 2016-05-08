<?php

dpm('hitting admin form');

/**
 * Implements hook_form().
 */
function granulr_admin_form($form, &$form_state) {

  dpm('admin form settintgs');

  $form['app'] = array(
    '#type' => 'fieldset',
    '#title' => t('Granular App Settings'),
  );

  $form['app']['titleBarColor'] = array(
    '#type' => 'textfield',
    '#title' => t('Title bar color'),
    '#description' => t('set the hex for the app title bar color.'),
    '#default_value' => variable_get('granulr_title_bar_color', ''),
  );

  // Ensure we post process image uploads.
  $form['#submit'][] = 'granulr_form_form_submit';

  return system_settings_form($form);
}


function granulr_form_form_submit($form, &$form_state) {

  dpm('form submit');
}
