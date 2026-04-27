import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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

const orderStatusLabels: Record<Order["status"], string> = {
  pending: "대기",
  processing: "진행 중",
  completed: "완료"
};

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
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
  }

  return (
    <main>
      <header className="page-header">
        <div>
          <p className="eyebrow">sweetpet</p>
          <h1>반려동물의 일상을 앨범 주문 데이터로.</h1>
        </div>
      </header>

      <section className="grid">
        <div className="panel">
          <h2>반려동물</h2>
          <div className="pet-list">
            {pets.map((pet) => (
              <button
                className={pet.id === selectedPetId ? "pet-card active" : "pet-card"}
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
              >
                <strong>{pet.name}</strong>
                <span>{pet.breed || pet.species}</span>
              </button>
            ))}
          </div>
          {selectedPet && <p className="muted">{selectedPet.memo}</p>}
        </div>

        <div className="panel">
          <h2>새 기록</h2>
          <form onSubmit={createRecord} className="form">
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
            <label className="wide">
              메모
              <textarea
                required
                placeholder="오늘의 기록을 짧게 남겨주세요."
                value={recordForm.memo}
                onChange={(event) => setRecordForm({ ...recordForm, memo: event.target.value })}
              />
            </label>
            <label className="wide">
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

      <section className="panel">
        <h2>기록</h2>
        <div className="records">
          {records
            .filter((record) => !selectedPetId || record.pet_id === selectedPetId)
            .map((record) => (
              <article className="record-card" key={record.id}>
                <div>
                  <time>{record.record_date}</time>
                  <h3>{record.condition}</h3>
                  <p>{record.memo}</p>
                  <div className="tags">
                    {record.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <div className="record-meta">
                  <span>{record.weight ? `${record.weight}kg` : "몸무게 없음"}</span>
                  <button onClick={() => deleteRecord(record.id)}>삭제</button>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>주문 생성</h2>
          <form onSubmit={createOrder} className="form single">
            <label>
              제목
              <input
                value={orderForm.title}
                onChange={(event) => setOrderForm({ ...orderForm, title: event.target.value })}
              />
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

        <div className="panel">
          <h2>주문</h2>
          <div className="orders">
            {orders.map((order) => (
              <article className="order-row" key={order.id}>
                <div>
                  <strong>{order.title}</strong>
                  <span>{order.start_date} - {order.end_date}</span>
                </div>
                <span className="status">{orderStatusLabels[order.status]}</span>
                <button onClick={() => updateOrderStatus(order)}>다음 상태</button>
                <button onClick={() => exportOrder(order.id)}>JSON 내보내기</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {exportJson && (
        <section className="panel">
          <h2>JSON 내보내기</h2>
          <pre>{exportJson}</pre>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
