import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Page = "pets" | "records" | "orders" | "export";

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthday: string;
  memo: string;
};

type RecordItem = {
  id: number;
  pet_id: number;
  record_date: string;
  weight: number | null;
  condition: string;
  memo: string;
  tags: string[];
};

type Order = {
  id: number;
  pet_id: number;
  title: string;
  start_date: string;
  end_date: string;
  status: "pending" | "processing" | "completed";
};

const pageLabels: Record<Page, string> = {
  pets: "반려동물",
  records: "기록",
  orders: "주문",
  export: "내보내기"
};

const orderStatusLabels: Record<Order["status"], string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

function App() {
  const [activePage, setActivePage] = useState<Page>("records");
  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [petForm, setPetForm] = useState({
    name: "",
    species: "강아지",
    breed: "",
    birthday: "",
    memo: ""
  });
  const [recordForm, setRecordForm] = useState({
    recordDate: "2026-04-27",
    weight: "",
    condition: "좋음",
    memo: "",
    tags: ""
  });
  const [orderForm, setOrderForm] = useState({
    title: "몽이의 4월 앨범",
    startDate: "2026-04-01",
    endDate: "2026-04-30"
  });
  const [exportJson, setExportJson] = useState("");

  const selectedPet = useMemo(() => pets.find((pet) => pet.id === selectedPetId), [pets, selectedPetId]);
  const selectedRecords = useMemo(
    () => records.filter((record) => !selectedPetId || record.pet_id === selectedPetId),
    [records, selectedPetId]
  );
  const selectedOrders = useMemo(
    () => orders.filter((order) => !selectedPetId || order.pet_id === selectedPetId),
    [orders, selectedPetId]
  );

  async function loadAll() {
    const [petsResponse, recordsResponse, ordersResponse] = await Promise.all([
      fetch(`${apiUrl}/api/pets`),
      fetch(`${apiUrl}/api/records`),
      fetch(`${apiUrl}/api/orders`)
    ]);
    const nextPets = await petsResponse.json();
    setPets(nextPets);
    setRecords(await recordsResponse.json());
    setOrders(await ordersResponse.json());
    setSelectedPetId((current) => current ?? nextPets[0]?.id ?? null);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createPet(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch(`${apiUrl}/api/pets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(petForm)
    });
    const pet = await response.json();
    setPetForm({ name: "", species: "강아지", breed: "", birthday: "", memo: "" });
    setSelectedPetId(pet.id);
    await loadAll();
  }

  async function createRecord(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await fetch(`${apiUrl}/api/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petId: selectedPetId,
        recordDate: recordForm.recordDate,
        weight: recordForm.weight ? Number(recordForm.weight) : null,
        condition: recordForm.condition,
        memo: recordForm.memo,
        tags: recordForm.tags
      })
    });
    setRecordForm((form) => ({ ...form, memo: "", tags: "" }));
    await loadAll();
  }

  async function deleteRecord(id: number) {
    await fetch(`${apiUrl}/api/records/${id}`, { method: "DELETE" });
    await loadAll();
  }

  async function createOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedPetId) return;

    await fetch(`${apiUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId: selectedPetId, ...orderForm })
    });
    setActivePage("orders");
    await loadAll();
  }

  async function updateOrderStatus(order: Order) {
    const nextStatus = order.status === "pending" ? "processing" : order.status === "processing" ? "completed" : "completed";
    await fetch(`${apiUrl}/api/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });
    await loadAll();
  }

  async function exportOrder(id: number) {
    const response = await fetch(`${apiUrl}/api/orders/${id}/export`);
    setExportJson(JSON.stringify(await response.json(), null, 2));
    setActivePage("export");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>sweetpet</span>
          <strong>반려동물 기록장</strong>
        </div>

        <nav className="nav">
          {(Object.keys(pageLabels) as Page[]).map((page) => (
            <button className={activePage === page ? "active" : ""} key={page} onClick={() => setActivePage(page)}>
              {pageLabels[page]}
            </button>
          ))}
        </nav>

        <div className="pet-switcher">
          <span>현재 반려동물</span>
          <select value={selectedPetId ?? ""} onChange={(event) => setSelectedPetId(Number(event.target.value))}>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span>{selectedPet ? selectedPet.name : "반려동물"}</span>
            <h1>{pageLabels[activePage]}</h1>
          </div>
          <div className="summary">
            <div>
              <strong>{selectedRecords.length}</strong>
              <span>기록</span>
            </div>
            <div>
              <strong>{selectedOrders.length}</strong>
              <span>주문</span>
            </div>
          </div>
        </header>

        {activePage === "pets" && (
          <section className="page-grid">
            <div className="section-panel">
              <div className="section-title">
                <h2>등록된 반려동물</h2>
                <span>{pets.length}마리</span>
              </div>
              <div className="pet-list">
                {pets.map((pet) => (
                  <button
                    className={pet.id === selectedPetId ? "pet-card active" : "pet-card"}
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                  >
                    <strong>{pet.name}</strong>
                    <span>{pet.breed || pet.species}</span>
                    <p>{pet.memo}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="section-panel">
              <div className="section-title">
                <h2>새 반려동물</h2>
              </div>
              <form className="form stack" onSubmit={createPet}>
                <label>
                  이름
                  <input required value={petForm.name} onChange={(event) => setPetForm({ ...petForm, name: event.target.value })} />
                </label>
                <label>
                  종류
                  <input value={petForm.species} onChange={(event) => setPetForm({ ...petForm, species: event.target.value })} />
                </label>
                <label>
                  품종
                  <input value={petForm.breed} onChange={(event) => setPetForm({ ...petForm, breed: event.target.value })} />
                </label>
                <label>
                  생일
                  <input type="date" value={petForm.birthday} onChange={(event) => setPetForm({ ...petForm, birthday: event.target.value })} />
                </label>
                <label>
                  메모
                  <textarea value={petForm.memo} onChange={(event) => setPetForm({ ...petForm, memo: event.target.value })} />
                </label>
                <button className="primary" type="submit">등록</button>
              </form>
            </div>
          </section>
        )}

        {activePage === "records" && (
          <section className="page-grid records-layout">
            <div className="section-panel">
              <div className="section-title">
                <h2>기록 목록</h2>
                <span>최근순</span>
              </div>
              <div className="records">
                {selectedRecords.map((record) => (
                  <article className="record-card" key={record.id}>
                    <div className="record-date">
                      <time>{record.record_date}</time>
                      <strong>{record.weight ? `${record.weight}kg` : "-"}</strong>
                    </div>
                    <div className="record-body">
                      <h3>{record.condition}</h3>
                      <p>{record.memo}</p>
                      <div className="tags">
                        {record.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                    <button className="text-button" onClick={() => deleteRecord(record.id)}>삭제</button>
                  </article>
                ))}
              </div>
            </div>

            <div className="section-panel">
              <div className="section-title">
                <h2>기록 작성</h2>
              </div>
              <form onSubmit={createRecord} className="form stack">
                <label>
                  날짜
                  <input
                    type="date"
                    value={recordForm.recordDate}
                    onChange={(event) => setRecordForm({ ...recordForm, recordDate: event.target.value })}
                  />
                </label>
                <label>
                  몸무게
                  <input
                    inputMode="decimal"
                    placeholder="4.5"
                    value={recordForm.weight}
                    onChange={(event) => setRecordForm({ ...recordForm, weight: event.target.value })}
                  />
                </label>
                <label>
                  컨디션
                  <select
                    value={recordForm.condition}
                    onChange={(event) => setRecordForm({ ...recordForm, condition: event.target.value })}
                  >
                    <option value="아주 좋음">아주 좋음</option>
                    <option value="좋음">좋음</option>
                    <option value="보통">보통</option>
                    <option value="피곤함">피곤함</option>
                  </select>
                </label>
                <label>
                  메모
                  <textarea
                    required
                    placeholder="오늘 있었던 일을 적어주세요."
                    value={recordForm.memo}
                    onChange={(event) => setRecordForm({ ...recordForm, memo: event.target.value })}
                  />
                </label>
                <label>
                  태그
                  <input
                    placeholder="산책, 미용"
                    value={recordForm.tags}
                    onChange={(event) => setRecordForm({ ...recordForm, tags: event.target.value })}
                  />
                </label>
                <button className="primary" type="submit">기록 추가</button>
              </form>
            </div>
          </section>
        )}

        {activePage === "orders" && (
          <section className="page-grid">
            <div className="section-panel">
              <div className="section-title">
                <h2>주문 만들기</h2>
                <span>기간 기준</span>
              </div>
              <form onSubmit={createOrder} className="form stack">
                <label>
                  제목
                  <input value={orderForm.title} onChange={(event) => setOrderForm({ ...orderForm, title: event.target.value })} />
                </label>
                <label>
                  시작일
                  <input
                    type="date"
                    value={orderForm.startDate}
                    onChange={(event) => setOrderForm({ ...orderForm, startDate: event.target.value })}
                  />
                </label>
                <label>
                  종료일
                  <input
                    type="date"
                    value={orderForm.endDate}
                    onChange={(event) => setOrderForm({ ...orderForm, endDate: event.target.value })}
                  />
                </label>
                <button className="primary" type="submit">주문 생성</button>
              </form>
            </div>

            <div className="section-panel">
              <div className="section-title">
                <h2>주문 목록</h2>
                <span>{selectedOrders.length}건</span>
              </div>
              <div className="orders">
                {selectedOrders.map((order) => (
                  <article className="order-card" key={order.id}>
                    <div>
                      <strong>{order.title}</strong>
                      <span>{order.start_date} - {order.end_date}</span>
                    </div>
                    <span className="status">{orderStatusLabels[order.status]}</span>
                    <div className="row-actions">
                      <button onClick={() => updateOrderStatus(order)}>상태 변경</button>
                      <button onClick={() => exportOrder(order.id)}>JSON 보기</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activePage === "export" && (
          <section className="section-panel">
            <div className="section-title">
              <h2>주문 데이터</h2>
              <span>JSON</span>
            </div>
            {exportJson ? (
              <pre>{exportJson}</pre>
            ) : (
              <div className="empty-state">
                <strong>아직 내보낸 주문이 없습니다.</strong>
                <p>주문 화면에서 JSON 보기를 선택하면 이곳에서 구조화된 주문 데이터를 확인할 수 있습니다.</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
