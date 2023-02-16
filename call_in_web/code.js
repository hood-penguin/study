// 일반 전화번호로 전화를 거는 함수
function call(phoneNumber) {
  // RTCPeerConnection 객체 생성
  var peerConnection = new RTCPeerConnection({
    iceServers: [{
      urls: "stun:stun.l.google.com:19302"
    }]
  });
  
  // getUserMedia를 이용하여 마이크의 오디오 스트림을 받아옴
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function(stream) {
    // 로컬 PeerConnection에 오디오 스트림 추가
    peerConnection.addStream(stream);
    
    // 일반 전화번호를 가지고 있는 상대방과 연결하는 코드
    var offerOptions = {
      offerToReceiveAudio: 1
    };
    
    // RTCPeerConnection 객체를 이용하여 SDP 세션 생성
    peerConnection.createOffer(offerOptions)
    .then(function(sessionDescription) {
      // 생성한 SDP 세션을 로컬 PeerConnection에 설정
      peerConnection.setLocalDescription(sessionDescription);
      
      // 일반 전화번호로 전화 걸기
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // 응답을 받았을 때, SDP 세션을 상대방 PeerConnection에 설정
          peerConnection.setRemoteDescription(new RTCSessionDescription(xhr.responseText));
        }
      }
      xhr.open("POST", "/call");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify({
        phoneNumber: phoneNumber,
        sdp: sessionDescription.sdp
      }));
    })
    .catch(function(err) {
      console.error(err);
    });
  })
  .catch(function(err) {
    console.error(err);
  });
}
