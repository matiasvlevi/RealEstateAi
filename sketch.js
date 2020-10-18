let d;
let b;
let nn;
let indexMax = 20000;
let g;
let n;
let losses = [];
let testlosses = [];
let accuracies = [];
let wnx = 800;
let wny = 900;
let logs = true;
let globalEpoch = 0;
let house_pricing_dataset = [];
let map_ = true;
let xoff = 0;
let yoff = 0;
let sliderX;
let sliderY;
let zoomSlider = 0;
let zoom = 1;
let xs = [];
let ys = [];
let cs = [];
let ps = [];
let b0 = 0;
let s0 = 0;
let b1 = 0;
let s1 = 0;
let tlat = [];
let tlon = [];
let tprice = [];

// Zoom the view on a city
function sanFrancisco() {
  xoff = -500;
  yoff = 1550;
  zoom = 0.2
}
function losAngeles() {
  xoff = -1800;
  yoff = 300;
  zoom = 0.2;
}

function setup() {
    sanFrancisco();
    houses = new DataSet("houses_dataset");
    nn = new Dann(9,1);

    nn.addHiddenLayer(9,leakyReLU);
    nn.addHiddenLayer(12,leakyReLU);
    nn.addHiddenLayer(9,leakyReLU);
    nn.addHiddenLayer(6,leakyReLU);

    nn.makeWeights();

    nn.lr = 0.0001;

    nn.log();


    g = new Graph(0,0,600,100);
    g.step = 10000
    g.addValue(losses,color(0,100,255),"loss");
    g.addValue(accuracies,color(200,255,0),"accuracy");
    createCanvas(wnx,wny);
}
let graphFunc = pricesGraph;
function draw() {
    background(65);
    if (houses.data.length > 0) {
        train(1);
    }
    if (losses.length > 0) {
        graphFunc = pricesGuessGraph;
        g.render();
    }
    if(losses.length > 10000*100) {
        losses = [];
        accuracies = [];
    }
    plotGraph();
    if (map_ == true) {

        graphFunc();
    }



}
