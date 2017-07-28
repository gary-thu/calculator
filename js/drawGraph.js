var sin=Math.sin;
var cos=Math.cos;
var tan=Math.tan;
var cot=Math.cot;
var sec=Math.sec;
var csc=Math.csc;
var ceil=Math.ceil;
var exp=Math.exp;
var floor=Math.floor;
var log=Math.log;
var max=Math.max;
var min=Math.min;
var pow=Math.pow;
var random=Math.random;
var round=Math.round;
var sqrt=Math.sqrt;

function Graph(from, to, step) {
  this.from = from;
  this.to = to;
  this.step = step;
  this.plotsList = [];

  this.curve = function(code) {
    var plots = [];
    for (var x = this.from; x < this.to; x += this.step)
        plots.push([x, eval(code)]);
    return plots;
  }

  this.paint = function(codeList) {
    var size=this.plotsList.length;
    for (var i=0; i<codeList.length; i++)
        this.plotsList[size+i] = this.curve(codeList[i]);
    return this.plotsList;    
  }

  return this;
}

function draw(target, codeList, from, to, step) {
  var g = new Graph(from, to, step);
  $.plot($(target), g.paint(codeList));
  return g;
}

function drawGraph() {
    var from = eval($("#from").val());
    var to   = eval($("#to").val());
    var step = eval($("#step").val());
    var codeList = $("#shell").val().split("\n");
    return draw("#output3", codeList, from, to, step);
}

function keyEnter(event) {
  console.log('124') 
  if (event.which == 13) {
//     event.preventDefault();
     drawGraph();
  }
}
    console.log('1234')
$(drawGraph);
$("#shell").keypress(keyEnter);
$("#from").keypress(keyEnter);
$("#to").keypress(keyEnter);
$("#step").keypress(keyEnter);