/**
 * @file
 * Javascript functionality for the Display Suite Extras module.
 */

(function ($, Drupal, drupalSettings) {

  "use strict";

  // Switch view mode inline with AJAX, for the 'View mode switcher' option.
  Drupal.behaviors.DSExtrasSwitchViewmode = {
    attach: function (context) {

      if ($('.switch-view-mode-field').length > 0) {
        $('.switch-view-mode-field a').click(function () {

          // Create an object.
          var link = $(this);

          // Get params from the class.
          var params = $(this).attr('class').split('-');

          $.ajax({
            type: 'GET',
            url: drupalSettings.basePath + 'ds-switch-view-mode',
            data: {entity_type: params[0], view_mode: params[3], id: params[2]},
            dataType: 'json',
            success: function (data) {
              if (data.status) {
                var old_view_mode = params[1];
                var wrapper = link.parents('.view-mode-' + old_view_mode);
                Drupal.theme('DisplaySuiteSwitchViewmode', wrapper, data.content);
                Drupal.attachBehaviors();
              }
              else {
                window.alert(data.errorMessage);
              }
            },
            error: function (xmlhttp) {
              window.alert(Drupal.t('An HTTP error @status occurred.', {'@status': xmlhttp.status}));
            }
          });
          return false;
        });
      }
    }
  };

  /**
   * Theme function for a replacing content of Display Suite content wrapper.
   *
   * @param wrapper
   *   The HTML object which needs to be replaced
   * @param content
   *   The new content
   */
  Drupal.theme.DisplaySuiteSwitchViewmode = function (wrapper, content) {
    wrapper.replaceWith(content);
  };

})(jQuery, Drupal, drupalSettings);
