<template>
  <div id="app" class="container">
      <div class="row">
        <div class="col-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="form-group">
                <label for="">Choose an image</label>
                <input type="file" @change="loadImage($event)">
              </div>
              <div class="form-group">
                <img :src="image.src" v-if="image.src" class="mw-100">
              </div>
            </div>
          </div>
        </div>
        <div class="col-8">
          <canvas ref="canvas"></canvas>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Subject, Subscription, fromEvent } from 'rxjs';
  import Render from './ts/render';
  import { resizeCanvas } from './ts/utility';
  const vertexShaderSource = require('./shaders/vertex.glsl');
  const fragmentShaderSource = require('./shaders/fragment.glsl');

  @Component({
    components: {
      // HelloWorld,
    },
  })
  export default class App extends Vue {
    public render: Render | null;
    public fileReader = new FileReader();
    public image = new Image();
    public imageSrc: string;
    public fileRead = fromEvent<FileReaderProgressEvent>(this.fileReader, 'load');
    public imageLoad = fromEvent<HTMLImageElement>(this.image, 'load');
    public imageLoad$: Subscription;
    public fileRead$: Subscription;

    constructor() {
      super();
      this.render = null;
      this.fileRead$ = this.fileRead.subscribe(event => {
        const tgt = event.target;
        // this.image = new Image();
        this.image.src = tgt.result;
      });
    }

    public get canvas(): HTMLCanvasElement {
      return this.$refs.canvas as HTMLCanvasElement;
    }

    public get imageSource(): string {
      return this.image.src;
    }

    public loadImage(evt: Event) {
      const tgt = evt.target;
      const files = (<HTMLInputElement>tgt).files;
      this.fileReader.readAsDataURL(files[0]);
    }

    private mounted() {
      resizeCanvas(this.canvas);
      this.render = new Render(this.canvas);
      this.render.init(vertexShaderSource, fragmentShaderSource);
    }

    private destroyed() {
      // this.imageLoad$.unsubscribe();
    }
  }
</script>

<style lang="scss">
  @import '~bootstrap/scss/bootstrap';

  body {
    background-color: #fbfbfb;
    color: #2c3e50;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-top: 5rem;
  }

  .card {
    box-shadow: 0 2px 5px 2px rgba(black, 0.1);
  }

  canvas {
    width: 800px;
    height: 600px;
    box-shadow: 0 2px 5px 2px rgba(black, 0.1);
  }
</style>
