export function retriggerTranslation() {
  const select = document.querySelector(".goog-te-combo");

  if (!select) return;

  const lang = select.value;

  select.value = "";
  select.value = lang;

  select.dispatchEvent(new Event("change"));
}
