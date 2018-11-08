<template>
  <div id="app" class="container">
      <div class="row">
        <div class="col-4">
          <div class="card h-100">
            <div class="card-body">
              <div class="form-group">
                <label for="">Choose an image</label>
                <input type="file" @change="fileInputChange($event)">
              </div>
              <div class="form-group">
                <img ref="image" class="mw-100">
              </div>
              <div class="form-group">
                <label for="kernelInput">Choose one or more convolution kernels</label>
                <select name="kernelInput" id="kernelInput" v-model="kernelsIndexes" multiple>
                  <option v-for="(k, i) of kernels" :key="i" :value="i" >{{ k.name }}</option>
                </select>
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
  import { Subject, Subscription, fromEvent, Observable } from 'rxjs';
  import { ajax } from 'rxjs/ajax';
  import Render from './ts/render';
  import { resizeCanvas } from './ts/utility';
  import RenderParams from './ts/render-params.interface';
  const vertexShaderSource = require('./shaders/vertex.glsl');
  const fragmentShaderSource = require('./shaders/fragment.glsl');

  @Component({
    components: {
      // HelloWorld,
    },
    watch: {
      kernelsIndexes(i: number) {
        this.render.render(this.renderParams);
      },
    },
  })
  export default class App extends Vue {
    public render: Render | null;
    public fileReader = new FileReader();
    public fileRead = fromEvent<FileReaderProgressEvent>(this.fileReader, 'load');
    public imageLoad: Observable<Event>;
    public imageLoad$: Subscription;
    public fileRead$: Subscription;
    public kernelsIndexes: number[] = [0];
    public kernels = [
      { name: 'None', data: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
      {
        name: 'gaussianBlur',
        data: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045],
      },
      {
        name: 'gaussianBlur2',
        data: [1, 2, 1, 2, 4, 2, 1, 2, 1],
      },
      {
        name: 'gaussianBlur3',
        data: [0, 1, 0, 1, 1, 1, 0, 1, 0],
      },
      {
        name: 'unsharpen',
        data: [-1, -1, -1, -1, 9, -1, -1, -1, -1],
      },
      {
        name: 'sharpness',
        data: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      },
      {
        name: 'sharpen',
        data: [-1, -1, -1, -1, 16, -1, -1, -1, -1],
      },
      {
        name: 'edgeDetect',
        data: [-0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125],
      },
      {
        name: 'edgeDetect2',
        data: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      },
      {
        name: 'edgeDetect3',
        data: [-5, 0, 0, 0, 0, 0, 0, 0, 5],
      },
      {
        name: 'edgeDetect4',
        data: [-1, -1, -1, 0, 0, 0, 1, 1, 1],
      },
      {
        name: 'edgeDetect5',
        data: [-1, -1, -1, 2, 2, 2, -1, -1, -1],
      },
      {
        name: 'edgeDetect6',
        data: [-5, -5, -5, -5, 39, -5, -5, -5, -5],
      },
      {
        name: 'sobelHorizontal',
        data: [1, 2, 1, 0, 0, 0, -1, -2, -1],
      },
      {
        name: 'sobelVertical',
        data: [1, 0, -1, 2, 0, -2, 1, 0, -1],
      },
      {
        name: 'previtHorizontal',
        data: [1, 1, 1, 0, 0, 0, -1, -1, -1],
      },
      {
        name: 'previtVertical',
        data: [1, 0, -1, 1, 0, -1, 1, 0, -1],
      },
      {
        name: 'boxBlur',
        data: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111],
      },
      {
        name: 'triangleBlur',
        data: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625],
      },
      {
        name: 'emboss',
        data: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
      },
    ];

    constructor() {
      super();
      this.render = null;
      this.fileRead$ = this.fileRead.subscribe(event => {
        const tgt = event.target;
        this.image.src = tgt.result;
      });
    }

    public get canvas(): HTMLCanvasElement {
      return this.$refs.canvas as HTMLCanvasElement;
    }

    public get image(): HTMLImageElement {
      return this.$refs.image as HTMLImageElement;
    }

    public get renderParams(): RenderParams {
      return {
        image: this.image,
        kernels: this.kernels
          .filter((v, i) => this.kernelsIndexes.includes(i))
          .map(v => v.data),
      };
    }

    public fileInputChange(evt: Event) {
      const tgt = evt.target;
      const files = (<HTMLInputElement>tgt).files;
      this.loadImage(files[0]);
    }

    public loadImage(blob: Blob) {
      this.fileReader.readAsDataURL(blob);
    }

    private mounted() {
      resizeCanvas(this.canvas);
      this.render = new Render(this.canvas);
      this.render.init(vertexShaderSource, fragmentShaderSource);

      const defaultImageLoad = ajax({
        url: '/logo.png',
        responseType: 'blob',
      }).subscribe(data => {
        this.loadImage(data.response);
      });
      this.imageLoad = fromEvent<Event>(this.image, 'load');
      this.imageLoad$ = this.imageLoad.subscribe(event => {
        this.render.render(this.renderParams);
      });
    }

    private destroyed() {
      this.imageLoad$.unsubscribe();
      this.fileRead$.unsubscribe();
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
