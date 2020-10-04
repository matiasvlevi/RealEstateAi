
let b0 = 0;
let s0 = 0;
let b1 = 0;
let s1 = 0;
function parseFile() {
    let index = 0;

    let biggest = 500001;
    let smallest = 14999;
    let rejects = [291,342,539,564,697,739,1098,1351];
    let file = document.getElementById("csvFile").files[0];
    Papa.parse(file,
    {
    	delimiter: "",	// auto-detect
    	newline: "",	// auto-detect
    	quoteChar: '"',
    	escapeChar: '"',
    	header: false,
    	transformHeader: undefined,
    	dynamicTyping: false,
    	preview: 0,
    	encoding: "",
    	worker: false,
    	comments: false,
    	step: function(results, parser) {

            if (checkValid(index)) {
                //.console.log(index);
                house_pricing_dataset.push(results.data);
                let inputs = [];


                let ran = int(random(0,11));

                inputs.push(map(JSON.parse(results.data[0]),-124,-114,0,1));
                inputs.push(map(JSON.parse(results.data[1]),32.5,42,0,1));
                inputs.push(map(JSON.parse(results.data[2]),1,52,0,1));
                inputs.push(map(JSON.parse(results.data[3]),2,9831.5,0,1));
                inputs.push(map(JSON.parse(results.data[4]),1,1934.20,0,1));
                inputs.push(map(JSON.parse(results.data[5]),3,5354.85,0,1));
                inputs.push(map(JSON.parse(results.data[6]),1,1521.25,0,1));
                inputs.push(map(JSON.parse(results.data[7]),0.5,15,0,1));
                if (results.data[9] == "INLAND") {
                    inputs.push(0.25);
                } else if (results.data[9] == "NEAR BAY") {
                    inputs.push(0.75);
                } else if (results.data[9] == "<1H OCEAN") {
                    inputs.push(0.5);
                } else {
                    inputs.push(1);
                }


                let price = map(JSON.parse(results.data[8]),14999,500001,0,1);

                if (ran == 0) {
                    houses.addTest(inputs,[price]);
                } else if (ran > 0) {
                    houses.add(inputs,[price]);
                }


            } else {
                console.log("invalid");
            }

            index++;
        },
    	complete: function(results, file) {
	        //console.log("Parsing complete:", results, file);
        //    console.log(smallest)
        //    console.log(biggest)


            plotGraph();
            //console.log(b1,s1);
        },
    	error: undefined,
    	download: false,
    	downloadRequestHeaders: undefined,
    	downloadRequestBody: undefined,
    	skipEmptyLines: false,
    	chunk: undefined,
    	chunkSize: undefined,
    	fastMode: undefined,
    	beforeFirstChunk: undefined,
    	withCredentials: undefined,
    	transform: undefined,
    	delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    });

}
function leakyReLU(x) {
    if (x >= 0) {
        return 1*x;
    } else {
        return 0.01*x;
    }

}
function leakyReLU_d(x) {
    if (x >= 0) {
        return 1;
    } else {
        return 0.01;
    }

}
function logReLU(x) {
    if (x >= 0) {
        return 1*x;
    } else {
        return (pow(exp(1),x)-1);
    }

}
function logReLU_d(x) {
    if (x >= 0) {
        return 1;
    } else {
        return pow(exp(1),x);
    }

}
function reLU(x) {
    if (x >= 0) {
        return 2*x;
    } else {
        return 0;
    }

}
function reLU_d(x) {
    if (x >= 0) {
        return 2;
    } else {
        return 0;
    }

}
function sigmoid(x) {
    return 1/(1+exp(-x));
}
function sigmoid_d(x) {
    return x * (1 - x);
}
function checkValid(index) {
    if (index ==291 || index == 342 || index == 539 || index == 564 || index == 697 || index == 739 || index == 1098 || index == 1351 || index == 1457 || index == 1494 || index == 1607 || index == 2029 || index == 2116 || index == 2302 || index == 2324 || index == 2335 || index == 2352 || index == 2413 || index == 2421 || index == 2579 || index == 2609 || index == 2648 || index == 2827 || index == 3025 || index == 3329 ||index == 3355 || index == 3377 || index == 3483 || index == 3486 || index == 3530 || index == 3722 || index == 3779 || index == 3913 ||index == 3922 || index == 3959 || index == 4044 || index == 4047 || index == 4187 || index == 4280 || index == 4310 || index == 4392|| index ==4448||index == 4497 || index == 4592 || index == 4601 || index == 4630||index == 4668 || index == 4692 || index == 4739 || index == 4744 || index == 4745 || index == 4768 || index == 4853 || index == 5060 || index == 5217 || index == 5223 || index == 5237 || index == 5655 || index == 5666 || index == 5679|| index == 5724 || index == 5752 || index == 5991 || index == 6053 || index == 6069 || index == 6221 || index == 6242 || index == 6254 || index == 6299 || index == 6422 || index == 6542 || index == 6591 || index == 6815 || index == 6836 || index == 6963 || index == 7098 || index == 7114 || index == 7169 || index == 7192 || index == 7229 || index == 7317 || index == 7331 || index == 7548|| index == 7655 || index == 7669 || index == 7764 || index == 7807 || index == 8338 || index == 8384 || index == 8531 || index == 8916 || index == 9150 || index == 9572 || index == 9621 || index == 9623 || index == 9815 || index == 9846 || index == 9878 || index == 9943 || index == 9971 || index == 10034 || index == 10217 || index == 10237 || index == 10386 || index == 10390 || index == 10429 || index == 10496 ||index == 10762 || index == 10886 || index == 10916 || index == 11097 || index == 11312 || index == 11352 || index == 11442 || index == 11450 || index == 11513 || index == 11742 || index == 12102 || index == 12415 || index == 12571 || index == 12810 || index == 13016 || index == 13070 || index == 13312 || index == 13333|| index == 13337 || index == 13598 || index == 13657 || index == 13707 || index == 13926 || index == 13933 || index == 13934 || index == 14016 ||index == 14153 || index == 14174 || index == 14308 ||index == 14332 || index ==14387 || index == 14463 || index == 14522 || index == 14642 || index == 14931 || index == 14971 || index == 14987 || index ==15031 ||index == 15061 || index == 15119 || index == 15138 || index == 15389 || index == 15398 || index == 15480 || index ==15608 || index == 15664 || index == 15891 || index == 15976 || index == 16026 || index == 16039 || index == 16105 || index ==16106 || index == 16331 || index == 16758 || index == 16880|| index == 16881 || index == 16886 || index == 17042 || index == 17199 || index == 17203 || index == 17640 || index == 17826 || index == 17841 || index == 17924 || index == 17929 || index == 17974 || index == 18178 || index ==18247 || index == 18262 || index == 18333 || index == 18347 || index == 18467 || index == 18787 || index == 18874 || index == 18915 || index == 19061 || index == 19072 || index == 19123 || index == 19151 || index == 19253 || index == 19333 || index == 19392 || index ==19403 || index == 19486 || index == 19560 || index == 19608 || index == 19639 || index == 19767 || index== 19819 || index == 19834 || index == 19891 || index == 19933 || index == 19960 || index ==20047 || index == 20070 || index == 20126 || index == 20268 || index == 20269 || index == 20373 || index == 20461 || index == 20485 || index == 0 || index == 20641 || index > indexMax) {
        return false;
    } else {
        return true;
    }
}
