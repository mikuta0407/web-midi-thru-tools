var midiDevices = {
    inputs: {},
    outputs: {}
};
var midiout = null;
var midiin = null;
var velocity = 0;
var isMidiMute = false;
var isVelFix = false;
var isChCovnert = false;
var isSendCC = true;

var key = 0; //mikuta0407 created
var oct = 0;

var keyarr =["C","C♯/D♭","D","D♯/E♭","E","F","F♯/G♭","G","G♯/A♭","A","A♯/B♭","B","C","C♯/D♭","D","D♯/E♭","E","F","F♯/G♭","G","G♯/A♭","A","A♯/B♭","B","C"]; //mikuta0407 created

//mikuta0407 edited
function inputEvent(e) {

    var target = e.target;
    
    var device = midiDevices.inputs[target.name];

       
    var numArray = [];
    
    if (device != midiin)
    {
        console.log("not selected");
        return; /* not selected device. throw away data  */
    }

    // to hex
    event.data.forEach(function (val) {
        numArray.push(val);
    });

    //console.log(device);
    //console.log(midiin);

    /*
    Send([Status Byte(128,144,176,etc...), Data Byte 1(Pitch, etc...), Data Byte 2(Velocity, value, etc...)]);
    */

    //CC
    if (numArray[0] >= 176) {
        if (isSendCC) {
            if (isChCovnert){
                numArray[0] = 176 + parseInt(document.getElementById("chconvertto").value);
            }
            Send([numArray[0], document.getElementById("ccmode").value, numArray[2]]);
        }

    //Note
    } else {
        //Channel
        console.log(isChCovnert);
        if (isChCovnert){
            //Off: 128~143
            if (numArray[0] <= 143){
                numArray[0] = 128 + parseInt(document.getElementById("chconvertto").value);
            }
            //On: 144~159
            else {
                numArray[0] = 144 + parseInt(document.getElementById("chconvertto").value);
            }
        }
    
        //Octave + Transpose
        numArray[1] += oct * 12 + key;

        //Transpose
        //numArray[1] += key;

        //Fix Velocity
        if (isVelFix){
            numArray[2] = velocity;
        }
        
    
        if (isMidiMute != true)
        {
            //console.log("selected");
            // output to midi sequencer
            //document.getElementById("synth").send(numArray);
            console.log(numArray);

            //Midi out
            Send([numArray[0], numArray[1], numArray[2]]);
        }
    }

    // output monitor
    in_inputMonitor(numArray);
}

function ecb(e) {
    //console.log(e);
}

function scb(midiaccess) {
    var inputs = midiaccess.inputs.values();
    var j = 0;
    
    for (var init = inputs.next(); !init.done; init = inputs.next()) {
        var value = init.value;
        document.getElementById("midiin").options[j++] = new Option(init.value.name);
        midiDevices.inputs[value.name] = value;
        value.addEventListener('midimessage', inputEvent, false);
        midiin = midiDevices.inputs[value.name];
    }
    //console.log("init");
    //console.log(midiin);
    

    var i = 0;
   
    var outputs = midiaccess.outputs.values();
    for (var outit = outputs.next(); !outit.done; outit = outputs.next()) {
        var value = outit.value;
        document.getElementById("midiout").options[i++] = new Option(outit.value.name);
        midiDevices.outputs[value.name] = value;
        midiout = midiDevices.outputs[value.name];
    }
    
}

function Init(mode) {

    console.log("Hello");

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: true
        }).then(scb, ecb);
    }else{
        ecb();
    }

    velocity = 64;
    
    document.getElementById("midiout").addEventListener("change", function (e) {
        var obj = document.getElementById("midiout");
        var idx = obj.selectedIndex;
        var val = obj.options[idx].value;
        midiout = midiDevices.outputs[val];
        //console.log(midiDevices.outputs);
        //console.log(val);
    });
    document.getElementById("midiin").addEventListener("change", function (e) {
        var obj = document.getElementById("midiin");
        var idx = obj.selectedIndex;
        var val = obj.options[idx].value;
        midiin = midiDevices.inputs[val];
        //console.log(midiin);
    });
    document.getElementById("inputMIDIMuteToggle").addEventListener("change", function (e) {
        isMidiMute = Boolean(document.getElementById("inputMIDIMuteToggle").checked);
    });

    document.getElementById("inputVelocityFixToggle").addEventListener("change", function (e) {
        isVelFix = Boolean(document.getElementById("inputVelocityFixToggle").checked);
    });

    document.getElementById("chconvert").addEventListener("change", function (e) {
        isChCovnert = Boolean(document.getElementById("chconvert").checked);
    });

    document.getElementById("sendcc").addEventListener("change", function (e) {
        isSendCC = Boolean(document.getElementById("chconvert").checked);
    });

    document.getElementById("velocityNum").addEventListener("change", function (e) {
        velocity = parseInt(document.getElementById("velocityNum").value);
    });

    if (mode == "keyboard"){
        document.getElementById("keyboard").addEventListener("change", function (e) {
            e.note[1] += key; //スクリーンキーボード用トランスポーズ
            //console.log(e.note);
            //0: NoteOn/NoteOff 1: Note
            Send([0x90, e.note[1], e.note[0] ? velocity : 0]);
        });
    }
    
    //document.getElementById("prog").addEventListener("change", function (e) {
    //    Send([0xc0, e.target.value]);
    //});

    document.getElementById("progselector").addEventListener("change", function (e) {

        if (isChCovnert){
            var ch = 192 + parseInt(document.getElementById("chconvertto").value);
        } else {
            var ch = 192;
        }
        Send([ch, document.getElementById("progselector").value - 1]);
    });

    document.getElementById("volume").addEventListener("change", function (e) {
        Send([0xb0, 7, e.target.value]);
    });
}

function in_inputMonitor(mess) {

    for (var i = 0; i < mess.length; i++) {
        document.getElementById("inmonitor").value += mess[i].toString(16);
        document.getElementById("inmonitor").value += " ";
    }
    document.getElementById("inmonitor").value += "\n";

    var obj = document.getElementById("inmonitor");
    obj.scrollTop = obj.scrollHeight;
}

function out_outputMonitor(mess) {

    for (var i = 0; i < mess.length; i++) {
        document.getElementById("outmonitor").value += mess[i].toString(16);
        document.getElementById("outmonitor").value += " ";
    }
    document.getElementById("outmonitor").value += "\n";

    var obj = document.getElementById("outmonitor");
    obj.scrollTop = obj.scrollHeight;
}

function Send(mess) {

    //console.log(mess);
   
    // output to midi device
    if(midiout)
    {
        midiout.send(mess);
    }
    
    // output to midi sequencer
    document.getElementById("synth").send(mess);
    
    out_outputMonitor(mess);
}

function sendSysEx()
{
    var inputStr = document.getElementById("sysExInputArea").value.split(' ');
    var inputNumArray = [inputStr.length];
    for (var i = 0; i < inputStr.length; i++)
    {
        inputNumArray[i] = parseInt(inputStr[i], 16);
    }

    Send(inputNumArray);
}

//mikuta0407 created
function transpose(keyfrombutton)
{
    key = keyfrombutton;
    document.getElementById("nowkey").innerHTML = "Now key : <b>" + key + ", " + keyarr[key + 12]+"</b>";
}

function octave(octfrombutton){
    if (octfrombutton == 0){
        oct = 0;
    } else {
        oct += parseInt(octfrombutton);
    }
    document.getElementById("nowoctave").innerHTML = `Now oct : <b>${oct}</b>`;
}

//mikuta0407 created
function gm1systemon(){
    Send([0xF0,0x7E,0x7F,0x09,0x01,0xF7]);
}

//mikuta0407 created
function gsreset(){
    Send([0xF0,0x41,0x10,0x42,0x12,0x40,0x00,0x7F,0x00,0x41,0xF7])
}

function xgsystemon(){
    Send([0xF0,0x43,0x10,0x4C,0x00,0x00,0x7E,0x00,0xF7]);
}