# sweetpet

반려동물의 일상과 성장 기록을 저장하고, 쌓인 기록을 앨범북 주문 데이터로 변환할 수 있는 콘텐츠 서비스입니다.

---

## 1. 서비스 소개

### 한 줄 설명

반려동물의 일상을 기록하고, 일정 기간의 기록을 앨범북 주문 데이터로 만들 수 있는 서비스입니다.

### 타겟 사용자

* 반려동물을 키우는 보호자
* 반려동물의 성장 과정을 날짜별로 남기고 싶은 사용자
* 쌓인 기록을 바탕으로 앨범북 제작 요청 데이터를 만들고 싶은 사용자

### 주요 기능

* 반려동물 등록 및 조회
* 반려동물별 기록 CRUD
  * 날짜
  * 몸무게
  * 컨디션
  * 메모
  * 태그
* 특정 기간의 기록을 묶어 앨범북 주문 생성
* 주문 상태 관리
  * `pending`
  * `processing`
  * `completed`
* 주문 데이터 JSON export

### 화면 역할 구분

서비스 화면은 시연 목적상 사용자 화면과 관리자 화면으로 분리합니다.

* 사용자 화면
  * 반려동물 관리
  * 반려동물 일상 기록 작성 및 조회
  * 특정 기간의 기록을 선택해 앨범북 주문 생성
* 관리자 화면
  * 접수된 주문 목록 확인
  * 주문 상태 관리
  * 주문 데이터 JSON export

관리자 화면은 주문 관리와 export까지만 제공하며, 사용자 반려동물이나 기록을 직접 생성/수정하는 기능은 포함하지 않습니다. 로그인, 권한 관리, 결제, 배송, 실제 인쇄 API 연동은 현재 범위에 포함하지 않습니다.

---

## 2. 실행 방법 (Docker)

```bash
# 저장소 클론
git clone <repo-url>
cd sweetpet

# 환경변수 준비
cp .env.example .env

# 실행
docker compose up --build
```

접속:

* Web: http://localhost:5173
* API: http://localhost:4000

포트를 변경해야 하는 경우 `.env`의 값을 수정합니다.

```bash
WEB_PORT=5173
API_PORT=4000
```

---

## 3. 완성한 레벨

### Lv1: 서비스 구현

구현 내용:

* 반려동물 등록
* 반려동물 목록 및 상세 조회
* 기록 생성, 조회, 수정, 삭제
* 날짜, 몸무게, 컨디션, 메모, 태그 기반 기록 관리
* 로그인 없이 확인 가능한 더미 데이터 제공

### Lv2: 자체 주문 기능

구현 내용:

* 특정 기간의 기록을 선택해 앨범북 주문 생성
* 주문 목록 및 상세 조회
* 주문 상태 관리
  * `pending → processing → completed`

### Lv3: 주문 데이터 익스포트

구현 내용:

* 주문 1건에 필요한 반려동물 정보, 기록 목록, 주문 메타데이터를 JSON으로 export
* 가상의 인쇄 API에 전달 가능한 구조화된 데이터 생성
* 실제 외부 API 호출 없이 독립적으로 동작

---

## 4. 기술 스택 및 아키텍처

### 기술 스택

* Frontend: React + Vite + TypeScript
* Backend: Express + TypeScript
* Database: SQLite
* Infra: Docker, Docker Compose

### 선택 이유

빠른 개발과 단순한 실행 환경을 우선했습니다. React와 Vite는 가벼운 프론트엔드 개발에 적합하고, Express는 RESTful API를 빠르게 구성하기 좋습니다. SQLite는 별도 DB 서버 없이 Docker 환경에서 바로 실행할 수 있어 과제 심사 환경에 적합합니다.

### 주요 구조

```text
sweetpet/
  client/        # React + Vite frontend
  server/        # Express + TypeScript backend
  data/          # SQLite database file
  README.md
  DESIGN.md
  SERVICE_GUIDE.md
  AGENT_RULES.md
  docker-compose.yml
```

---

## 5. AI 도구 사용 내역

* ChatGPT
  * 서비스 아이디어 정리
  * 데이터 모델 초안 작성
  * README, DESIGN, SERVICE_GUIDE, AGENT_RULES 문서 구성
* Codex
  * 프로젝트 문서 작성 및 정리
  * 구현 범위와 과제 요구사항 점검
  * 이후 보일러플레이트 및 코드 작성 보조 예정

AI가 생성한 내용은 그대로 확정하지 않고, 과제 요구사항과 서비스 방향에 맞는지 검토한 뒤 반영합니다.

---

## 6. 설계 의도

이 서비스는 책 제작 자체보다 반려동물의 일상 기록을 중심에 둡니다. 사용자가 남긴 날짜별 기록이 쌓이고, 그 기록 중 특정 기간을 선택해 앨범북 주문 데이터로 변환되는 흐름을 목표로 합니다.

핵심 흐름:

```text
Record → Accumulate → Select Period → Create Order → Export
```

역할 기준 흐름:

```text
User: Pet → Record → Select Period → Create Order
Admin: Manage Orders → Update Status → Export JSON
```

### 아이디어 선택 이유

반려동물의 성장은 사진, 메모, 몸무게, 컨디션처럼 작은 기록으로 남는 경우가 많습니다. sweetpet은 이런 기록을 단순 저장에 그치지 않고, 나중에 하나의 앨범북 주문 데이터로 연결할 수 있게 설계했습니다.

### 사업적 가능성

반려동물 기록은 반복 사용성이 있고, 일정 기간이 지나면 앨범북, 기념 책자, 선물용 콘텐츠로 확장될 수 있습니다. 콘텐츠가 먼저 쌓이고, 책 제작은 그 콘텐츠를 활용한 부가 기능이 되는 구조이기 때문에 인쇄 API와 연결하기 좋은 서비스 모델입니다.

### 더 시간이 있었다면 추가할 기능

* 사진 업로드 및 앨범 레이아웃 미리보기
* 가족 공유 기록 기능
* 월별 성장 리포트
* AI 기반 기록 요약 및 앨범 제목 추천
* 실제 인쇄 API 연동을 위한 export schema 버전 관리
