var $choice = $(".choice");
var $scan = $(".scan");
var $aicq = $(".aicq");
var $share = $(".share");
var $contact = $(".contact");
var isInit = false;

$scan.hide();
$aicq.hide();
$share.hide();
$contact.hide();

$("#btnScan").click(function () {
    $choice.hide();
    $scan.show();
    // isStartReg = true;

    openCam();
});

$("#btn3D").click(function () {
    $choice.hide();
    $aicq.show();

    scene.visible = true;
    if (!isInit) {
        loadObject("res/"+cardId+".fbx");
        render();
    }
});

// $(".scan-icon").click(function () {
//     $scan.hide();
//     $aicq.show();
// });

$(".scan .back-btn").click(function () {
    $scan.hide();
    $choice.show();
});

$(".aicq .back-btn").click(function () {
    scene.visible = false;
    isStartReg = false;
    $aicq.hide();
    $choice.show();
});

$(".top-btn1").click(function () {
    // $aicq.hide();
    // $contact.show();
});

$(".top-btn2").click(function () {
    $aicq.hide();
    $contact.show();
});

$(".top-btn3").click(function () {
    $aicq.hide();
    $share.show();
});

$(".contact .back-btn").click(function () {
    $contact.hide();
    $aicq.show();
});

$(".share .back-btn").click(function () {
    $share.hide();
    $aicq.show();
});

// $(".login-btn").click(function () {
//     window.location.href = "https://www.baidu.com/";
// });