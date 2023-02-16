웹상에서 전화를 걸기 위해서는 WebRTC를 써야한다.

---
WebRTC: 웹브라우저를 통해 음성 및 영상 스트림을 송수신하는 기술

P2P(peer to peer) 방식으로 통신, 직접적인 전화번호 등록 기능 제공x

고유 ID or 닉네임 등 사용 가능

SIP 같은 전화 규약을 이용하여 전화번호 등록하고 WebRTC 기술을 적용하여 음성 통화 가능

이때는 SIP 서버와 WebRTC 사이의 미디어 게이트웨이를 이용하여 두 기술을 연동하여 사용 가능

상대방의 IP주소와 포트번호를 알아야 함, 그러나 대부분의 인터넷에선 NAT(Network Address Translation)이 적용되어, 로컬 IP주소와 공인 IP주소 간의 매핑이 필요함

---
SIP(Session Initiation Protocol): 인터넷 프로토콜(IP) 기반의 멀티미디어 통신을 위한 프로토콜
->VoIP(Voice over Internet Protocol)와 같은 인터넷 기반의 음성 통화 및 멀티미디어 통화를 위해 사용되며,
  전화 교환기나 음성 채팅, 영상 회의 등 다양한 통신 기능을 제공

SIP는 클라이언트-서버 모델을 기반으로 동작

SIP 클라이언트: 음성통화를 시도하는 단말이나 응용프로그램

SIP 서버: 클라이언트 간의 연결을 관리, SIP 요청과 응답 메시지를 처리하면 SIP 세션을 수립하고 제어함

SPI는 다른프로토콜과의 연동이 쉬움

PSTN(Public Switched Telephone Network) 게이트웨이를 이용하여 WebRTC 연결을 PSTN으로 연결시켜 일반 전화망으로 전화 가

WebRTC-3GPP 연동

3GPP(Third Generation Partnership Project) 는 모바일 통신 표준을 제정하는 단체, WebRTC와 연동항 모바일단말에서 일반 전화망으로 전화 가능

* javascript
```
// 서버에서 SDP를 받았을 때 실행되는 함수
function handleSdp(sdp) {
  peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
    .then(function() {
      if (sdp.type === "offer") {
        return peerConnection.createAnswer();
      }
    })
    .then(function(answer) {
      return peerConnection.setLocalDescription(answer);
    })
    .then(function() {
      // answer SDP를 서버에 전송
      sendSdp(peerConnection.localDescription);
    });
}
```
---
SDP(Session Description Protocol): 멀티미디어 세션을 위한 세션 설명 프로토콜

WebRTC에서 사용되며 브라우저간의 P2P연결을 설정

WebRTC에서 P2P연결을 설정하기 위해, 브라우저에서 로컬 스트림을 가져오고, STUN/TURN 서버를 이용하여 NAT를 통한 문제를 해결한 뒤,
상대방과 P2P 연결을 설정, 이때 연결을 위한 세션 정보를 SDP로 교환

SDP는 브라우저에서 가져온 로컬 스트림의 정보와 P2P 연결을 위한 네트워크 설정 정보, 코덱 정보 등을 포함

상대방에게 전달될 때는 문자열 형태로 전달, 상대방은 이를 다시 객체 형태로 변환하여사용

WebRTC에서는 SDP는 ICE(Interactive Connectivity Establishment) 프로토콜과 함께 사용
ICE:NAT(네트워크 주소 변환)와 방화벽으로 인해 P2P 연결에 어려움이있는 상황에서, STUN/TURN 서버를 통해 접속가능한 주소를 찾아내는 프로토콜

STUN(Sesstion Traversal Utilities for NAT) 서버는 WebRTC 연결시에 사용되며, NAT로 인해 발생되는 문제를 해결하기 위한 서버

클라이언트의 로컬 IP 주소와 NAT가 할당한 공인 IP주소, 그리고 NAT 타임 등을 알려줌

이 정보로 클라이언트는 NAT를 통해 연결할 수 있는 상대방의 IP 주소와 포트 번호를 찾아낼 수 있음.

TURN(Traversal Using Relay NAT) 서버는 STUN과 마찬가지로 NAT 문제를 해결하기 위해 사용됨.

브라우저에서 직접적으로 연결할 수 없는 상황에서 데이터를 전송할 수 있는 중계 서버 역할을 함.

NAT의 종류와 방화벽등으로 인해 P2P연결이 제한되는 경우에 유용

데이터 전송에 대한 추가적인 비용 발생할 수 있으므로 STUN이 우선적으로 사용되고 예외상황때만 TURN 사용하는게 좋음


---
```
// SDP를 서버에 전송하는 함수
function sendSdp(sdp) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // 서버에서 응답 받은 SDP 처리
      var response = JSON.parse(xhr.responseText);
      if (response.type === "answer") {
        handleSdp(response.sdp);
      }
    }
  };
  xhr.open("POST", "/sdp");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(sdp));
}
```

```
// 통화 종료 버튼 클릭 시 실행되는 함수
function hangup() {
  peerConnection.close();
}
```
