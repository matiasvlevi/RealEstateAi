let d;
let b;
let nn;
let indexMax = 20000;
let graphplot;
let losses = [];
let testlosses = [];
let accuracies = [];
let wnx = 800;
let wny = 900;
let logs = false;
let globalEpoch = 0;
let house_pricing_dataset = [];
let map_ = false;

let xoff = 0;
let yoff = 0;
let sliderX;
let sliderY;
let zoomSlider = 0;
let zoom = 0;
function preload() {
    //makeDatasets();
    houses = new DataSet("houses_dataset");
    nn = new DANNeuralNetwork(9,1);
    nn.addHiddenLayer(21);
    nn.addHiddenLayer(16);
    nn.addHiddenLayer(12);
    nn.addHiddenLayer(6)

    sliderX = createSlider(-1200,2400,0);
    sliderY = createSlider(-1200,2400,0);
    zoomSlider = createSlider(1,10,10);
    nn.makeWeights();
    nn.activation(0,leakyReLU,leakyReLU_d);
    nn.activation(1,leakyReLU,leakyReLU_d);
    nn.activation(2,leakyReLU,leakyReLU_d);
    nn.activation(3,leakyReLU,leakyReLU_d);
    nn.activation(4,leakyReLU,leakyReLU_d);


    graphplot = new Graph();
    graphplot.addValue(losses,color(0,100,255));
    graphplot.addValue(accuracies,color(200,255,0));
    nn.lr = 0.000001;
    console.log(nn);



}
let xs = [];
let ys = [];
let cs = [];
let ps = [];
function plotGraph() {

    if (houses.data.length > 0) {
        for (let i = 0; i < houses.data.length;i++) {
             // let x = map(houses.data[i].inputs[0],0.25,0.75,0,2400);
             // let y = map(houses.data[i].inputs[1],0.25,0.75,0,2400);
             xs[i] = map(houses.data[i].inputs[0],0,zoom,0,wnx);
             ys[i] = map(houses.data[i].inputs[1],0,zoom,wny,200);
             cs[i] = houses.data[i].inputs[8];
             ps[i] = houses.data[i].target[0];

        }
    }



}
function pricesGraph() {
    for (let i = 0; i < houses.data.length;i++) {
        let r = map(ps[i],0,1,0,255);
        let g = map(ps[i],0,1,255,0);
        let b = 255 - g - r;

        fill(r,g,b,255)
        noStroke();
        let rad = 0;
        if (zoom < 0.5) {
            rad = 2;
        } else {
            rad = 1;
        }
        ellipse(xs[i]+xoff,ys[i]+yoff,rad,rad);
    }



}
function pricesGuessGraph() {
    pricesGraph();
    for (let i = 0; i < houses.testData.length/(indexMax/10000);i++) {
        let r = map(tprice[i],0,1,0,255);
        let g = map(tprice[i],0,1,255,0);
        let b = 255 - g - r;

        fill(r,g,b,255)
        stroke(0,200);
        strokeWeight(1);
        let x = map(tlon[i],0,zoom,0,wnx);
        let y = map(tlat[i],0,zoom,wny,200);
        ellipse(x+xoff,y+yoff,5,5);
    }



}
function waterGraph() {
    for (let i = 0; i < houses.data.length;i++) {




        if (cs[i] == 1) {
            fill(0,0,255);
        } else if (cs[i] == 0.25) {
            fill(218,117,44)
        } else if (cs[i] == 0.5) {
            fill(49,245,121)
        } else if (cs[i] == 0.75) {
            fill(49,192,245)
        }
        noStroke();
        ellipse(xs[i]+xoff,ys[i]+yoff,1,1);
    }



}
function setup() {
    createCanvas(wnx,wny);
}
let graphFunc = pricesGraph;
function draw() {
    background(65);
    zoom = zoomSlider.value()/10;
    xoff = sliderX.value();
    yoff = sliderY.value();
    plotGraph()
    graphplot.graph();
    if (map_ == true) {

        graphFunc();
    }


}
let tlat = [];
let tlon = [];
let tprice = [];
function test(log) {
    let set = houses;
    let accuracy = 0;

    let sum = 0;

    for (let i = 0; i < set.testData.length/(indexMax/10000); i++) {


        let randomIndex = int(random(0,set.testData.length));

        tlon[i] = set.testData[randomIndex].inputs[0];
        tlat[i] = set.testData[randomIndex].inputs[1];
        let outs = [];
        if (log == true) {
            outs = nn.feedForward(set.testData[randomIndex].inputs, set.testData[randomIndex].target);
        } else {
            outs = nn.feedForwardNoLog(set.testData[randomIndex].inputs);
        }
        tprice[i] = outs[0];
        accuracy = outs[0] - set.testData[randomIndex].target[0];
        if (accuracy < 0) {
            accuracy*=-1;
        }
        sum+=accuracy;
        //console.log(i+" accuracy: " + accuracy);
    }
    let accuracyPercentage = (1 - (sum/(set.testData.length/(indexMax/10000))));
    if (log == true) {
        console.log("      Accuracy: " + round(accuracyPercentage*1000*100)/1000+"%");
    }

    return accuracyPercentage;
}
function train(epoch) {
    let set = houses;

    for (let e = 0; e < epoch; e++) {
        let sum = 0;
        console.log("Epoch :" + (globalEpoch));
        for (let i = 0; i < set.data.length; i++) {
            //console.log(set.data[i])
            nn.backpropagate(set.data[i].inputs,set.data[i].target);
            sum += nn.loss;
        }
        let loss = sum/set.data.length;
        if (e == epoch-1) {
            accuracies.push(test(logs));
        } else {
            accuracies.push(test(false));
        }
        //let ep = globalEpoch+e;

        losses.push(loss);

        globalEpoch++;
    }


}
class DataSet {
    constructor(title) {
        this.data = [];
        this.testData = [];
        this.title = title;
    }
    add(inputs, target) {
        this.data.push(new Data(inputs, target));
    }
    addTest(inputs, target) {
        this.testData.push(new Data(inputs, target));
    }

}


class Data {
    constructor(inputs,target) {
        this.inputs = inputs;
        this.target = target;
    }
}
