<?php

/**
 * Implements hook_form().
 */
function granulr_admin_form($form, &$form_state) {
  $form['granulr'] = array(
    '#type' => 'fieldset',
    '#title' => t('Granular App Settings'),
  );

  $form['granulr']['brand'] = array(
    '#type' => 'fieldset',
    '#title' => t('Branding'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,  
  );

  $form['granulr']['brand']['titleBarTextColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar text color'),
    '#description' => t('Set the hex for the app title bar color.'),
    '#default_value' => variable_get('titleBarTextColor', ''),
  );

  $form['granulr']['brand']['titleBarBackgroundColor'] = array(
    '#type' => 'jquery_colorpicker',
    '#title' => t('Title bar barckground color'),
    '#description' => t('Set the hex for the app title bar background color.'),
    '#default_value' => variable_get('titleBarBackgroundColor', ''),
  );

  $form['granulr']['layout'] = array(
    '#type' => 'fieldset',
    '#title' => t('Layout'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,  
  );

  $form['granulr']['layout']['entityListingsLayoutType'] = array(
    '#type' => 'select',
    '#title' => t('Listings Layout'),
    '#options' => array(
      'list' => t('List'),
      'grid' => t('Grid'),
    ),
    '#description' => t('Sets the entity listings layout style.'),
    '#default_value' => variable_get('entityListingsLayoutType', ''),
  );


  $form['granulr']['features'] = array(
    '#type' => 'fieldset',
    '#title' => t('Features'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,  
  );

  $form['granulr']['features']['socialFeature'] = array(
    '#type' => 'checkbox',
    '#title' => t('Social Sharing'),
    '#description' => t('Enable social sharing'),
    '#default_value' => variable_get('socialFeature', ''),
  );

  $form['granulr']['features']['mapDirections'] = array(
    '#type' => 'checkbox',
    '#title' => t('Map Directions'),
    '#description' => t('Enables the map directions or user routing.'),
    '#default_value' => variable_get('mapDirections', ''),
  );

  $form['granulr']['features']['myListings'] = array(
    '#type' => 'checkbox',
    '#title' => t('Map Directions'),
    '#description' => t('Allows users to bookmark entities and create a my listings section.'),
    '#default_value' => variable_get('myListings', ''),
  );

  // Ensure we post process image uploads.
  $form['#submit'][] = 'granulr_form_form_submit';

  return system_settings_form($form);
}

/**
 * Get app setting values and save to granulr_app_settings
 */
function granulr_form_form_submit($form, &$form_state) {
  $app_settings = $form_state['complete form']['granulr'];
  $brand_settings = $app_settings['brand'];
  $layout_settings = $app_settings['layout'];
  $feature_settings = $app_settings['features'];
  
  // Setup config enpoint output..
  $app_settings_output = array(
    'theme' => array(
      'brand' => array(),
      'layout' => array(
        'entityListings' => ''
        )
      ),
    'features' => array(),
    );

  // Extract app branding settings form state.
  foreach($brand_settings as $key => $brand_setting) {
    if (isset($brand_setting['#input']) && 
      $brand_setting['#input'] === TRUE && 
      $brand_setting['#value'] !== null) {
      
      $app_settings_output['theme']['brand'][$key] = '#' . $brand_setting['#value'];
    }
  }

  // Extract layout settings form state form state.
  foreach($layout_settings as $key => $layout_setting) {
    if (isset($layout_setting['#input']) && 
      $layout_setting['#input'] === TRUE && 
      $layout_setting['#value'] !== null) {
      
      $app_settings_output['theme']['layout']['entityListings'] = $layout_setting['#value'];
    }
  }

  // Extract toggable features.
  foreach($feature_settings as $key => $feature_setting) {
    if (isset($feature_setting['#input']) && 
      $feature_setting['#input'] === TRUE && 
      $feature_setting['#value'] !== null) {
      
      $app_settings_output['features'][$key] = $feature_setting['#value'];
    }
  }

  variable_set('granulr_app_settings', $app_settings_output);
}
