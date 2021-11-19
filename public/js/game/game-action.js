
  function play_card(){
    let buttom_player = document.getElementById("container_bottom");
    let container = buttom_player.getElementsByClassName("hand")[0];
    const id =parseInt(container.id.replace(/player_/g,""));
    
    let obj = card_tool.check_clicked_card(id)
    console.log(obj)
    // if(obj.matching ==="True"){
    //   const card = CardModule.get_card_detail(obj.card_id);
    //   if(card.card_value === "wild"){
    //     const modal = document.getElementById("modal");
    //     modal.classList.add("show");
    //     modal.style.display="block";
        
    //   }
    // }

  }

  function color_selector(event){
    // event.preventDefault();
    console.log(event.target);

  }