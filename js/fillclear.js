function clearField() {
  if(document.searchform.searchfield.value == "Hallo") {
    document.searchform.searchfield.value = "";
  }
}

function fillField() {
  if(document.searchform.searchfield.value == "") {
    document.searchform.searchfield.value = "Hallo";
  }
}