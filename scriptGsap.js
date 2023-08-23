// console.log("Hello Shabaaz");

var tl = gsap.timeline();


tl.from(".navbar",{
    opacity:0,
    duration:0.7,
    width:0

})



tl.from(".navbar .logo,.navbar ul,.navbar .nav-form",{
    y: -80,
    opacity: 0,
    duration: 1,
    stagger:0.3
})



gsap.from(".sideelements ul li",{
    x:-100,
    opacity: 0,
    duration: 1,
    stagger:0.1

})

tl.from(".navbar img",{
    rotate:360,
    duration:2,
})
