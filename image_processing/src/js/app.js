import { render } from './render.js';
import { randInt } from './utility.js';

export default new Vue({
  data: {
    loadedImage: null,
  },
  computed: {
    canvas: function() {
      return this.$refs['canvas'];
    },
  },
  methods: {
    loadImage(evt) {
      const tgt = evt.target || window.event.srcElement,
        files = tgt.files;

      if (FileReader && files && files.length) {
        let fr = new FileReader();
        fr.onload = () => {
          this.loadedImage = new Image();
          this.loadedImage.src = fr.result;
        };
        fr.readAsDataURL(files[0]);
      }
    },
  },
  created: function() {
    // render();
  },
});
