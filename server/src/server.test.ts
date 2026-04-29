import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { db, migrate, seed } from "./db.js";
import { createApp } from "./server.js";

const app = createApp();

function resetDatabase() {
  migrate();
  db.exec(`
    DELETE FROM book_records;
    DELETE FROM orders;
    DELETE FROM books;
    DELETE FROM records;
    DELETE FROM pets;
    DELETE FROM sqlite_sequence WHERE name IN ('pets', 'records', 'books', 'orders');
  `);
  seed();
}

async function seedPetId() {
  const response = await request(app).get("/api/pets").expect(200);
  return response.body.data[0].id as number;
}

async function createSeedOrder() {
  const petId = await seedPetId();
  const response = await request(app)
    .post("/api/orders")
    .send({
      petId,
      title: "온달의 3월 앨범",
      startDate: "2026-03-04",
      endDate: "2026-03-29",
      printOptions: {
        size: "b5",
        binding: "hardcover",
        paper: "glossy",
        quantity: 2
      }
    })
    .expect(201);

  return response.body.data;
}

beforeEach(() => {
  resetDatabase();
});

describe("sweetpet api", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        ok: true,
        service: "sweetpet"
      }
    });
  });

  it("returns seeded pets", async () => {
    const response = await request(app).get("/api/pets").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "온달",
          species: "강아지"
        })
      ])
    );
  });

  it("creates, updates, lists, and deletes records", async () => {
    const petId = await seedPetId();

    const created = await request(app)
      .post("/api/records")
      .field("petId", String(petId))
      .field("recordDate", "2026-04-25")
      .field("condition", "좋음")
      .field("memo", "테스트 기록입니다.")
      .field("tags", "테스트,기록")
      .expect(201);

    const recordId = created.body.data.id;
    expect(created.body.data).toMatchObject({
      petId,
      recordDate: "2026-04-25",
      tags: ["테스트", "기록"]
    });

    const updated = await request(app)
      .put(`/api/records/${recordId}`)
      .field("recordDate", "2026-04-26")
      .field("condition", "아주 좋음")
      .field("memo", "수정된 테스트 기록입니다.")
      .field("tags", "수정")
      .expect(200);

    expect(updated.body.data).toMatchObject({
      id: recordId,
      recordDate: "2026-04-26",
      condition: "아주 좋음",
      tags: ["수정"]
    });

    const listed = await request(app).get(`/api/records?petId=${petId}`).expect(200);
    expect(listed.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: recordId })])
    );

    await request(app).delete(`/api/records/${recordId}`).expect(200);

    const afterDelete = await request(app).get(`/api/records?petId=${petId}`).expect(200);
    expect(afterDelete.body.data).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: recordId })])
    );
  });

  it("creates an order from a valid record period", async () => {
    const order = await createSeedOrder();

    expect(order).toMatchObject({
      title: "온달의 3월 앨범",
      status: "pending",
      recordCount: 5,
      printOptions: {
        size: "b5",
        binding: "hardcover",
        paper: "glossy",
        quantity: 2
      }
    });
    expect(order.orderUid).toMatch(/^order_/);
  });

  it("rejects order creation when the selected period has too few records", async () => {
    const petId = await seedPetId();

    const response = await request(app)
      .post("/api/orders")
      .send({
        petId,
        title: "기록 부족 주문",
        startDate: "2026-04-01",
        endDate: "2026-04-01"
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: "at least 5 records are required"
    });
  });

  it("updates order status from pending to processing to completed", async () => {
    const order = await createSeedOrder();

    const processing = await request(app)
      .patch(`/api/orders/${order.orderUid}/status`)
      .send({ status: "processing" })
      .expect(200);

    expect(processing.body.data.status).toBe("processing");

    const completed = await request(app)
      .patch(`/api/orders/${order.orderUid}/status`)
      .send({ status: "completed" })
      .expect(200);

    expect(completed.body.data.status).toBe("completed");
  });

  it("exports an order as structured JSON", async () => {
    const order = await createSeedOrder();

    const response = await request(app).get(`/api/orders/${order.orderUid}/export`).expect(200);

    expect(response.body.data).toMatchObject({
      service: "sweetpet",
      exportVersion: "1.0",
      order: expect.objectContaining({
        orderUid: order.orderUid,
        recordCount: 5
      }),
      book: expect.objectContaining({
        recordCount: 5
      }),
      pet: expect.objectContaining({
        name: "온달"
      }),
      printOptions: {
        size: "b5",
        binding: "hardcover",
        paper: "glossy",
        quantity: 2
      }
    });
    expect(response.body.data.generatedAt).toEqual(expect.any(String));
    expect(response.body.data.selectedRecords).toHaveLength(5);
  });
});
