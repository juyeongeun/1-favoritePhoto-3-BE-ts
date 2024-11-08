# 📸💕 최애의 포토

---

# **👥 스프린트 1기 3팀_BE**

팀 협업 [노션 링크: [https://bubble-city-3ac.notion.site/45d0984c93d146ebad41f9d4c835a0eb?v=d38586371d5d47e8bba3ee1ec029b278&pvs=4]

---

## **👨‍👩‍👧 팀원 구성**
<div align="center">
  <table height="250px" width="100%">
    <tbody>
      <tr>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/866cb1b5-a8d5-4a3c-ab6e-00b1356f8cf1" width="150px;" alt="탁우현"/><br />
          <b>FS 팀원: 탁우현</b><br />
          <sub><a href="https://github.com/WooHyunTak">GitHub 프로필</a></sub>
        </td>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/56e6f1e8-955f-451d-b68e-f68011bba6c2" width="150px;" alt="주영은"/><br />
          <b>FS 팀원: 주영은</b><br />
          <sub><a href="https://github.com/juyeongeun">GitHub 프로필</a></sub>
        </td>
        <td align="center">
          <img src="https://github.com/user-attachments/assets/f2225266-aa8d-470a-ac16-abfea32c1e43" width="150px;" alt="김소희"/><br />
          <b>FS 팀원: 김소희</b><br />
          <sub><a href="https://github.com/Im-amberIm">GitHub 프로필</a></sub>
        </td>
      </tr>
    </tbody>
  </table>
</div>


---

## **📚 프로젝트 소개**

- 디지털 포토 카드의 등록과 거래
    
    > "최애의 포토"는 디지털 시대의 새로운 수집 문화를 선도하는 플랫폼입니다. 자신이 좋아하는 아이돌이나 스포츠 스타, 그림 등 디지털 포토카드를 손쉽게 사고팔 수 있는 공간으로, 특별한 커뮤니티를 제공합니다. 이제는 좋아하는 포토카드를 실제로 모으는 것뿐만 아니라, 디지털 자산으로 소장하며 나만의 컬렉션을 완성할 수 있습니다. 서로의 포토카드를 교환하고, 나만의 포토카드를 자랑하는 재미와 함께 상호 교류도 즐길 수 있는 플랫폼, "최애의 포토"에서 만나보세요!
    > 
- 프로젝트 기간: 2024.10.08 ~ 2024.10.31

---

## **⚙ 기술 스택**

### Backend

<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/PrismaORM-2D3748?style=for-the-badge&logo=Prisma&logoColor=white">

### Database

<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white">

### 기타 Tool

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"> <img src="https://img.shields.io/badge/Zoom-0B5CFF?style=for-the-badge&logo=zoom&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

---

## **📌 백엔드 팀원별 구현 기능 상세**

### **탁우현**

- 포토카드 교환 신청
    - 기능 개요: 이 기능은 판매자가 등록한 포토카드를 사용자(구매자)가 소유하고 있는 포토카드와 교환을 신청할 수 있습니다.
    - 구현 내용
        - 엔드포인트: `POST api/exchange/:id/request`
        - 요청 바디: 자신이 소유한 card의 Id와 희망하는 수량 제안하는 카드의 대한 설명을 받습니다. 아래의 예시를 확인
        
        ```jsx
        {
          "my-cardId": "number", //교환을 제안하는 카드의 Id
        	"description" : "string", //교환설명
        	"count" : "number", //교환을 희망하는 숫자 신청수와 교환수는 같다
        }
        
        ```
        
        - Request Params : 신청하는 상품(shop)의 Id를 받습니다.
        - 응답: 성공적으로 신청이 되면 생성된 exchange 레코드가 반환 됩니다.
- 포토카드 교환 취소
    - 기능 개요: 이 기능은 사용자(구매자)가 제안한 교환 신청을 취소 합니다.
    - 구현 내용
        - 엔드포인트: `DELETE api/exchange/:id`
        - Request Params : 신청한 exchange의 Id를 받습니다.
        - 응답: 성공적으로 취소가 되면  exchange 레코드를 삭제합니다.
- 포토카드 교환 승인
    - 기능 개요: 이 기능은 판매자가 특정 교환 신청을 수락 합니다
    - 구현 내용
        - 엔드포인트: `POST api/exchange/:id/accept`
        - Request Params : 신청한 exchange의 Id를 받습니다.
        - 처리순서:
            1. 등록된 상품의 남은 수량을 업데이트합니다.
            2. 신청자의 ID로 shop에 등록된 card의 아이템으로 새로운 레코드를 생성합니다.
            3. 판매자의 ID로 exchange에 신청된 card의 아이템으로 새로운 레코드를 생성합니다.
            4. 만약 교환이 완료된후 등록된 상품의 남은 수량이 없다면 다른 신청자들의 ID로 알림(notification) 레코드를 생성합니다.
            5. 승인된 신청자의 ID로 알림(notification) 레코드를 생성합니다.
            6. 위의 모든 작업은 transaction 처리로 진행됩니다.
            7. 모든 작업이 성공한다면 신청된 exchange 레코드를 삭제합니다.
        - 응답 : 판매자의 Id로 생성된 새로운 card 레코드를 반환합니다.
- 포토카드 교환 거절
    - 기능 개요: 이 기능은 판매자가 특정 교환 신청을 거절 합니다.
    - 구현 내용
        - 엔드포인트: `POST api/exchange/:id/refuse`
        - Request Params : 신청한 exchange의 Id를 받습니다.
        - 처리순서:
            1. 신청자의 ID로 거절 알림(notification) 레코드를 생성합니다.
            2. 신청된 exchange 레코드를 삭제합니다.
- 회원가입
    - 기능 개요: 이 기능은 새로운 사용자가 최애의 포토 사이트의 회원가입을 제공합니다.
    - 구현 내용
        - 엔드포인트: `POST api/users/signup`
        - Request Body:
            
            ```jsx
            {
                "email" : "String", //이메일형식 유효성검사
                "nickname" : "String",
                "password" : "String" // 특수문자 + 문자 + 숫자
            }
            ```
            
        - 응답: 성공적으로 가입이 완료되면 새로 생성한 user 레코드를 반환한다.
- 이메일 체크
    - 기능 개요: 이 기능은 새로운 사용자가 회원가입시 이미 사용중인 이메일을 검사합니다.
    - 구현 내용
        - 엔드포인트: `POST api/users/check-email`
        - Request Body:
            
            ```jsx
            {
              "email": "string"
            }
            ```
            
        - 응답:  성공적으로 검사가 되면 사용 가능 여부와 메시지를 반환 한다.
- 닉네임 체크
    - 기능 개요: 이 기능은 새로운 사용자가 회원가입시 이미 사용중인 닉네을 검사합니다.
    - 구현 내용
        - 엔드포인트: `POST /users/check-nickname`
        - Request Body:
            
            ```jsx
            {
              "nickname": "string"
            }
            
            ```
            
        - 응답:  성공적으로 검사가 되면 사용 가능 여부와 메시지를 반환 한다.
- 로그인
    - 기능 개요: 이 기능은 회원 사용자가 회원 자격을 요청합니다.
    - 구현 내용
        - 엔드포인트: `POST /users/login`
        - Request Body:
            
            ```jsx
            {
              "email": "string",
            	"password" : "string"
            }
            
            ```
            
        - 처리순서 :
            1. 리퀘스트로 전달받은 이메일 정보로 등록된 사용자를 검사합니다.
            2. 등록된 이메일인 경우 전달받은 비밀번호와 저장된 비밀번호를 비교합니다.
            3. 비밀번호가 일치하는 경우 access-token과 refresh-token을 생성한다 (JWT 토큰)
            4. 생성된 refresh-token을 사용자 테이블의 저장합니다.
            5. 생성된 토큰을 쿠키에 담아 사용자 정보와 함께 반환 합니다.
        - 응답:  생성된 쿠키과 사용자 정보를 JSON으로 반환 합니다.
- 로그아웃
    - 기능 개요: 이 기능은 로그인된 사용자가 사이트에서 로그아웃을 제공합니다.
    - 구현 내용
        - 엔드포인트: `DELETE /users/logout`
        - Request : origin cookie에 저장된 access 토큰
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 사용자 테이블의 refresh-token을 제거 합니다.
            3. 토큰의 값을 저장하지 않고 반환합니다.
        - 응답:  제거된 쿠키 반환 합니다.
- 사용자 정보 조회
    - 기능 개요: 이 기능은 사용자가 자신의 정보를 조회합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/me`
        - Request : origin cookie에 저장된 access 토큰
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 리퀘스트의 user 정보를 저장합니다.
            3. 저장된 user정보를 가지고 데이터베이스를 조회합니다.
            4. 조회된 사용자 정보를 반환합니다.
        - 응답:  전달받은 쿠키생성에 사용된 사용자정보를 조회후 JSON으로 반환합니다
- 토큰갱신
    - 기능 개요: 이 기능은 만료된 access-token을 갱신합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/refresh-token`
        - Request : origin cookie에 저장된 refresh 토큰
        - 처리순서 :
            1. 리퀘스트로 전달받은 refresh-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 토큰의 user 정보와 실제로 저장된 refresh-token을 비교합니다.
            3. 동일한 정보라면 새로운 access-token과 refresh-token을 생성합니다.
            4. 새롭게 생성된 refresh-token의 정보를 데이터베이스의 저장합니다.
            5. 새롭게 생성된 토큰을 쿠키에 담아 user 정보와 함께 반환합니다.
        - 응답:  새로운 토큰과 사용자 정보를 JSON으로 반환합니다
- 나의 교환 목록
    - 기능 개요: 이 기능은 사용자가 신청한 교환 목록을 조회합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/my-exchange`
        - Request : origin cookie에 저장된 access 토큰
        - Requset-Query :
            
            ```jsx
            keyword = "String",
            limit = "Number",
            cursor = "Number"
            ```
            
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 토큰의 user 정보와 Query로 전달받은 정보로 저장된 교환목록을 조회합니다. 
            3. 조회된 레코드 리스트와 다음 Cursor를 반환합니다.
        - 응답:  조회된 레코드 리스트와 다음 Cursor를 JSON 반환합니다.
- 나의 카드 목록
    - 기능 개요: 이 기능은 사용자가 소유한 카드 목록을 조회합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/my-cards`
        - Request : origin cookie에 저장된 access 토큰
        - Requset-Query :
            
            ```jsx
            keyword = "String",
            limit = "Number",
            cursor = "Number"
            ```
            
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 토큰의 user 정보와 Query로 전달받은 정보로 저장된 카드목록을 조회합니다. 
            3. 조회된 레코드 리스트와 다음 Cursor를 반환합니다.
        - 응답:  조회된 레코드 리스트와 다음 Cursor를 JSON 반환합니다.
- 나의 카드 등급 수
    - 기능 개요: 이 기능은 사용자가 소유한 카드 등급별 소유수 조회합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/my-cards-count`
        - Request : origin cookie에 저장된 access 토큰
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 토큰의 user 정보로 저장된 각 등급별 수를 조회합니다. 
            3. 조회된 등급별 수를 반환합니다.
        - 응답:  조회된 등급별 수를  JSON 반환합니다.
- 나의 판매 목록
    - 기능 개요: 이 기능은 사용자가 판매중인 카드 목록을 목록을 조회합니다.
    - 구현 내용
        - 엔드포인트: `GET /users/my-sales`
        - Request : origin cookie에 저장된 access 토큰
        - Requset-Query :
            
            ```jsx
            keyword = "String",
            limit = "Number",
            cursor = "Number",
            grade= "String",
            genre= "String",
            salesType= "salesType",
            isSoldOut= "boolean",
            ```
            
        - 처리순서 :
            1. 리퀘스트로 전달받은 access-token의 유효성 검사를 진행합니다.
            2. 유효한 토큰이라면 토큰의 user 정보와 Query로 전달받은 정보로 저장된 카드목록을 조회합니다. 
            3. 조회된 레코드 리스트에서 각각의 교환/판매 테이블의 관계를 판단합니다.
            4. 각각의 레코드가 판매중인 상품이라면 isSoldOut 상태를 확인하고 프로퍼티를 추가합니다.
            5. 완성된 리스트를 nextCursor와 함께 반환 합니다.
        - 응답:  조회된 레코드 리스트와 다음 Cursor를 JSON 반환합니다.

### 주영은

- 포토카드 등록
    - 기능 개요: 이 기능은 사용자가 카드를 최초로 등록할 때 이용됩니다.
    - 구현 내용
        - 엔드포인트: `POST api/cards`
        - 요청 바디: 이미지 multer 사용으로 데이터는 form-data 형식으로 전송합니다.
            
            ```json
            {
            	"name": "string",
            	"grade": "string",
            	"genre": "string",
            	"description": "string",
            	"totalCount": "Number",
            	"imageURL": "File"
            }
            ```
            
    - 처리 순서:
        1. 이미지를 AWS S3에 업로드 합니다.
        2. 데이터의 유효성을 검사합니다.
            1. 유효성이 위배된다면 AWS S3에 업로드된 해당 이미지를 삭제합니다.
    - 응답
        - 카드 등록이 성공적으로 끝나면 생성된 새로운 카드 레코드를 반환합니다.
- 포토카드 구매
    - 기능 개요: 이 기능은 상점에 등록된 포토카드를 구매할 때 이용되는 기능입니다.
    - 구현 내용
        - 엔드포인트: `POST api/purchases/:shopId`
        - 요청 바디: 구매 할 카드의 수량을 전송합니다.
            
            ```json
            {
            	"count": "Number"
            }
            ```
            
        - Request Params
            - 해당 상점의 id를 받습니다.
        - 처리순서:
            1. 구매자(User) 포인트를 차감합니다.
            2. 판매자(User) 포인트를 증가합니다.
            3. 상점(Shop) 재고를 업데이트합니다.
            4. 구매자에게 해당 카드(Card)를 새로운 레코드로 생성합니다.
            5. 구매자 ID로 구매 기록(Purchase) 레코드를 생성합니다.
            6. 구매자의 ID로 구매 완료 알림(Notification) 레코드를 생성합니다.
            7. 판매자의 ID로 판매 완료 알림(Notification) 레코드를 생성합니다.
            8. 위의 모든 작업은 transaction 처리로 진행됩니다.
            9. 구매 후 해당 상점의 카드가 품절일 경우
                1. 판매자 ID로 품절 완료 알림(Notification) 레코드를 생성합니다.
                2. 교환 신청자가 있을 경우 신청자 n명에 대해 해당 카드가 품절이 되었다는 알림(Notification) 레코드를 n개 생성합니다.
    - 응답: 구매 완료된 후의 해당 상점 레코드를 반환합니다.

### 김소희

- 상점
    - 포토카드 판매 등록
        - 기능 개요 : 마이갤러리에 생성되어있는 포토카드 목록에서 판매할 포토카드를 선택, 등록하여 마켓플레이스에서 판매할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `POST /shop`
            - 요청 바디: 포토카드의 ID, 가격, 총 발행량, 등급, 장르, 설명을 포함한 JSON 형식입니다.(교환희망 장르,등급,설명은 선택적)
            
            ```json
            {
              "cardId": 1,
              "price": 15,
              "totalCount": 2,
              "exchangeGrade": "RARE", // 선택적
              "exchangeGenre": "자연", // 선택적
              "exchangeDescription": "푸른자연이 가득한 사진 구해요." // 선택적
            }
            ```
            
            - Request Params : 상점에 등록할 포토카드의 ID가 포함됩니다.
            - 응답: 성공적으로 등록되면, 생성된 상점 카드 레코드가 반환됩니다.
    - 포토카드 판매 취소
        - 기능 개요 : 마이플레이스 페이지에 판매중인 포토카드를 판매 취소(철회)할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `DELETE /shop/cards/:shopId/:cardId`
            - 요청 바디:  없음
            - Request Params : 판매 취소할 카드가 등록된 상점의 ID와 판매취소할 포토카드의 ID
            - 응답: 성공적으로 판매가 취소되면, 해당 카드에 대한 취소 결과가 반환됩니다.
    - 상점에 등록한 포토카드 수정
        - 기능 개요 : 마이플레이스 페이지에 판매중인 포토카드의 가격, 판매 수량, 교환 희망 정보(선택적)를 수정 할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `PATCH /shop/cards/:shopId/:cardId`
            - 요청 바디: 포토카드의 가격, 총 발행량, 등급, 장르, 설명을 포함한 JSON 형식입니다.(교환희망 장르,등급,설명은 선택적)
            
            ```json
            {
              "price": 30,
              "totalCount":4,
              "exchangeGrade": "RARE", // 선택적
              "exchangeGenre": "풍경", // 선택적
              "exchangeDescription": "꽃이 배경인 RARE 풍경 카드를 찾습니다" // 선택적
            }
            ```
            
            - Request Params : 수정할 포토카드가 등록된 상점의 ID, 수정할 포토카드의 ID
            - 응답: 성공적으로 수정되면, 업데이트된 상점 카드 레코드가 반환됩니다.
    - 상점에 등록한 포토카드 전체 조회
        - 기능 개요 : 마이플레이스 페이지에 판매중인 모든 포토카드를 아무나 조회할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `GET /shop/cards`
            - 요청 바디: 없음
            - Request Params : 없음
            - 응답: 성공적으로 조회되면, 등록한 모든 상점 카드가 포함된 리스트가 반환됩니다.
    - 상점에 등록한 포토카드 상세 조회
        - 기능 개요 : 마이플레이스 페이지에 판매중인 포토카드를 상세 조회할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `GET /shop/cards/:shopId/:cardId`
            - 요청 바디: 없음
            - Request Params : 상세조회 할 카드가 등록된 상점의 ID와 상세조회 할 포토카드의 ID
            - 응답: 성공적으로 조회되면, 해당 포토카드의 상세정보가 포함된 객체가 반환됩니다.
- 알림
    - 알림 생성
        - 기능 개요 : 다양한 이벤트(교환 제안, 판매 완료 등)에 따라 사용자에게 알림을 생성하여 전달하는 기능입니다.
        - 구현 내용
            - 엔드포인트: `POST /notifications`
            - 요청 바디: 알림 유형에 따라 다름
            
            ```json
                    {
                      "type": 1, // 알림 유형 (예: 교환제안)
                      "exchange": {
                        "user": {
                          "nickname": "사용자닉네임" // 교환 제안을 보낸 사용자 닉네임
                        },
                        "userId": 11, // 교환 제안을 보낸 사용자 ID
                        "shop": {
                          "userId": 22, // 판매자 ID
                          "card": {
                            "grade": "RARE", // 카드 등급
                            "name": "카드이름" // 카드 이름
                          }
                        }
                      }
                    }
                    ```
            ```
            
            - Request Params : 알림을 생성할 이벤트의 관련 데이터가 포함됩니다.
            - 응답: 성공적으로 등록되면, 생성된 알림 정보가 포함된 객체가 반환됩니다.
    - 모든 알림 전체 조회
        - 기능 개요 : 현재 로그인한 사용자에게 온 모든 알림을 조회할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `GET /notifications`
            - 요청 바디: 없음.
            - Request Params : 없음.
            - 응답: 성공적으로 조회되면, 모든 알림이 포함된 리스트가 반환됩니다.
    - 알림 업데이트
        - 기능 개요 : 특정 알림의 읽음 여부를 업데이트하여 사용자가 확인한 알림을 관리할 수 있는 기능입니다.
        - 구현 내용
            - 엔드포인트: `PATCH /notifications/:id`
            - 요청 바디:
            
            ```json
            {
              "read": true // // 알림의 읽음 여부를 업데이트
            }
            ```
            
            - Request Params : 수정할 알림의 ID가 포함됩니다.
            - 응답: 성공적으로 업데이트되면, 수정된 알림 정보가 포함된 객체가 반환됩니다.
    - 알림 삭제
        - 기능 개요 : 특정 알림을 삭제할 수 있습니다.
        - 구현 내용
            - 엔드포인트: `DELETE /notifications/:id`
            - 요청 바디: 없음
            - Request Params : 삭제할 알림의 ID가 포함됩니다.
            - 응답: 성공적으로 삭제되면, 알림 성공적으로 삭제되었다는 메세지가 반환됩니다.
- 포인트
    - 랜덤 포인트 뽑기
        - 기능 개요 : 로그인한 사용자에게 1시간에 1번 랜덤 상자 뽑기 기회를 부여하는 기능입니다. 뽑은 포인트는 적립됩니다.
        - 구현 내용
            - 엔드포인트: `POST /point/draw`
            - 요청 바디: 없음
            - Request Params : 없음
            - 응답: 성공적으로 뽑기 이벤트가 완료되면, 적립된 포인트와 관련된 정보가 포함된 객체가 반환됩니다.

---

## 📁 파일 구조

```

├─ app.js
├─ config
│  ├─ cookiesConfig.js
│  └─ passportConfig.js
├─ controllers
│  ├─ cardController.js
│  ├─ exchangeController.js
│  ├─ notificationController.js
│  ├─ pointController.js
│  ├─ purchaseController.js
│  ├─ shopController.js
│  └─ userController.js
├─ env.js
├─ middlewares
│  ├─ card
│  │  ├─ cardValidation.js
│  │  └─ imageUpload.js
│  ├─ error
│  │  └─ errorHandler.js
│  ├─ exchange
│  │  └─ exchangeValidation.js
│  ├─ passport
│  │  └─ jwtToken.js
│  ├─ shop
│  │  └─ shopValidation.js
│  └─ users
│     ├─ authUser.js
│     └─ userValidation.js
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ mockData.js
│  ├─ schema.prisma
│  └─ seed.js
├─ repositorys
│  ├─ cardRepository.js
│  ├─ exchangeRepository.js
│  ├─ notificationRepository.js
│  ├─ pointRepository.js
│  ├─ purchaseRepository.js
│  ├─ shopRepository.js
│  └─ userRepository.js
├─ services
│  ├─ cardService.js
│  ├─ exchangeService.js
│  ├─ notificationService.js
│  ├─ pointService.js
│  ├─ purchaseService.js
│  ├─ shopService.js
│  └─ userService.js
└─ utils
   ├─ error
   │  └─ asyncHandle.js
   ├─ notification
   │  └─ createByType.js
   ├─ prismaClient.js
   └─ random
      └─ random.js
```
