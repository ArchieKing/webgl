(function (){

  var btnArrow = $(".btnArrow");
  var threeBtns = $(".threeBtns");
  var btn1 = $(".btn1");
  var btn2 = $(".btn2");
  var btn3 = $(".btn3");
  var isHide = false;

  var btnRoam = $(".btnRoam");
  var btnAerialView = $(".btnAerialView");
  var btn1F = $(".btn1F");
  var btn2F = $(".btn2F");

  btnArrow.click(function() {
    isHide = !isHide;
    if (isHide) {
      threeBtns.hide();
      btnArrow.css("transform","rotate(180deg)");
    }else {
      threeBtns.show();
      btnArrow.css("transform","rotate(0deg)");
    }
  });

  btn1.click(function() {

    // moveTargetPos = scene.children[0].children[3].position;
    //
    // lookAtPos = scene.position;
    //
    // isChange = true;

    // scene.children[1].visible = true;
    // scene.children[2].visible = false;
    // scene.children[3].visible = false;

    btn1.attr('src',"imgs/btn1_h.png");
    btn2.attr('src',"imgs/btn2_n.png");
    btn3.attr('src',"imgs/btn3.png");
  });

  btn2.click(function() {

    // moveTargetPos = scene.children[0].children[4].position;
    //
    // lookAtPos = scene.children[0].children[3].position;
    //
    // isChange = true;

    // scene.children[1].visible = false;
    // scene.children[2].visible = true;
    // scene.children[3].visible = false;

    btn1.attr('src',"imgs/btn1_n.png");
    btn2.attr('src',"imgs/btn2_h.png");
    btn3.attr('src',"imgs/btn3_n.png");

  });

  btn3.click(function() {

    // moveTargetPos = scene.children[0].children[5].position;
    //
    // lookAtPos = scene.position;
    //
    // isChange = true;

    // scene.children[1].visible = false;
    // scene.children[2].visible = false;
    // scene.children[3].visible = true;

    btn1.attr('src',"imgs/btn1.png");
    btn2.attr('src',"imgs/btn2_n.png");
    btn3.attr('src',"imgs/btn3_h.png");

  });

  btnRoam.click(function(){
    roamOn();

    btnRoam.attr('src',"imgs/roam_h.png");
    btnAerialView.attr('src',"imgs/aerialView.png");
  });

  btnAerialView.click(function(){
    roamOff();

    btnRoam.attr('src',"imgs/roam.png");
    btnAerialView.attr('src',"imgs/aerialView_h.png");
  });

  btn1F.click(function(){
    btn1F.attr('src',"imgs/1F_h.png");
    btn2F.attr('src',"imgs/2F.png");
  });

  btn2F.click(function(){
    btn1F.attr('src',"imgs/1F.png");
    btn2F.attr('src',"imgs/2F_h.png");
  });
})();
