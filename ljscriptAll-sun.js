// ==UserScript==
// @name         ljScriptAll-sun
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  论剑脚本
// @author       sun
// @match        http://sword-direct22.yytou.cn:8084/*
// @include     http://*.yytou.cn*
// @grant        none
// ==/UserScript==

//-----------全局变量------------
cmdQueue = new Queue();
btnList = {};		// 按钮列表
buttonWidth = '80px';	// 按钮宽度
buttonHeight = '25px';	// 按钮高度
firstpos = 350;		// 当前按钮距离顶端高度，初始130
secondpos = 450;		// 当前按钮距离顶端高度，初始130
delta = 30;	                // 每个按钮间隔
paddingLeft = '0px';//按钮内文字离按钮左边距
paddingRight= '0px';//按钮内文字离按钮右边距
curStamp = 0;  //当前时间戳
preStamp = 0;  //之前时间戳
skillList = "雪饮狂刀;如来神掌;排云掌法"; //通用出招技能
excludeSkills = "天师灭神剑|茅山道术";
//-----------添加按钮------------
createButton("签到领奖",CheckIn);
createButton("跨服天剑谷",tianjianFunc);
createButton("自动出招",autoPerformSkill);
//createButton("破阵",cangxi);
function createButton(btnName,func){
    btnList[btnName]=document.createElement('button');
    var myBtn = btnList[btnName];
    myBtn.innerText = btnName;
    myBtn.style.position = 'absolute';
    myBtn.style.right = '0px';
    myBtn.style.top = firstpos + 'px';
	myBtn.style.paddingLeft = paddingLeft;
	myBtn.style.paddingRight = paddingRight;
    firstpos = firstpos + delta;
    myBtn.style.width = buttonWidth;
    myBtn.style.height = buttonHeight;
    myBtn.addEventListener('click', func);

    // 按钮加入窗体中
    document.body.appendChild(myBtn);
}
//-----------任务代码------------
var performSkillTrigger = 0;
function autoPerformSkill(){
    if(btnList["自动出招"].innerText  == '自动出招'){
		performSkillTrigger = 1;
        performSkill();
        btnList["自动出招"].innerText  = '停止出招';}
    else{
         btnList["自动出招"].innerText  = '自动出招';
		 performSkillTrigger = 0;
    }
}


var checkinstep=0;
function fengyi(){//逢义礼包
	pushCmd("jh 1");
	pushCmd("look_npc snow_mercenary");
	startFengyi();
}

function startFengyi(){
	console.log("fengyi");
	var npc=g_obj_map.get("msg_npc");
	if (npc==undefined){
		setTimeout(startFengyi,200);
	}else if(npc.get("id")!="snow_mercenary"){
		console.log(npc.get("id"));
		clickButton("look_npc snow_mercenary",0);
		setTimeout(startFengyi,200);
	}else{
		for (var i=1;i<10;i++){
			console.log(npc.get("cmd"+i+"_name"));
			if (npc.get("cmd"+i+"_name")==undefined)
				break;
			if (npc.get("cmd"+i+"_name").match("礼包")!=null&&npc.get("cmd"+i+"_name").match("1元")==null&&npc.get("cmd"+i+"_name").match("兑换")==null)
				pushCmd(npc.get("cmd"+i));
		}
		pushCmd("jh 2");
		pushCmd("go north");pushCmd("go north");pushCmd("go north");pushCmd("go north");pushCmd("go north");pushCmd("go north");pushCmd("go north");pushCmd("go east");
		pushCmd("look_room");
		pushCmd("tzjh_lq");
	}
}

function CheckIn(){ // 进入扬州
	pushCmd('jh');
	if (g_obj_map.get("msg_jh_list")==undefined){
		setTimeout(function(){CheckIn();},500);
	}else{
		if (checkinstep==0){
			pushCmd("share_ok 1");
			pushCmd("share_ok 2");
			pushCmd("share_ok 3");
			pushCmd("share_ok 4");
			pushCmd("share_ok 5");
			pushCmd("share_ok 7");
			scanEscapedFish();
			fengyi();
			console.log('签到一次！');
			btnList["签到领奖"].innerText = '扬州签到';
			checkinstep++;
		}else if(checkinstep==1){
			pushCmd('jh 5');       // 进入章节
			pushCmd('go north');     // 南门大街
			pushCmd('go north');   // 十里长街3
			pushCmd('go north');    // 十里长街2
			pushCmd('go west');    // 黄鸡货铺
			pushCmd('sign7');
			checkinstep++;
			btnList["签到领奖"].innerText = '武馆签到';
		}else if(checkinstep==2){
			pushCmd('cangjian get_all'); // 一键领取闯楼奖励
			pushCmd('home');
			pushCmd('jh 1');        // 进入章节
			pushCmd('go east') ;     // 广场
			pushCmd('go north');     // 雪亭镇街道
			pushCmd('go east');     // 淳风武馆大门
			pushCmd('go east') ;    // 淳风武馆教练场
			pushCmd('event_1_44731074');
			pushCmd('event_1_8041045');
			pushCmd('event_1_8041045');
			pushCmd('home');
			checkinstep++;
			btnList["签到领奖"].innerText = '日常潜能';
		}else if(checkinstep==3){
			setTimeout(function(){weieyu();},500);
		}
	}
}
var sendrequest=0;

function sendtell(){
	if (sendrequest==0){
		if (g_obj_map.get("msg_attrs")==undefined){
			setTimeout(function(){sendtell()},1000);
		}else{
			var me=g_obj_map.get("msg_attrs").get("id");
			send("tell u3823757 "+me+"HUAIrequest\n");
		}
	}
}
//sendtell();
function xiakedao1(){
	var jhlist=g_obj_map.get("msg_jh_list").get("finish36");
	if (jhlist!=undefined&&jhlist!=0){
		pushCmd("jh 36");
		pushCmd('yell',0);
		xiakedao2();
	}else{
		pozhen();
	}
}
function xiakedao2(){
	if (g_obj_map.get("msg_room")==undefined){
		setTimeout(function(){xiaokedao2();},200);
	}else{
		var locationname=g_obj_map.get("msg_room").get("short");
			if((locationname=="侠客岛渡口")){
				pushCmd("go east");pushCmd("go northeast");pushCmd("go northeast");pushCmd("go northeast");
				pushCmd("go east");pushCmd("go east");pushCmd("go east");pushCmd('event_1_9179222');
				pushCmd("go east");pushCmd('event_1_11720543');
				pushCmd("go west");pushCmd("go north");pushCmd("go east");pushCmd("go east");
				pushCmd("go south");pushCmd("go east");pushCmd('event_1_44025101');
				console.log("看书结束，准备跳瀑布");
				setTimeout(function(){xiakedao3();},500);
			}else{
				setTimeout(function(){xiakedao2();},500);
			}
	}
}
function xiakedao3(){
	if (g_obj_map.get("msg_room")==undefined){
		setTimeout(function(){xiakedao3();},200);
	}else{
		var locationname=g_obj_map.get("msg_room").get("short");
		console.log(locationname);
		if (locationname=="崖底"&&cmdQueue.isEmpty()){
			pushCmd('event_1_4788477');
			pushCmd('go northwest');
			pushCmd('go west');
			pushCmd('go southwest');
			pushCmd('go west');
			pushCmd('go north');
			pushCmd('go north');
			pushCmd('go north');
			pushCmd('go west');
			pushCmd('go west');
			pushCmd('go south');
			pushCmd('go west');
			pushCmd('go northwest');
			pushCmd('go west');
			pushCmd('go east');
			pushCmd('go northeast');
			pushCmd('go northeast');
			pushCmd('go northeast');
			pushCmd('go east');
			pushCmd('go east');
			pushCmd('go east');
			pushCmd('go east');
			pushCmd('go east');
			pushCmd('go south');
			pushCmd('go east');
			pushCmd('event_1_44025101');
			console.log("跳瀑布失败，回到瀑布")
			setTimeout(function(){xiakedao3();},500);
		}else if (locationname=="石门"&&cmdQueue.isEmpty()){
			console.log("进入石门")
			pushCmd('event_1_36230918');pushCmd('go east');
			pushCmd('go east');pushCmd('go south');
			pushCmd('event_1_77496481');
			console.log("侠客岛日常结束");
			setTimeout(function(){pozhen();},500);
		}else{
			setTimeout(function(){xiakedao3();},500);
		}
	}

}
function binghuodao(){
	var jhlist=g_obj_map.get("msg_jh_list").get("finish35");
	if (jhlist!=undefined&&jhlist!=0){
		pushCmd('jh 35');
		pushCmd('go northwest');      // 熔岩滩头
		pushCmd('go northwest');      // 海蚀涯
		pushCmd('go northwest');      // 峭壁崖道
		pushCmd('go north');      // 峭壁崖道
		pushCmd('go northeast') ;     // 炙溶洞口
		pushCmd('go northwest');      // 炙溶洞
		pushCmd('go west') ;     // 炙溶洞口
		pushCmd('go northwest') ;     // 熔岩小径
		pushCmd('go east') ;     // 熔岩小径
		pushCmd('go east');      // 石华林
		pushCmd('go east');      // 分岛岭
		pushCmd('go east');      // 跨谷石桥
		pushCmd('go east') ;     // 大平原
		pushCmd('go southeast');pushCmd('go north'); pushCmd('go north'); pushCmd('go west') ; pushCmd('go north');pushCmd('go west') ;pushCmd('event_1_53278632');pushCmd('sousuo');pushCmd('sousuo');
		console.log("冰火岛日常结束");
		console.log("日常结束");
	}else{
		console.log("日常结束");
	}

}
function pozhen(){
	var jhlist=g_obj_map.get("msg_jh_list").get("finish26");
	if (jhlist!=undefined&&jhlist!=0){
		pushCmd('jh 26');
		pushCmd('go west');
		pushCmd('go west');
		pushCmd('go north');
		pushCmd('go north');
		pushCmd('event_1_14435995');
		pushCmd("go south");
		pushCmd("go east");
		pushCmd("go east");	
		pushCmd('event_1_18075497');
		console.log("破阵采矿结束");
		setTimeout(function(){binghuodao();},500);
	}else{
		setTimeout(function(){binghuodao();},500);
	}
}

function cangxi1(){      
	pushCmd("jh");
	var jhlist=g_obj_map.get("msg_jh_list").get("finish36");
	if (jhlist!=undefined&&jhlist!=0){
		pushCmd('jh 26');
		pushCmd('go west');
		pushCmd('go west');
		pushCmd('go north');
		pushCmd('go west');
		pushCmd('go west');
		pushCmd('go west');
		pushCmd('go north');
        cangxi();		
	}else{
		if (g_obj_map.get("msg_room")==undefined){
			setTimeout(function(){cangxi();},200);
		}else{
			var locationname=g_obj_map.get("msg_room").get("short");
			console.log(locationname);
			if (locationname=="阴山古刹"&&cmdQueue.isEmpty()){
				pushCmd('jh 26');
				pushCmd('go west');
				pushCmd('go west');
				pushCmd('go north');
				pushCmd('go west');
				pushCmd('go west');
				pushCmd('go north');					
				setTimeout(function(){cangxi();},500);
			}else if (locationname=="阴山密林"&&cmdQueue.isEmpty()){
				pushCmd("go north");
				setTimeout(function(){cangxi();},500);
			}else if (locationname=="阴山岩画"&&cmdQueue.isEmpty()){
				console.log(locationname);
				pushCmd("event_1_12853448");
				
			}else{
				setTimeout(function(){cangxi();},500);
			}
		}
	}
}
function weieyu(){
	var jhlist=g_obj_map.get("msg_jh_list").get("finish37");
	if (jhlist!=undefined&&jhlist!=0){
		pushCmd("jh 37");
		pushCmd("go north");
		pushCmd("go east");
		pushCmd("go east");
		pushCmd("go northwest");
		pushCmd("go northwest");
		pushCmd("go west");
		pushCmd("go north");
		pushCmd("go east");
		pushCmd("go north");
		pushCmd("go east");
		pushCmd("go east");
		pushCmd("go east");
		pushCmd("go northeast");
		pushCmd("go northeast");
		pushCmd("go northeast");
		pushCmd("go southeast");
		pushCmd("go north");
		pushCmd('event_1_97487911');
		console.log("喂过鳄鱼");
		xiakedao1();
	}else{
		xiakedao1();
	}
}


function maikuli() {
	pushCmd('work click maikuli');
}
function duancha() {
	pushCmd('work click duancha');
}
function dalie() {
	pushCmd('work click dalie');
}
function baobiao() {
	pushCmd('work click baobiao');
}
function maiyi() {
	pushCmd('work click maiyi');
}
function xuncheng() {
	pushCmd('work click xuncheng');
}
function datufei() {
	pushCmd('work click datufei');
}
function dalei() {
	pushCmd('work click dalei');
}
function kangjijinbin() {
	pushCmd('work click kangjijinbin');
}
function zhidaodiying() {
	pushCmd('work click zhidaodiying');
}
function dantiaoqunmen() {
	pushCmd('work click dantiaoqunmen');
}
function shenshanxiulian() {
	pushCmd('work click shenshanxiulian');
}
function jianmenlipai(){
	pushCmd('work click jianmenlipai');
}
function dubawulin(){
	pushCmd('work click dubawulin');
}

function scanEscapedFish() {
	maikuli();
	duancha();
	dalie();
	baobiao();
	maiyi();
	xuncheng();
	datufei();
	dalei();
	kangjijinbin();
	zhidaodiying();
	dantiaoqunmen();
	shenshanxiulian();
	jianmenlipai();
	dubawulin();
	pushCmd('public_op3'); // 向师傅磕头
}

//-----------通用发招代码--------
function performSkill(){
	if (performSkillTrigger=1)
	{
		
        performSkillA();
		if($('span.outbig_text:contains(战斗结束)').length>0){
			pushCmd('prev_combat');
		}
		setTimeout(performSkill,800);	
    }
}
function performSkillA(){
    // 如果找到设置的技能则释放
    for(var i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
		console.log(skillList);
        if(skillName !== "" && isContains(skillList, skillName)){
            console.log(skillName);
            pushCmd('playskill '+i);
            return;
        }
    }

    // 如果没找到设置技能，随便用一个非招bb的技能
    for(i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && !isContains(excludeSkills, skillName)){
            console.log(skillName);
            clickButton('playskill '+i);
            return;
        }
    }
}


//-----------跨服天剑谷----------
var tianjianTrigger=0;
var path=[];
	var tjfight=0;
	var tjroomclear=0;
	var preroomrandom="";
	var direction=["west","east","south","north","southwest","southeast","northeast","northwest"];//八个方向
	function tianjianFunc(){
		if (tianjianTrigger==0){
			btnList["跨服天剑谷"].innerText = '停止天剑谷';
			tianjianTrigger=1;
			killtianjian();
			tianjianmove();
		}else if (tianjianTrigger==1){
			btnList["跨服天剑谷"].innerText = '跨服天剑谷';
			tianjianTrigger=0;
			tjroomclear=0;
			path=[];
			tjfight=0;
			preroomrandom="";
		}
	}
	
	function tianjianmove(){
		var roominfo=g_obj_map.get("msg_room");
		if ((roominfo==undefined||tjroomclear==0)&&tianjianTrigger==1){//房间信息没有刷新，或者在战斗，或者房间内还有npc
			 setTimeout(function(){tianjianmove();},200);
		}else{
			console.log(path);
			for (var i=0;i<8;i++){
				if (roominfo.get(direction[i])!=undefined){
					if (roominfo.get(direction[i]).match("峡谷")==null&&(path.length<=10||Math.random()>0.4)){//不包含峡谷两个字，为特殊房间
					preroomrandom=roominfo.get("go_random");
					tjroomclear=0;
					path.push(g_obj_map.get("msg_room").get(direction[i]));
					clickButton("go "+direction[i]); //移动到特殊房间
			if (tianjianTrigger==1){
				tianjianmove();
				setTimeout(killtianjian,1000);
			}
					return;
					}
				}

			}
			//没有特殊房间，开始寻找普通房间
			for (var i=0;i<8;i++){
				if (roominfo.get(direction[i])!=undefined){
					if (path.indexOf(g_obj_map.get("msg_room").get(direction[i]))==-1){
					path.push(g_obj_map.get("msg_room").get(direction[i]));
					preroomrandom=roominfo.get("go_random");
					tjroomclear=0;
					clickButton("go "+direction[i],0);
			if (tianjianTrigger==1){
				tianjianmove();
				setTimeout(killtianjian,1000);
			}
					return;
					}
				}
			}
			preroomrandom=roominfo.get("go_random");
			var randomdirect=Math.round((Math.random()*7));
			while(roominfo.get(direction[randomdirect])==undefined){
				randomdirect=Math.round((Math.random()*7));
			}
			tjroomclear=0;
			clickButton("go "+direction[randomdirect],0);
			if (tianjianTrigger==1){
				tianjianmove();
				setTimeout(killtianjian,1000);
			}


		}
	}
	function tianjianGu(){
		this.dispatchMessage=function(b){
			var type = b.get("type"), subType = b.get("subtype");
			//console.log(b);
			//console.log("type=" + type + " subtype=" + subType + " ready_pos = " + b.get("ready_pos"));
		    //console.log(subType);
			if (type=="vs"&&subType=="vs_info"){ //这是进入战斗的提示
			    console.log("进入战斗");
			    //performSkillA();
				//clickButton("playskill 1",0);//放个绝学先
			}else if (type=="vs"&&subType=="combat_result"){//战斗结束 继续调取击
				tjfight=0;
				send("look_room\n");
				setTimeout(killtianjian,1000);
			}
		}
	}
	function killtianjian(){
		var npclist=g_obj_map.get("msg_room");
		if ((npclist==undefined||tjfight==1)&&tianjianTrigger==1){
			setTimeout(function(){killtianjian();},200);
		}else{
			if (npclist.get("go_random")==preroomrandom&&g_obj_map.get("msg_team")==undefined){//没动啊，是队长或者一个人的话就再次调用移动
				tjroomclear=1;
				return;
			}else if(npclist.get("go_random")==preroomrandom&&g_obj_map.get("msg_team").get("is_learder")==undefined){
				tjroomclear=1;
				return;
			}else if(npclist.get("go_random")==preroomrandom&&g_obj_map.get("msg_team").get("is_learder")==1){
				tjroomclear=1;
				return;
			}
			for (var i=1;i<10;i++){
				if (npclist.get("npc"+i)==undefined){
					if (g_obj_map.get("msg_team")==undefined){
						break;
					}else if(g_obj_map.get("msg_team").get("is_learder")==undefined){
						break;
					}else if(g_obj_map.get("msg_team").get("is_learder")==1){
						break;
					}else if (parseInt(g_obj_map.get("msg_team").get("is_leader"))==0) {
						break;
					}
				}
				if (npclist.get("npc"+i).split(",")[0]!="kuafu_tjgws"&&npclist.get("npc"+i).split(",")[1].match("符兵")==null){
					tjfight=1;
					clickButton("kill "+npclist.get("npc"+i).split(",")[0]);
					break;
				}

			}
			for (var i=1;i<10;i++){
				if (npclist.get("npc"+i)==undefined){
					if (g_obj_map.get("msg_team")==undefined){
						tjroomclear=1;
						return;
					}else if(g_obj_map.get("msg_team").get("is_learder")==undefined){
						tjroomclear=1;
						return;
					}else if(g_obj_map.get("msg_team").get("is_learder")==1){
						tjroomclear=1;
						return;
					}else if (parseInt(g_obj_map.get("msg_team").get("is_leader"))==0) {
						if (tianjianTrigger==1)
						setTimeout(killtianjian,200);
					}
				}
				if (npclist.get("npc"+i).split(",")[0]=="kuafu_tjgws"){
					tjfight=1;
					console.log("kill "+npclist.get("npc"+i).split(",")[0]);
					clickButton("kill "+npclist.get("npc"+i).split(",")[0]);
					return;
				}
			}
			killtianjian();
		}
	}
	var tianjian=new tianjianGu;
//-----------初始化代码----------
(function (window) {
		window.go = function(dir) {
			console.debug("开始执行：", dir);
			var d = dir.split(";");
			for (var i = 0; i < d.length; i++)
				pushCmd(d[i], 0);
		};


		var ql_w = {
			'书房': 1,
			'打铁铺子': 2,
			'桑邻药铺': 3,
			'南市': 4,
			'桃花别院': 5,
			'绣楼': 6,
			'北大街': 7,
			'钱庄': 8,
			'杂货铺': 9,
			'祠堂大门': 10,
			'厅堂': 11
		};
		window.go_ql = function(w) {
			zx(ql_w[w]);
		}
	
		function go_yx(w){
			if (w.startsWith("雪亭镇")) {
				go("jh 1;e;n");
			} else if (w.startsWith("洛阳")) {
				go("jh 2;n;n");
			} else if (w.startsWith("华山村")) {
				go("jh 3;s;s");
			} else if (w.startsWith("华山")) {
				go("jh 4;n;n");
			} else if (w.startsWith("扬州")) {
				go("jh 5;n;n");
			} else if (w.startsWith("丐帮")) {
				go("jh 6;event_1_98623439;s");
			} else if (w.startsWith("乔阴县")) {
				go("jh 7;s;s;s");
			} else if (w.startsWith("峨眉山")) {
				go("jh 8;w;nw;n;n;n;n");
			} else if (w.startsWith("恒山")) {
				go("jh 9;n;n;n");
			} else if (w.startsWith("武当山")) {
				go("jh 10;w;n;n");
			} else if (w.startsWith("晚月庄")) {
				go("jh 11;e;e;s;sw;se;w");
			} else if (w.startsWith("水烟阁")) {
				go("jh 12;n;n;n");
			} else if (w.startsWith("少林寺")) {
				go("jh 13;n;n");
			} else if (w.startsWith("唐门")) {
				go("jh 14;w;n;n;n");
			} else if (w.startsWith("青城山")) {
				go("jh 15;s;s");
			} else if (w.startsWith("逍遥林")) {
				go("jh 16;s;s");
			} else if (w.startsWith("开封")) {
				go("jh 17;n;n");
			} else if (w.startsWith("明教")) {
				go("jh 18;n;nw;n;n");
			} else if (w.startsWith("全真教")) {
				go("jh 19;s;s");
			} else if (w.startsWith("古墓")) {
				go("jh 20;w;w");
			} else if (w.startsWith("白驮山")) {
				go("jh 21;nw;w");
			} else if (w.startsWith("嵩山")) {
				go("jh 22;n;n");
			} else if (w.startsWith("寒梅庄")) {
				go("jh 23");
			} else if (w.startsWith("泰山")) {
				go("jh 24");
			} else if (w.startsWith("大旗门")) {
				go("jh 25");
			} else if (w.startsWith("大昭寺")) {
				go("jh 26");
			} else if (w.startsWith("魔教")) {
				go("jh 27");
			}

			random_move();
		}

		function random_move() {
			var v = Math.random();
			if (v < 0.25) go("e")
			else if (v < 0.5) go("w")
			else if (v < 0.75) go("s")
			else go("n");
		}

		function zx(x) {
			x = parseInt(x);
			console.debug(x);

			if (x == 1) {
				go("jh 1;e;n;e;e;e;e;n");
			} else if (x == 2) {
				go("jh 1;e;n;n;w");
			} else if (x == 3) {
				go("jh 1;e;n;n;n;w");
			}

			if (x == 4) {
				go("jh 2;n;n;e")
			}

			if (x == 5) {
				go("jh 2;n;n;n;n;w;s");
			}
			if (x == 6) {
				go("jh 2;n;n;n;n;w;s;w");
			}
			if (x == 7) {
				go("jh 2;n;n;n;n;n;n;n");
			}
			if (x == 8) {
				go("jh 2;n;n;n;n;n;n;;n;e");
			}

			if (x == 9) {
				go("jh 3;s;s;e");
			}
			if (x == 10) {
				go("jh 3;s;s;w");
			}
			if (x == 11) {
				go("jh 3;s;s;w;n");
			}

		}


	function MyMap(){
		this.elements = [];
		this.size = function() {
			return this.elements.length
		};
		this.isEmpty = function() {
			return 1 > this.elements.length
		};
		this.clear = function() {
			this.elements = []
		};
		this.put = function(a, b) {
			for (var c = !1, d = 0; d < this.elements.length; d++)
				if (this.elements[d].key == a) {
					c = !0;
					this.elements[d].value = b;
					break
				}
			!1 == c && this.elements.push({
				key: a,
				value: b
			})
		};
		this.remove = function(a) {
			var b = !1;
			try {
				for (var c = 0; c < this.elements.length; c++)
					if (this.elements[c].key == a)
						return this.elements.splice(c, 1), !0
			} catch (d) {
				b =
				!1
			}
			return b
		};
		this.get = function(a) {
			try {
				for (var b = 0; b < this.elements.length; b++)
					if (this.elements[b].key == a)
						return this.elements[b].value
			} catch (c) {
				return null
			}
		};
		this.copy = function(a) {
			null == a && (a = new Map);
			try {
				for (var b = 0; b < this.elements.length; b++)
					a.put(this.elements[b].key, this.elements[b].value);
				return a
			} catch (c) {
				return null
			}
		};
		this.element = function(a) {
			return 0 > a || a >= this.elements.length ? null : this.elements[a]
		};
		this.containsKey = function(a) {
			var b = !1;
			try {
				for (var c = 0; c < this.elements.length; c++)
					if (this.elements[c].key ==
					a) {
						b = !0;
						break
					}
			} catch (d) {
				b = !1
			}
			return b
		};
		this.containsValue = function(a) {
			var b = !1;
			try {
				for (var c = 0; c < this.elements.length; c++)
					if (this.elements[c].value == a) {
						b = !0;
						break
					}
			} catch (d) {
				b = !1
			}
			return b
		};
		this.values = function() {
			for (var a = [], b = 0; b < this.elements.length; b++)
				a.push(this.elements[b].value);
			return a
		};
		this.keys = function() {
			for (var a = [], b = 0; b < this.elements.length; b++)
				a.push(this.elements[b].key);
			return a
		}
	}

	function Question() {
			this.answers = new MyMap;
			this.answers.put("锦缎腰带是腰带类的第几级装备", "a");
			this.answers.put("扬州询问黑狗子能到下面哪个地点", "a");
			this.answers.put("跨服天剑谷每周六几点开启", "a");
			this.answers.put("青城派的道德经可以提升哪个属性", "c");
			this.answers.put("论剑中以下哪个不是晚月庄的技能", "d");
			this.answers.put("跨服天剑谷是星期几举行的", "b");
			this.answers.put("玉女剑法是哪个门派的技能", "b");
			this.answers.put("玉草帽可以在哪位npc那里获得？", "b");
			this.answers.put("逍遥林是第几章的地图", "c");
			this.answers.put("精铁棒可以在哪位npc那里获得", "d");
			this.answers.put("鎏金缦罗是披风类的第几级装备", "d");
			this.answers.put("神雕大侠在哪一章", "a");
			this.answers.put("华山武器库从哪个NPC进", "d");
			this.answers.put("首冲重置卡需要隔多少天才能在每日充值奖励中领取", "b");
			this.answers.put("以下哪个不是空空儿教导的武学", "b");
			this.answers.put('“迎梅客栈”场景是在哪个地图上', "d");
			this.answers.put('独孤求败有过几把剑', "d");
			this.answers.put('晚月庄的小贩在下面哪个地点', "a");
			this.answers.put('扬州询问黑狗能到下面哪个地点', "a");
			this.answers.put('“清音居”场景是在哪个地图上', "a");
			this.answers.put('一天能完成师门任务有多少个', "c");
			this.answers.put('林祖师是哪个门派的师傅', "a");
			this.answers.put('九区服务器名称', "d");
			this.answers.put('去唐门地下通道要找谁拿钥匙', "a");
			this.answers.put('能增容貌的是下面哪个技能', "a");
			this.answers.put('铁手镯  可以在哪位npc那里获得', "a");
			this.answers.put('街头卖艺是挂机里的第几个任务', "a");
			this.answers.put('“三清宫”场景是在哪个地图上', "c");
			this.answers.put('论剑中以下哪个是大理段家的技能', "a");
			this.answers.put('藏宝图在哪里npc那里买', "a");
			this.answers.put('六脉神剑是哪个门派的绝学', "a");
			this.answers.put('如何将华山剑法从400级提升到440级', "d");
			this.answers.put('王重阳是哪个门派的师傅', "b");
			this.answers.put('在庙祝处洗杀气每次可以消除多少点', "a");
			this.answers.put('以下哪个宝石不能镶嵌到衣服', "a");
			this.answers.put('达摩杖的伤害是多少', "d");
			this.answers.put('嫁衣神功是哪个门派的技能', "b");
			this.answers.put('可以召唤金甲伏兵助战是哪个门派', "a");
			this.answers.put('端茶递水是挂机里的第几个任务', "b");
			this.answers.put('下列哪项战斗不能多个玩家一起战斗', "a");
			this.answers.put('寒玉床在哪里切割', "a");
			this.answers.put('拜师风老前辈需要正气多少', "b");
			this.answers.put('每天微信分享能获得多少元宝', "d");

			this.answers.put('丐帮的绝学是什么', "a");
			this.answers.put('以下哪个门派不是隐藏门派', "c");
			this.answers.put('玩家想修改名字可以寻找哪个NPC', "a");
			this.answers.put('论剑中以下哪个不是古墓派的的技能', "b");
			this.answers.put('安惜迩是在那个场景', "c");
			this.answers.put('神雕侠侣的时代背景是哪个朝代', "d");
			this.answers.put('论剑中以下哪个是华山派的技能的', "a");
			this.answers.put('夜皇在大旗门哪个场景', "c");
			this.answers.put('什么装备可以镶嵌紫水晶', "c");
			this.answers.put('乌檀木刀可以在哪位npc那里获得', "d");
			this.answers.put('易容后保持时间是多久', "a");
			this.answers.put('以下哪个不是宋首侠教导的武学', "d");
			this.answers.put('踏云棍可以在哪位npc那里获得', "a");
			this.answers.put('玉女剑法是哪个门派的技能', "b");
			this.answers.put('根骨能提升哪个属性', "c");
			this.answers.put('论剑中以下哪个是铁血大旗门的技能', "b");
			this.answers.put('明教的九阳神功有哪个特殊效果', "a");
			this.answers.put('辟邪剑法在哪学习', "b");
			this.answers.put('论剑中古墓派的终极师傅是谁', "d");
			this.answers.put('论剑中青城派的终极师傅是谁', "d");
			this.answers.put('逍遥林怎么弹琴可以见到天山姥姥', "b");
			this.answers.put('论剑一次最多能突破几个技能', "c");
			this.answers.put('劈雳拳套有几个镶孔', "a");
			this.answers.put('仓库最多可以容纳多少种物品', "b");
			this.answers.put('以下不是天宿派师傅的是哪个', "c");
			this.answers.put('易容术在哪学习', "b");
			this.answers.put('瑷伦在晚月庄的哪个场景', "b");
			this.answers.put('羊毛斗篷是披风类的第几级装备', "a");
			this.answers.put('弯月刀可以在哪位npc那里获得', "b");
			this.answers.put('骆云舟在乔阴县的哪个场景', "b");
			this.answers.put('屠龙刀是什么级别的武器', "a");
			this.answers.put('天蚕围腰可以镶嵌几颗宝石', "d");
			this.answers.put('“蓉香榭”场景是在哪个地图上', "c");
			this.answers.put('施令威在哪个地图', "b");
			this.answers.put('扬州在下面哪个地点的npc处可以获得玉佩', "c");
			this.answers.put('拜师铁翼需要多少内力', "b");
			this.answers.put('九区服务器名称', "d");
			this.answers.put('"白玉牌楼"场景是在哪个地图上', "c");
			this.answers.put('宝玉鞋在哪获得', "a");
			this.answers.put('落英神剑掌是哪个门派的技能', "b");
			this.answers.put('下面哪个门派是正派', "a");
			this.answers.put('兑换易容面具需要多少玄铁碎片', "c");
			this.answers.put('以下哪些物品是成长计划第五天可以领取的', "b");
			this.answers.put('论剑中以下哪个是晚月庄的人物', "a");
			this.answers.put('论剑中以下哪个不是魔教的技能', "a");
			this.answers.put('匕首加什么属性', "c");
			this.answers.put('钢丝甲衣可以在哪位npc那里获得', "d");
			this.answers.put('论剑中花紫会的师傅是谁', "c");
			this.answers.put('暴雨梨花针的伤害是多少', "c");
			this.answers.put('吸血蝙蝠在下面哪个地图', "a");
			this.answers.put('论剑中以下是峨嵋派技能的是哪个', "a");
			this.answers.put('蓝止萍在晚月庄哪个小地图', "b");
			this.answers.put('下面哪个地点不是乔阴县的', "d");
			this.answers.put('领取消费积分需要寻找哪个NPC', "c");
			this.answers.put('下面哪个不是门派绝学', "d");
			this.answers.put('人物背包最多可以容纳多少种物品', "a");
			this.answers.put('什么装备不能镶嵌黄水晶', "d");
			this.answers.put('古灯大师在大理哪个场景', "c");
			this.answers.put('草帽可以在哪位npc那里获得', "b");
			this.answers.put('西毒蛇杖的伤害是多少', "c");
			this.answers.put('成长计划六天可以领取多少银两', "d");
			this.answers.put('朱老伯在华山村哪个小地图', "b");
			this.answers.put('论剑中以下哪个是唐门的技能', "b");
			this.answers.put('游龙散花是哪个门派的阵法', "d");
			this.answers.put('高级乾坤再造丹加什么', "b");
			this.answers.put('唐门的唐门毒经有哪个特殊效果', "a");
			this.answers.put('葛伦在大招寺的哪个场景', "b");
			this.answers.put('“三清殿”场景是在哪个地图上', "b");
			this.answers.put('哪样不能获得玄铁碎片', "c");
			this.answers.put('在哪里捏脸提升容貌', "d");
			this.answers.put('论剑中以下哪个是天邪派的技能', "b");
			this.answers.put('向师傅磕头可以获得什么', "b");
			this.answers.put('骆云舟在哪一章', "c");
			this.answers.put('论剑中以下哪个不是唐门的技能', "c");
			this.answers.put('华山村王老二掉落的物品是什么', "a");
			this.answers.put('下面有什么是寻宝不能获得的', "c");
			this.answers.put('寒玉床需要切割多少次', "d");
			this.answers.put('绿宝石加什么属性', "c");
			this.answers.put('魏无极处读书可以读到多少级', "a");
			this.answers.put('天山姥姥在逍遥林的哪个场景', "d");
			this.answers.put('天羽奇剑是哪个门派的技能', "a");
			this.answers.put('大招寺的铁布衫有哪个特殊效果', "c");
			this.answers.put('挖剑冢可得什么', "a");
			this.answers.put('灭绝师太在峨眉山哪个场景', "a");
			this.answers.put('论剑是星期几举行的', "c");
			this.answers.put('柳淳风在雪亭镇哪个场景', "b");
			this.answers.put('萧辟尘在哪一章', "d");
			this.answers.put('论剑中以下哪个是明教的技能', "b");
			this.answers.put('天邪派在哪里拜师', "b");
			this.answers.put('钨金腰带是腰带类的第几级装备', "d");
			this.answers.put('灭绝师太在第几章', "c");
			this.answers.put('一指弹在哪里领悟', "b");
			this.answers.put('翻译梵文一次多少银两', "d");
			this.answers.put('刀法基础在哪掉落', "a");
			this.answers.put('黯然消魂掌有多少招式', "c");
			this.answers.put('黑狗血在哪获得', "b");
			this.answers.put('雪蕊儿在铁雪山庄的哪个场景', "d");
			this.answers.put('东方教主在魔教的哪个场景', "b");
			this.answers.put('以下属于正派的门派是哪个', "a");
			this.answers.put('选择武学世家会影响哪个属性', "a");
			this.answers.put('寒玉床睡觉一次多久', "c");
			this.answers.put('魏无极在第几章', "a");
			this.answers.put('孙天灭是哪个门派的师傅', "c");
			this.answers.put('易容术在哪里学习', "a");
			this.answers.put('哪个NPC掉落拆招基础', "a");
			this.answers.put('七星剑法是哪个门派的绝学', "a");
			this.answers.put('以下哪些物品不是成长计划第二天可以领取的', "c");
			this.answers.put('以下哪个门派是中立门派', "a");
			this.answers.put('黄袍老道是哪个门派的师傅', "c");
			this.answers.put('舞中之武是哪个门派的阵法', "b");
			this.answers.put('隐者之术是那个门派的阵法', "a");
			this.answers.put('踏雪无痕是哪个门派的技能', "b");
			this.answers.put('以下哪个不是在雪亭镇场景', "d");
			this.answers.put('排行榜最多可以显示多少名玩家', "a");
			this.answers.put('貂皮斗篷是披风类的第几级装备', "b");
			this.answers.put('武当派的绝学技能是以下哪个', "d");
			this.answers.put('兰花拂穴手是哪个门派的技能', "a");
			this.answers.put('油流麻香手是哪个门派的技能', "a");
	//        this.answers.put('清风寨在哪', "b");
			this.answers.put('披星戴月是披风类的第几级装备', "d");
			this.answers.put('当日最低累积充值多少元即可获得返利', "b");
			this.answers.put('追风棍在哪里获得', "b");
			this.answers.put('长剑在哪里可以购买', "a");
			this.answers.put('莫不收在哪一章', "a");
			this.answers.put('读书写字最高可以到多少级', "b");
			this.answers.put('哪个门派拜师没有性别要求', "d");
			this.answers.put('墨磷腰带是腰带类的第几级装备', "d");
			this.answers.put('不属于白驼山的技能是什么', "b");
			this.answers.put('婆萝蜜多心经是哪个门派的技能', "b");
			this.answers.put('乾坤一阳指是哪个师傅教的', "a");
			this.answers.put('“日月洞”场景是在哪个地图上', "b");
			this.answers.put('倚天屠龙记的时代背景哪个朝代', "a");
			this.answers.put('八卦迷阵是哪个门派的阵法', "b");
			this.answers.put('七宝天岚舞是哪个门派的技能', "d");
			this.answers.put('断云斧是哪个门派的技能', "a");
			this.answers.put('跨服需要多少级才能进入', "c");
			this.answers.put('易容面具需要多少玄铁兑换', "c");
			this.answers.put('张教主在明教哪个场景', "d");
			this.answers.put('玉蜂浆在哪个地图获得', "a");
			this.answers.put('在逍遥派能学到的技能是哪个', "a");
			this.answers.put('每日微信分享可以获得什么奖励', "a");
			this.answers.put('红宝石加什么属性', "b");
			this.answers.put('金玉断云是哪个门派的阵法', "a");
			this.answers.put('正邪任务一天能做几次', "a");
			this.answers.put('白金戒指可以在哪位npc那里获得', "b");
			this.answers.put('金戒指可以在哪位npc那里获得', "d");
			this.answers.put('柳淳风在哪哪一章', "c");
			this.answers.put('论剑是什么时间点正式开始', "a");
			this.answers.put('黯然销魂掌是哪个门派的技能', "a");
			this.answers.put('在正邪任务中不能获得下面什么奖励', "d");
			this.answers.put('孤儿出身增加什么', "d");
			this.answers.put('丁老怪在星宿海的哪个场景', "b");
			this.answers.put('读书写字301-400级在哪里买书', "c");
			this.answers.put('闯楼第几层可以获得称号“藏剑楼长老”', "c");
			this.answers.put('以下属于邪派的门派是哪个', "b");
			this.answers.put('论剑中以下哪个不是丐帮的人物', "a");
			this.answers.put('论剑中青城派的第一个师傅是谁', "a");
			this.answers.put('以下哪个不是何不净教导的武学', "c");
			this.answers.put('吕进在哪个地图', "a");
			this.answers.put('拜师老毒物需要蛤蟆功多少级', "a");
			this.answers.put('蛇形刁手是哪个门派的技能', "b");
			this.answers.put('乌金玄火鞭的伤害是多少', "d");
			this.answers.put('张松溪在哪个地图', "c");
			this.answers.put('欧阳敏是哪个门派的', "b");
			this.answers.put('以下哪个门派是正派', "d");
			this.answers.put('成功易容成异性几次可以领取易容成就奖', "b");
			this.answers.put('论剑中以下不是峨嵋派技能的是哪个', "b");
			this.answers.put('城里抓贼是挂机里的第几个任务', "b");
			this.answers.put('每天的任务次数几点重置', "d");
			this.answers.put('莲花掌是哪个门派的技能', "a");
			this.answers.put('大招寺的金刚不坏功有哪个特殊效果', "a");
			this.answers.put('多少消费积分可以换取黄金钥匙', "b");
			this.answers.put('什么装备都能镶嵌的是什么宝石', "c");
			this.answers.put('什么影响打坐的速度', "c");
			this.answers.put('蓝止萍在哪一章', "c");
			this.answers.put('寒玉床睡觉修炼需要多少点内力值', "c");
			this.answers.put('武穆兵法通过什么学习', "a");
			this.answers.put('倒乱七星步法是哪个门派的技能', "d");
			this.answers.put('闯楼第几层可以获得称号“藏剑楼护法”', "b");
			this.answers.put('兽皮鞋可以在哪位npc那里获得', "b");
			this.answers.put('寒玉床在那个地图可以找到', "a");
			this.answers.put('易容术可以找哪位NPC学习', "b");
			this.answers.put('铁戒指可以在哪位npc那里获得', "a");
			this.answers.put('通灵需要寻找哪个NPC', "c");
			this.answers.put('功德箱在雪亭镇的哪个场景', "c");
			this.answers.put('蓝宝石加什么属性', "a");
			this.answers.put('每天分享游戏到哪里可以获得20元宝', "a");
			this.answers.put('选择书香门第会影响哪个属性', "b");
			this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
			this.answers.put('新手礼包在哪领取', "c");

			this.answers.put('春风快意刀是哪个门派的技能', "b");
			this.answers.put('朱姑娘是哪个门派的师傅', "a");
			this.answers.put('出生选武学世家增加什么', "a");
			this.answers.put('以下哪个宝石不能镶嵌到内甲', "a");
			this.answers.put('生死符的伤害是多少', "a");
			this.answers.put('扬文的属性', "a");
			this.answers.put('云问天在哪一章', "a");
			this.answers.put('首次通过桥阴县不可以获得那种奖励', "a");
			this.answers.put('剑冢在哪个地图', "a");
			this.answers.put('在哪里消杀气', "a");
			this.answers.put('闯楼每多少层有称号奖励', "a");
			this.answers.put('打坐增长什么属性', "a");
			this.answers.put('从哪个npc处进入跨服战场', "a");
			this.answers.put('下面哪个是天邪派的师傅', "a");
			this.answers.put('每天能做多少个谜题任务', "a");
			this.answers.put('小男孩在华山村哪里', "a");
			this.answers.put('追风棍可以在哪位npc那里获得', "a");
			this.answers.put('逍遥派的绝学技能是以下哪个', "a");
			this.answers.put('沧海护腰是腰带类的第几级装备', "a");
			this.answers.put('花花公子在哪个地图', "a");
			this.answers.put('每次合成宝石需要多少银两', "a");
			this.answers.put('以下哪个不是微信分享好友、朋友圈、QQ空间的奖励', "a");
			this.answers.put('打排行榜每天可以完成多少次', "a");
			this.answers.put('夜行披风是披风类的第几级装备', "a");
			this.answers.put('白蟒鞭的伤害是多少', "a");
			this.answers.put('易容术向谁学习', "a");
			this.answers.put('支线对话书生上魁星阁二楼杀死哪个NPC给10元宝', "a");
			this.answers.put('斗转星移是哪个门派的技能', "a");
			this.answers.put('杨过在哪个地图', "a");
			this.answers.put('钻石项链在哪获得', "a");
			this.answers.put('多少消费积分换取黄金宝箱', "a");
			this.answers.put('每突破一次技能有效系数加多少', "a");
			this.answers.put('茅山学习什么技能招宝宝', "a");
			this.answers.put('陆得财在乔阴县的哪个场景', "a");
			this.answers.put('独龙寨是第几个组队副本', "a");
			this.answers.put('以下哪个是花紫会的祖师', "a");
			this.answers.put('金弹子的伤害是多少', "a");
			this.answers.put('明月帽要多少刻刀摩刻', "a");
			this.answers.put('论剑输一场获得多少论剑积分', "a");
			this.answers.put('论剑中以下哪个是铁血大旗门的师傅', "a");
			this.answers.put('8级的装备摹刻需要几把刻刀', "a");
			this.answers.put('赠送李铁嘴银两能够增加什么', "a");
			this.answers.put('金刚不坏功有什么效果', "a");
			this.answers.put('少林的易筋经神功有哪个特殊效果', "a");
			this.answers.put('大旗门的修养术有哪个特殊效果', "a");
			this.answers.put('金刚杖的伤害是多少', "a");
			this.answers.put('双儿在扬州的哪个小地图', "a");
			this.answers.put('花不为在哪一章', "a");
			this.answers.put('铁项链可以在哪位npc那里获得', "a");
			this.answers.put('武学世家加的什么初始属性', "a");
			this.answers.put('师门磕头增加什么', "a");
			this.answers.put('全真的道家心法有哪个特殊效果', "a");
			this.answers.put('功德箱捐香火钱有什么用', "a");
			this.answers.put('雪莲有什么作用', "a");
			this.answers.put('论剑中以下哪个是花紫会的技能', "a");
			this.answers.put('柳文君所在的位置', "a");
			this.answers.put('岳掌门在哪一章', "a");
			this.answers.put('长虹剑在哪位npc那里获得？', "a");
			this.answers.put('副本一次最多可以进几人', "a");
			this.answers.put('师门任务每天可以完成多少次', "a");
			this.answers.put('逍遥步是哪个门派的技能', "a");
			this.answers.put('新人礼包在哪个npc处兑换', "a");
			this.answers.put('使用朱果经验潜能将分别增加多少', "a");
			this.answers.put('欧阳敏在哪一章', "a");
			this.answers.put('辟邪剑法是哪个门派的绝学技能', "a");
			this.answers.put('在哪个npc处可以更改名字', "a");
			this.answers.put('毒龙鞭的伤害是多少', "a");
			this.answers.put('晚月庄主线过关要求', "a");
			this.answers.put('怎么样获得免费元宝', "a");
			this.answers.put('成长计划需要多少元宝方可购买', "a");
			this.answers.put('青城派的道家心法有哪个特殊效果', "a");
			this.answers.put('藏宝图在哪个NPC处购买', "a");
			this.answers.put('丁老怪是哪个门派的终极师傅', "a");
			this.answers.put('斗转星移阵是哪个门派的阵法', "a");
			this.answers.put('挂机增长什么', "a");
			this.answers.put('鹰爪擒拿手是哪个门派的技能', "a");
			this.answers.put('八卦迷阵是那个门派的阵法', "a");
			this.answers.put('一天能完成挑战排行榜任务多少次', "a");
			this.answers.put('论剑每天能打几次', "a");
			this.answers.put('需要使用什么衣服才能睡寒玉床', "a");
			this.answers.put('张天师是哪个门派的师傅', "a");
			this.answers.put('技能柳家拳谁教的', "a");
			this.answers.put('九阴派梅师姐在星宿海哪个场景', "a");
			this.answers.put('哪个npc处可以捏脸', "a");
			this.answers.put('论剑中步玄派的师傅是哪个', "a");
			this.answers.put('宝玉鞋击杀哪个npc可以获得', "a");
			this.answers.put('慕容家主在慕容山庄的哪个场景', "a");
			this.answers.put('闻旗使在哪个地图', "a");
			this.answers.put('虎皮腰带是腰带类的第几级装备', "a");
			this.answers.put('在哪里可以找到“香茶”？', "a");
			this.answers.put('打造刻刀需要多少个玄铁', "a");
			this.answers.put('包家将是哪个门派的师傅', "a");
			this.answers.put('论剑中以下哪个是天邪派的人物', "a");
			this.answers.put('升级什么技能可以提升根骨', "a");
			this.answers.put('NPC公平子在哪一章地图', "a");
			this.answers.put('逄义是在那个场景', "a");
			this.answers.put('锻造一把刻刀需要多少银两', "a");
			this.answers.put('以下哪个不是岳掌门教导的武学', "a");
			this.answers.put('捏脸需要寻找哪个NPC？', "a");
			this.answers.put('论剑中以下哪个是晚月庄的技能', "a");
			this.answers.put('碧海潮生剑在哪位师傅处学习', "a");
			this.answers.put('干苦力是挂机里的第几个任务', "a");
			this.answers.put('铁血大旗门云海心法可以提升什么', "a");
			this.answers.put('以下哪些物品是成长计划第四天可以领取的？', "a");
			this.answers.put('易容术多少级才可以易容成异性NPC', "a");
			this.answers.put('摹刻扬文需要多少把刻刀？', "a");
			this.answers.put('正邪任务中客商的在哪个地图', "a");
			this.answers.put('白驼山第一位要拜的师傅是谁', "a");
			this.answers.put('枯荣禅功是哪个门派的技能', "a");
			this.answers.put('漫天花雨匕在哪获得', "a");
			this.answers.put('摧心掌是哪个门派的技能', "a");
			this.answers.put('“花海”场景是在哪个地图上？', "a");
			this.answers.put('雪蕊儿是哪个门派的师傅', "a");
			this.answers.put('新手礼包在哪里领取', "a");
			this.answers.put('论语在哪购买', "a");
			this.answers.put('银丝链甲衣可以在哪位npc那里获得？', "a");
			this.answers.put('乾坤大挪移属于什么类型的武功', "a");
			this.answers.put('移开明教石板需要哪项技能到一定级别', "a");
			this.answers.put('开通VIP月卡最低需要当天充值多少元方有购买资格', "a");
			this.answers.put('黯然销魂掌有多少招式', "c");
			this.answers.put('“跪拜坪”场景是在哪个地图上', "b");
			this.answers.put('孤独求败称号需要多少论剑积分兑换', "b");
			this.answers.put('孔雀氅可以镶嵌几颗宝石', "b");
			this.answers.put('客商在哪一章', "b");
			this.answers.put('疯魔杖的伤害是多少', "b");
			this.answers.put('丐帮的轻功是哪个', "b");
			this.answers.put('霹雳掌套的伤害是多少', "b");
			this.answers.put('方媃是哪个门派的师傅', "b");
			this.answers.put('拜师张三丰需要多少正气', "b");
			this.answers.put('天师阵法是哪个门派的阵法', "b");
			this.answers.put('选择商贾会影响哪个属性', "b");
			this.answers.put('银手镯可以在哪位npc那里获得？', "b");
			//this.answers.put('清风寨在哪', "d");
			this.answers.put('在雪亭镇李火狮可以学习多少级柳家拳', "b");
			this.answers.put('华山施戴子掉落的物品是什么', "b");
			this.answers.put('尹志平是哪个门派的师傅', "b");
			this.answers.put('病维摩拳是哪个门派的技能', "b");
			this.answers.put('茅山的绝学是什么', "b");
			this.answers.put('茅山派的轻功是什么', "b");
			this.answers.put('风泉之剑可以在哪位npc那里获得？', "b");
			this.answers.put('凌波微步是哪个门派的技能', "b");
			this.answers.put('藏宝图在哪个npc处购买', "b");
			this.answers.put('军营是第几个组队副本', "b");
			this.answers.put('北岳殿神像后面是哪位npc', "b");
			this.answers.put('王重阳是哪个门派的师傅', "b");
			this.answers.put('跨服是星期几举行的', "b");
			this.answers.put('学习屠龙刀法需要多少内力', "b");
			this.answers.put('高级乾坤再造丹是增加什么的', "b");
			this.answers.put('银项链可以在哪位npc那里获得', "b");
			this.answers.put('每天在线多少个小时即可领取消费积分', "b");
			this.answers.put('晚月庄的内功是什么', "b");

			this.answers.put('冰魄银针的伤害是多少', "b");
			this.answers.put('论剑中以下哪个是丐帮的技能', "b");
			this.answers.put('神雕大侠所在的地图', "b");
			this.answers.put('突破丹在哪里购买', "b");
			this.answers.put('白金手镯可以在哪位npc那里获得', "a");
			this.answers.put('金手镯可以在哪位npc那里获得', "b");
			this.answers.put('以下哪个不是梁师兄教导的武学', "b");
			this.answers.put('技能数量超过了什么消耗潜能会增加', "b");
			this.answers.put('白金项链可以在哪位npc那里获得', "b");
			this.answers.put('小龙女住的古墓是谁建造的', "b");
			this.answers.put('打开引路蜂礼包可以得到多少引路蜂', "b");
			this.answers.put('购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益', "b");
			this.answers.put('白玉腰束是腰带类的第几级装备', "b");
			this.answers.put('老顽童在全真教哪个场景', "b");
			this.answers.put('神雕侠侣的作者是', "b");
			this.answers.put('晚月庄的七宝天岚舞可以提升哪个属性', "b");
			this.answers.put('论剑在周几进行', "b");
			this.answers.put('vip每天不可以领取什么', "b");
			this.answers.put('每天有几次试剑', "b");
			this.answers.put('晚月庄七宝天岚舞可以提升什么', "b");
			this.answers.put('哪个分享可以获得20元宝', "b");
			this.answers.put('大保险卡可以承受多少次死亡后不降技能等级', "b");
			this.answers.put('凌虚锁云步是哪个门派的技能', "b");
			this.answers.put('屠龙刀法是哪个门派的绝学技能', "b");
			this.answers.put('金丝鞋可以在哪位npc那里获得', "b");
			this.answers.put('老毒物在白驮山的哪个场景', "b");
			this.answers.put('毒物阵法是哪个门派的阵法', "b");
			this.answers.put('以下哪个不是知客道长教导的武学', "b");
			this.answers.put('飞仙剑阵是哪个门派的阵法', "b");
			this.answers.put('副本完成后不可获得下列什么物品', "b");
			this.answers.put('晚月庄意寒神功可以提升什么', "b");
			this.answers.put('北冥神功是哪个门派的技能', "b");
			this.answers.put('论剑中以下哪个是青城派的技能', "b");
			this.answers.put('六阴追魂剑是哪个门派的技能', "b");
			this.answers.put('王铁匠是在那个场景', "b");
			this.answers.put('以下哪个是步玄派的祖师', "b");
			this.answers.put('在洛阳萧问天那可以学习什么心法', "b");
			this.answers.put('在哪个npc处能够升级易容术', "b");
			this.answers.put('摹刻10级的装备需要摩刻技巧多少级', "b");
			this.answers.put('师门任务什么时候更新', "b");
			this.answers.put('哪个npc属于全真七子', "b");
			this.answers.put('正邪任务中卖花姑娘在哪个地图', "b");
			this.answers.put('风老前辈在华山哪个场景', "b");
			this.answers.put('“留云馆”场景是在哪个地图上？', "b");
			this.answers.put('割鹿刀可以在哪位npc那里获得', "b");
			this.answers.put('论剑中以下哪个是大招寺的技能', "b");
			this.answers.put('全真的基本阵法有哪个特殊效果', "b");
			this.answers.put('论剑要在晚上几点前报名', "b");
			this.answers.put('碧磷鞭的伤害是多少？', "b");
			this.answers.put('一天能完成谜题任务多少个', "b");
			this.answers.put('正邪任务杀死好人增长什么', "b");
			this.answers.put('木道人在青城山的哪个场景', "b");
			this.answers.put('论剑中以下哪个不是大招寺的技能', "b");
			this.answers.put('“伊犁”场景是在哪个地图上？', "b");
			this.answers.put('“冰火岛”场景是在哪个地图上', "b");
			this.answers.put('“双鹤桥”场景是在哪个地图上', "b");
			this.answers.put('“百龙山庄”场景是在哪个地图上？', "b");

			this.answers.put('九阳神功是哪个门派的技能', "c");
			this.answers.put('树王坟在第几章节', "c");
			this.answers.put('阳刚之劲是哪个门派的阵法', "c");
			this.answers.put('上山打猎是挂机里的第几个任务', "c");
			this.answers.put('一张分身卡的有效时间是多久', "c");
			this.answers.put('锻造一把刻刀需要多少玄铁碎片锻造', "c");
			this.answers.put('论剑中以下哪个不是铁血大旗门的技能', "c");
			this.answers.put('如意刀是哪个门派的技能', "c");
			this.answers.put('跨服在哪个场景进入', "c");
			this.answers.put('在哪个NPC可以购买恢复内力的药品？', "c");
			this.answers.put('欧阳敏在唐门的哪个场景', "c");
			this.answers.put('密宗伏魔是哪个门派的阵法', "c");
			this.answers.put('孔雀氅是披风类的第几级装备？', "c");
			this.answers.put('天山折梅手是哪个门派的技能', "c");
			this.answers.put('玩家每天能够做几次正邪任务', "c");
			this.answers.put('柳淳风在哪一章', "c");
			this.answers.put('茅山天师正道可以提升什么', "c");
			this.answers.put('洪帮主在洛阳哪个场景', "c");
			this.answers.put('以下哪个不是全真七子？', "c");
			this.answers.put('云九天是哪个门派的师傅', "c");
			this.answers.put('摹刻烈日宝链需要多少级摩刻技巧', "c");
			this.answers.put('伏虎杖的伤害是多少', "c");
			this.answers.put('灵蛇杖法是哪个门派的技能', "c");
			this.answers.put('“子午楼”场景是在哪个地图上', "c");
			this.answers.put('什么装备可以镶嵌紫水晶', "c");
			this.answers.put('石师妹哪个门派的师傅', "c");
			this.answers.put('烈火旗大厅是那个地图的场景', "c");
			this.answers.put('打土匪是挂机里的第几个任务', "c");
			this.answers.put('捏脸需要花费多少银两', "c");
			this.answers.put('大旗门的云海心法可以提升哪个属性', "c");
			this.answers.put('论剑中以下哪个是铁雪山庄的技能', "c");
			this.answers.put('“白玉牌楼”场景是在哪个地图上', "c");
			this.answers.put('以下哪个宝石不能镶嵌到披风', "c");
			this.answers.put('魏无极身上掉落什么装备', "c");
			this.answers.put('以下不是步玄派的技能的哪个', "c");
			this.answers.put('“常春岛渡口”场景是在哪个地图上', "c");
			this.answers.put('北斗七星阵是第几个的组队副本', "c");
			this.answers.put('宝石合成一次需要消耗多少颗低级宝石', "c");
			this.answers.put('烈日项链可以镶嵌几颗宝石', "c");
			this.answers.put('达摩在少林哪个场景', "c");
			this.answers.put('积分商城在雪亭镇的哪个场景', "c");
			this.answers.put('全真的双手互搏有哪个特殊效果', "c");
			this.answers.put('论剑中以下哪个不是唐门的人物', "c");
			this.answers.put('棋道是哪个门派的技能', "c");
			this.answers.put('七星鞭的伤害是多少', "c");
			this.answers.put('富春茶社在哪一章', "c");
			this.answers.put('等级多少才能在世界频道聊天', "c");
			this.answers.put('以下哪个是封山派的祖师', "c");
			this.answers.put('论剑是星期几进行的', "c");
			this.answers.put('师门任务每天可以做多少个', "c");
			this.answers.put('风泉之剑加几点悟性', "c");
			this.answers.put('黑水伏蛟可以在哪位npc那里获得？', "c");
			this.answers.put('陆得财是哪个门派的师傅', "c");
			this.answers.put('拜师小龙女需要容貌多少', "c");
			this.answers.put('下列装备中不可摹刻的是', "c");
			this.answers.put('古灯大师是哪个门派的终极师傅', "c");
			this.answers.put('“翰墨书屋”场景是在哪个地图上', "c");
			this.answers.put('论剑中大招寺第一个要拜的师傅是谁', "c");
			this.answers.put('杨过小龙女分开多少年后重逢', "c");
			this.answers.put('选择孤儿会影响哪个属性', "c");
			this.answers.put('论剑中逍遥派的终极师傅是谁', "c");
			this.answers.put('不可保存装备下线多久会消失', "c");
			this.answers.put('一个队伍最多有几个队员', "c");
	//        this.answers.put('论语在哪购买', "c");
			this.answers.put('以下哪个宝石不能镶嵌到戒指', "c");
			this.answers.put('论剑是每周星期几', "c");
			this.answers.put('茅山在哪里拜师', "c");
			this.answers.put('以下哪个宝石不能镶嵌到腰带', "c");
			this.answers.put('黄宝石加什么属性', "c");
			this.answers.put('茅山可以招几个宝宝', "c");
			this.answers.put('唐门密道怎么走', "c");
			this.answers.put('论剑中以下哪个不是大理段家的技能', "c");
			this.answers.put('论剑中以下哪个不是魔教的人物', "d");
			this.answers.put('每天能做多少个师门任务', "c");
			this.answers.put('一天能使用元宝做几次暴击谜题', "c");

			this.answers.put('成长计划第七天可以领取多少元宝', "d");
			this.answers.put('每天能挖几次宝', "d");
			this.answers.put('日月神教大光明心法可以提升什么', "d");
			this.answers.put('在哪个npc处领取免费消费积分', "d");
			this.answers.put('副本有什么奖励', "d");
			this.answers.put('论剑中以下不是华山派的人物的是哪个', "d");
			this.answers.put('论剑中以下哪个不是丐帮的技能', "d");
			this.answers.put('以下哪个不是慧名尊者教导的技能', "d");
			this.answers.put('慕容山庄的斗转星移可以提升哪个属性', "d");
			this.answers.put('论剑中以下哪个不是铁雪山庄的技能', "d");
			this.answers.put('师门任务一天能完成几次', "d");
			this.answers.put('以下有哪些物品不是每日充值的奖励', "d");
			this.answers.put('论剑中以下哪个不是华山派的技能的', "d");
			this.answers.put('武穆兵法提升到多少级才能出现战斗必刷', "d");
			this.answers.put('论剑中以下哪个不是全真教的技能', "d");
			this.answers.put('师门任务最多可以完成多少个', "d");
			this.answers.put('张三丰在哪一章', "d");
			this.answers.put('倚天剑加多少伤害', "d");
			this.answers.put('以下谁不精通降龙十八掌', "d");
			this.answers.put('论剑中以下哪个不是明教的技能', "d");
			this.answers.put('受赠的消费积分在哪里领取', "d");
			this.answers.put('以下哪个不是道尘禅师教导的武学', "d");
			this.answers.put('古墓多少级以后才能进去', "d");
			this.answers.put('千古奇侠称号需要多少论剑积分兑换', "d");
			this.answers.put('魔鞭诀在哪里学习', "d");
			this.answers.put('通灵需要花费多少银两', "d");
			this.answers.put('白银宝箱礼包多少元宝一个', "d");
			this.answers.put('以下哪个不是论剑的皮肤', "d");
			this.answers.put('小李飞刀的伤害是多少', "d");
			this.answers.put('下面哪个npc不是魔教的', "d");
			this.answers.put('天蚕围腰是腰带类的第几级装备', "d");
			this.answers.put('黄岛主在桃花岛的哪个场景', "d");
			this.answers.put('宝玉帽可以在哪位npc那里获得？', "d");
			this.answers.put('什么影响攻击力', "d");
			this.answers.put('紫宝石加什么属性', "d");
			this.answers.put('少林的混元一气功有哪个特殊效果', "d");
			this.answers.put('以下哪个是晚月庄的祖师', "d");
			this.answers.put('以下不是隐藏门派的是哪个', "d");
			this.answers.put('第一个副本需要多少等级才能进入', "d");
			this.answers.put('风泉之剑在哪里获得', "d");
			this.answers.put('镖局保镖是挂机里的第几个任务', "d");
			this.answers.put('下面哪个不是古墓的师傅', "d");
			this.answers.put('每个玩家最多能有多少个好友', "b");
			this.answers.put('以下哪个不是在扬州场景', "d");
			this.answers.put('茅山的天师正道可以提升哪个属性', "d");
			this.answers.put('“无名山脚”场景是在哪个地图上', "d");
			this.answers.put('闯楼第几层可以获得称号“藏剑楼楼主”', "d");
			this.answers.put('充值积分不可以兑换下面什么物品', "d");
			this.answers.put('魔教的大光明心法可以提升哪个属性', "d");
			this.answers.put('以下哪些物品不是成长计划第三天可以领取的', "d");
			this.answers.put('论剑中以下哪个不是峨嵋派可以拜师的师傅', "d");
			this.answers.put('哪个技能不是魔教的', "d");
			this.answers.put('沧海护腰可以镶嵌几颗宝石', "d");
			this.answers.put('城里打擂是挂机里的第几个任务', "d");
			this.answers.put('以下哪个不是鲁长老教导的武学', "d");
			this.answers.put('以下哪些物品不是成长计划第一天可以领取的', "d");
			this.answers.put('包拯在哪一章', "d");
			this.answers.put('张天师在茅山哪个场景', "d");
			this.answers.put('山河藏宝图需要在哪个NPC手里购买？', "d");
			this.answers.put('影响你出生的福缘的出生是', "d");
			this.answers.put('张三丰在武当山哪个场景', "d");
			this.answers.put('春秋水色斋需要多少杀气才能进入', "d");
			this.answers.put('论剑中以下哪个不是是晚月庄的技能', "d");
			this.answers.put('大乘佛法有什么效果', "d");
			this.answers.put('正邪任务最多可以完成多少个', "d");
			this.answers.put('高级突破丹多少元宝一颗', "d");
			this.answers.put('清虚道长在哪一章', "d");
			this.answers.put('在战斗界面点击哪个按钮可以进入聊天界面', "d");
			this.answers.put('“鹰记商号”场景是在哪个地图上？', "d");
			this.answers.put('改名字在哪改', "d");
			this.answers.put('以下哪个不是在洛阳场景', "d");
	//        this.answers.put('青城派的道德经可以提升哪个属性', "d");
			this.answers.put('金项链可以在哪位npc那里获得', "d");

			this.answer = function(a) {
	//          alert("答案是：" + a);
				pushCmd("question " + a,0);
	//            go("question");
			}

			this.dispatchMessage = function(b) {
				var type = b.get("type"), msg= b.get("msg")
				if (type == "show_html_page" && msg.indexOf("知识问答第") > 0) {
					console.log(msg);
					if (msg.indexOf("回答正确！") > 0) {
						pushCmd("question");
						return;
					}

					var q = this.answers.keys();
					for (var i in q) {
						var k = q[i];

						if (msg.indexOf(k) > 0) {
							this.answer(this.answers.get(k));
							break;
						}
					}

	//                else if (msg.indexOf("正邪任务一天能做几次") > 0) this.answer("b")

				}
			}
		}

		var question = new Question
			function Trigger(r, h, c, n) {
			this.regexp = r;
			this.handler = h;
			this.class = c;
			this.name = n;

			this.enabled = true;

			this.trigger = function(line) {
				if (!this.enabled) return;

				if (!this.regexp.test(line)) return;

				console.log("触发器: " + this.regexp + "触发了");
				var m = line.match(this.regexp);
				this.handler(m);
			}

			this.enable = function() {
				this.enabled = true;
			}

			this.disable = function() {
				this.enabled = false;
			}

		}

		jh = function(w) {
			if (w == 'xt') w = 1;
			if (w == 'ly') w = 2;
			if (w == 'hsc') w = 3;
			if (w == 'hs') w = 4;
			if (w == 'yz') w = 5;
			if (w == 'gb') w = 6;
			if (w == 'qy') w = 7;
			if (w == 'em') w = 8;
			if (w == 'hs2') w = 9;
			if (w == 'wd') w = 10;
			if (w == 'wy') w = 11;
			if (w == 'sy') w = 12;
			if (w == 'sl') w = 13;
			if (w == 'tm') w = 14;
			if (w == 'qc') w = 15;
			if (w == 'xx') w = 16;
			if (w == 'kf') w = 17;
			if (w == 'gmd') w = 18;
			if (w == 'qz') w = 19;
			if (w == 'gm') w = 20;
			if (w == 'bt') w = 21;
			if (w == 'ss') w = 22;
			if (w == 'mz') w = 23;
			if (w == 'ts') w = 24;


			pushCmd("jh " + w, 0);
		};


		function Triggers() {
			this.allTriggers = [];

			this.trigger = function(line) {
				var t = this.allTriggers.slice(0);
				for (var i = 0, l = t.length; i < l; i++) {
					t[i].trigger(line);
				}
			}

			this.newTrigger = function(r, h, c, n) {
				var t = new Trigger(r, h, c, n);
				if (n) {
					for (var i = this.allTriggers.length - 1; i >= 0; i--) {
						if (this.allTriggers[i].name == n) this.allTriggers.splice(i, 1);
					}
				}

				this.allTriggers.push(t);

				return t;
			}

			this.enableTriggerByName = function(n) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t.name == n) t.enable();
				}
			}

			this.disableTriggerByName = function(n) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t.name == n) t.disable();
				}
			}

			this.enableByCls = function(c) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t.class == c) t.enable();
				}
			}

			this.disableByCls = function(c) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t.class == c) t.disable();
				}
			}

			this.removeByCls = function(c) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t && t.class == c) this.allTriggers.splice(i, 1);
				}
			}

			this.removeByName = function(n) {
				for (var i = this.allTriggers.length - 1; i >= 0; i--) {
					t = this.allTriggers[i];
					if (t.name == n) this.allTriggers.splice(i, 1);
				}
			}
		}

		window.triggers = new Triggers;

		triggers.newTrigger(/似乎以下地方藏有宝物(.*)/, function(m) {
			m = m[1].split(/\d+/);
			var bl_found = false;
			for (i = 0, l = m.length; i < l; i++) {
				var a = m[i];
				console.log(a);
				if (/一片翠绿的草地/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/大诗人白居易之墓，墓碑上刻着“唐少傅白公墓”。四周环绕着冬青。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/你现在正站在雪亭镇南边的一家小客栈里，这家客栈虽小，却是方圆五百里/.test(a)) {
					jh('xt');
					go('dig go');
					bl_found = true;
					break;
				}
				if (/这里是雪亭镇镇前广场的空地，地上整齐地铺著大石板。广场中央有一个木头搭的架子，经过多年的风吹日晒雨淋，看来非常破旧。四周建筑林立。往西你可以看到一间客栈，看来生意似乎很好。/.test(a)) {
					jh('xt');
					go('e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间十分老旧的城隍庙，在你面前的神桌上供奉著一尊红脸的城隍，庙虽老旧，但是神案四周已被香火薰成乌黑的颜色，显示这里必定相当受到信徒的敬仰。/.test(a)) {
					jh('xt');
					go('e;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条普通的黄土小径，弯弯曲曲往东北一路盘旋上山，北边有一间城隍庙，往西则是雪亭镇的街道。/.test(a)) {
					jh('xt');
					go('e;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条普通的黄土小径，小径往西南通往一处山间的平地，从这里可以望见不少房屋错落在平地上，往东北则一路上山。/.test(a)) {
					jh('xt');
					go('e;e;s;ne;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条说宽不宽，说窄倒也不窄的山路，路面用几块生满青苔的大石铺成，西面是一段坡地，从这里可以望见西边有几间房屋错落在林木间，东面则是山壁，山路往西南衔接一条黄土小径，往北则是通往山上的石阶。/.test(a)) {
					jh('xt');
					go('e;e;s;ne;ne;dig go');
					bl_found = true;
					break;
				}
				if (/这里是雪亭镇的街口，往北是一个热闹的广场，南边是条小路通往一座林子，东边则有一条小径沿著山腰通往山上，往西是一条比较窄的街道，参差不齐的瓦屋之间传来几声犬吠。从这里向东南走就是进出关的驿道了。/.test(a)) {
					jh('xt');
					go('e;s;dig go');
					bl_found = true;
					break;
				}
				if (/这里是雪亭镇的街道，你的北边有一家客栈，从这里就可以听到客栈里人们饮酒谈笑/.test(a)) {
					jh('xt');
					go('e;s;w;dig go');
					bl_found = true;
					break;
				}
				if (/这里是一间宽敞的书院，虽然房子看起来很老旧了，但是打扫得很整洁，墙壁上挂著一幅山水画，意境颇为不俗，书院的大门开在北边，西边有一扇木门通往边厢。/.test(a)) {
					jh('xt');
					go('e;s;w;s;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条宽敞坚实的青石板铺成的大道，路上车马的痕迹已经在路面上留下一条条明显的凹痕，往东是一条较小的街道通往雪亭镇。/.test(a)) {
					jh('xt');
					go('e;s;w;w;dig go');
					bl_found = true;
					break;
				}
				if (/你现在正走在雪亭镇的街道上，东边不远处有一间高大的院子，门口立著一根粗大的旗杆/.test(a)) {
					jh('xt');
					go('e;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间素来以公平信用著称的钱庄，钱庄的老板还是个曾经中过举人的读书人/.test(a)) {
					jh('xt');
					go('e;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/你现在正站在一间大宅院的入口，两只巨大的石狮镇守在大门的两侧，一阵阵吆喝与刀剑碰撞的声音从院子中传来，通过大门往东可以望见许多身穿灰衣的汉子正在操练。/.test(a)) {
					jh('xt');
					go('e;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/你现在正站在一个宽敞的教练场中，地上铺著黄色的细砂，许多人正在这里努力地操练著，北边是一间高大的兵器厅，往东则是武馆师父们休息的大厅。/.test(a)) {
					jh('xt');
					go('e;n;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间堆满各式兵器、刀械的储藏室，各式武器都依照种类、长短、依次放在一起，并且擦拭得一尘不染，储藏室的出口在你的南边，面对出口的左手边有一个架子/.test(a)) {
					jh('xt');
					go('e;n;e;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里是淳风武馆的正厅，五张太师椅一字排开面对著门口，这是武馆中四位大师傅与馆主柳淳风的座位/.test(a)) {
					jh('xt');
					go('e;n;e;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是淳风武馆中的天井，往西走可以回到正厅/.test(a)) {
					jh('xt');
					go('e;n;e;e;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是一间整理得相当乾净的书房，红木桌椅上铺著蓝绸巾，显得十分考究，西面的立著一个书架，上面放著一排排的古书，往南走出房门可以看到天井。/.test(a)) {
					jh('xt');
					go('e;n;e;e;e;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里是一间布置得相当雅致的厢房，从窗子可以看到北边的天井跟南边的庭园中各式各样的奇花异草，以及他们所带来的淡淡香气，厢房的东面墙上还挂著一幅仕女图/.test(a)) {
					jh('xt');
					go('e;n;e;e;e;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/这里是淳风武馆的内院，平常武馆弟子没有馆主的允许是不敢到这里来的/.test(a)) {
					jh('xt');
					go('e;n;e;e;e;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/你现在正走在雪亭镇的大街，往南直走不远处是镇上的广场，在你的东边是一间大宅院/.test(a)) {
					jh('xt');
					go('e;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里是一间打铁铺子，从火炉中冒出的火光将墙壁映得通红，屋子的角/.test(a)) {
					jh('xt');
					go('e;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/这里是雪亭镇的大街，东边有一栋陈旧的建□，看起来像是什麽店铺，但是并没有任何招牌，只有一扇门上面写著一个大大的/.test(a)) {
					jh('xt');
					go('e;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一家中等规模的当铺，老旧的柜台上放著一张木牌/.test(a)) {
					jh('xt');
					go('e;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是丰登当铺的储藏室，有时候当铺里的大朝奉会把铺里存不下的死当货物拿出来拍卖/.test(a)) {
					jh('xt');
					go('e;n;n;n;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是雪亭镇的大街，一条小巷子通往东边，西边则是一间驿站/.test(a)) {
					jh('xt');
					go('e;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里是负责雪亭镇官府文书跟军令往来的雪亭驿/.test(a)) {
					jh('xt');
					go('e;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/一间小木屋，在这北方的风中吱吱作响。/.test(a)) {
					jh('xt');
					go('e;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是一处山坳，往南就是雪亭镇，一条蜿蜒的小径往东通往另一个邻近的小山村/.test(a)) {
					jh('xt');
					go('e;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里便是有名的龙门石窟，石窟造像，密布于两岸的崖壁上。远远可以望见琵琶峰上的白冢。/.test(a)) {
					jh('ly');
					go('dig go');
					bl_found = true;
					break;
				}
				if (/城南官道，道路两旁是一片树林，远处是一片片的农田了。田地里传来农人的呼号，几头黄牛悠闲的趴卧着。/.test(a)) {
					jh('ly');
					go('n;dig go');
					bl_found = true;
					break;
				}
				if (/由此洛阳城南门出去，就可以通往南市的龙门石窟。城门处往来客商络绎不绝，几名守城官兵正在检查过往行人。/.test(a)) {
					jh('ly');
					go('n;n;dig go');
					bl_found = true;
					break;
				}
				if (/洛阳最繁华的街市，这里聚集着各国客商。/.test(a)) {
					jh('ly');
					go('n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里便是洛水渡口静静的洛水由此向东，汇入滚滚黄河。码头上正泊着一艘船坞，常常的缆绳垂在水中。/.test(a)) {
					jh('ly');
					go('n;n;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/一艘普通的船坞，船头坐着一位蓑衣男子。/.test(a)) {
					jh('ly');
					go('n;n;e;s;luoyang317_op1;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是洛阳的南面了，街上有好几个乞丐在行乞。/.test(a)) {
					jh('ly');
					go('n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是一座供奉洛神的小庙。小庙的地上放着几个蒲团。/.test(a)) {
					jh('ly');
					go('n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/这儿就是洛阳金刀世家了。金刀门虽然武功不算高，但也是有两下子的。/.test(a)) {
					jh('ly');
					go('n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/金刀世家的练武场。金刀门的门主王天霸在这儿教众弟子习武。/.test(a)) {
					jh('ly');
					go('n;n;n;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是洛神庙下面的地道，上面人走动的声音都隐约可听见。/.test(a)) {
					jh('ly');
					go('n;n;n;w;putuan;dig go');
					bl_found = true;
					break;
				}
				if (/湿润的青石路显然是刚刚下过雨，因为来往行人过多，路面多少有些坑坑凹凹，一不留神很容易被绊到。/.test(a)) {
					jh('ly');
					go('n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这儿就是菜市口。各种小贩商人十分嘈杂，而一些地痞流氓也混迹人群伺机作案。/.test(a)) {
					jh('ly');
					go('n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/一个猪肉摊，在这儿摆摊卖肉已经十多年了。/.test(a)) {
					jh('ly');
					go('n;n;n;n;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/你刚踏进巷子，便听得琴韵丁冬，小巷的宁静和外面喧嚣宛如两个世界/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/小院四周满是盛开的桃花，穿过一条长廊，一座别致的绣楼就在眼前了。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;s;dig go');
					bl_found = true;
					break;
				}
				if (/绣楼内挂着湖绿色帐幔，一名女子斜靠在窗前的美人榻上。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;s;w;dig go');
					bl_found = true;
					break;
				}
				if (/这里就是背阴巷了，站在巷口可以万剑阴暗潮湿的窄巷，这里聚集着洛阳的地痞流氓，寻常人不敢近前。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;event_1_98995501;dig go');
					bl_found = true;
					break;
				}
				if (/黑暗的街道，几个地痞无赖正慵懒的躺在一旁。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;event_1_98995501;n;dig go;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一家酒肆，洛阳地痞头目甄大海正坐在里面小酌。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;event_1_98995501;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/院落里杂草丛生，东面的葡萄架早已枯萎。/.test(a)) {
					jh('ly');
					go('n;n;n;n;w;event_1_98995501;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/一座跨街大青砖砌的拱洞高台谯楼，矗立在城中心。鼓楼为二层木瓦建筑，设有大鼓大钟，晨钟暮鼓，用以报时。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/相传春秋时代，楚王在此仰望周王城，问鼎重几何。周室暗弱，居然隐忍不发。这便是街名的由来。银钩赌坊也在这条街上。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/这里便是洛阳有名的悦来客栈，只见客栈大门处人来人往，看来生意很红火。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;n;dig go');
					bl_found = true;
					break;
				}
				if (/客栈大院，院内紫藤花架下放着几张桌椅，东面是一座马厩。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/客栈马倌正在往马槽里添草料，旁边草料堆看起来有些奇怪。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/房间布置的极为雅致，没有太多的装饰，唯有屋角放着一个牡丹屏风。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/赌坊二楼走廊，两旁房间里不时床来莺声燕语，看来这里不止可以赌。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/通往赌坊二楼的楼梯，上面铺着大红色地毯。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/大厅满是呼庐喝雉声、骰子落碗声、银钱敲击声，男人和女人的笑声，/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;n;dig go');
					bl_found = true;
					break;
				}
				if (/走出赌坊后门，桂花清香扑面而来，桂花树下的水缸似乎被人移动过。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/赌坊门口人马喧哗，门上一支银钩在风中摇晃，不知道多少人咬上了这没有鱼饵的钩/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;w;dig go');
					bl_found = true;
					break;
				}
				if (/自古以来，洛阳墨客骚人云集，因此有“诗都”之称，牡丹香气四溢，又有“花都”的美誉/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;s;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是牡丹园内的一座小亭子，布置得十分雅致。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;w;s;luoyang111_op1;dig go');
					bl_found = true;
					break;
				}
				if (/也许由于连年的战乱，使得本来很热闹的街市冷冷清清，道路两旁的店铺早已破旧不堪，一眼望去便知道有很久没有人居住了。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这间当铺处于闹市，位置极好。当铺老板正半眯着双眼在高高的柜台上打盹。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/你无意中走进一条青石街，这里不同于北大街的繁华热闹，两边是一些小店铺，北面有一家酒肆，里面出入的人看起来衣衫褴褛。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间小酒肆，里面黑暗潮湿，满是油垢的桌旁，几名无赖正百无聊赖的就着一盘花生米喝酒。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是洛阳北边街道，人群熙熙攘攘甚是热闹。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/洛阳城的钱庄，来往的商客往往都会将银两存于此处。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/就是洛阳北门，门口站着的是守城官兵。站在城楼望出去，外面是一片茅草路。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/城北通往邙山的小路，路旁草丛中时有小兽出没。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/一片绿云般的竹林隔绝了喧嚣尘世，步入这里，心不由平静了下来。青石小路在竹林中蜿蜒穿行，竹林深处隐约可见一座小院。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/绿竹环绕的小院，院内几间房舍都用竹子打造，与周围竹林颇为和谐。这小院的主人显然有些独特之处。院内一名老翁正在劈柴。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;n;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/一间雅致的书斋，透过窗户可以见到青翠修竹，四周如此清幽，竹叶上露珠滴落的声音都能听见。靠墙的书架看起来很别致。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;n;e;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/ 就是洛阳城墙上的城楼，驻守的官兵通常会在这儿歇个脚，或是聊下天。如果心细之人，能看到角落里似乎有一个隐秘的把手。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/ 这个城楼上的密室显然是守城军士秘密建造的，却不知有何用途。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;w;luoyang14_op1;dig go');
					bl_found = true;
					break;
				}
				if (/这就是洛阳城的城墙。洛阳是重镇，因此城墙上驻守的官兵格外多。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/由于连年的战乱，整条金谷街的不少铺子已经荒废掉了。再往东走就是洛阳地痞流氓聚集的背阴巷。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是洛阳首富的庄院，据说家财万贯，富可敌国。庄院的的中间有一棵参天大树。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/这儿是富人家的储藏室，因此有不少奇珍异宝。仔细一看，竟然还有一个红光满面的老人家半躺在角落里。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;n;op1;dig go');
					bl_found = true;
					break;
				}
				if (/一座朴实的石拱桥，清澈河水从桥下流过。对面可见一座水榭。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;dig go');
					bl_found = true;
					break;
				}
				if (/荷池旁的水榭，几名游客正在里面小憩。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/回廊两旁便是碧绿荷塘，阵阵荷香拂过。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/荷塘中的观景台，两名女子在这里游玩。远远站着几名护卫，闲杂人等一律被挡在外面。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/隐藏在一片苍翠树林中的小路，小路尽头有座草屋。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/简陋的茅草小屋，屋内陈设极其简单。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/石阶两侧山泉叮咚，林木森森。漫步而上，可见山腰有亭。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这就是听伊亭，据说白居易曾与好友在此品茗、论诗。一旁的松树上似乎有什么东西。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/丛林小径，因为走得人少，小径已被杂草覆盖。/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/听着松涛之音，犹如直面大海/.test(a)) {
					jh('ly');
					go('n;n;n;n;n;e;e;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这里是华山村村口，几个草垛随意的堆放在路边，三两个泼皮慵懒躺在那里。/.test(a)) {
					jh('hsc');
					go('dig go');
					bl_found = true;
					break;
				}
				if (/这是一条穿过村口松树林的小路。/.test(a)) {
					jh('hsc');
					go('n;dig go');
					bl_found = true;
					break;
				}
				if (/这就是有名的神女冢，墓碑前散落着游人墨客烧的纸钱，前面不远处有一间破败的土地庙。/.test(a)) {
					jh('hsc');
					go('n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一片溪边的杏树林，一群孩童在此玩耍。/.test(a)) {
					jh('hsc');
					go('w;dig go');
					bl_found = true;
					break;
				}
				if (/村口一个简易茶棚，放着几张木质桌椅，干净齐整，过往路人会在这里喝杯热茶歇歇脚，村里的王老二常常会混在这里小偷小摸。/.test(a)) {
					jh('hsc');
					go('w;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间破败的土地庙门口，门旁的对联已经模糊不清，隐约只见上联“德之不修/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;dig go');
					bl_found = true;
					break;
				}
				if (/土地庙庙堂，正中供奉着土地，香案上堆积这厚厚的灰尘。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;dig go');
					bl_found = true;
					break;
				}
				if (/隐藏在佛像后的地道入口，两只黑狗正虎视眈眈的立在那里。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/通往西侧的通道，前面被铁栅栏挡住了。/.test(a)) {
					jh('hsc');
					bl_found = true;
					go('w;event_1_59520311;n;n;w;dig go');
					break;
				}
				if (/通往地下通道的木楼梯/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/通道两侧点着油灯，昏暗的灯光让人看不清楚周围的环境。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/通往东侧的通道，前面传来有水声和痛苦的呻吟。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一件宽敞的大厅，正中间摆着一张太师椅，两侧放着一排椅子。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一件布置极为简单的卧房，显然只是偶尔有人在此小憩。床上躺着一名半裸女子，满脸惊恐。/.test(a)) {
					jh('hsc');
					go('w;event_1_59520311;n;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条古老的青石街，几个泼皮在街上游荡。/.test(a)) {
					jh('hsc');
					go('s;dig go');
					bl_found = true;
					break;
				}
				if (/这是一条碎石小路，前面有一个打铁铺。/.test(a)) {
					jh('hsc');
					go('s;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间打铁铺，炉火烧的正旺，一名汉子赤膊挥舞着巨锤，锤落之处但见火花四溅。/.test(a)) {

					jh('hsc');
					go('s;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/一棵千年银杏树屹立在广场中央，树下有一口古井，据说这口古井的水清澈甘甜，村里的人每天都会来这里挑水。/.test(a)) {
					jh('hsc');
					go('s;s;dig go');
					bl_found = true;
					break;
				}
				if (/村里的杂货铺，店老板正在清点货品。/.test(a)) {
					jh('hsc');
					go('s;s;e;dig go');
					bl_found = true;
					break;
				}
				if (/杂货铺后院，堆放着一些杂物，东边角落里放着一个马车车厢，一个跛脚汉子坐在一旁假寐。/.test(a)) {
					jh('hsc');
					go('s;s;e;s;dig go');
					bl_found = true;
					break;
				}
				if (/这是一个普通的马车车厢，粗布帘挡住了马车车窗和车门，地板上面躺着一个人。/.test(a)) {
					jh('hsc');
					go('s;s;e;s;huashancun24_op2;dig go');
					bl_found = true;
					break;
				}
				if (/这是村内宗祠大门，门口一棵古槐，树干低垂。/.test(a)) {
					jh('hsc');
					go('s;s;w;dig go');
					bl_found = true;
					break;
				}
				if (/宗祠的大厅，这里供奉着宗室先祖。/.test(a)) {
					jh('hsc');
					go('s;s;w;n;dig go');
					bl_found = true;
					break;
				}
				if (/青石板铺就的小桥，几棵野草从石缝中钻出，清澈的溪水自桥下湍湍流过。/.test(a)) {
					jh('hsc');
					go('s;s;s;dig go');
					bl_found = true;
					break;
				}
				if (/田间泥泞的小路，一个稻草人孤单的立在一旁，似乎在指着某个地方。一个男子神色慌张的从一旁田地里钻出。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间竹篱围城的小院，院内种着几株桃花，屋后竹林环绕，颇为雅致。旁边的西厢房上挂着一把铜制大锁，看起来有些奇怪。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;w;dig go');
					bl_found = true;
					break;
				}
				if (/这是小院的厅堂，迎面墙壁上挂着一幅山水画，看来小院的主人不是普通农人。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;w;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是一间普通的厢房，四周窗户被布帘遮得严严实实。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;w;get_silver;dig go');
					bl_found = true;
					break;
				}
				if (/一条杂草丛生的乡间小路，时有毒蛇出没。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;dig go');
					bl_found = true;
					break;
				}
				if (/一间看起来有些破败的小茅屋，屋内角落里堆着一堆稻草，只见稻草堆悉悉索索响了一阵，竟然从里面钻出一个人来。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;e;dig go');
					bl_found = true;
					break;
				}
				if (/清风寨山脚，站在此处可以摇摇望见四面悬崖的清风寨。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;dig go');
					bl_found = true;
					break;
				}
				if (/通往清风寨唯一的山路，一侧便是万丈深渊。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;dig go');
					bl_found = true;
					break;
				}
				if (/两扇包铁木门将清风寨与外界隔绝开来，门上写着“清风寨”三字。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里就是桃花泉，一片桃林环绕着清澈泉水，据说泉水一年四季不会枯竭。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/清风寨前院，地面由坚硬岩石铺就。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/清风寨练武场，四周放置着兵器架。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/清风寨议事厅，正中放置着一张虎皮椅。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里是清风寨后院，远角有一颗大树，树旁有一扇小门。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这里就是清风寨兵器库了，里面放着各色兵器。角落里一个上锁的黑铁箱不知道装着什么。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/这里的空气中充满清甜的味道，地上堆积着已经晒干的柿子。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/这是清风寨寨主的卧房，床头挂着一把大刀。/.test(a)) {
					jh('hsc');
					go('s;s;s;s;s;nw;n;n;n;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/这是通往二楼大厅的楼梯，楼梯扶手上的雕花精美绝伦，看来这酒楼老板并不是一般的生意人/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;dig go');
					bl_found = true;
					break;
				}
				if (/二楼是雅座，文人学士经常在这里吟诗作画，富商土豪也在这里边吃喝边作交易。/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/进门绕过一道淡绿绸屏风，迎面墙上挂着一副『芙蓉出水』图。厅内陈列奢华，雕花楠/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;n;w;dig go');
					bl_found = true;
					break;
				}
				if (/进门绕过一道淡黄绸屏风，迎面墙上挂着一副『芍药』图，鲜嫩欲滴/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;n;e;dig go');
					bl_found = true;
					break;
				}
				if (/进门绕过一道淡红绸屏风，迎面墙上挂着一副『牡丹争艳』图，牡丹素以富贵著称。图侧对联：“幽径天姿呈独秀，古园国色冠群芳”。/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;n;n;dig go');
					bl_found = true;
					break;
				}
				if (/你站在观景台上眺望，扬州城的美景尽收眼底。东面是就是小秦淮河岸，河岸杨柳轻拂水面，几簇粉色桃花点缀其间。/.test(a)) {
					jh('yz');
					go('n;n;n;n;n;n;e;n;n;n;n;dig go');
					bl_found = true;
					break;
				}

			}
			if (bl_found) go("cangbaotu_op1");
	//      window.setTimeout('go("cangbaotu_op1")', 3000);
		}, "", "cbt");



		window.game = this;

		window.attach = function() {
			var oldWriteToScreen = window.writeToScreen;
			window.writeToScreen = function(a, e, f, g) {
				oldWriteToScreen(a, e, f, g);
				a = a.replace(/<[^>]*>/g, "");
				triggers.trigger(a);
			};

			webSocketMsg.prototype.old = gSocketMsg.dispatchMessage;

			gSocketMsg.dispatchMessage = function(b) {
				this.old(b);
				question.dispatchMessage(b);
				/*
				if (fishingTrigger==1){
					fishfeedback.dispatchMessage(b);
				}
				if (QxTalking==1){
					whipser.dispatchMessage(b);
				}
				if (escapeTrigger==1){
					escape.dispatchMessage(b);
				}
				if (onekillTrigger==1){
					onekill.dispatchMessage(b);
				}
				if(fanjiTrigger==1){
					combat.dispatchMessage(b);
				}
				if (kuafuTrigger==1){
					kuafu.dispatchMessage(b);
				}*/
				if (tianjianTrigger==1){
					tianjian.dispatchMessage(b);
				}/*
				if (Debug==1){
					debugm.dispatchMessage(b);
				}
				if (killerTrigger==1){
					killing.dispatchMessage(b);
				}
				if (GodMode==1){
					godview.dispatchMessage(b);
				}*/
				/*
				if (permission==0){
					allowed.dispatchMessage(b);
				}*/

			}
		};
		attach();

	})(window);
//-----------通用代码------------
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}
function execCmdQueue()
{	
	if (!cmdQueue.isEmpty())
	{
		curStamp=(new Date()).valueOf();
		if ((curStamp-preStamp)>200){
			var cmd = cmdQueue.dequeue();
			clickButton(cmd);
			preStamp=curStamp;
		}		
	}
	setTimeout(function(){execCmdQueue();},10);
}

execCmdQueue();
function pushCmd(cmd)
{	
	cmdQueue.enqueue(cmd);
}
function pullCmd()
{
	if (j<100)
	{
		;
		console.log(cmdQueue.dequeue());
		j++;
		setTimeout(pullCmd,1000);	
	}
}

//队列构造
function Queue() {
	
	this.items = [];
	//初始化队列方法
	if (typeof Queue.prototype.push != "function") {
		//入队
		Queue.prototype.enqueue = function() {
				var len = arguments.length;
				if (len == 0) {
					return;
				}
				for (var i = 0; i < len; i++) {
					this.items.push(arguments[i])
				}
			}
			//出队
		Queue.prototype.dequeue = function() {
				var result = this.items.shift();
				return typeof result != 'undefined' ? result : false;
			}
			//返回队首元素
		Queue.prototype.front = function() {
				return this.items[items.length - 1];
			}
			//队列是否为空
		Queue.prototype.isEmpty = function() {
				return this.items.length == 0;
			}
			//返回队列长度
		Queue.prototype.size = function() {
				return this.items.length;
			}
			//清空队列
		Queue.prototype.clear = function() {
				this.items = [];
			}
			//返回队列
		Queue.prototype.show = function() {
			return this.items;
		}
	}
}


