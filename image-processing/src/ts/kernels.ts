export const kernels = [
  { name: 'None', data: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
  {
    name: 'gaussianBlur',
    data: [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045]
  },
  {
    name: 'gaussianBlur2',
    data: [1, 2, 1, 2, 4, 2, 1, 2, 1]
  },
  {
    name: 'gaussianBlur3',
    data: [0, 1, 0, 1, 1, 1, 0, 1, 0]
  },
  {
    name: 'unsharpen',
    data: [-1, -1, -1, -1, 9, -1, -1, -1, -1]
  },
  {
    name: 'sharpness',
    data: [0, -1, 0, -1, 5, -1, 0, -1, 0]
  },
  {
    name: 'sharpen',
    data: [-1, -1, -1, -1, 16, -1, -1, -1, -1]
  },
  {
    name: 'edgeDetect',
    data: [-0.125, -0.125, -0.125, -0.125, 1, -0.125, -0.125, -0.125, -0.125]
  },
  {
    name: 'edgeDetect2',
    data: [-1, -1, -1, -1, 8, -1, -1, -1, -1]
  },
  {
    name: 'edgeDetect3',
    data: [-5, 0, 0, 0, 0, 0, 0, 0, 5]
  },
  {
    name: 'edgeDetect4',
    data: [-1, -1, -1, 0, 0, 0, 1, 1, 1]
  },
  {
    name: 'edgeDetect5',
    data: [-1, -1, -1, 2, 2, 2, -1, -1, -1]
  },
  {
    name: 'edgeDetect6',
    data: [-5, -5, -5, -5, 39, -5, -5, -5, -5]
  },
  {
    name: 'sobelHorizontal',
    data: [1, 2, 1, 0, 0, 0, -1, -2, -1]
  },
  {
    name: 'sobelVertical',
    data: [1, 0, -1, 2, 0, -2, 1, 0, -1]
  },
  {
    name: 'previtHorizontal',
    data: [1, 1, 1, 0, 0, 0, -1, -1, -1]
  },
  {
    name: 'previtVertical',
    data: [1, 0, -1, 1, 0, -1, 1, 0, -1]
  },
  {
    name: 'boxBlur',
    data: [0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111, 0.111]
  },
  {
    name: 'triangleBlur',
    data: [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]
  },
  {
    name: 'emboss',
    data: [-2, -1, 0, -1, 1, 1, 0, 1, 2]
  }
];
