d3.selectAll('.dropdown')
  .on('mouseover',function(){ this.classList.add('expand') })
  .on('mouseout',function(){ this.classList.remove('expand') })

var map = d3.select('#map')
var img = d3.select('#mapimg')
var content = d3.select('#content')
size()
function size () {
  img.style({
    width:window.innerWidth+'px',
  })
  content.style({
    height:img.node().getBoundingClientRect().height,
  })
}

d3.select(window).on('resize.index',size)