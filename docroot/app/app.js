$(function() {

  var Event = Backbone.Model.extend({});

  var Events = Backbone.Collection.extend({
    model: Event,
    url: 'http://event-finder.dev/events/json'
  });

  var EventView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#event-view').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });

  var EventsList = Backbone.View.extend({
    el: $('#main-container'),

    template: _.template($('#events-list').html()),

    initialize: function() {
      self = this;
      this.collection.fetch({
        success: function() {
          self.render();
        }
      });
    },

    render: function() {
      
      this.el.innerHTML = this.template();

      var ul = this.$el.find('ul');
      
      this.collection.forEach( function(model) {
        ul.append((new EventView({ model: model })).render().el);
      }, this);

      return this;
    }
  });

  var App = new EventsList({ collection: new Events });

});
