$(function() {
	var sheng_name = ''
	var shi_name = ''
	var xian_name = ''
	// AJAX.weather(sheng_name,shi_name)
	// console.log(provinces)
	if($("#search").val()==''){
		sheng_name = '辽宁'
		shi_name = '盘锦市'
		xian_name = ''
		AJAX.weather(sheng_name,shi_name)
	}
	$("#search").on('change',function(){
		var districtName = $("#search").val()
		for(var i = 0 ; i < provinces.length ; i ++ ){
			if(provinces[i].name.indexOf(districtName)!=-1){
				$(".area_p").text(provinces[i].name)
				if(provinces[i].name.indexOf('市')!=-1||provinces[i].name.indexOf('省')!=-1){
					sheng_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
					shi_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
				}else{
					sheng_name = provinces[i].name
					shi_name = provinces[i].name
				}
				xian_name = ''
			}else{
				for(var j = 0 ; j < provinces[i]['city'].length ; j ++ ){
					if(provinces[i]['city'][j]['name'].indexOf(districtName)!=-1){
						$(".area_p").text(provinces[i].name+" "+provinces[i]['city'][j]['name'])
						if(provinces[i]['city'][j]['name'].indexOf('地区')!=-1){
							// console.log(provinces[i]['city'][j]['name'])
							 shi_name = provinces[i]['city'][j]['name'].substring(0,provinces[i]['city'][j]['name'].length-2)
							 if(provinces[i].name.indexOf('市')!=-1||provinces[i].name.indexOf('省')!=-1){
							 	sheng_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
							 }else{
								 sheng_name = provinces[i].name
							 }
						}else{
							shi_name = provinces[i]['city'][j]['name']
							if(provinces[i].name.indexOf('市')!=-1||provinces[i].name.indexOf('省')!=-1){
								sheng_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
							}else{
								 sheng_name = provinces[i].name
							}
						}
						console.log(provinces[i]['city'][j]['name'])
						xian_name = ''
					}else{
						for(var k = 0 ; k < provinces[i]['city'][j]['districtAndCounty'].length ; k ++ ){
							if(provinces[i]['city'][j]['districtAndCounty'][k].indexOf(districtName)!=-1){
								$(".area_p").text(provinces[i]['city'][j]['name']+" "+provinces[i]['city'][j]['districtAndCounty'][k])
								 xian_name = (provinces[i]['city'][j]['districtAndCounty'][k]).substring(0,provinces[i]['city'][j]['districtAndCounty'][k].length-1)
								if(provinces[i]['city'][j]['name'].indexOf('地区')!=-1){
									// console.log(provinces[i]['city'][j]['name'])
									 shi_name = provinces[i]['city'][j]['name'].substring(0,provinces[i]['city'][j]['name'].length-2)
									 if(provinces[i].name.indexOf('市')!=-1||provinces[i].name.indexOf('省')!=-1){
									 	sheng_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
									 }else{
										 sheng_name = provinces[i].name
									 }
								}else{
									shi_name = provinces[i]['city'][j]['name']
									if(provinces[i].name.indexOf('市')!=-1||provinces[i].name.indexOf('省')!=-1){
										sheng_name = (provinces[i].name).substring(0,provinces[i].name.length-1)
									}else{
										 sheng_name = provinces[i].name
									}
								}
							}
						}
					}
				}
			}
		}
		console.log(xian_name)
		if($(".area_p").text().indexOf("省")!=-1&&$(".area_p").text().length<5){
			$(".inputtip").show()
			$(".inputtip").text("抱歉未找到相关位置")
		}else{
			$(".inputtip").hide()
			AJAX.weather(sheng_name,shi_name,xian_name)
		}
		
	})
	
	ECHART.wea_echart()
})

var AJAX = {
	weather:function(sheng_name,shi_name,xian_name){
		$.ajax({
			type: 'get',
			// url: 'https://wis.qq.com/weather/common?source=xw&refer=h5&province=' + sheng_name + '&city=' + shi_name +'&county=&weather_type=observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise&callback=reqwest_1660989549854',
			url: 'https://wis.qq.com/weather/common',
			type: 'get',
			async: false,
			dataType: "jsonp",//向Ajax发送jsonp请求，会自动的创建js 解决跨域问题
			data: {
				source: 'xw',
				refer: 'h5',
				weather_type: 'observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise|air',
				province: sheng_name,
				city: shi_name,
				county: xian_name,
				// callback: 'reqwest_1660989549854'（可不传）
			},
			success:function(res){
				console.log(res)
				var resout = res
				console.log(JSON.stringify(resout.data.forecast_1h))
				$(".tem_num").text(res.data.observe.degree+'°')
				$(".tem_name").text(res.data.observe.weather)
				$(".tem_qualitytext").text(res.data.air.aqi+" "+res.data.air.aqi_name)
				// console.log(res.data.air.aqi+" "+res.data.air.aqi_name)
				for(var i = 0 ; i <weather_num.length ; i ++ ){
					if(res.data.air.aqi_name==weather_num[i].name){
						$(".tem_qualitytext").css({
							"background-color":weather_num[i].color
						})
						// ***修改伪类的style 样式的方法
						$(".tem_qualitytext").append('<style>.tem_qualitytext::before{background-image:url(https://mat1.gtimg.com/qqcdn/tupload/1630660670'+weather_num[i].code+'.png)}')
					}
				}
				$(".tem_qualitytext").mouseover(function(){
					$(".air_table").children().remove()
					var table_div = `
						<div class="air_tabletip_"></div>
						<div class="air_tabletip">空气质量指数${res.data.air.aqi} ${res.data.air.aqi_name}</div>
						<div class="air_tabledetail">
							<table class="air_tdinner" cellspacing="0">
								<tr class="air_tr">
									<td class="air_td">
										<div class="air_p">${res.data.air['pm2.5']}</div>
										<div class="air_p1">PM2.5</div>
									</td>
									<td class="air_td">
										<div class="air_p">${res.data.air['pm10']}</div>
										<div class="air_p1">PM10</div>
									</td>
									<td class="air_td">
										<div class="air_p">${res.data.air['so2']}</div>
										<div class="air_p1">SO2</div>
									</td>
								</tr>
								<tr class="air_tr">
									<td class="air_td">
										<div class="air_p">${res.data.air['no2']}</div>
										<div class="air_p1">NO2</div>
									</td>
									<td class="air_td">
										<div class="air_p">${res.data.air['o3']}</div>
										<div class="air_p1">O3</div>
									</td>
									<td class="air_td">
										<div class="air_p">${res.data.air['co']}</div>
										<div class="air_p1">CO</div>
									</td>
								</tr>
							</table>
						</div>
					`
					$(".air_table").append(table_div)
					var ba_color = $(".tem_qualitytext").css("background-color")
					$(".air_tabletip_").css("border-bottom-color",ba_color)
					$(".air_tabletip").css("background-color",ba_color)
					$(".air_table").show()
				})
				$(".tem_qualitytext").mouseout(function(){
					$(".air_table").hide()
				})
				
				var alarmarr = []
				$(".warmming").children().remove()
				for(var i in res.data.alarm){//预警部分
					alarmarr.push(i)
					var warmmtext = `
					<div class="ws" >
						<div class="singwarm"  data-num="${i}">${res.data.alarm[i]['type_name'] }预警</div>
						<div class="warmtext">
						<div class="warmtext_top"></div>
							<div class="warm_tip">${res.data.alarm[i]['type_name']+res.data.alarm[i]['level_name']}预警</div>
							<div class="warm_detail">${res.data.alarm[i]['detail']}</div>
						</div>
					</div>
					`
					$(".warmming").append(warmmtext)
					
					for(var j = 0 ; j < alarm_color.length ; j ++ ){
						if(res.data.alarm[i]['level_name']==alarm_color[j].name){
							$(".singwarm").eq(i).css({
								"background-color":alarm_color[j].color,
							})
							$(".warm_tip").eq(i).css({
								"background-color":alarm_color[j].color,
							})
							$(".warmtext_top").eq(i).css("border-bottom-color",alarm_color[j].color)
							
						}
					}
				}
				$(".singwarm").mouseenter(function(){
					var num = $(this).data("num")
					$(".warmtext").eq(num).show()
				})
				$(".singwarm").mouseleave(function(){
					$(".warmtext").hide()
				})
				for(var i = 0 ; i < wind_dd.length ; i ++ ){//风部分
					if(res.data.observe.wind_direction==wind_dd[i].code){
						$(".txt").first().text(wind_dd[i].name+'风'+res.data.observe.wind_power+'级')
						$(".other_item:first .icon_pic").css("background","url(https://mat1.gtimg.com/qqcdn/tupload/163066067"+wind_dd[i].code_pic+".png)")
					}
				}
				
				$(".txt").eq(1).text('湿度'+res.data.observe.humidity+'%')
				$(".txt").eq(2).text('气压'+res.data.observe.pressure+'hPa')
				var otherdiv = `
					<p class="other_item" style="margin-left:">
						<i class="icon_pic" id="car_num"></i>
						<span class="txt">限行${res.data.limit['tail_number']}</span>
					</p>
				`
				if(res.data.limit['tail_number']!=""){
					$(".other_item").eq(3).remove()
					$(".real_temother").append(otherdiv)
				}
				
				var clicknum = 0 //tips部分
				var rainer = []
				for(var i in res.data.tips.observe){
					rainer.push(res.data.tips.observe[i])
				}
				for(var i in res.data.tips.forecast_24h){
					rainer.push(res.data.tips.forecast_24h[i]) 
				}
				console.log(rainer)
				$(".texttips").text(rainer[0])
				$("#tips_btn").click(function(){
					clicknum ++ 
					if(clicknum>rainer.length-1){
						clicknum=0
						$(".texttips").text(rainer[clicknum])
						// console.log(clicknum)
					}else{
						$(".texttips").text(rainer[clicknum])
						// console.log(clicknum)
					}
				})
				var dntime = res.data.observe.update_time
				// console.log(dntime.substring(8,10))
				if(dntime.substring(8,10)>res.data.rise[0].sunset||dntime.substring(8,10)<res.data.rise[0].sunrise){
					$(".bigger_icon img").attr("src",'https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/currentweather/night/'+res.data.observe.weather_code+'.png')
				}else{
					$(".bigger_icon img").attr("src",'https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/currentweather/day/'+res.data.observe.weather_code+'.png')
				}
				//逐小时部分
				DIV.hour(resout)
				$("#hourarrow_right").click(function(){
					var left_distance = $(".hour_wea").css("left")
					if(left_distance=='0px'){
						$(".hour_wea").animate({
							"left":'-1100px'
						},1000)
					}else{
						$(".hour_wea").animate({
							"left":'-1400px'
						},1000)
					}
				})
				$("#hourarrow_left").click(function(){
					var left_distance = $(".hour_wea").css("left")
					console.log(left_distance)
					if(left_distance=='-1400px'){
						$(".hour_wea").animate({
							"left":'-1100px'
						},1000)
					}else{
						$(".hour_wea").animate({
							"left":'0px'
						},1000)
					}
				})
				//七日天气预报
				DIV.sevenWeather(resout)
				//生活指数
				DIV.life(resout)
				
			}	
		})
	}
}
var DIV = {
	hour:function(resout){
		$(".hour_detailed").children().remove()
		var inhourarr = []
		var newhour = []
		for(var i in resout.data.forecast_1h){
			if(i<24){//只要24小时数据
				newhour.push(resout.data.forecast_1h[i])
			}
		}
		var inum = 0
		var inum_ = 0
		var objnew = {}
		var objnew_ = {}
		for(var i = 0 ; i < newhour.length ; i ++ ){
			for(var j in resout.data.rise){
				var risetime = resout.data.rise[j]['time']
				var sunrise = risetime+(resout.data.rise[j]['sunrise']).substring(0,2)+(resout.data.rise[j]['sunrise']).substring(3,5)+'00'
				var sunset = risetime+(resout.data.rise[j]['sunset']).substring(0,2)+(resout.data.rise[j]['sunset']).substring(3,5)+'00'
				var obj1h = {}
				var obj1h_ = {}
				if((i+1)<newhour.length){
					if(sunrise>newhour[i]['update_time']&&sunrise<newhour[i+1]['update_time']){
						obj1h['update_time'] = resout.data.rise[j]['time']+(resout.data.rise[j]['sunrise']).substring(0,2)+':'+(resout.data.rise[j]['sunrise']).substring(3,5)
						obj1h['degree'] = '日出'
						obj1h['weather_code'] = 'rise'
						objnew=obj1h
						inum = i
					}
				}
				if((i+1)<newhour.length){
					if(sunset>newhour[i]['update_time']&&sunset<newhour[i+1]['update_time']){
						console.log((resout.data.rise[j]['sunset']).substring(0,3))
						obj1h_['update_time'] = resout.data.rise[j]['time']+(resout.data.rise[j]['sunset']).substring(0,2)+":"+(resout.data.rise[j]['sunset']).substring(3,5)
						obj1h_['degree'] = '日落'
						obj1h_['weather_code'] = 'set'
						objnew_=obj1h_
						inum_ = i
					}
				}
			}
		}
		newhour.splice(inum+1,0,objnew)
		newhour.splice(inum_+1,0,objnew_)
		for(var i = 0 ; i < newhour.length ; i ++ ){
			// console.log(newhour[i]['update_time'])
			if(newhour[i]['update_time'].substring(8,10)>resout.data.rise[0].sunset||newhour[i]['update_time'].substring(8,10)<resout.data.rise[0].sunrise){
				var hour=`
					<div class="hour_wea">
						<div class="hour_time">${newhour[i]['update_time'].substring(8,10)+":"+newhour[i]['update_time'].substring(11,13)}</div>
						<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/night/${newhour[i]['weather_code']}.png" class="icon"/>
						<div class="hour_tem">${newhour[i]['degree']}°</div>
					</div>
				`
			}else{
				var hour=`
					<div class="hour_wea">
						<div class="hour_time">${newhour[i]['update_time'].substring(8,10)+":"+newhour[i]['update_time'].substring(11,13)}</div>
						<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/day/${newhour[i]['weather_code']}.png" class="icon"/>
						<div class="hour_tem">${newhour[i]['degree']}°</div>
					</div>
				`
			}
			if(newhour[i]['degree']=='日出'||newhour[i]['degree']=='日落'){
				if(newhour[i]['update_time'].substring(8,10)>resout.data.rise[0].sunset||newhour[i]['update_time'].substring(8,10)<resout.data.rise[0].sunrise){
					var hour=`
						<div class="hour_wea">
							<div class="hour_time">${newhour[i]['update_time'].substring(8,10)+":"+newhour[i]['update_time'].substring(11,13)}</div>
							<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/${newhour[i]['weather_code']}.png" class="icon"/>
							<div class="hour_tem">${newhour[i]['degree']}</div>
						</div>
					`
				}else{
					var hour=`
						<div class="hour_wea">
							<div class="hour_time">${newhour[i]['update_time'].substring(8,10)+":"+newhour[i]['update_time'].substring(11,13)}</div>
							<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/${newhour[i]['weather_code']}.png" class="icon"/>
							<div class="hour_tem">${newhour[i]['degree']}</div>
						</div>
					`
				}
			}
			$(".hour_detailed").append(hour)
		}
		console.log(newhour)
	},
	sevenWeather:function(resout){
		var dayname = ["昨天","今天","明天","后天"]
		dayname.push()
		var data1 = []
		var data2 = []
		$(".seven_detailed ul").children().remove()
		for(var i in resout.data.forecast_24h){
			if(i > 3 ){
				dayname.push(new Date(resout.data.forecast_24h[i]['time']).getDay())
			}
			for(var j = 0 ; j < dataname.length ; j ++ ){
				if(dataname[j].code==dayname[i]){
					dayname[i] = dataname[j].name
				}
			}
			console.log(dayname)
			var sevenday = `
			<li class="sevenli">
				<div class="sevenday">${dayname[i]}</div>
				<div class="sevendata">${resout.data.forecast_24h[i]['time'].substring(5,7)}月${resout.data.forecast_24h[i]['time'].substring(8,10)}日</div>
				<div class="seven_amwea">
					<div class="amweatext">${resout.data.forecast_24h[i]['day_weather']}</div>
					<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/day/${resout.data.forecast_24h[i]['day_weather_code']}.png" class="icon"/>
				</div>
				<div class="night">
					<img src="https://mat1.gtimg.com/pingjs/ext2020/weather/pc/icon/weather/night/${resout.data.forecast_24h[i]['night_weather_code']}.png" class="icon"/><br/>
					<p class="amweatext">${resout.data.forecast_24h[i]['night_weather']}</p>
				</div>
				<div class="sevenwind">${resout.data.forecast_24h[i]['night_wind_direction']} ${resout.data.forecast_24h[i]['day_wind_power']}级</div>
			</li>
			`
			$(".seven_detailed ul").append(sevenday)
			data1.push(resout.data.forecast_24h[i]['max_degree'])
			data2.push(resout.data.forecast_24h[i]['min_degree'])
		}
		ECHART.wea_echart(data1,data2)
	},
	life:function(resout){
		for(var i = 0 ; i < lifearr.length ; i ++ ){
			var life_div=`
			<li class="life_li">
				<div class="life_icon">
					<div class="life_pic"></div>
					<div class="life_text">${resout.data.index[lifearr[i]['name']].name+" "+ resout.data.index[lifearr[i]['name']].info}</div>
				</div>
				<div class="life_tips">
					<div class="life_tipstext">${resout.data.index[lifearr[i]['name']].detail}</div>
				</div>
			</li>
			`
			$(".life_ul").append(life_div)
			$(".life_pic").eq(i).css("background","url(https://mat1.gtimg.com/qqcdn/tupload/163066066"+lifearr[i].code+".png)")
		}
		$("#life_left").click(function(){
			$(".life_ul").animate({
				"left":"0px"
			},1000)
		})
		$("#life_right").click(function(){
			$(".life_ul").animate({
				"left":"-440px"
			},1000)
		})
	}
}
var lifearr = [{
		"name":"clothes",
		"code":"6213"
	},{
		"name":"umbrella",
		"code":"8580"
	},{
		"name":"fish",
		"code":"6695"
	},{
		"name":"tourism",
		"code":"7732"
	},{
		"name":"cold",
		"code":"6965"
	},{
		"name":"carwash",
		"code":"8362"
	},{
		"name":"dry",
		"code":"7497"
	},{
		"name":"diffusion",
		"code":"8064"
	},{
		"name":"sports",
		"code":"8568"
	},{
		"name":"sunscreen",
		"code":"6730"
	},{
		"name":"comfort",
		"code":"7831"
	},{
		"name":"drying",
		"code":"7594"
	}]
var dataname = [{
		"name":"周日",
		"code":0
	},{
		"name":"周一",
		"code":1
	},{
		"name":"周二",
		"code":2
	},{
		"name":"周三",
		"code":3
	},{
		"name":"周四",
		"code":4
	},{
		"name":"周五",
		"code":5
	},{
		"name":"周六",
		"code":6
	}]
var weather_num = [{
		"name":"优",
		"color":"#a3d765",
		"code":'276'
	},{
		"name":"良",
		"color":"#f0cc35",
		"code":'304'
	},{
		"name":"轻度污染",
		"color":"#f1ab62",
		"code":'499'
	},{
		"name":"重度污染",
		"color":"#ff0000",
		"code":'499'
	}]
var alarm_color = [{
		"name":"橙色",
		"color":"#ec807c"
	},{
		"name":"黄色",
		"color":"#f5d271"
	},{
		"name":"蓝色",
		"color":"#86c5f7"
	}]	
var wind_dd = [{
	"name":'北',
	"code":8,
	"code_pic":"1984"
},{
	"name":'东北',
	"code":1,
	"code_pic":"1214"
},{
	"name":'东',
	"code":2,
	"code_pic":"1368"
},{
	"name":'东南',
	"code":3,
	"code_pic":"1434"
},{
	"name":'南',
	"code":4,
	"code_pic":"1587"
},{
	"name":'西南',
	"code":5,
	"code_pic":"1645"
},{
	"name":'西',
	"code":6,
	"code_pic":"1784"
},{
	"name":'西北',
	"code":7,
	"code_pic":"1877"
},{
	"name":'无持续风向',
	"code":0,
	"code_pic":"1144"
}]				
var ECHART = {
	wea_echart:function(data1,data2){
		var one = echarts.init(document.getElementById('main'))
		option = {
			grid:{
				left:'-1%',
				right:'1%',
				top:'20%',
				bottom:'0%'
			},
			xAxis: {
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','sun'],
				axisLine:false,
				axisLabel:{
					interval:3
				}
			},
			yAxis: {
				type: 'value',
				axisLine:false,
				splitLine:false
			},
			series: [
				{
					data: data1/* [250, 330, 324, 318, 235, 247, 360] */,
					type: 'line',
					symbol:'circle',//拐点实心
					symbolSize:8,
					label:{//是否在这线上显示数值
						show:true,
						position:'top',
						color:'#000',
						fontSize:18,
						formatter:function(params){//这线上数值加单位
							return (params.value)+'°'
						}
					},
					lineStyle:{
						color:'#ffa500'
					},
					itemStyle:{
						normal:{
							color:'#ffa500',
							lineStyle:{
								// type:'dotted'//虚线
								width:3
							}
						},
						
					}
				},
				{
					data: data2/* [150, 230, 224, 258, 135, 147, 260] */,
					type: 'line',
					symbol:'circle',//拐点实心
					symbolSize:8,
					label:{
						show:true,
						position:'bottom',
						color:'#000',
						fontSize:18,
						formatter:function(params){//这线上数值加单位
							return (params.value)+'°'
						}
					},
					lineStyle:{
						color:'#9ed0ff'
					},
					itemStyle:{
						normal:{
							color:'#9ed0ff',
							lineStyle:{
								// type:'dotted'//虚线
								width:3
							}
						}
					}
				},
			]
		};
		one.setOption(option);
	},
}
	