/* Popup */
export function spawnPopup(
  title: string,
  message: string,
  severity: "crit" | "warn",
  duration?: number
) {
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.classList.add("popup-" + severity);

  const titleObj = document.createElement("h1");
  titleObj.innerText = title;
  popup.appendChild(titleObj);

  const messageObj = document.createElement("p");
  messageObj.innerText = message;
  popup.appendChild(messageObj);

  document.body.appendChild(popup);

  if (duration) {
    setTimeout(() => {
      popup.remove();
    }, duration);
  }
}

/* Error catcher */
window.addEventListener("error", (e) => {
  spawnPopup(e.error, e.message, "crit");
});

/* DOM Injector */
export function injectContent(q: string, content: string) {
  document.querySelector(q)!.innerHTML = content;

  var scripts = Array.prototype.slice.call(
    document.querySelector(q)!.getElementsByTagName("script")
  );
  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src != "") {
      var tag = document.createElement("script");
      tag.src = scripts[i].src;
      document.getElementsByTagName("head")[0].appendChild(tag);
    } else {
      eval(scripts[i].innerHTML);
    }
  }
}
