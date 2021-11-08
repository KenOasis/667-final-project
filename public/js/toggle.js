/*
  javascript for triggering tolltip toggle 
 */

let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Reference: https://codepen.io/team/bootstrap/pen/zYBXGwX?editors=1010
new bootstrap.Popover(document.body, {
  selector: '.has-popover'
});