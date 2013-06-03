L.Playback = L.Playback || {};

L.Playback.Transport = L.Class.extend({
  options: {
    position: 'bottomleft'
  },

  onAdd: function (map) {
      // create the control container with a particular class name
      var container = L.DomUtil.create('button', 'btn');

      // ... initialize other DOM elements, add listeners, etc.
      container.innerHTML = "Show All"

      return container;
  }
});