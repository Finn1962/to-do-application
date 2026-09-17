const queryString = window.location.search;

const params = new URLSearchParams(queryString);

const scrollPosition = params.get("scrollY");

window.window.scrollTo({
  top: scrollPosition,
  left: 0,
  behavior: "instant",
});
