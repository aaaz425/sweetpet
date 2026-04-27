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

function App() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [recordForm, setRecordForm] = useState({
    recordDate: "2026-04-27",
    weight: "",
    condition: "good",
    memo: "",
    tags: ""
  });
  const [orderForm, setOrderForm] = useState({
    title: "Mong's April Album",
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
          <h1>Pet records into album-ready order data.</h1>
        </div>
      </header>

      <section className="grid">
        <div className="panel">
          <h2>Pet</h2>
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
          <h2>New Record</h2>
          <form onSubmit={createRecord} className="form">
            <label>
              Date
              <input
                type="date"
                value={recordForm.recordDate}
                onChange={(event) => setRecordForm({ ...recordForm, recordDate: event.target.value })}
              />
            </label>
            <label>
              Weight
              <input
                inputMode="decimal"
                placeholder="4.5"
                value={recordForm.weight}
                onChange={(event) => setRecordForm({ ...recordForm, weight: event.target.value })}
              />
            </label>
            <label>
              Condition
              <select
                value={recordForm.condition}
                onChange={(event) => setRecordForm({ ...recordForm, condition: event.target.value })}
              >
                <option value="great">great</option>
                <option value="good">good</option>
                <option value="normal">normal</option>
                <option value="tired">tired</option>
              </select>
            </label>
            <label className="wide">
              Memo
              <textarea
                required
                placeholder="Write a short daily note."
                value={recordForm.memo}
                onChange={(event) => setRecordForm({ ...recordForm, memo: event.target.value })}
              />
            </label>
            <label className="wide">
              Tags
              <input
                placeholder="walk, grooming"
                value={recordForm.tags}
                onChange={(event) => setRecordForm({ ...recordForm, tags: event.target.value })}
              />
            </label>
            <button className="primary" type="submit">Add record</button>
          </form>
        </div>
      </section>

      <section className="panel">
        <h2>Records</h2>
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
                  <span>{record.weight ? `${record.weight}kg` : "No weight"}</span>
                  <button onClick={() => deleteRecord(record.id)}>Delete</button>
                </div>
              </article>
            ))}
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Create Order</h2>
          <form onSubmit={createOrder} className="form single">
            <label>
              Title
              <input
                value={orderForm.title}
                onChange={(event) => setOrderForm({ ...orderForm, title: event.target.value })}
              />
            </label>
            <label>
              Start
              <input
                type="date"
                value={orderForm.startDate}
                onChange={(event) => setOrderForm({ ...orderForm, startDate: event.target.value })}
              />
            </label>
            <label>
              End
              <input
                type="date"
                value={orderForm.endDate}
                onChange={(event) => setOrderForm({ ...orderForm, endDate: event.target.value })}
              />
            </label>
            <button className="primary" type="submit">Create order</button>
          </form>
        </div>

        <div className="panel">
          <h2>Orders</h2>
          <div className="orders">
            {orders.map((order) => (
              <article className="order-row" key={order.id}>
                <div>
                  <strong>{order.title}</strong>
                  <span>{order.start_date} - {order.end_date}</span>
                </div>
                <span className="status">{order.status}</span>
                <button onClick={() => updateOrderStatus(order)}>Next</button>
                <button onClick={() => exportOrder(order.id)}>Export</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {exportJson && (
        <section className="panel">
          <h2>JSON Export</h2>
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
