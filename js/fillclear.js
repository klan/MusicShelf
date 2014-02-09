function clearField() {
  if(document.searchform.term.value == "Search") {
    document.searchform.term.value = "";
  }
}

function fillField() {
  if(document.searchform.term.value == "") {
    document.searchform.term.value = "Search";
  }
}