# sweetpet

반려동물의 일상과 성장 기록을 저장하고, 쌓인 기록을 앨범북 주문 데이터로 변환할 수 있는 콘텐츠 서비스입니다.

---

## 1. 서비스 소개

### 한 줄 설명

반려동물의 일상을 기록하고, 일정 기간의 기록을 앨범북 주문 데이터로 만들 수 있는 서비스입니다.

### 타겟 사용자

- 반려동물을 키우는 보호자
- 반려동물의 성장 과정을 날짜별로 남기고 싶은 사용자
- 쌓인 기록을 바탕으로 앨범북 제작 요청 데이터를 만들고 싶은 사용자

### 주요 기능

- 반려동물 등록, 조회, 수정, 삭제
  - 이름, 종, 품종, 생일, 메모, 사진
- 반려동물별 기록 CRUD
  - 날짜
  - 컨디션
  - 메모
  - 태그
  - 사진
- 특정 기간의 기록을 묶어 앨범북 주문 생성
  - 주문 생성 시 Book draft 생성, 기록 연결, finalized 처리 후 Order 생성
  - 인쇄 옵션: 판형, 제본, 용지, 수량
- 주문 상태 관리
  - `pending`
  - `processing`
  - `completed`
  - `canceled`
- 주문 데이터 JSON export

### 화면 역할 구분

서비스 화면은 시연 목적상 사용자 화면과 관리자 화면으로 분리합니다.

- 사용자 화면
  - 반려동물 관리
  - 반려동물 일상 기록 작성 및 조회
  - 특정 기간의 기록을 선택해 앨범북 주문 생성
- 관리자 화면
  - 접수된 주문 목록 확인
  - 주문 상태 관리
  - 주문 데이터 JSON 복사

관리자 화면은 주문 관리와 JSON 복사까지만 제공하며, 사용자 반려동물이나 기록을 직접 생성/수정하는 기능은 포함하지 않습니다. 로그인, 권한 관리, 결제, 배송, 실제 인쇄 API 연동은 현재 범위에 포함하지 않습니다.

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

- Web: http://localhost:5173
- API: http://localhost:4000

포트를 변경해야 하는 경우 `.env`의 값을 수정합니다.

```bash
WEB_PORT=5173
API_PORT=4000
```

Docker Compose 실행 시 SQLite 데이터베이스는 `data/sweetpet.sqlite`에 생성됩니다. 데이터가 없는 경우 서버가 시연용 반려동물과 기록 더미 데이터를 자동으로 넣습니다.

---

## 3. 로컬 개발 및 테스트

```bash
# 의존성 설치
npm install

# 프론트엔드와 백엔드 개발 서버 실행
npm run dev

# 빌드
npm run build

# 단위/통합 테스트
npm test

# E2E 테스트
npm run test:e2e
```

로컬 개발 서버 기본 주소:

- Web: http://localhost:5173
- API: http://localhost:4000

백엔드만 실행할 때는 `npm run start --workspace server`를 사용할 수 있습니다. 이 경우 먼저 `npm run build --workspace server`가 필요합니다.

---

## 4. 완성한 레벨

### Lv1: 서비스 구현

구현 내용:

- 반려동물 등록, 수정, 삭제
- 반려동물 목록 및 상세 조회
- 기록 생성, 조회, 수정, 삭제
- 날짜, 컨디션, 메모, 태그, 사진 기반 기록 관리
- 로그인 없이 확인 가능한 더미 데이터 제공

### Lv2: 자체 주문 기능

구현 내용:

- 특정 기간의 기록을 선택해 앨범북 주문 생성
- 주문 생성 시 내부적으로 Book draft 생성, 기록 연결, finalized 처리, Order 생성
- 주문 생성 조건
  - 선택 기간 내 기록 최소 5개
  - 선택 기간 내 기록 최대 30개
- 주문 목록 및 상세 조회
- pending 주문 수정
- 주문 상태 관리
  - `pending → processing → completed`
  - `pending → canceled`

### Lv3: 주문 데이터 익스포트

구현 내용:

- 주문 1건, 또는 여러건에 필요한 주문, Book, 반려동물, 선택 기록, 인쇄 옵션을 JSON으로 복사
- 가상의 인쇄 API에 전달 가능한 구조화된 데이터 생성
- 실제 외부 API 호출 없이 독립적으로 동작

---

## 5. 기술 스택 및 아키텍처

### 기술 스택

- Frontend: React + Vite + TypeScript
- UI: Tailwind CSS, shadcn/Radix 기반 공용 컴포넌트, lucide-react
- State/Data: TanStack Query, React Hook Form, Zod
- Backend: Express + TypeScript, multer
- Database: SQLite (`node:sqlite`)
- Test: Vitest, Supertest, Playwright
- Infra: Docker, Docker Compose

### 선택 이유

빠른 개발과 단순한 실행 환경을 우선했습니다. React와 Vite는 가벼운 프론트엔드 개발에 적합하고, Express는 RESTful API를 빠르게 구성하기 좋습니다. SQLite는 별도 DB 서버 없이 Docker 환경에서 바로 실행할 수 있어 과제 심사 환경에 적합합니다. TanStack Query와 React Hook Form/Zod는 목록 조회, 폼 입력, 검증 흐름을 작게 유지하기 위해 사용했습니다.

### 주요 구조

```text
sweetpet/
  client/        # React + Vite frontend
  server/        # Express + TypeScript backend
  e2e/           # Playwright end-to-end tests
  data/          # SQLite database file
  README.md
  DATA_MODEL.md
  DESIGN.md
  SERVICE_GUIDE.md
  AGENT_RULES.md
  docker-compose.yml
```

### API 개요

모든 API 응답은 다음 형태를 사용합니다.

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": []
}
```

주요 엔드포인트:

- `GET /api/health`
- `GET /api/pets`
- `POST /api/pets`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`
- `GET /api/records`
- `POST /api/records`
- `PUT /api/records/:id`
- `DELETE /api/records/:id`
- `GET /api/books`
- `POST /api/books`
- `GET /api/books/:bookUid`
- `POST /api/books/:bookUid/contents`
- `POST /api/books/:bookUid/finalization`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:orderUid`
- `PUT /api/orders/:orderUid`
- `PATCH /api/orders/:orderUid/status`
- `GET /api/orders/:orderUid/export`

---

## 6. AI 도구 사용 내역

- ChatGPT
  - 서비스 아이디어 정리
  - 데이터 모델 초안 작성
  - README, DESIGN, SERVICE_GUIDE, AGENT_RULES 문서 구성
- Codex
  - 프로젝트 문서 작성 및 정리
  - 구현 범위와 과제 요구사항 점검
  - 프론트엔드/백엔드 구현 보조
  - 테스트와 README 최신화 보조

AI가 생성한 내용은 그대로 확정하지 않고, 과제 요구사항과 서비스 방향에 맞는지 검토한 뒤 반영합니다.

---

## 7. 설계 의도

이 서비스는 책 제작 자체보다 반려동물의 일상 기록을 중심에 둡니다. 사용자가 남긴 날짜별 기록이 쌓이고, 그 기록 중 특정 기간을 선택해 앨범북 주문 데이터로 변환되는 흐름을 목표로 합니다.

핵심 흐름:

```text
기록 → 누적 → 기간 선택 → 주문 생성 → 내보내기
```

역할 기준 흐름:

```text
사용자: 반려동물 관리 → 기록 작성 → 기간 선택 → 주문 생성
관리자: 주문 관리 → 상태 변경 → JSON 내보내기
```

### 아이디어 선택 이유

반려동물의 성장은 사진, 메모, 컨디션처럼 작은 기록으로 남는 경우가 많습니다. sweetpet은 이런 기록을 단순 저장에 그치지 않고, 나중에 하나의 앨범북 주문 데이터로 연결할 수 있게 설계했습니다.

### 사업적 가능성

반려동물 기록은 반복 사용성이 있고, 일정 기간이 지나면 앨범북, 기념 책자, 선물용 콘텐츠로 확장될 수 있습니다. 콘텐츠가 먼저 쌓이고, 책 제작은 그 콘텐츠를 활용한 부가 기능이 되는 구조이기 때문에 인쇄 API와 연결하기 좋은 서비스 모델입니다.

### 더 시간이 있었다면 추가할 기능

- 앨범 레이아웃 미리보기
- 가족 공유 기록 기능 (회원/인증 추가)
- 월별 성장 리포트
- AI 기반 기록 요약 및 앨범 제목 추천
- 실제 인쇄 API 연동을 위한 export schema 버전 관리
