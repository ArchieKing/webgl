/**
 * Created by Archie on 2018/6/3.
 */

/** show
* 0 => only 3d
* 1 => cam + 3d
* 2 => cam + reg + 3d
* default => cam + 3d
 * ѡ����ʾģʽ
 * */
switch (getInfo("show")){
    case "0":
        console.log("3d");
        add3d();
        break;
    case "1":
        console.log("cam 3d");
        addCam3d();
        break;
    case "2":
        console.log("cam reg 3d");
        addCamReg3d();
        break;
    default :
        console.log("3d");
        add3d();
        break;
}

/**
* ��ȡ�û�Id
* */
var modelId = getInfo("modelId");
if (!modelId){
    modelId = "hangkei001";
}

function getInfo(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function add3d(){
    document.write("<script type='text/javascript' src='js/3d/3d.js'></script>");
}

function addCam3d(){
    document.write("<script type='text/javascript' src='js/cam/webar.js'></script>");
    document.write("<script type='text/javascript' src='js/cam/app.js'></script>");
    document.write("<script type='text/javascript' src='js/3d/3d.js'></script>");
}

function addCamReg3d(){
    document.write("<script type='text/javascript' src='js/camreg/CamMgr.js'></script>");
    document.write("<script type='text/javascript' src='js/camreg/ArchieTools.js'></script>");
}
