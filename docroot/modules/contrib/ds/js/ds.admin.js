/**
 * @file
 * Javascript functionality for Display Suite's administration UI.
 */

(function ($, Drupal) {

  "use strict";

  Drupal.DisplaySuite = Drupal.DisplaySuite || {};
  Drupal.DisplaySuite.fieldopened = '';
  Drupal.DisplaySuite.layout_original = '';

  Drupal.behaviors.DSSummaries = {
    attach: function (context) {

      $(context).find('#edit-fs1').drupalSetSummary(function (context) {
        var fieldtemplates = $('#edit-fs1-field-template', context);

        if (fieldtemplates.is(':checked')) {
          var fieldtemplate = $('#edit-fs1-ft-default option:selected').text();
          return Drupal.t('Enabled') + ': ' + Drupal.t(fieldtemplate);
        }

        return Drupal.t('Disabled');
      });
    }
  };

  /**
   * Row handlers for the 'Manage display' screen.
   */
  Drupal.fieldUIDisplayOverview = Drupal.fieldUIDisplayOverview || {};

  Drupal.fieldUIDisplayOverview.ds = function (row, data) {

    this.row = row;
    this.name = data.name;
    this.region = data.region;
    this.tableDrag = data.tableDrag;

    // Attach change listener to the 'region' select.
    this.$regionSelect = $('select.ds-field-region', row);
    this.$regionSelect.change(Drupal.fieldUIOverview.onChange);

    // Attach change listener to the 'plugin type' select.
    this.$formatSelect = $('select.field-plugin-type', row);
    this.$formatSelect.change(Drupal.fieldUIOverview.onChange);

    return this;
  };

  Drupal.fieldUIDisplayOverview.ds.prototype = {

    /**
     * Returns the region corresponding to the current form values of the row.
     */
    getRegion: function () {
      return this.$regionSelect.val();
    },

    /**
     * Reacts to a row being changed regions.
     *
     * This function is called when the row is moved to a different region, as a
     * result of either :
     * - a drag-and-drop action
     * - user input in one of the form elements watched by the
     *   Drupal.fieldUIOverview.onChange change listener.
     *
     * @param region
     *   The name of the new region for the row.
     * @return
     *   A hash object indicating which rows should be AJAX-updated as a result
     *   of the change, in the format expected by
     *   Drupal.displayOverview.AJAXRefreshRows().
     */
    regionChange: function (region) {

      // Replace dashes with underscores.
      region = region.replace(/-/g, '_');

      // Set the region of the select list.
      this.$regionSelect.val(region);

      // Prepare rows to be refreshed in the form.
      var refreshRows = {};
      refreshRows[this.name] = this.$regionSelect.get(0);

      // If a row is handled by field_group module, loop through the children.
      if ($(this.row).hasClass('field-group') && $.isFunction(Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields)) {
        Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields(region, this, refreshRows);
      }

      return refreshRows;
    }
  };

  /**
   * Field template.
   */
  Drupal.behaviors.settingsToggle = {
    attach: function (context) {

      // Bind on click.
      $('.field-plugin-settings-edit-form', context).once('ds-ft', function () {

        var fieldTemplate = $(this);

        // Bind on field template select button.
        fieldTemplate.find('.ds-extras-field-template').change(function () {
          ds_show_expert_settings(fieldTemplate);
        });

        ds_show_expert_settings(fieldTemplate);

      });

      // Show / hide settings on field template form.
      function ds_show_expert_settings(element, open) {
        var field = element;
        var ft = $('.ds-extras-field-template', field).val();

        if (ft === 'theme_ds_field_expert') {
          // Show second, third, fourth, fifth and sixth label.
          if ($('.lb .form-item:nth-child(1)', field).is(':visible')) {
            $('.lb .form-item:nth-child(2), .lb .form-item:nth-child(3), .lb .form-item:nth-child(4), .lb .form-item:nth-child(5), .lb .form-item:nth-child(6)', field).show();
          }
          // Remove margin from update button.
          $('.ft-update', field).css({'margin-top': '-10px'});
          // Show wrappers.
          $('.ow, .fis, .fi', field).show();
        }
        else {
          // Hide second, third, fourth, fifth and sixth  label.
          $('.lb .form-item:nth-child(2), .lb .form-item:nth-child(3), .lb .form-item:nth-child(4), .lb .form-item:nth-child(5), .lb .form-item:nth-child(6)', field).hide();
          // Add margin on update button.
          $('.ft-update', field).css({'margin-top': '10px'});
          // Hide wrappers.
          $('.ow, .fis, .fi', field).hide();
        }

        // Colon.
        if (ft === 'theme_field' || ft === 'theme_ds_field_reset') {
          $('.colon-checkbox', field).parent().hide();
        }
        else if ($('.lb .form-item:nth-child(1)', field).is(':visible')) {
          $('.colon-checkbox', field).parent().show();
        }

        // CSS classes.
        if (ft !== 'theme_ds_field_expert' && ft !== 'theme_ds_field_reset') {
          $('.field-classes', field).show();
        }
        else {
          $('.field-classes', field).hide();
        }
      }

      $('.label-change').change(function () {
        var field = $(this).parents('tr');
        if ($('.field-template', field).length > 0) {
          var ft = $('.ds-extras-field-template', field).val();
          if (ft === 'theme_field' || ft === 'theme_ds_field_reset') {
            $('.colon-checkbox', field).parent().hide();
          }
        }
      });
    }
  };

})(jQuery, Drupal);
