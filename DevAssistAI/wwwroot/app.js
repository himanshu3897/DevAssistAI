const form = document.querySelector("#analysis-form");
const codeInput = document.querySelector("#code");
const charCount = document.querySelector("#char-count");
const submitButton = document.querySelector("#submit-button");
const resultSection = document.querySelector("#result-section");
const resultElement = document.querySelector("#result");
const copyButton = document.querySelector("#copy-result");

const exampleCode = `public static decimal CalculateDiscount(decimal price, decimal discountPercent)
{
    return price - (price * discountPercent / 100);
}`;

function updateCount() {
  charCount.textContent = `${codeInput.value.length.toLocaleString()} / 20,000 characters`;
}

codeInput.addEventListener("input", updateCount);

document.querySelector("#load-example").addEventListener("click", () => {
  codeInput.value = exampleCode;
  updateCount();
  codeInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!codeInput.value.trim()) {
    codeInput.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Analyzing…";
  resultSection.hidden = false;
  resultElement.textContent = "Working on your request. This may take a moment.";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codeInput.value,
        task: document.querySelector("#task").value,
        language: document.querySelector("#language").value.trim() || "text"
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || payload.error || "The request could not be completed. Check the server configuration and try again.");
    }
    resultElement.textContent = payload.result || "The provider returned an empty response.";
  } catch (error) {
    resultElement.textContent = error.message || "Unexpected error. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Run analysis";
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultElement.textContent);
    copyButton.textContent = "Copied";
    window.setTimeout(() => { copyButton.textContent = "Copy result"; }, 1500);
  } catch {
    copyButton.textContent = "Select text to copy";
  }
});

updateCount();