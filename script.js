/**
 * 이 파일은 미니톡 스팸방지 플러그인의 일부입니다. (https://www.minitalk.io)
 *
 * 도배메시지를 차단합니다.
 * 
 * @file /plugins/antipapering/script.js
 * @author Arzz (arzz@arzz.com)
 * @license MIT License
 * @version 1.0.1
 * @modified 2021. 8. 17.
 */
if (Minitalk === undefined) return;

/**
 * 도배방지 플러그인 적용을 받지 않을 최소권한
 * 0 ~ 9 : 0 : 손님, 9 : 관리자
 */
me.limit = 1;

/**
 * 도배기준 time 초 내 count 개의 메시지 작성
 */
me.time = 10; // 10초 내
me.count = 5; // 5개 메시지

// 메시지를 보낼때마다 보낸 시각을 기록한다.
Minitalk.on("sendMessage",function(minitalk,message) {
	if (minitalk.user.me.level < me.limit) {
		// 메시지를 보낸 기록을 저장한다.
		var antipapering = Minitalk.session("antipapering") ? Minitalk.session("antipapering") : [];
		antipapering.push(moment().valueOf());
		
		while (antipapering.length > me.count) {
			antipapering.shift();
		}
		
		Minitalk.session("antipapering",antipapering);
	}
});

// 메시지를 보내기전 도배기준에 충족하는지 확인한다.
Minitalk.on("beforeSendMessage",function(minitalk) {
	// 메시지를 보낸 기록을 가져온다.
	var antipapering = Minitalk.session("antipapering") ? Minitalk.session("antipapering") : [];
	
	// 갯수를 확인한다.
	if (antipapering.length == me.count) {
		// 젤 처음 보낸 메시지 시각을 확인하여 기준 시간 이내라면
		if (antipapering[0] >= moment().valueOf() - me.time * 1000) {
			Minitalk.ui.printSystemMessage("error",me.time + "초 이내에 " + me.count + "개 이상의 메시지를 전송할 수 없습니다.");
			return false;
		}
	}
});