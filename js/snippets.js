let dragEnter = e => {
  e.preventDefault();

  me = e.currentTarget
  me.classList.add('hovered');
  if (me.childElementCount == 0) {
    // me.classList.add('hovered');
  } else {

    // let meIdx = [...feed.childNodes].indexOf(me);
    //
    // var idx = meIdx;
    //
    // if (idx >= 0) {
    //
    //   var s = -1;
    //   var i = 1;
    //
    //   var occupied = feed.childNodes[idx].childElementCount > 0;
    //
    //   while (occupied) {
    //     // delta is a sequence of [-1,+2,-3,+4...].
    //     // Starts with '-'' since left-bound search is preferrable.
    //     // allows to search for the nearest vacant slot by jumping around
    //     // the 'me' from both left and right, continuously receding from it
    //     //in terms of the array indices.
    //     let delta = i*s;
    //     idx += delta;
    //
    //     if (idx >= 0) {
    //       occupied = feed.childNodes[idx].childElementCount > 0;
    //     }
    //
    //     s *= -1; // sign flip for the next iteration
    //     i++;     // absolute magnitude increase for the next iteration
    //   }
    //
    //   console.log(`me: ${meIdx} free: ${idx}`);
    //
    //   if (meIdx > idx) {  // Vacant is to the left
    //
    //     for (var i = idx; i < meIdx; i++) {
    //       let targetTile = feed.childNodes[i];
    //       let sourceTile = feed.childNodes[i+1];
    //
    //       targetTile.appendChild(sourceTile.childNodes[0]);
    //     }
    //
    //   } else {            // Vacant ins to the right
    //
    //     for (var i = meIdx; i < idx; i++) {
    //       let targetTile = feed.childNodes[i+1];
    //       let sourceTile = feed.childNodes[i];
    //
    //       targetTile.appendChild(sourceTile.childNodes[0]);
    //     }
    //   }
    // } // Else we are beyond the feed bounds (moving around the stock)

  }
}
