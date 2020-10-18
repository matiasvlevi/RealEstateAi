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
let graphFunc = pricesGraph;
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
function preload() {
    //makeDatasets();
    sanFrancisco();
    houses = new DataSet("houses_dataset");
    nn = new Dann(9,1);

    nn.addHiddenLayer(9);
    nn.addHiddenLayer(12);
    nn.addHiddenLayer(12);
    nn.addHiddenLayer(6);

    nn.makeWeights();

    nn.lr = 0.0001;

    nn.log();


    graphplot = new Graph(0,0,600,100);
    graphplot.addValue(losses,color(0,100,255),"loss");
    graphplot.addValue(accuracies,color(200,255,0),"accuracy");
}
function setup() {
    createCanvas(wnx,wny);
}

function draw() {
    background(65);
    if (houses.data.length > 0) {
     train(1,2);
    }
    if (losses.length > 0) {

      //train(1);
      graphFunc = pricesGuessGraph;
    }
    plotGraph();


    if (losses.length > 0) {
     graphplot.update();


    }
    if (map_ == true) {

        graphFunc();
    }



}

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
            outs = nn.feedForward(set.testData[randomIndex].inputs);
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
let trainIndex = 0;
function train(epoch, div) {
    let set = houses;

    for (let e = 0; e < epoch; e++) {
        let sum = 0;

        console.log("Epoch :" + (globalEpoch));
        for (let i = 0; i < set.data.length/div; i++) {
            //console.log(set.data[i].target)
            nn.backpropagate(set.data[trainIndex].inputs,set.data[trainIndex].target);
            sum += nn.loss;
            if (trainIndex >= set.data.length-1) {
              trainIndex = 0;
            } else {
              trainIndex++;
            }

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
