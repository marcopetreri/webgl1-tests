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
                <img ref="image" class="mx-auto d-block" style="max-width: 100px;">
              </div>
              <div class="form-group">
                <label for="kernelInput">Choose one or more convolution kernels</label>
                <select class="custom-select" name="kernelInput" id="kernelInput" v-model="kernelsIndexes" multiple>
                  <option v-for="(k, i) of kernels" :key="i" :value="i" >{{ k.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="tx">Translate X</label>
                <input class="form-control" type="range" name="tx" id="tx" v-model.number="translate.x">
                <input type="number" v-model.number="translate.x">
              </div>
              <div class="form-group">
                <label for="ty">Translate Y</label>
                <input class="form-control" type="range" name="ty" id="ty" v-model.number="translate.y">
                <input type="number" v-model.number="translate.y">
              </div>
              <div class="form-group">
                <label for="sx">Scale X</label>
                <input class="form-control" type="range" name="sx" id="sx" v-model.number="scale.x">
                <input type="number" v-model.number="scale.x">
              </div>
              <div class="form-group">
                <label for="sy">Scale Y</label>
                <input class="form-control" type="range" name="sy" id="sy" v-model.number="scale.y">
                <input type="number" v-model.number="scale.y">
              </div>
              <div class="form-group">
                <label for="rdeg">Rotate</label>
                <input class="form-control" type="range" name="rdeg" id="rdeg" min="0" max="360" v-model.number="rotate.deg">
                <input type="number" v-model.number="rotate.deg">
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
        this.draw();
      },
      'translate.x': function() {
        this.draw();
      },
      'translate.y': function() {
        this.draw();
      },
      'scale.x': function() {
        this.draw();
      },
      'scale.y': function() {
        this.draw();
      },
      'rotate.deg': function() {
        this.draw();
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
    public translate: { x: number; y: number } = { x: 0, y: 0 };
    public scale: { x: number; y: number } = { x: 1, y: 1 };
    public rotate: { deg: number } = { deg: 0 };

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

    public get transformMatrix(): Mat3 {
      const t = Mat3.translation(this.translate.x, this.translate.y);
      const s = Mat3.scaling(this.scale.x, this.scale.y);
      const r = Mat3.rotation(this.rotate.deg);
      const c = new Mat3()
        .compose(t)
        .compose(s)
        .compose(r);
      console.log('t ' + t, 's ' + s, 'r ' + r, 'c ' + c);
      return c;
    }

    public get renderParams(): RenderParams {
      return {
        image: this.image,
        kernels: this.kernels
          .filter((v, i) => this.kernelsIndexes.includes(i))
          .map(v => v.data),
        transformMatrix: this.transformMatrix,
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

    public draw() {
      this.render.render(this.renderParams);
    }

    private mounted() {
      resizeCanvas(this.canvas);
      this.render = new Render(this.canvas, { alpha: false });
      this.render.init(vertexShaderSource, fragmentShaderSource);

      const defaultImageLoad = ajax({
        url: '/logo.png',
        responseType: 'blob',
      }).subscribe(data => {
        this.loadImage(data.response);
      });
      this.imageLoad = fromEvent<Event>(this.image, 'load');
      this.imageLoad$ = this.imageLoad.subscribe(event => {
        this.draw();
      });

      // let a = new Vec3(1, 0, 0);
      // let b = new Vec3(0, 1, 0);
      // let c = new Vec3(0, 0, 1);
      // let d = new Vec3();
      // d.add(a)
      //   .add(b)
      //   .add(c)
      //   .mul(0.5);

      // console.log('a = ' + a, 'b = ' + b, 'c = ' + c, 'd = ' + d);

      // console.log(
      //   'neg ' + Vec3.neg(a),
      //   'add ' + Vec3.add(a, b),
      //   'sub ' + Vec3.sub(a, b),
      //   'mul ' + Vec3.mul(a, 2),
      //   'div ' + Vec3.div(a, 2),
      //   'dot ' + Vec3.dot(a, b),
      //   'cross ' + Vec3.cross(a, b)
      // );

      // let m = new Mat3([2, 0, 0, 0, 3, 0, 0, 0, 4]);
      // let n = new Mat3([3, 0, 0], [0, 3, 0], [0, 0, 3]);
      // console.log(
      //   'm = ' + m,
      //   'n = ' + n,
      //   'm * n = ' +
      //     Mat3.compose(
      //       m,
      //       n
      //     ),
      //   'd * m = ' + Mat3.mul(n, Mat3.mul(m, d)),
      //   'transpose = ' + Mat3.transpose(new Mat3([1, 2, 3, 4, 5, 6, 7, 8, 9]))
      // );
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
