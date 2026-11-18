// Консольный скрипт: делает 10 последовательных запросов к URL
// и считает среднее время, объём данных и скорость скачивания.

const REQUESTS = 10;

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Использование: node index.js <url>');
    process.exit(1);
  }

  let totalBytes = 0;
  let totalMs = 0;

  for (let i = 1; i <= REQUESTS; i++) {
    const start = performance.now();

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Запрос ${i}: сервер ответил ${res.status} ${res.statusText}`);
    }
    // arrayBuffer() ждёт, пока тело ответа придёт целиком
    const body = await res.arrayBuffer();

    const ms = performance.now() - start;
    totalBytes += body.byteLength;
    totalMs += ms;

    console.log(`Запрос ${i}/${REQUESTS}: ${ms.toFixed(0)} мс, ${(body.byteLength / 1024).toFixed(1)} КБ`);
  }

  const avgMs = totalMs / REQUESTS;
  const totalSec = totalMs / 1000;
  const mbPerSec = totalBytes / 1024 / 1024 / totalSec; // мегабайты в секунду
  const mbitPerSec = (mbPerSec * 8);                    // мегабиты в секунду

  console.log('\n--- Итоги ---');
  console.log(`Среднее время запроса: ${avgMs.toFixed(0)} мс`);
  console.log(`Всего скачано: ${(totalBytes / 1024 / 1024).toFixed(2)} МБ`);
  console.log(`Скорость скачивания: ${mbPerSec.toFixed(2)} МБ/с (${mbitPerSec.toFixed(2)} Мбит/с)`);
}

main().catch((err) => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});
