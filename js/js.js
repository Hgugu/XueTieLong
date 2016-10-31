/**
 * Created by babby on 2016/9/17.
 */

/*验证*/
$('form').submit(function(){
    var nameVal= $.trim($('#name').val());
    var telReg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
    var telVal= $.trim($('#tel').val());
    if(nameVal=='')
    {
        alert('请输入您的姓名！');
        return false;
    }
    if(!telReg.test(telVal))
    {
        alert("请输入正确的手机号！");
        return false;
    }
});

/*三级联动*/
var selectObj={
    map:new BMap.Map("allmap"),
    local:null,
    province:document.querySelector('#province'),
    city:document.querySelector('#city'),
    dots:document.querySelector('#dots'),
    optionData:function(json,obj){
        var frag=document.createDocumentFragment();//碎片
        for(var i in json)//i是dataCountry数据的属性
        {
            var option=document.createElement("option");//创建option节点
            option.value=i;//将属性i赋值给option的value
            option.innerHTML=i;
            frag.appendChild(option);
        }
        obj.appendChild(frag);
    },
    optionJson:function(json,obj){
        var frag=document.createDocumentFragment();//碎片
        for(var i in json)//i是dataCountry数据的属性
        {
            var option=document.createElement("option");//创建option节点
            option.value=json[i];//将属性i赋值给option的value
            option.innerHTML=json[i];
            frag.appendChild(option);
        }
        obj.appendChild(frag);
    },
    init:function(){
        selectObj.optionData(dataCountry.province,selectObj.province);//初始

        //第一个下拉菜单
        selectObj.province.addEventListener('change',function(){
            var val=$(this).val();

            $(selectObj.city).html('<option value="">请选择城市</option>');
            $(selectObj.city).val("");
            $(selectObj.city).siblings('.i-f-bg').css("color","#929292").text('请选择城市');


            $(selectObj.dots).html('<option value="">请选择网点</option>');
            $(selectObj.dots).val("");
            $(selectObj.dots).siblings('.i-f-bg').css("color","#929292").text('请选择网点');
            if(val=='')
            {
                val='请选择省份';
                $(this).siblings('span').css('color','#929292').text(val);
            }
            else
            {
                $(this).siblings('span').css('color','#000').text(val);
                selectObj.optionJson(dataCountry.province[val],selectObj.city);
            }
        });

        //第二个下拉菜单
        selectObj.city.addEventListener('change',function(){
            var val=$(this).val();

            $(selectObj.dots).html('<option value="">请选择网点</option>');
            $(selectObj.dots).val("");
            $(selectObj.dots).siblings('.i-f-bg').css("color","#929292").text('请选择网点');
            if(val=='')
            {
                val='请选择城市';
                $(this).siblings('span').css('color','#929292').text(val);
            }
            else
            {
                $(this).siblings('span').css('color','#000').text(val);
                selectObj.optionJson(dataCountry.company[val],selectObj.dots);
            }
        });

        //第三个下拉菜单
        selectObj.dots.addEventListener('change',function(){
            var val=$(this).val();

            if(val=='')
            {
                val='请选择网点';
                $(this).siblings('span').css('color','#929292').text(val);

                $('#address,#comTel,#code').val('');
            }
            else
            {
                $(this).siblings('span').css('color','#000').text(val);

                var arr=dataCountry.address[val];
                $('#address').val(arr[0]);
                $('#comTel').val(arr[1]);
                $('#code').val(arr[2]);


                selectObj.map.clearOverlays();
                selectObj.map.centerAndZoom($('#city').val(), 12);//城市
                selectObj.local = new BMap.LocalSearch(selectObj.map, {
                    //renderOptions:{map: selectObj.map}
                    onSearchComplete: function(results) {
                        console.log(results);
                        var rs=results.getPoi(0);
                        if(rs)
                        {
                            //console.log(rs.point.lng,rs.point.lat);
                            var point = new BMap.Point(rs.point.lng,rs.point.lat);
                            selectObj.map.centerAndZoom(point, 12);
                            var marker = new BMap.Marker(point);  // 创建标注
                            selectObj.map.addOverlay(marker);              // 将标注添加到地图中
                            marker.addEventListener("click",getAttr);
                            var opts = {
                                title : val // , 信息窗口标题
                                //enableMessage:true,//设置允许信息窗发送短息
                                //message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
                            };
                            var infoWindow = new BMap.InfoWindow("地址："+arr[0]+"<br />电话："+arr[1], opts);  // 创建信息窗口对象
                            //console.log(arr[0],arr[1],arr[2]);
                            function getAttr(){
                                selectObj.map.openInfoWindow(infoWindow,point); //开启信息窗口
                            }
                        }
                    }
                });
                window.setTimeout(function(){
                    selectObj.local.search(val);
                },800);
            }
        });
    }
};

selectObj.init();