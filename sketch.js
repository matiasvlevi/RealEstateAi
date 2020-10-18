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
        train(1,2);
    }
    if (losses.length > 0) {
        train(1,2);
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
function train(epoch) {
    let set = houses;

    for (let e = 0; e < epoch; e++) {
        let sum = 0;

        console.log("Epoch :" + (globalEpoch));
        for (let i = 0; i < set.data.length; i++) {
            //console.log(set.data[i].target)
            nn.backpropagate(set.data[trainIndex].inputs,set.data[trainIndex].target);


            if (trainIndex >= set.data.length-1) {
              trainIndex = 0;
            } else {
              trainIndex++;
            }
            losses.push(nn.loss);
        }

        if (e == epoch-1) {
            let result = test(logs);
            for (let i =0;i<set.data.length;i++){
                accuracies.push(result);
            }

        } else {
            accuracies.push(test(false));
        }
        //let ep = globalEpoch+e;



        globalEpoch++;


    }


}
