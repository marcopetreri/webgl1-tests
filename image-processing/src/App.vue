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
  import { kernels } from './ts/kernels';
  import { Vec3, Mat3 } from './ts/math';
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
    public kernels = kernels;

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

      let a = new Vec3(1, 0, 0);
      let b = new Vec3(0, 1, 0);
      let c = new Vec3(0, 0, 1);

      console.log('a = ' + a, 'b = ' + b, 'c = ' + c);

      console.log(
        'neg ' + Vec3.neg(a),
        'add ' + Vec3.add(a, b),
        'sub ' + Vec3.sub(a, b),
        'mul ' + Vec3.mul(a, 2),
        'div ' + Vec3.div(a, 2),
        'dot ' + Vec3.dot(a, b),
        'cross ' + Vec3.cross(a, b)
      );

      let m = new Mat3([1, 0, 1], [0, 0, 0], [0, 1, 0]);
      console.log('m = ' + m);
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
