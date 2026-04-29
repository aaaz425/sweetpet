import { expect, test, type APIRequestContext } from "@playwright/test";

const apiUrl = "http://127.0.0.1:4010";

async function deletePetByName(request: APIRequestContext, petName: string) {
  const response = await request.get(`${apiUrl}/api/pets`);
  if (!response.ok()) return;

  const payload = (await response.json()) as { data: Array<{ id: number; name: string }> };
  const createdPets = payload.data.filter((pet) => pet.name === petName);

  await Promise.all(createdPets.map((pet) => request.delete(`${apiUrl}/api/pets/${pet.id}`)));
}

test("creates an album order and exports JSON from admin", async ({ page, request }) => {
  const runId = Date.now();
  const petName = `E2E 펫 ${runId}`;
  const orderTitle = `E2E 앨범 ${runId}`;

  try {
    await test.step("seed 데이터에 의존하지 않도록 새 마이펫을 등록한다", async () => {
      await page.goto("/pets");
      await expect(page.getByRole("button", { name: /마이펫 등록/ })).toBeVisible();
      await page.getByRole("button", { name: /마이펫 등록/ }).click();
      await expect(page.getByRole("heading", { name: "마이펫 등록" })).toBeVisible();
      await page.getByLabel("이름").fill(petName);
      await page.getByRole("combobox", { name: "종류 선택" }).click();
      await page.getByRole("option", { name: "강아지" }).click();
      await page.getByRole("button", { name: "등록", exact: true }).click();
      await expect(page.getByText(petName)).toBeVisible();
    });

    await test.step("앨범북 주문에 필요한 최소 일상기록 5개를 작성한다", async () => {
      await page.goto("/records");
      await expect(page.getByRole("button", { name: "일상기록 작성" })).toBeVisible();
      await page.getByLabel("마이펫").click();
      await page.getByText(petName).click();

      for (let index = 1; index <= 5; index += 1) {
        const recordMemo = `E2E 기록 ${runId}-${index}`;

        await test.step(`일상기록 ${index}번째를 작성한다`, async () => {
          await page.getByRole("button", { name: "일상기록 작성" }).click();
          await expect(page.getByRole("heading", { name: "일상기록 작성" })).toBeVisible();
          await page.getByPlaceholder("이날 있었던 일을 적어주세요.").fill(recordMemo);
          await page.getByRole("button", { name: "일상기록 추가" }).click();
          await expect(page.getByText(recordMemo)).toBeVisible();
        });
      }
    });

    await test.step("방금 작성한 기록으로 앨범북 주문을 생성한다", async () => {
      await page.goto("/albums");
      await expect(page.getByRole("heading", { name: "주문 내역" })).toBeVisible();

      await page.getByRole("button", { name: "주문하기" }).click();
      await expect(page.getByRole("heading", { name: "앨범북 주문" })).toBeVisible();
      await page.getByLabel("대상 반려동물").click();
      await page.getByText(petName).click();
      await page.getByPlaceholder("제목을 입력하세요").fill(orderTitle);
      await expect(page.getByText("5개")).toBeVisible();
      await page.getByRole("button", { name: "주문하기" }).last().click();

      await expect(page.getByText(orderTitle)).toBeVisible();
    });

    await test.step("관리자가 주문을 열고 export JSON을 확인한다", async () => {
      await page.getByRole("tab", { name: "관리자" }).click();
      await expect(page.getByText(orderTitle)).toBeVisible();
      await page.getByText(orderTitle).click();

      await expect(page.getByRole("heading", { name: orderTitle })).toBeVisible();
      await page.getByRole("button", { name: "JSON 보기" }).click();

      const exportJson = page.locator("pre");
      await expect(exportJson).toContainText('"service": "sweetpet"');
      await expect(exportJson).toContainText('"exportVersion": "1.0"');
      await expect(exportJson).toContainText(orderTitle);
      await expect(exportJson).toContainText('"selectedRecords"');
    });
  } finally {
    await test.step("E2E가 생성한 마이펫과 연결 데이터를 정리한다", async () => {
      await deletePetByName(request, petName);
    });
  }
});
