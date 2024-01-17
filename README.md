# w3-b

<img width="774" alt="image" src="https://github.com/madcamp-2023/w3-b/assets/99087502/184d5170-1487-438e-a99d-ca2a38a98eca">

## Project Overview

2010년부터 지속된 몰입캠프가 초창기에 비해 참여자가 80명으로 늘어나고 앞으로의 운영계획 변화(학생 운영진, 노션 등)로 인하여 기존 홈페이지의 리뉴얼을 기획하게 되었습니다.

리뉴얼된 내용은 다음과 같습니다.
* 전반적인 웹 UI 및 UX를 수정하였습니다.
* 관리자 계정으로 들어가면 게시판 내용을 생성할 수 있습니다.
* 지정된 코드로 회원가입을 진행하면 후기를 작성할 수 있습니다.
* 후기 작성자만이 수정 및 삭제가 가능하도록 기획하였습니다.

## Technology Stack Selecton

### Server-Side: Node.js

Node.js는 단일 스레드 이벤트 루프 모델을 기반으로 하는 JavaScript 런타임 환경으로, 비동기식 입출력을 지원하여 높은 성능을 제공합니다. 이를 통해 빠른 서버 응답 시간을 유지하고 다수의 동시 연결을 처리할 수 있습니다. 또한, JavaScript를 사용하여 서버와 클라이언트 사이의 일관성 있는 코드 작성이 가능하여 개발 생산성을 높일 수 있습니다.

### Web Framework: Express.js

프로젝트에서는 Express.js를 웹 프레임워크로 선택하였습니다. Express.js는 Node.js를 위한 빠르고 유연한 웹 애플리케이션 프레임워크로, 간결한 구문과 미들웨어 지원을 통해 효율적인 라우팅 및 요청 처리를 제공합니다.

### Database: MariaDB

MariaDB는 MySQL의 오픈 소스 포크로, 안정성과 성능 면에서 우수한 관계형 데이터베이스 시스템입니다. ACID (원자성, 일관성, 고립성, 지속성)를 준수하며, 트랜잭션 관리 및 복제 기능을 지원하여 데이터의 신뢰성을 보장합니다. 또한, 오픈 소스 특성상 활발한 커뮤니티 지원과 다양한 플러그인을 활용할 수 있습니다.

데이터베이스로 Mariadb(mysql)을 사용하였고 전반적인 ERD는 아래와 같습니다.

<img width="698" alt="w3-b_ERD" src="https://github.com/hiyseo/Please/assets/94510731/768c8409-d4c8-483f-b55f-73f8e8068866">

### Deployment Environment: AWS EC2

프로젝트를 실제 환경에 배포하기 위해 Amazon Web Services (AWS) EC2 인스턴스를 선택하였습니다. EC2는 탄력적인 컴퓨팅 파워를 제공하며, 가상 서버를 사용하여 안정적인 웹 애플리케이션 배포를 가능케 합니다.

#### AWS EC2 선택 이유

1. 탄력성과 확장성: EC2는 필요에 따라 가상 서버를 생성하고 크기를 조정할 수 있어 트래픽 증가에 따른 탄력적인 대응이 가능합니다.
2. 신뢰성과 안정성: AWS는 글로벌 인프라를 기반으로 하며, 다양한 가용 영역과 데이터 센터에서 안정적인 서비스를 제공합니다.
3. 편리한 관리: EC2는 AWS Management Console을 통해 쉽게 관리할 수 있으며, 다양한 AMI(Amazon Machine Image)를 활용하여 운영체제 및 소프트웨어 설정을 간편하게 구성할 수 있습니다.

### Key Advantages
1. 성능 향상: Node.js의 비동기식 입출력은 빠른 응답 시간과 효율적인 자원 활용을 가능케 합니다.
2. 유지보수성 강화: JavaScript를 서버와 클라이언트 양쪽에서 사용하여 코드 일관성을 유지하고 개발자들 간의 협업을 용이하게 합니다.
3. 데이터베이스 안정성: MariaDB의 안정성과 ACID를 준수하는 특성으로 신뢰성 있는 데이터 관리를 지원합니다.
