




  function play_card(){
    let obj = card_tool.check_clicked_card(game_state.receiver)
    if(obj.matching ==="True"){
      const card = CardModule.get_card_detail(obj.card_id);
      if(card.card_value === "wild"){
        const modal = document.getElementById("modal");
        modal.classList.add("show");
        modal.style.display="block";
        
      }
    }

  }
  

  function color_selector(event){
    // event.preventDefault();
    console.log(event.target);

  }