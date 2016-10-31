/**
 * Created by babby on 2016/9/14.
 */
function fontAuto(width){
    var winW=document.documentElement.clientWidth;
    if(winW>=width)//当屏幕宽度大于或等于ps里的实际宽度
    {
        document.documentElement.style.fontSize="625%";
    }
    else{//当屏幕宽度小于ps里的实际宽度
        document.documentElement.style.fontSize=(winW/width*625)+"%";
    }
}
fontAuto(640);

window.onresize=function(){//旋转屏幕
    fontAuto(640);
};