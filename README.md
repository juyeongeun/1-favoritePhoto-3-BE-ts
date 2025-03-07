# 📸💕 최애의 포토

팀 협업 [노션 링크](https://bubble-city-3ac.notion.site/45d0984c93d146ebad41f9d4c835a0eb?v=d38586371d5d47e8bba3ee1ec029b278&pvs=4)

🎥 [시연 영상](https://drive.google.com/file/d/1Tm46eMQ_Woq-zwY9syITu1ZSH-vohZyG/view?usp=drive_link)

<br>

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

<br>

## **📚 프로젝트 소개**

- 디지털 포토 카드의 등록과 거래
    
    > "최애의 포토"는 디지털 시대의 새로운 수집 문화를 선도하는 플랫폼입니다. 자신이 좋아하는 아이돌이나 스포츠 스타, 그림 등 디지털 포토카드를 손쉽게 사고팔 수 있는 공간으로, 특별한 커뮤니티를 제공합니다. 이제는 좋아하는 포토카드를 실제로 모으는 것뿐만 아니라, 디지털 자산으로 소장하며 나만의 컬렉션을 완성할 수 있습니다. 서로의 포토카드를 교환하고, 나만의 포토카드를 자랑하는 재미와 함께 상호 교류도 즐길 수 있는 플랫폼, "최애의 포토"에서 만나보세요!
    > 
- 프로젝트 기간: 2024.10.08 ~ 2024.10.31
  
<br>

## **⚙ 기술 스택**

### Backend

<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/PrismaORM-2D3748?style=for-the-badge&logo=Prisma&logoColor=white">

### Database

<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white">

### 기타 Tool

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"> <img src="https://img.shields.io/badge/Zoom-0B5CFF?style=for-the-badge&logo=zoom&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

<br>

## **📌 구현 기능 상세**

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

<br>

## 📁 파일 구조
<details>
  <summary>파일 구조</summary>
<pre>
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
</pre>
</details>
