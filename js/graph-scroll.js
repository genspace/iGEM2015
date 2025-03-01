function graphScroll() {
  var windowHeight,
      dispatch = d3.dispatch("scroll", "active", "fixed", "above", "below"),
      sections = d3.select('null'),
      i = -1,
      sectionPos = [],
      n,
      graph = d3.select('null'),
      isFixed = null,
      isBelow = null,
      isAbove = null,
      container = d3.select('body'),
      containerStart = 0,
      belowStart,
      eventId = Math.random(),
      stickyTop

  function reposition(){
    var i1 = 0
    sectionPos.forEach(function(d, i){
      if (d < pageYOffset - containerStart + 180) i1 = i
    })
    i1 = Math.min(n - 1, i1)
    if (i != i1){
      sections.classed('graph-scroll-active', function(d, i){ return i === i1 })

      dispatch.active(i1, i)

      i = i1
    }

    var isAbove1 = pageYOffset < containerStart
    if (isAbove != isAbove1){
      isAbove = isAbove1
      graph.classed('graph-scroll-above', isAbove)
      if(isAbove) dispatch.above(i1)
    }
    var isBelow1 = pageYOffset > belowStart
    if (isBelow != isBelow1){
      isBelow = isBelow1
      graph.classed('graph-scroll-below', isBelow)
      if(isBelow) dispatch.below(i1)
    }
    var isFixed1 = !isBelow && pageYOffset > containerStart+stickyTop
    if (isFixed != isFixed1){
      isFixed = isFixed1
      graph.classed('graph-scroll-fixed', isFixed)
      if(isFixed) dispatch.fixed(i1)
    }

    if (stickyTop){
      graph.style('padding-top', (isBelow || isFixed ? stickyTop : 0)+ 'px')
    }
  }

   function resize(){
    sectionPos = []
    var startPos
    sections.each(function(d, i){
      if (!i) startPos = this.getBoundingClientRect().top
      sectionPos.push(this.getBoundingClientRect().top -  startPos) })

    var containerBB = container.node().getBoundingClientRect()
    var graphBB = graph.node().getBoundingClientRect()

    containerStart = containerBB.top + pageYOffset
    belowStart = containerBB.bottom - graphBB.height  + pageYOffset
  }

  function keydown() {
    if (!isFixed) return
    var delta
    switch (d3.event.keyCode) {
      case 39: // right arrow
      if (d3.event.metaKey) return
      case 40: // down arrow
      case 34: // page down
      delta = d3.event.metaKey ? Infinity : 1 ;break
      case 37: // left arrow
      if (d3.event.metaKey) return
      case 38: // up arrow
      case 33: // page up
      delta = d3.event.metaKey ? -Infinity : -1 ;break
      case 32: // space
      delta = d3.event.shiftKey ? -1 : 1
      ;break
      default: return
    }

    var i1 = Math.max(0, Math.min(i + delta, n - 1))
    rv.scrollTo(i1)

    d3.event.preventDefault()
  }


  var rv ={}

  rv.scrollTo = function(_x){
    if (isNaN(_x)) return rv

    d3.select(document.documentElement)
        .interrupt()
      .transition()
        .duration(500)
        .tween("scroll", function() {
          var i = d3.interpolateNumber(pageYOffset, sectionPos[_x] + containerStart+(stickyTop?-stickyTop:0))
          return function(t) { scrollTo(0, i(t)) }
        })
    return rv
  }


  rv.container = function(_x){
    if (!_x) return container

    container = _x
    return rv
  }

  rv.graph = function(_x){
    if (!_x) return graph

    graph = _x
    return rv
  }

  rv.eventId = function(_x){
    if (!_x) return eventId

    eventId = _x
    return rv
  }

  rv.stickyTop = function(_x){
    if (!_x) return stickyTop

    stickyTop = _x
    return rv
  }

  rv.sections = function (_x){
    if (!_x) return sections

    sections = _x
    n = sections.size()

    d3.select(window)
        .on('scroll.gscroll'  + eventId, reposition)
        .on('resize.gscroll'  + eventId, resize)
        .on('keydown.gscroll' + eventId, keydown)

    resize()
    d3.timer(function() {
      reposition()
      return true
    })

    return rv
  }

  d3.rebind(rv, dispatch, "on")

  return rv
}