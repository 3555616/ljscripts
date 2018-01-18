// ==UserScript==
// @name         论剑-脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sun modified at 2018-1-16
// @match        http://*.yytou.cn/*
// @exclude      http://res.yytou.cn/*
// @grant        none
// ==/UserScript==

//按钮外观设置-----------------------------------------------------------------
var btnList = {};		// 按钮列表
mySkillLists = "雪饮狂刀;如来神掌;排云掌法"; //通用出招技能

//奇侠顺序-----------------------------------------------------------------------------------
var qxList_input = "步惊鸿；逆风舞；庞统；浪唤雨；火云邪神；吴缜；郭济；王蓉；风南；狐苍雁；李宇飞；风行骓；护竺";	//奇侠顺序
var qxList = qxList_input.split("；");
//通用代码----------------------------------------------------------------
/**
 * [isContains 判断子串是否被包含]
 * @param  {[type]}  str    [原始字符串]
 * @param  {[type]}  substr [子串]
 * @return {Boolean}        [包含返回true]
 */
function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}

 window.go = function(dir){
    if (dir.indexOf("#")>=0)
	{
	    var dirTimer = dir.split("#");
	    var totalTime = 0;
		for(var i=0;i<dirTimer.length;i++)
		{
			if (0==dirTimer[i].indexOf("wa")){
			    var d = dirTimer[i].split(";");
			    var t = d[0].replace("wa ","") - 0;
				totalTime += t;
				setTimeout("go('" + dirTimer[i].replace(d[0] + ";","") + "')",totalTime);
			}else
			{
			    go(dirTimer[i]);
			}
		}
	}else
	{
		var dirFast = dir.split(";");
		for (var i=0;i<dirFast.length;i++)
		{
		    if (dirFast[i].trim().length>0)
			{
			   clickButton(dirFast[i], 0);
			}
		}
	}
}

//按钮列表----------------------------------------------------------------------------------------------------------------------------

btnObjList_u = {"▲qx":function(){showHideButtonAllEx("▲qx","l_u");},"比试奇侠":function(){BiShiFunc();},"撩奇侠":function(){goSwordsman(0);},"石街":function(){ShiJieFunc();},"桃花泉":function(){TaoHuaFunc();},"潭畔草地":function(){CaoDiFunc();},"临渊石台":function(){ShiTaiFunc();},"碧水寒潭":function(){BiShuiFunc();},"悬崖":function(){XuanYaFunc();},"观景台":function(){GuanJingFunc();},"峨眉":function(){EmeiFunc();},"九老":function(){JiuLaoFunc();},"鼓楼":function(){GulouFunc();},"老母洞":function(){SongshanFunc();}};
btnObjList_d= {"▼rc":function(){showHideButtonAllEx("▼rc","l_d");},"回主页":function(){GoHomeFunc();},"签到":function(){CheckInFunc();},"开答题":function(){answerQuestionsFunc();},"试剑":function(){ShiJieFunc();},"冰火岛":function(){fishingFirstFunc();},"侠客岛":function(){RiChangFunc();},"喂鳄鱼":function(){WeiYuFunc();},"采莲":function(){CailianFunc();},"暴丹":function(){BaodanFunc();},"大昭":function(){DazhaoFunc();}};
btnObjList_lu= {"◤f1":function(){showHideButtonAllEx("◤f1","l_lu");},"杀天剑":function(){killTianJianTargetFunc();},"开战斗":function(){AutoKillFunc();},"摸尸体":function(){AutoGetFunc();},"买千年":function(){YaopuFunc();}};
btnObjList_ld= {"◣f2":function(){showHideButtonAllEx("◣f2","l_ld");},"吃千年":function(){userMedecineFunc();},"杀红名":function(){killHongMingTargetFunc();},"杀黄名":function(){killHuangMingTargetFunc();}};
btnObjList_lul = {"◤zd":function(){showHideButtonAllEx("◤zd","l_lul");},"冰月谷":function(){BingYueFunc();},"青城龙灵":function(){LongLingFunc();},"白陀军阵":function(){JunZhenFunc();},"钓鱼城":function(){EmeiFunc1();}}

createButtonEx("l_u","up",420,350,60,21,2,btnObjList_u);
createButtonEx("l_d","down",420,370,60,21,2,btnObjList_d);
createButtonEx("l_lu","left",350,370,60,21,2,btnObjList_lu);
createButtonEx("l_ld","left",350,390,60,21,2,btnObjList_ld);
createButtonEx("l_luu","up",350,350,60,21,2,btnObjList_luu);
function createButtonEx(btnPrefix,btnCreateDir,btnPosStartX,btnPosStartY,btnWidth,btnHeight,btnDelta,btnArray){

	var posX = btnPosStartX;
	var posY = btnPosStartY;
	var cnt = 0;
	for (var btn in btnArray)
	{
		btnList[btn]=document.createElement('button');

		var myBtn = btnList[btn];
		btnList[btn].name = btnPrefix + btn;
		myBtn.name = btnPrefix + btn;
		if (cnt==0)
		{
			btnList[btn].name = btn;
			myBtn.name = btn;
		}
		myBtn.innerText = btn;
		myBtn.style.position = 'absolute';
		myBtn.style.left = posX + 'px';
		myBtn.style.top = posY + 'px';
		myBtn.style.paddingLeft = '0px';
		myBtn.style.paddingRight = '0px';


		myBtn.style.width = btnWidth + "px";
		myBtn.style.height = btnHeight + "px";
		myBtn.addEventListener('click', btnArray[btn]);

		// 按钮加入窗体中
		document.body.appendChild(myBtn);
		if ("left"== btnCreateDir.toLowerCase())
		{
			posX = posX - btnWidth - btnDelta;
		}
		if ("right" == btnCreateDir.toLowerCase())
		{
			posX = posX + btnWidth + btnDelta;
		}
		if ("up" == btnCreateDir.toLowerCase())
		{
			posY = posY - btnHeight - btnDelta;
		}
		if ("down" == btnCreateDir.toLowerCase())
		{
			posY = posY + btnHeight + btnDelta;
		}
		cnt+=1;
	}
}
function showHideButtonAllEx(selfName,btnPrefix)
{

    if ("block"==$("button[name^='"+btnPrefix + "']").css("display"))
	{
		$("button[name^='"+btnPrefix + "']").hide();


		$("button[name='"+selfName + "']").text(selfName + "┇");
		//this.innerText = this.innerText + "┇";
	}else
	{
		$("button[name^='"+btnPrefix + "']").show();

		$("button[name='"+selfName + "']").text($("button[name='"+selfName + "']").text().replace("┇",""));
	}
}


//回主页-------------------------
function GoHomeFunc(){
    clickButton('home');     //回主页
}

// 峨眉山门广场-----------------------------------------------------
function EmeiFunc(){
    go("jh 8;w;nw;n;#wa 2000;n;n;n;e;#wa 2000;e;n;n;e");
}

//鼓楼-------------------------
function GulouFunc(){
    go('jh 2;n;n;n;n;n');
}



// 嵩山老母洞-----------------------------------------------------
function SongshanFunc(){
    go("jh 22;n;n;w;#wa 2000;n;n;n;n;");

}


// 石街-洛阳-------------------------------------------------
function ShiJieFunc(){
    go("jh 2;n;n;n;n;w;event_1_98995501;n");
       }

// 桃花泉-华山村---------------------------------------------------
function TaoHuaFunc(){
    go("jh 3;s;s;s;s;#wa 1000;s;nw;n;n;e");
}
// 潭畔草地-华山-----------------------------------------------------
function CaoDiFunc(){
    go("jh 4;n;n;n;n;#wa 1000;n;n;n;event_1_91604710;#wa 1000;s;s;s;");
}
// 临渊石台-华山----------------------------------------------------
function ShiTaiFunc(){
    go("jh 4;n;n;n;n;#wa 1000;n;n;n;n;#wa 1000;n;e;n");
}

// 碧水寒潭-明教----------------------------------------------------
function BiShuiFunc(){
    go("jh 18;n;nw;n;n;#wa 1000;n;n;n;ne;#wa 1000;n;n;n;n;n;#wa 1000;e;e;se;se;e");
}

// 悬崖-古墓------------------------------------------------
function XuanYaFunc(){
    go("jh 20;w;w;s;e;#wa 1000;s;s;s;s;s;#wa 1000;sw;sw;s;s;e");
}

// 观景台-泰山----------------------------------------------------
function GuanJingFunc(){
    go("jh 24;n;n;n;n;#wa 1000;n;n;n;n;n;#wa 1000;n;n;n;e;e;n");
}

// 九老洞-峨眉山------------------------------------------------
function JiuLaoFunc(){
 if ($('.cmd_click_room')[0] === undefined || $('.cmd_click_room')[0].innerText !== "山门广场"){
        alert("请位于 #山门广场# 位置再点 #九老洞# 按钮！");
        return;
}
    go("n;n;n;w;#wa 1000;n;n;n;n;#wa 1000;n;n;n;n;n;#wa 1000;nw;sw;w;nw;w");
}

//比试奇侠--------------------------------
function BiShiFunc(){
    if(btnList["比试奇侠"].innerText  == '比试奇侠'){
        var Swordsman_targetName = prompt("请输入奇侠名称","只需要修改游侠名称，小号自动比试");
        fightSwordsmanFunc();
        btnList["比试奇侠"].innerText  = '停止比试';}
    else{clearKill();
         {btnList["比试奇侠"].innerText  = '比试奇侠';}
        }

    function fightSwordsmanFunc(){
        // 间隔2000毫秒查找比试一次
        fightSwordsmanIntervalFunc = setInterval(fightSwordsman,1000);
    }

    /**
 * [clearKill 停止比试奇侠]
 * @return {[type]} [无]
 */
    function clearKill(){
        clearInterval(fightSwordsmanIntervalFunc);
    }

    /**
 * [fightSwordsman 比试指定奇侠]
 * @return {[type]} [无]
 */
    function fightSwordsman(){
        // 寻找指定名称的奇侠并开始比试
        $("button.cmd_click3").each(
            function(){
                if(isContains($(this).html() , Swordsman_targetName))
                    eval($(this).attr("onclick").replace("look_npc","fight"));
            });
        // 战斗结束自动退出战斗界面
        if($('span.outbig_text:contains(战斗结束)').length>0){
            clickButton('prev_combat');
        }

    }
}
//撩奇侠--------------------------
var qixiaCode={
    "浪唤雨":0,
    "王蓉":1,
    "庞统":2,
    "李宇飞":3,
    "步惊鸿":4,
    "风行骓":5,
    "郭济":6,
    "吴缜":7,
    "风南":8,
    "火云邪神":9,
    "逆风舞":10,
    "狐苍雁":11,
    "护竺":12
};

var askTimes=0;	//查找询问次数，超过5次失败

function goSwordsman(qxOrder){

    clickButton('find_task_road qixia '+qixiaCode[qxList[qxOrder]]);
    askSwordsman(qxOrder);

}


function askSwordsman(qxOrder){
    var isFind=0;	//标记是否找到奇侠
    askTimes = askTimes +1;
    if(askTimes>5){
        console.log(qxList[qxOrder]+"没找到");
        askTimes=0;
        return;
    }
    $("button.cmd_click3").each(
        function(){
            if(isContains($(this).html() , qxList[qxOrder])){
                isFind=1;
                askTimes=0;
                console.log("对话 "+qxList[qxOrder]);
                for(var i=0;i<5;i++)
                    eval($(this).attr("onclick").replace("look_npc","ask"));
            }
        });
    if(isFind===0)	//没找到间隔1秒再找一次
        setTimeout(function(){
            askSwordsman(qxOrder);
        },2000);
    else
        if (qxOrder+1<qxList.length)
        {
           setTimeout(function(){
            goSwordsman(qxOrder+1);
        },2000);
        }else{
            askTimes=0;
            console.log("撩奇侠结束");
            clickButton('home');
        }

}




//----------------------日常类-----------------------
//回主页-------------------------
function GoHomeFunc(){
    clickButton('home');     //回主页
}
// 签到--------------------------------------------------------
function CheckInFunc(){ // 进入扬州
    console.log('签到一次！');
	//go("jh 5;n;n;n;w;sign7;jh 1;event_1_44531938;e;n;e;e;event_1_8041045;event_1_8041045;event_1_44731074;home;sort fetch_reward;shop money_buy shop1_N_10;cangjian get_all;home");
  go('jh 5;n;n;n;w;sign7;#wa 1000;jh 1;event_1_44531938;#wa 1000;e;n;e;e;event_1_8041045;#wa 1000;event_1_8041045;event_1_44731074;home;#wa 1000;share_ok 1;#wa 200;share_ok 2;#wa 300;share_ok 3;#wa 300;share_ok 4;#wa 300;share_ok 5;#wa 300;share_ok 7');
}

//喂鳄鱼------------------------
 function WeiYuFunc(){
     go("jh 37;n;e;e;#wa 1000;nw;nw;w;n;#wa 1000;e;n;e;e;#wa 1000;e;ne;ne;ne;#wa 1000;se;n;event_1_97487911;home;");
}

// 换装备 -------------------------------------------------------
function ZhuangBei(){
    if(btnList["战斗装"].innerText == '战斗装')
    { console.log("切换战斗装备！");
     clickButton('wield weapon_sb_sword10');       // 九天龙吟剑
     clickButton('wear equip_moke_finger10');       // 斩龙戒指
     clickButton('wear equip_moke_head10');       // 斩龙帽子
     btnList["战斗装"].innerText = '打坐装';
    }
    else
    {console.log("切换打坐装备！");
     clickButton('wear dream hat');       // 迷幻经纶
     clickButton('wield sword of windspring');       // 风泉
     clickButton('wear longyuan banzhi moke');       // 龙渊
     btnList["战斗装"].innerText = '战斗装';
    }
}

// 出海----------------------------------------------------
function fishingFirstFunc(){
    go("jh 35;nw;nw;nw;n;#wa 1000;ne;nw;w;nw;#wa 1000;e;e;e;e;#wa 1000;e;se;n;n;#wa 1000;w;n;w;event_1_53278632");
}



// 清谜题 -----------------------------------------------

function clearPuzzleFunc(){
    clickButton('auto_tasks cancel');
}

// 吃千年灵芝-------------------------------------------
function userMedecineFunc(){
    clickButton('items use snow_qiannianlingzhi');
}

// 答题 ---------------------------------------------------

var answerQuestionsInterval = null;
var QuestAnsLibs = {
    "神雕侠侣的作者是?":"b",
    "跨服天剑谷是星期几举行的？":"b",
    "藏宝图在哪里npc那里买？":"a",
    "“白玉牌楼”场景是在哪个地图上？":"c",
    "“百龙山庄”场景是在哪个地图上？":"b",
    "“冰火岛”场景是在哪个地图上？":"b",
    "“常春岛渡口”场景是在哪个地图上？":"c",
    "“跪拜坪”场景是在哪个地图上？":"b",
    "“翰墨书屋”场景是在哪个地图上？":"c",
    "“花海”场景是在哪个地图上？":"a",
    "“留云馆”场景是在哪个地图上？":"b",
    "“清音居”场景是在哪个地图上？":"a",
    "“日月洞”场景是在哪个地图上？":"b",
    "“蓉香榭”场景是在哪个地图上？":"c",
    "“三清殿”场景是在哪个地图上？":"b",
    "“三清宫”场景是在哪个地图上？":"c",
    "“双鹤桥”场景是在哪个地图上？":"b",
    "“无名山脚”场景是在哪个地图上？":"d",
    "“伊犁”场景是在哪个地图上？":"b",
    "“鹰记商号”场景是在哪个地图上？":"d",
    "“迎梅客栈”场景是在哪个地图上？":"d",
    "“子午楼”场景是在哪个地图上？":"c",
    "8级的装备摹刻需要几把刻刀？":"a",
    "NPC公平子在哪一章地图？":"a",
    "vip每天不可以领取什么？":"b",
    "瑷伦在晚月庄的哪个场景？":"b",
    "安惜迩是在那个场景？":"c",
    "黯然消魂掌有多少招式？":"c",
    "黯然销魂掌是哪个门派的技能？":"a",
    "黯然销魂掌有多少招式？":"c",
    "八卦迷阵是哪个门派的阵法？":"b",
    "八卦迷阵是那个门派的阵法？":"a",
    "白金戒指可以在哪位npc那里获得？":"b",
    "白金戒指可以在哪位那里获得？":"b",
    "白金手镯可以在哪位npc那里获得？":"a",
    "白金项链可以在哪位npc那里获得？":"b",
    "白金项链可以在哪位那里获得？":"b",
    "白蟒鞭的伤害是多少？":"a",
    "白驼山第一位要拜的师傅是谁？":"a",
    "白银宝箱礼包多少元宝一个？":"d",
    "白玉牌楼场景是在哪个地图上？":"c",
    "白玉腰束是腰带类的第几级装备？":"b",
    "拜师风老前辈需要正气多少？":"b",
    "拜师老毒物需要蛤蟆功多少级？":"a",
    "拜师铁翼需要多少内力？":"b",
    "拜师小龙女需要容貌多少？":"c",
    "拜师张三丰需要多少正气？":"b",
    "包家将是哪个门派的师傅？":"a",
    "包拯在哪一章？":"d",
    "宝石合成一次需要消耗多少颗低级宝石？":"c",
    "宝玉帽可以在哪位npc那里获得？":"d",
    "宝玉帽可以在哪位那里获得？":"d",
    "宝玉鞋击杀哪个npc可以获得？":"a",
    "宝玉鞋击杀哪个可以获得？":"a",
    "宝玉鞋在哪获得？":"a",
    "暴雨梨花针的伤害是多少？":"c",
    "北斗七星阵是第几个的组队副本？":"c",
    "北冥神功是哪个门派的技能？":"b",
    "北岳殿神像后面是哪位？":"b",
    "北岳殿神像后面是哪位npc？":"b",
    "匕首加什么属性？":"c",
    "碧海潮生剑在哪位师傅处学习？":"a",
    "碧磷鞭的伤害是多少？":"b",
    "镖局保镖是挂机里的第几个任务？":"d",
    "冰魄银针的伤害是多少？":"b",
    "病维摩拳是哪个门派的技能？":"b",
    "不可保存装备下线多久会消失？":"c",
    "不属于白驼山的技能是什么？":"b",
    "仓库最多可以容纳多少种物品？":"b",
    "沧海护腰可以镶嵌几颗宝石？":"d",
    "沧海护腰是腰带类的第几级装备？":"a",
    "藏宝图在哪个npc处购买？":"b",
    "藏宝图在哪个处购买？":"b",
    "藏宝图在哪里那里买？":"a",
    "藏宝图在哪个NPC处购买":"a",
    "草帽可以在哪位npc那里获得？":"b",
    "草帽可以在哪位那里获得？":"b",
    "成功易容成异性几次可以领取易容成就奖？":"b",
    "成长计划第七天可以领取多少元宝？":"d",
    "成长计划六天可以领取多少银两？":"d",
    "成长计划需要多少元宝方可购买？":"a",
    "城里打擂是挂机里的第几个任务？":"d",
    "城里抓贼是挂机里的第几个任务？":"b",
    "充值积分不可以兑换下面什么物品？":"d",
    "出生选武学世家增加什么？":"a",
    "闯楼第几层可以获得称号“藏剑楼护法”？":"b",
    "闯楼第几层可以获得称号“藏剑楼楼主”？":"d",
    "闯楼第几层可以获得称号“藏剑楼长老”？":"c",
    "闯楼每多少层有称号奖励？":"a",
    "春风快意刀是哪个门派的技能？":"b",
    "春秋水色斋需要多少杀气才能进入？":"d",
    "从哪个npc处进入跨服战场？":"a",
    "从哪个处进入跨服战场？":"a",
    "摧心掌是哪个门派的技能？":"a",
    "达摩在少林哪个场景？":"c",
    "达摩杖的伤害是多少？":"d",
    "打开引路蜂礼包可以得到多少引路蜂？":"b",
    "打排行榜每天可以完成多少次？":"a",
    "打土匪是挂机里的第几个任务？":"c",
    "打造刻刀需要多少个玄铁？":"a",
    "打坐增长什么属性？":"a",
    "大保险卡可以承受多少次死亡后不降技能等级？":"b",
    "大乘佛法有什么效果？":"d",
    "大旗门的修养术有哪个特殊效果？":"a",
    "大旗门的云海心法可以提升哪个属性？":"c",
    "大招寺的金刚不坏功有哪个特殊效果？":"a",
    "大招寺的铁布衫有哪个特殊效果？":"c",
    "当日最低累积充值多少元即可获得返利？":"b",
    "刀法基础在哪掉落？":"a",
    "倒乱七星步法是哪个门派的技能？":"d",
    "等级多少才能在世界频道聊天？":"c",
    "第一个副本需要多少等级才能进入？":"d",
    "貂皮斗篷是披风类的第几级装备？":"b",
    "丁老怪是哪个门派的终极师傅？":"a",
    "丁老怪在天宿海的哪个场景？":"b",
    "丁老怪在天宿海哪个场景？":"b",
    "丁老怪在星宿海的哪个场景？":"b",
    "东方教主在魔教的哪个场景？":"b",
    "斗转星移是哪个门派的技能？":"a",
    "斗转星移阵是哪个门派的阵法？":"a",
    "毒龙鞭的伤害是多少？":"a",
    "毒物阵法是哪个门派的阵法？":"b",
    "独孤求败有过几把剑？":"d",
    "独龙寨是第几个组队副本？":"a",
    "读书写字301-400级在哪里买书？":"c",
    "读书写字最高可以到多少级？":"b",
    "端茶递水是挂机里的第几个任务？":"b",
    "断云斧是哪个门派的技能？":"a",
    "锻造一把刻刀需要多少玄铁碎片锻造？":"c",
    "锻造一把刻刀需要多少银两？":"a",
    "兑换易容面具需要多少玄铁碎片？":"c",
    "多少消费积分换取黄金宝箱？":"a",
    "多少消费积分可以换取黄金钥匙？":"b",
    "翻译梵文一次多少银两？":"d",
    "方媃是哪个门派的师傅？":"b",
    "飞仙剑阵是哪个门派的阵法？":"b",
    "风老前辈在华山哪个场景？":"b",
    "风泉之剑加几点悟性？":"c",
    "风泉之剑可以在哪位npc那里获得？":"b",
    "风泉之剑可以在哪位那里获得？":"b",
    "风泉之剑在哪里获得？":"d",
    "疯魔杖的伤害是多少？":"b",
    "伏虎杖的伤害是多少？":"c",
    "副本完成后不可获得下列什么物品？":"b",
    "副本一次最多可以进几人？":"a",
    "副本有什么奖励？":"d",
    "富春茶社在哪一章？":"c",
    "改名字在哪改？":"d",
    "丐帮的绝学是什么？":"a",
    "丐帮的轻功是哪个？":"b",
    "干苦力是挂机里的第几个任务？":"a",
    "钢丝甲衣可以在哪位npc那里获得？":"d",
    "钢丝甲衣可以在哪位那里获得？":"d",
    "高级乾坤再造丹加什么？":"b",
    "高级乾坤再造丹是增加什么的？":"b",
    "高级突破丹多少元宝一颗？":"d",
    "割鹿刀可以在哪位npc那里获得？":"b",
    "葛伦在大招寺的哪个场景？":"b",
    "根骨能提升哪个属性？":"c",
    "功德箱捐香火钱有什么用？":"a",
    "功德箱在雪亭镇的哪个场景？":"c",
    "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？":"b",
    "孤独求败称号需要多少论剑积分兑换？":"b",
    "孤儿出身增加什么？":"d",
    "古灯大师是哪个门派的终极师傅？":"c",
    "古灯大师在大理哪个场景？":"c",
    "古墓多少级以后才能进去？":"d",
    "挂机增长什么？":"a",
    "寒玉床睡觉修炼需要多少点内力值？":"c",
    "寒玉床睡觉一次多久？":"c",
    "寒玉床需要切割多少次？":"d",
    "寒玉床在哪里切割？":"a",
    "寒玉床在那个地图可以找到？":"a",
    "黑狗血在哪获得？":"b",
    "黑水伏蛟可以在哪位npc那里获得？":"c",
    "黑水伏蛟可以在哪位那里获得？":"c",
    "红宝石加什么属性？":"b",
    "洪帮主在洛阳哪个场景？":"c",
    "虎皮腰带是腰带类的第几级装备？":"a",
    "花不为在哪一章？":"a",
    "花花公子在哪个地图？":"a",
    "华山村王老二掉落的物品是什么？":"a",
    "华山施戴子掉落的物品是什么？":"b",
    "华山武器库从哪个NPC进？":"d",
    "黄宝石加什么属性？":"c",
    "黄岛主在桃花岛的哪个场景？":"d",
    "黄袍老道是哪个门派的师傅？":"c",
    "积分商城在雪亭镇的哪个场景？":"c",
    "技能柳家拳谁教的？":"a",
    "技能数量超过了什么消耗潜能会增加？":"b",
    "嫁衣神功是哪个门派的技能？":"b",
    "剑冢在哪个地图？":"a",
    "街头卖艺是挂机里的第几个任务？":"a",
    "金弹子的伤害是多少？":"a",
    "金刚不坏功有什么效果？":"a",
    "金刚杖的伤害是多少？":"a",
    "金戒指可以在哪位npc那里获得？":"d",
    "金手镯可以在哪位npc那里获得？":"b",
    "金丝鞋可以在哪位npc那里获得？":"b",
    "金项链可以在哪位npc那里获得？":"d",
    "金玉断云是哪个门派的阵法？":"a",
    "锦缎腰带是腰带类的第几级装备？":"a",
    "精铁棒可以在哪位npc那里获得？":"d",
    "精铁棒可以在哪位那里获得？":"d",
    "九区服务器名称？":"d",
    "九阳神功是哪个门派的技能？":"c",
    "九阴派梅师姐在星宿海哪个场景？":"a",
    "军营是第几个组队副本？":"b",
    "开通VIP月卡最低需要当天充值多少元方有购买资格？":"a",
    "可以召唤金甲伏兵助战是哪个门派？":"a",
    "客商在哪一章？":"b",
    "孔雀氅可以镶嵌几颗宝石？":"b",
    "孔雀氅是披风类的第几级装备？":"c",
    "枯荣禅功是哪个门派的技能？":"a",
    "跨服副本周六几点开启？":"a",
    "跨服是星期几举行的？":"b",
    "跨服天剑谷每周六几点开启？":"a",
    "跨服需要多少级才能进入？":"c",
    "跨服在哪个场景进入？":"c",
    "兰花拂穴手是哪个门派的技能？":"a",
    "蓝宝石加什么属性？":"a",
    "蓝止萍在哪一章？":"c",
    "蓝止萍在晚月庄哪个小地图？":"b",
    "老毒物在白驮山的哪个场景？":"b",
    "老顽童在全真教哪个场景？":"b",
    "莲花掌是哪个门派的技能？":"a",
    "烈火旗大厅是那个地图的场景？":"c",
    "烈日项链可以镶嵌几颗宝石？":"c",
    "林祖师是哪个门派的师傅？":"a",
    "灵蛇杖法是哪个门派的技能？":"c",
    "凌波微步是哪个门派的技能？":"b",
    "凌虚锁云步是哪个门派的技能？":"b",
    "领取消费积分需要寻找哪个NPC？":"c",
    "鎏金缦罗是披风类的第几级装备？":"d",
    "柳淳风在哪一章":"c",
    "柳淳风在雪亭镇哪个场景？":"b",
    "柳文君所在的位置？":"a",
    "六脉神剑是哪个门派的绝学？":"a",
    "六阴追魂剑是哪个门派的技能？":"b",
    "陆得财是哪个门派的师傅？":"c",
    "陆得财在乔阴县的哪个场景？":"a",
    "论剑每天能打几次？":"a",
    "论剑是每周星期几？":"c",
    "论剑是什么时间点正式开始？":"a",
    "论剑是星期几进行的？":"c",
    "论剑是星期几举行的？":"c",
    "论剑输一场获得多少论剑积分？":"a",
    "论剑要在晚上几点前报名？":"b",
    "论剑一次最多能突破几个技能？":"c",
    "论剑在周几进行？":"b",
    "论剑中步玄派的师傅是哪个？":"a",
    "论剑中大招寺第一个要拜的师傅是谁？":"c",
    "论剑中古墓派的终极师傅是谁？":"d",
    "论剑中花紫会的师傅是谁？":"c",
    "论剑中青城派的第一个师傅是谁？":"a",
    "论剑中青城派的终极师傅是谁？":"d",
    "论剑中逍遥派的终极师傅是谁？":"c",
    "论剑中以下不是峨嵋派技能的是哪个？":"b",
    "论剑中以下不是华山派的人物的是哪个？":"d",
    "论剑中以下哪个不是大理段家的技能？":"c",
    "论剑中以下哪个不是大招寺的技能？":"b",
    "论剑中以下哪个不是峨嵋派可以拜师的师傅？":"d",
    "论剑中以下哪个不是丐帮的技能？":"d",
    "论剑中以下哪个不是丐帮的人物？":"a",
    "论剑中以下哪个不是古墓派的的技能？":"b",
    "论剑中以下哪个不是华山派的技能的？":"d",
    "论剑中以下哪个不是明教的技能？":"d",
    "论剑中以下哪个不是魔教的技能？":"a",
    "论剑中以下哪个不是魔教的人物？":"d",
    "论剑中以下哪个不是全真教的技能？":"d",
    "论剑中以下哪个不是是晚月庄的技能？":"d",
    "论剑中以下哪个不是唐门的技能？":"c",
    "论剑中以下哪个不是唐门的人物？":"c",
    "论剑中以下哪个不是铁雪山庄的技能？":"d",
    "论剑中以下哪个不是铁血大旗门的技能？":"c",
    "论剑中以下哪个不是晚月庄的技能？":"d",
    "论剑中以下哪个是大理段家的技能？":"a",
    "论剑中以下哪个是大招寺的技能？":"b",
    "论剑中以下哪个是丐帮的技能？":"b",
    "论剑中以下哪个是花紫会的技能？":"a",
    "论剑中以下哪个是华山派的技能的？":"a",
    "论剑中以下哪个是明教的技能？":"b",
    "论剑中以下哪个是青城派的技能？":"b",
    "论剑中以下哪个是唐门的技能？":"b",
    "论剑中以下哪个是天邪派的技能？":"b",
    "论剑中以下哪个是天邪派的人物？":"a",
    "论剑中以下哪个是铁雪山庄的技能？":"c",
    "论剑中以下哪个是铁血大旗门的技能？":"b",
    "论剑中以下哪个是铁血大旗门的师傅？":"a",
    "论剑中以下哪个是晚月庄的技能？":"a",
    "论剑中以下哪个是晚月庄的人物":"a",
    "论剑中以下是峨嵋派技能的是哪个？":"a",
    "论语在哪购买？":"a",
    "骆云舟在哪一章？":"c",
    "骆云舟在乔阴县的哪个场景？":"b",
    "落英神剑掌是哪个门派的技能？":"b",
    "吕进在哪个地图？":"a",
    "绿宝石加什么属性？":"c",
    "漫天花雨匕在哪获得？":"a",
    "茅山的绝学是什么？":"b",
    "茅山的天师正道可以提升哪个属性？":"d",
    "茅山可以招几个宝宝？":"c",
    "茅山派的轻功是什么？":"b",
    "茅山天师正道可以提升什么？":"c",
    "茅山学习什么技能招宝宝？":"a",
    "茅山在哪里拜师？":"c",
    "每次合成宝石需要多少银两？":"a",
    "每个玩家最多能有多少个好友？":"b",
    "每日微信分享可以获得什么奖励？":"a",
    "每天的任务次数几点重置？":"d",
    "每天分享游戏到哪里可以获得20元宝？":"a",
    "每天能挖几次宝？":"d",
    "每天能做多少个谜题任务？":"a",
    "每天能做多少个师门任务？":"c",
    "每天微信分享能获得多少元宝？":"d",
    "每天有几次试剑？":"b",
    "每天在线多少个小时即可领取消费积分？":"b",
    "每突破一次技能有效系数加多少？":"a",
    "密宗伏魔是哪个门派的阵法？":"c",
    "灭绝师太在第几章？":"c",
    "灭绝师太在峨眉山哪个场景？":"a",
    "明教的九阳神功有哪个特殊效果？":"a",
    "明月帽要多少刻刀摩刻？":"a",
    "摹刻10级的装备需要摩刻技巧多少级？":"b",
    "摹刻烈日宝链需要多少级摩刻技巧？":"c",
    "摹刻扬文需要多少把刻刀？":"a",
    "魔鞭诀在哪里学习？":"d",
    "魔教的大光明心法可以提升哪个属性？":"d",
    "莫不收在哪一章？":"a",
    "墨磷腰带是腰带类的第几级装备？":"d",
    "木道人在青城山的哪个场景？":"b",
    "慕容家主在慕容山庄的哪个场景？":"a",
    "慕容山庄的斗转星移可以提升哪个属性？":"d",
    "哪个npc处可以捏脸？":"a",
    "哪个NPC掉落拆招基础？":"a",
    "哪个npc属于全真七子？":"b",
    "哪个处可以捏脸？":"a",
    "哪个分享可以获得20元宝？":"b",
    "哪个技能不是魔教的？":"d",
    "哪个门派拜师没有性别要求？":"d",
    "哪样不能获得玄铁碎片？":"c",
    "能增容貌的是下面哪个技能？":"a",
    "捏脸需要花费多少银两？":"c",
    "捏脸需要寻找哪个NPC？":"a",
    "欧阳敏是哪个门派的？":"b",
    "欧阳敏是哪个门派的师傅？":"b",
    "欧阳敏在哪一章？":"a",
    "欧阳敏在唐门的哪个场景？":"c",
    "排行榜最多可以显示多少名玩家？":"a",
    "逄义是在那个场景？":"a",
    "披星戴月是披风类的第几级装备？":"d",
    "劈雳拳套有几个镶孔？":"a",
    "霹雳掌套的伤害是多少？":"b",
    "辟邪剑法是哪个门派的绝学技能？":"a",
    "辟邪剑法在哪学习？":"b",
    "婆萝蜜多心经是哪个门派的技能？":"b",
    "七宝天岚舞是哪个门派的技能？":"d",
    "七星鞭的伤害是多少？":"c",
    "七星剑法是哪个门派的绝学？":"a",
    "棋道是哪个门派的技能？":"c",
    "千古奇侠称号需要多少论剑积分兑换？":"d",
    "乾坤大挪移属于什么类型的武功？":"a",
    "乾坤一阳指是哪个师傅教的？":"a",
    "青城派的道德经可以提升哪个属性？":"c",
    "青城派的道家心法有哪个特殊效果？":"a",
    "清风寨在哪":"b",
    "清风寨在哪个地图？":"d",
    "清虚道长在哪一章？":"d",
    "去唐门地下通道要找谁拿钥匙？":"a",
    "全真的道家心法有哪个特殊效果？":"a",
    "全真的基本阵法有哪个特殊效果？":"b",
    "全真的双手互搏有哪个特殊效果？":"c",
    "人物背包最多可以容纳多少种物品？":"a",
    "日月神教大光明心法可以提升什么？":"d",
    "如何将华山剑法从400级提升到440级？":"d",
    "如意刀是哪个门派的技能？":"c",
    "山河藏宝图需要在哪个NPC手里购买？":"d",
    "上山打猎是挂机里的第几个任务？":"c",
    "少林的混元一气功有哪个特殊效果？":"d",
    "少林的易筋经神功有哪个特殊效果？":"a",
    "蛇形刁手是哪个门派的技能？":"b",
    "什么影响打坐的速度？":"c",
    "什么影响攻击力？":"d",
    "什么装备不能镶嵌黄水晶？":"d",
    "什么装备都能镶嵌的是什么宝石？":"c",
    "什么装备可以镶嵌紫水晶？":"c",
    "神雕大侠所在的地图？":"b",
    "神雕大侠在哪一章？":"a",
    "神雕侠侣的时代背景是哪个朝代？":"d",
    "神雕侠侣的作者是？":"b",
    "升级什么技能可以提升根骨？":"a",
    "生死符的伤害是多少？":"a",
    "师门磕头增加什么？":"a",
    "师门任务每天可以完成多少次？":"a",
    "师门任务每天可以做多少个？":"c",
    "师门任务什么时候更新？":"b",
    "师门任务一天能完成几次？":"d",
    "师门任务最多可以完成多少个？":"d",
    "施令威在哪个地图？":"b",
    "石师妹哪个门派的师傅？":"c",
    "使用朱果经验潜能将分别增加多少？":"a",
    "首冲重置卡需要隔多少天才能在每日充值奖励中领取？":"b",
    "首次通过桥阴县不可以获得那种奖励？":"a",
    "受赠的消费积分在哪里领取？":"d",
    "兽皮鞋可以在哪位npc那里获得？":"b",
    "兽皮鞋可以在哪位那里获得？":"b",
    "树王坟在第几章节？":"c",
    "双儿在扬州的哪个小地图？":"a",
    "孙天灭是哪个门派的师傅？":"c",
    "踏雪无痕是哪个门派的技能？":"b",
    "踏云棍可以在哪位npc那里获得？":"a",
    "踏云棍可以在哪位那里获得？":"a",
    "唐门的唐门毒经有哪个特殊效果？":"a",
    "唐门密道怎么走？":"c",
    "天蚕围腰可以镶嵌几颗宝石？":"d",
    "天蚕围腰是腰带类的第几级装备？":"d",
    "天山姥姥在逍遥林的哪个场景？":"d",
    "天山折梅手是哪个门派的技能？":"c",
    "天师阵法是哪个门派的阵法？":"b",
    "天邪派在哪里拜师？":"b",
    "天羽奇剑是哪个门派的技能？":"a",
    "铁戒指可以在哪位npc那里获得？":"a",
    "铁戒指可以在哪位那里获得？":"a",
    "铁手镯可以在哪位npc那里获得？":"a",
    "铁手镯可以在哪位那里获得？":"a",
    "铁项链可以在哪位npc那里获得？":"a",
    "铁血大旗门云海心法可以提升什么？":"a",
    "通灵需要花费多少银两？":"d",
    "通灵需要寻找哪个NPC？":"c",
    "突破丹在哪里购买？":"b",
    "屠龙刀法是哪个门派的绝学技能？":"b",
    "屠龙刀是什么级别的武器？":"a",
    "挖剑冢可得什么？":"a",
    "弯月刀可以在哪位npc那里获得？":"b",
    "弯月刀可以在哪位那里获得？":"b",
    "玩家每天能够做几次正邪任务？":"c",
    "玩家想修改名字可以寻找哪个NPC？":"a",
    "晚月庄的内功是什么？":"b",
    "晚月庄的七宝天岚舞可以提升哪个属性？":"b",
    "晚月庄的小贩在下面哪个地点？":"a",
    "晚月庄七宝天岚舞可以提升什么？":"b",
    "晚月庄意寒神功可以提升什么？":"b",
    "晚月庄主线过关要求？":"a",
    "王铁匠是在那个场景？":"b",
    "王重阳是哪个门派的师傅？":"b",
    "魏无极处读书可以读到多少级？":"a",
    "魏无极身上掉落什么装备？":"c",
    "魏无极在第几章？":"a",
    "闻旗使在哪个地图？":"a",
    "乌金玄火鞭的伤害是多少？":"d",
    "乌檀木刀可以在哪位npc那里获得？":"d",
    "乌檀木刀可以在哪位那里获得？":"d",
    "钨金腰带是腰带类的第几级装备？":"d",
    "武当派的绝学技能是以下哪个？":"d",
    "武穆兵法提升到多少级才能出现战斗必刷？":"d",
    "武穆兵法通过什么学习？":"a",
    "武学世家加的什么初始属性？":"a",
    "舞中之武是哪个门派的阵法？":"b",
    "西毒蛇杖的伤害是多少？":"c",
    "吸血蝙蝠在下面哪个地图？":"a",
    "下列哪项战斗不能多个玩家一起战斗？":"a",
    "下列装备中不可摹刻的是？":"c",
    "下面哪个npc不是魔教的？":"d",
    "下面哪个不是古墓的师傅？":"d",
    "下面哪个不是门派绝学？":"d",
    "下面哪个不是魔教的？":"d",
    "下面哪个地点不是乔阴县的？":"d",
    "下面哪个门派是正派？":"a",
    "下面哪个是天邪派的师傅？":"a",
    "下面有什么是寻宝不能获得的？":"c",
    "向师傅磕头可以获得什么？":"b",
    "逍遥步是哪个门派的技能？":"a",
    "逍遥林是第几章的地图？":"c",
    "逍遥林怎么弹琴可以见到天山姥姥？":"b",
    "逍遥派的绝学技能是以下哪个？":"a",
    "萧辟尘在哪一章？":"d",
    "小李飞刀的伤害是多少？":"d",
    "小龙女住的古墓是谁建造的？":"b",
    "小男孩在华山村哪里？":"a",
    "新人礼包在哪个npc处兑换？":"a",
    "新手礼包在哪里领取？":"a",
    "新手礼包在哪领取？":"c",
    "需要使用什么衣服才能睡寒玉床？":"a",
    "选择孤儿会影响哪个属性？":"c",
    "选择商贾会影响哪个属性？":"b",
    "选择书香门第会影响哪个属性？":"b",
    "选择武学世家会影响哪个属性？":"a",
    "学习屠龙刀法需要多少内力？":"b",
    "雪莲有什么作用？":"a",
    "雪蕊儿是哪个门派的师傅？":"a",
    "雪蕊儿在铁雪山庄的哪个场景？":"d",
    "扬文的属性？":"a",
    "扬州询问黑狗能到下面哪个地点？":"a",
    "扬州询问黑狗子能到下面哪个地点？":"a",
    "扬州在下面哪个地点的npc处可以获得玉佩？":"c",
    "扬州在下面哪个地点的处可以获得玉佩？":"c",
    "羊毛斗篷是披风类的第几级装备？":"a",
    "阳刚之劲是哪个门派的阵法？":"c",
    "杨过小龙女分开多少年后重逢?":"c",
    "杨过在哪个地图？":"a",
    "夜行披风是披风类的第几级装备？":"a",
    "夜皇在大旗门哪个场景？":"c",
    "一个队伍最多有几个队员？":"c",
    "一天能使用元宝做几次暴击谜题？":"c",
    "一天能完成谜题任务多少个？":"b",
    "一天能完成师门任务有多少个？":"c",
    "一天能完成挑战排行榜任务多少次？":"a",
    "一张分身卡的有效时间是多久？":"c",
    "一指弹在哪里领悟？":"b",
    "移开明教石板需要哪项技能到一定级别？":"a",
    "以下不是步玄派的技能的哪个？":"c",
    "以下不是天宿派师傅的是哪个？":"c",
    "以下不是晚月庄技能？":"d",
    "以下不是隐藏门派的是哪个？":"d",
    "以下哪个宝石不能镶嵌到戒指？":"c",
    "以下哪个宝石不能镶嵌到内甲？":"a",
    "以下哪个宝石不能镶嵌到披风？":"c",
    "以下哪个宝石不能镶嵌到腰带？":"c",
    "以下哪个宝石不能镶嵌到衣服？":"a",
    "以下哪个不是道尘禅师教导的武学？":"d",
    "以下哪个不是何不净教导的武学？":"c",
    "以下哪个不是慧名尊者教导的技能？":"d",
    "以下哪个不是空空儿教导的武学？":"b",
    "以下哪个不是梁师兄教导的武学？":"b",
    "以下哪个不是鲁长老教导的武学？":"d",
    "以下哪个不是论剑的皮肤？":"d",
    "以下哪个不是全真七子？":"c",
    "以下哪个不是宋首侠教导的武学？":"d",
    "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？":"a",
    "以下哪个不是岳掌门教导的武学？":"a",
    "以下哪个不是在洛阳场景":"d",
    "以下哪个不是在雪亭镇场景？":"d",
    "以下哪个不是在扬州场景？":"d",
    "以下哪个不是知客道长教导的武学？":"b",
    "以下哪个门派不是隐藏门派？":"c",
    "以下哪个门派是正派？":"d",
    "以下哪个门派是中立门派？":"a",
    "以下哪个是步玄派的祖师？":"b",
    "以下哪个是封山派的祖师？":"c",
    "以下哪个是花紫会的祖师？":"a",
    "以下哪个是晚月庄的祖师？":"d",
    "以下哪些物品不是成长计划第二天可以领取的？":"c",
    "以下哪些物品不是成长计划第三天可以领取的？":"d",
    "以下哪些物品不是成长计划第一天可以领取的？":"d",
    "以下哪些物品是成长计划第四天可以领取的？":"a",
    "以下哪些物品是成长计划第五天可以领取的？":"b",
    "以下属于邪派的门派是哪个？":"b",
    "以下属于正派的门派是哪个？":"a",
    "以下谁不精通降龙十八掌？":"d",
    "以下有哪些物品不是每日充值的奖励？":"d",
    "倚天剑加多少伤害？":"d",
    "倚天屠龙记的时代背景哪个朝代？":"a",
    "易容后保持时间是多久？":"a",
    "易容面具需要多少玄铁兑换？":"c",
    "易容术多少级才可以易容成异性NPC？":"a",
    "易容术可以找哪位NPC学习？":"b",
    "易容术向谁学习？":"a",
    "易容术在哪里学习？":"a",
    "易容术在哪学习？":"b",
    "银手镯可以在哪位npc那里获得？":"b",
    "银手镯可以在哪位那里获得？":"b",
    "银丝链甲衣可以在哪位npc那里获得？":"a",
    "银项链可以在哪位npc那里获得？":"b",
    "银项链可以在哪位那里获得？":"b",
    "尹志平是哪个门派的师傅？":"b",
    "隐者之术是那个门派的阵法？":"a",
    "鹰爪擒拿手是哪个门派的技能？":"a",
    "影响你出生的福缘的出生是？":"d",
    "油流麻香手是哪个门派的技能？":"a",
    "游龙散花是哪个门派的阵法？":"d",
    "玉草帽可以在哪位npc那里获得？":"b",
    "玉蜂浆在哪个地图获得？":"a",
    "玉女剑法是哪个门派的技能？":"b",
    "岳掌门在哪一章？":"a",
    "云九天是哪个门派的师傅？":"c",
    "云问天在哪一章？":"a",
    "在洛阳萧问天那可以学习什么心法？":"b",
    "在庙祝处洗杀气每次可以消除多少点？":"a",
    "在哪个npc处可以更改名字？":"a",
    "在哪个npc处领取免费消费积分？":"d",
    "在哪个npc处能够升级易容术？":"b",
    "在哪个NPC可以购买恢复内力的药品？":"c",
    "在哪个处可以更改名字？":"a",
    "在哪个处领取免费消费积分？":"d",
    "在哪个处能够升级易容术？":"b",
    "在哪里可以找到“香茶”？":"a",
    "在哪里捏脸提升容貌？":"d",
    "在哪里消杀气？":"a",
    "在逍遥派能学到的技能是哪个？":"a",
    "在雪亭镇李火狮可以学习多少级柳家拳？":"b",
    "在战斗界面点击哪个按钮可以进入聊天界面？":"d",
    "在正邪任务中不能获得下面什么奖励？":"d",
    "怎么样获得免费元宝？":"a",
    "赠送李铁嘴银两能够增加什么？":"a",
    "张教主在明教哪个场景？":"d",
    "张三丰在哪一章？":"d",
    "张三丰在武当山哪个场景？":"d",
    "张松溪在哪个地图？":"c",
    "张天师是哪个门派的师傅？":"a",
    "张天师在茅山哪个场景？":"d",
    "长虹剑在哪位npc那里获得？":"a",
    "长虹剑在哪位那里获得？":"a",
    "长剑在哪里可以购买？":"a",
    "正邪任务杀死好人增长什么？":"b",
    "正邪任务一天能做几次？":"a",
    "正邪任务中客商的在哪个地图？":"a",
    "正邪任务中卖花姑娘在哪个地图？":"b",
    "正邪任务最多可以完成多少个？":"d",
    "支线对话书生上魁星阁二楼杀死哪个NPC给10元宝？":"a",
    "朱姑娘是哪个门派的师傅？":"a",
    "朱老伯在华山村哪个小地图？":"b",
    "追风棍可以在哪位npc那里获得？":"a",
    "追风棍在哪里获得？":"b",
    "紫宝石加什么属性？":"d",
    "钻石项链在哪获得？":"a"

};
function answerQuestionsFunc(){
    if(btnList["开答题"].innerText == "开答题"){
        console.log("准备自动答题！");
        answerQuestionsInterval = setInterval(answerQuestions, 1000);
        btnList["开答题"].innerText = "停答题";
    }else{
        console.log("停止自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
    }
}

function answerQuestions(){
    if($('span:contains(每日武林知识问答次数已经)').text().slice(-46) == "每日武林知识问答次数已经达到限额，请明天再来。每日武林知识问答次数已经达到限额，请明天再来。") {
        // 今天答题结束了
        console.log("完成自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
    }
    clickButton('question');
    setTimeout(getAndAnsQuestion, 300); // 300 ms之后提取问题，查询答案，并回答
}

function getAndAnsQuestion(){
    // 提取问题
    //alert($(".out").text());
    var theQuestion = A = $(".out").text().split("题")[1].split("A")[0];
    // 左右去掉空格

    //var theQuestion = A = $(".out").text();
    //theQuestion=theQuestion.split("题")[1];
    //theQuestion=theQuestion.split("A.")[0];
    theQuestion=theQuestion.replace( /^\theQuestion*/, "");
    theQuestion=theQuestion.replace( /\theQuestion*$/, "");
    theQuestion=theQuestion.slice(1);
    //theQuestion = theQuestion.trim(" ","left").trim(" ","right");
    //alert(theQuestion);
    // 查找某个问题，如果问题有包含关系，则
    var theAnswer = getAnswer2Question(theQuestion);
    if (theAnswer !== "failed"){
        eval("clickButton('question " + theAnswer + "')");
    }else{
        alert("没有找到答案，请手动完成该题目！");
        console.log("停止自动答题！");
        btnList["开答题"].innerText = "开答题";
        clearInterval(answerQuestionsInterval);
        return;
    }
    setTimeout(printAnswerInfo, 0);

}
function printAnswerInfo(){
    console.log("完成一道武林知识问答：" );
    console.log($('span:contains(知识问答第)').text().split("继续答题")[0]);
}
function getAnswer2Question(localQuestion){
    // 如果找到答案，返回响应答案，a,b,c或者d
    // 如果没有找到答案，返回 "failed"

    var resultsFound = [];
    var countor = 0;
    for(var quest in QuestAnsLibs){
        if (isContains(quest, localQuestion)){ //包含关系就可
            resultsFound[countor] = quest;
            countor = countor +1;
        }else if(isContains(quest, localQuestion.replace("npc","")) || isContains(quest, localQuestion.replace("NPC",""))){

        }

    }
    if(resultsFound.length ==1){
        return QuestAnsLibs[resultsFound[0]];
    }
    else {
        console.log("题目 " + localQuestion + " 找不到答案或存在多个答案，请手动作答！");
        return "failed";
    }
}

// 加力 ----------------------------
function enforceFunc(){
    if (btnList["加力"].innerText == '加力') {
        var enforcePoints = prompt("请输入加力点数","835");  //加力点数
        clickButton('enforce '+ enforcePoints);
        btnList["加力"].innerText = '不加力';
    }else{ // 不加力
        clickButton('enforce');
        btnList["加力"].innerText = '加力';
    }
}



//一键侠客岛--------------------
function RiChangFunc(){
   	 go('jh 36;yell;#wa 25000;e;ne;ne;ne;e;e;#wa 2000;e;event_1_9179222;e;event_1_11720543;w;#wa 2000;n;e;e;s;e;event_1_44025101;');

    setTimeout(XiaKeFunc,32000);
}

// 判断出路
function XiaKeFunc(){
    if ($('span.outtitle')[0].innerText == "崖底")		// 重新跳
        XuanYaFunc();
    else if ($('span.outtitle')[0].innerText == "石门")	// 进门领悟
    {
		go("event_1_36230918;e;e;s;#wa 2000;event_1_77496481;home");
    }
    else{
        setTimeout(XiaKeFunc,2000);		// 2秒后重新检查出路
    }
}

// 重新跳崖
function XuanYaFunc(){
	go("event_1_4788477;#wa 2000;nw;w;sw;w;n;n;n;w;w;#wa 2000;s;w;nw;w;e;#wa 2000;ne;ne;ne;e;e;#wa 2000;e;e;e;s;e;event_1_44025101;");

    setTimeout(XiaKeFunc,10000);
    // 2秒后检查出路
}


// 怼蛇 ----------------------------
var SnakeName = 'luoyang_luoyang20';

function SnakeFunc(){
    if (! (counthead=prompt("请输入剩余数量","20"))){
        return;
    }
	go("jh 2;n;n;n;n;n;n;n;n;n;e");
    clickButton('kill ' + SnakeName);
    setTimeout(killsnake,500);
}


function killsnake(){
	if($('span:contains(胜利)').text().slice(-3) == '胜利！'){
		clickButton('prev_combat');
		if(counthead > 1){
			counthead = counthead - 1;
			console.log('杀人一次，剩余杀人次数：%d！',counthead);
			clickButton('kill ' + SnakeName);
		}
		else{
			console.log('刷完了！');
			clickButton('home');
			return;	 // 终止
		}
	}
	else{
		if(is_fighting)
			ninesword();
		else
			clickButton('kill ' + SnakeName);
	}
	setTimeout(killsnake,500);
}

// 试剑----------------------------

function ShiJieFunc(){
    clickButton('swords');
    clickButton('swords select_member huashan_feng');   //风清扬
    clickButton('swords select_member gumu_yangguo'); //神雕大侠
    clickButton('swords select_member taoist_zhangtianshi'); //张天师
    clickButton('swords fight_test go');
    setTimeout(Shijie1,1000);//code
}
function Shijie1(){
    if( isContains($('span:contains(你今天)').text().slice(-12), '你今天试剑次数已达限额。')){
        console.log('打完收工！');
    }
    else{clickButton('swords fight_test go');
         ninesword();
         setTimeout(Shijie1,1000);//code
        }
}
// 杀红名----------------------------
var HongMingNPCList =["[21-25区]恶棍", "[21-25区]流寇", "[21-25区]剧盗","[21-25区]云老四", "[21-25区]岳老三", "[21-25区]二娘","[21-25区]段老大", "[21-25区]墟归一","[21-15区]上官晓芙","[21-25区]洪昭天","恶棍", "流寇", "云老四", "岳老三", "二娘","段老大","剧盗"];
var killHongMingIntervalFunc =  null;
var currentNPCIndex = 0;

function killHongMingTargetFunc(){
    zdskill =  null;
    if (btnList["杀红名"].innerText == '杀红名'){
        currentNPCIndex = 0;
        console.log("开始杀红名目标NPC！");
        skillLists = mySkillLists;
        btnList["杀红名"].innerText ='停红名';
        killHongMingIntervalFunc = setInterval(killHongMing, 500);

    }else{
        console.log("停止杀红名目标NPC！");
        btnList["杀红名"].innerText ='杀红名';
        clearInterval(killHongMingIntervalFunc);
    }
}

function killHongMing(){
    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    getHongMingTargetCode();
    if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
        currentNPCIndex = 0;
        console.log('杀人一次！');
        clickButton('prev_combat');
    }
}
function getHongMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (HongMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillHongMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillHongMingInfo(){
    var HongMingInfo = $('span').text();
    if (HongMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};


// 杀黄名----------------------------
var HuangMingNPCList = ["[21-25区]王铁匠", "[21-25区]杨掌柜", "[21-25区]柳绘心", "[21-25区]柳小花", "[21-25区]卖花姑娘","[21-25区]刘守财","[21-25区]朱老伯","[21-25区]方老板", "[21-25区]客商","[21-25区]方寡妇","[21-25区]花落云", "[21-25区]辰川","[21-25区]王世仲","王铁匠", "杨掌柜", "柳绘心", "柳小花", "朱老伯","方老板", "客商","方寡妇","卖花姑娘","刘守财"];
var killHuangMingIntervalFunc =  null;
var currentNPCIndex = 0;

function killHuangMingTargetFunc(){
    zdskill =  null;
    if (btnList["杀黄名"].innerText == '杀黄名'){
        currentNPCIndex = 0;
        console.log("开始杀黄名目标NPC！");
        skillLists = mySkillLists;
        btnList["杀黄名"].innerText ='停黄名';
        killHuangMingIntervalFunc = setInterval(killHuangMing, 500);

    }else{
        console.log("停止杀黄名目标NPC！");
        btnList["杀黄名"].innerText ='杀黄名';
        clearInterval(killHuangMingIntervalFunc);
    }
}

function killHuangMing(){
    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
    }
    getHuangMingTargetCode();
    if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
        currentNPCIndex = 0;
        console.log('杀人一次！');
        clickButton('prev_combat');
    }
}
function getHuangMingTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (HuangMingNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillHuangMingInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillHuangMingInfo(){
    var HuangMingInfo = $('span').text();
    if (HuangMingInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

// 杀天剑----------------------------
var TianJianNPCList = ["天剑", "天剑真身", "虹风","饕餮兽魂", "守谷神兽", "镇谷神兽",  "虹雨","虹雷", "虹电", "天剑谷卫士", "醉汉"];
var killTianJianIntervalFunc =  null;
var currentNPCIndex = 0;
function killTianJianTargetFunc(){
    zdskill =  mySkillLists;
    if (btnList["杀天剑"].innerText == '杀天剑'){
        currentNPCIndex = 0;
        console.log("开始杀天剑目标NPC！");
        skillLists = mySkillLists;
        btnList["杀天剑"].innerText ='停天剑';
        killTianJianIntervalFunc = setInterval(killTianJian, 500);

    }else{
        console.log("停止杀天剑目标NPC！");
        btnList["杀天剑"].innerText ='杀天剑';
        clearInterval(killTianJianIntervalFunc);
    }
}

function killTianJian(){
    if ($('span').text().slice(-7) == "不能杀这个人。"){
        currentNPCIndex = currentNPCIndex + 1;
        console.log("不能杀这个人！");
        //        return;
    }
    getTianJianTargetCode();
    //setTimeout(ninesword, 200);
    if($('span:contains(胜利)').text().slice(-3)=='胜利！' || $('span:contains(战败了)').text().slice(-6)=='战败了...'){
        currentNPCIndex = 0;
        console.log('杀人一次！');
        clickButton('prev_combat');
    }
}
function getTianJianTargetCode(){
    var peopleList = $(".cmd_click3");
    var thisonclick = null;
    var targetNPCListHere = [];
    var countor= 0;
    for(var i=0; i < peopleList.length; i++) { // 从第一个开始循环
        // 打印 NPC 名字，button 名，相应的NPC名
        thisonclick = peopleList[i].getAttribute('onclick');
        if (TianJianNPCList.contains(peopleList[i].innerText)){
            var targetCode = thisonclick.split("'")[1].split(" ")[1];
            //           console.log("发现NPC名字：" +  peopleList[i].innerText + "，代号：" + targetCode);
            targetNPCListHere[countor] = peopleList[i];
            countor = countor +1;
        }
    }
    // targetNPCListHere 是当前场景所有满足要求的NPC button数组
    if (currentNPCIndex >= targetNPCListHere.length){
        currentNPCIndex = 0;
    }
    if (targetNPCListHere.length > 0){
        thisonclick = targetNPCListHere[currentNPCIndex].getAttribute('onclick');
        var targetCode = thisonclick.split("'")[1].split(" ")[1];
        console.log("准备杀目标NPC名字：" + targetNPCListHere[currentNPCIndex].innerText + "，代码：" + targetCode +"，目标列表中序号：" + (currentNPCIndex ));
        clickButton('kill ' + targetCode); // 点击杀人
        setTimeout(detectKillTianJianInfo,200); // 200 ms后获取杀人情况，是满了还是进入了
    }
}
function detectKillTianJianInfo(){
    var TianJianInfo = $('span').text();
    if (TianJianInfo.slice(-15) == "已经太多人了，不要以多欺少啊。"){
        currentNPCIndex = currentNPCIndex + 1;
    }else{
        currentNPCIndex = 0;
    }
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};





//自动战斗--------------------------
function AutoKillFunc(){
    if(btnList["开战斗"].innerText  == '开战斗'){
        AutoKill1Func();
        btnList["开战斗"].innerText  = '关战斗';}
    else{clearKill2();
         {btnList["开战斗"].innerText  = '开战斗';}
        }

    function AutoKill1Func(){
        // 间隔500毫秒查找比试一次
        AutoKill1FuncIntervalFunc = setInterval(AutoKill1,2000);
    }

    function clearKill2(){
        clearInterval(AutoKill1FuncIntervalFunc);
    }

    function AutoKill1(){
        ninesword();
        if($('span.outbig_text:contains(战斗结束)').length>0){
            clickButton('prev_combat');
        }
    }
}

//无脑摸尸体--------------------------------
//AutoGetFunc();
function AutoGetFunc(){
    if(btnList["摸尸体"].innerText  == '摸尸体'){
        var AutoGet_targetName = "尸体";
        AutoGet1Func();
        btnList["摸尸体"].innerText  = '不摸了';}
    else{clearGet();
         {btnList["摸尸体"].innerText  = '摸尸体';}
        }

    function AutoGet1Func(){
        AutoGet1IntervalFunc = setInterval(AutoGet1,2000);
    }

    function clearGet(){
        clearInterval(AutoGet1IntervalFunc);
    }

    function AutoGet1(){
        $("button.cmd_click3").each(
            function(){
                if(isContains($(this).html() , AutoGet_targetName))
                    eval($(this).attr("onclick").replace("look_item corpse","get corpse"));
            });
    }
}

//战斗调用通用脚本----------------------------------------------------
var banSkills = "天师灭神剑|茅山道术";
function ninesword(){
    zdskill = mySkillLists;
    setTimeout(ninesword1,2000);
    if($('span.outbig_text:contains(战斗结束)').length>0){
        clickButton('prev_combat');
    }
}
function ninesword1(){
    // 如果找到设置的技能则释放
    for(var i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && isContains(zdskill, skillName)){
            console.log(skillName);
            clickButton('playskill '+i);
            return;
        }
    }

    // 如果没找到设置技能，随便用一个非招bb的技能
    for(i = 1;i < 5;i++){
        skillName = $('#skill_'+i).children().children().text();
        if(skillName !== "" && !isContains(banSkills, skillName)){
            console.log(skillName);
            clickButton('playskill '+i);
            return;
        }
    }
}

//采莲-------------------------
function CailianFunc(){
   go('jh 2;n;n;n;n;#wa 1000;n;n;n;n;n;#wa 1000;n;n;n;n;n;#wa 1000;n;n;n;n;n;#wa 1000;e;n;n;n;w;event_1_31320275;home;');
}

//攻击丹-------------------------
function BaodanFunc(){
   go('jh 14;sw;s;e;s;#wa 1000;s;sw;sw;w;w;#wa 1000;s;s;e;e;e;#wa 1000;n;ne;event_1_56989555;event_1_56989555 go;home');
}


//大昭寺-------------------------
function DazhaoFunc(){
    go('jh 26;w;w;n;e;#wa 1000;e;event_1_18075497;#wa 1000;w;w;n;event_1_14435995;s;');
}


//驿站-------------------------
function YaopuFunc(){
	var count_qn = prompt("请输入购买千年灵芝的数量",50);
    var buy = "";
    for(var i=0;i<count_qn/10;i++)
	{
		buy = buy + "#wa 500;buy /map/snow/obj/qiannianlingzhi_N_10 from snow_herbalist;";
	}
    go('jh 1;e;n;n;n;w;'+buy + "home");
}


// 峨眉山-----------------------------------------------------
function EmeiFunc1(){
    go("jh 8;ne;e;e;e;n");

}


//冰月谷-------------------------
function BingYueFunc(){
    go('jh 14;w;n;n;n;n;event_1_32682066');
}


//青城龙灵-------------------------
function LongLingFunc(){
    go('jh 15;n;nw;w;nw;n;event_1_14401179');
}


//白陀军阵-------------------------
function JunZhenFunc(){
    go('jh 21;n;n;n;n;w');
}