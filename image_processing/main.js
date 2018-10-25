import { randInt } from './utility';

export default new Vue({
  el: '#app',
  data: {
    loadedImage: null,
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
  created: function(params) {
    console.log('ok');
    console.log(randInt(1, 2));
  },
});
