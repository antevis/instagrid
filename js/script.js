let doc = window.document;

let container = doc.getElementById('container');
let stock = doc.getElementById('stock');
let feed = doc.getElementById('feed');
let rowInput = doc.getElementById('rows-input');

let processUrl = f => {
  let reader = new FileReader();
  reader.readAsDataURL(f);

  reader.onload = rlev => {

    let img = new Image();
    img.src = rlev.target.result;

    img.onload = () => {
      let srcHeight = img.height;
      let srcWidth = img.width;
      let scaleFactor = 150 / Math.min(srcHeight, srcWidth);

      let elem = document.createElement('canvas');
      elem.width = srcWidth * scaleFactor;
      elem.height = srcHeight * scaleFactor;
      let ctx = elem.getContext('2d');
      ctx.drawImage(img, 0, 0, elem.width, elem.height);

      let url = ctx.canvas.toDataURL(img);

      let stockTileContainer = doc.createElement('div');
      stockTileContainer.style.width = '100px';
      stockTileContainer.style.height = '100px';
      stockTileContainer.classList.add('tile-container');

      addTileContainerEvents(stockTileContainer);

      let tile = doc.createElement('div');
      tile.classList.add('tile');
      tile.style.width = '98px';
      tile.style.height = '98px';
      tile.style.backgroundImage = `url(${url})`;
      tile.setAttribute('draggable', 'true');

      // Tiles listeners
      tile.addEventListener('dragstart', dragStart);
      tile.addEventListener('dragend', dragEnd);

      stockTileContainer.appendChild(tile);
      stock.appendChild(stockTileContainer);
    }
  }
}

let feedContainerCount = stockCount => {
  return Math.ceil(stockCount/3)*3;
}

let setTileParams = (parent, child) => {
  let parent_width = parent.offsetWidth;
  let parent_height = parent.offsetHeight;

  if (parent_width <= 100) {
    child.style.width = `${parent_width-2}px`
    child.style.height = `${parent_height-2}px`
    child.style.borderRadius = '3px';
  } else {
    child.style.width = `${parent_width}px`
    child.style.height = `${parent_height}px`
    child.style.borderRadius = 0;
  }
}

let popChildren = parent => {
  while (parent.firstChild)
    parent.removeChild(parent.firstChild);
}

let addTileContainerEvents = tileContainer => {
  tileContainer.addEventListener('dragover', dragOver);
  tileContainer.addEventListener('dragenter', dragEnter);
  tileContainer.addEventListener('dragleave', dragLeave);
  tileContainer.addEventListener('drop', dragDrop);
}

let handleFileSelect = e => {

  container.style.display = 'flex';
  container.style.height = `${window.innerHeight - 150}px`;

  let files = [...e.target.files].filter( s => s.type.includes("image") );

  for (file of files) {
    processUrl(file);
  }
}

let randomColor = () => {
  let red = parseInt(Math.random()*255);
  let green = parseInt(Math.random()*255);
  let blue = parseInt(Math.random()*255);

  return `rgb(${red},${green},${blue})`
}

var ego = null;

// Tiles events
let dragStart = e => {
  e.dataTransfer.setData('Text', '');
  ego = e.currentTarget;
  setTimeout(() => ego.classList.add('invisible'), 0);
}

let dragEnd = e => {
  e.currentTarget.classList.remove('invisible');
}

// Tile-container events
let dragOver = e => {
  e.preventDefault();
}

let dragEnter = e => {
  e.preventDefault();
  e.currentTarget.classList.add('hovered');
}

let dragLeave = e => {
  e.currentTarget.classList.remove('hovered');
}

let dragDrop = e => {
  if (e.currentTarget.childElementCount != 0) { // need to switch parents

    let ego_parent = ego.parentNode;
    let existing_child = e.currentTarget.childNodes[0];
    ego_parent.appendChild(existing_child);

    setTileParams(ego_parent, existing_child);
  }

  e.currentTarget.appendChild(ego);

  setTileParams(e.currentTarget, ego);

  e.currentTarget.classList.remove('hovered');
}

let init = () => {

  doc.getElementById('files').addEventListener('change', handleFileSelect, false);
  doc.getElementById('add-rows-button').addEventListener('click', () => {

    if (stock.childElementCount > 0) {

      let nRows = parseInt(rowInput.value);
      if (nRows) {
        for (var i = 0; i < nRows*3; i++) {
          let feedTileContainer = doc.createElement('div');
          feedTileContainer.style.width = '148px';
          feedTileContainer.style.height = '148px';
          feedTileContainer.classList.add('tile-container');

          addTileContainerEvents(feedTileContainer);
          feed.insertBefore(feedTileContainer, feed.firstElementChild);
        }

        if (feed.offsetWidth <= 450) {
          let feedScrollBarWidth = feed.offsetWidth - feed.scrollWidth;
          feed.style.width = `${feed.offsetWidth + feedScrollBarWidth}px`;
        }
      }
    } else {
      alert('Nowhere to add.');
    }
  });
  doc.getElementById('download').addEventListener('click', () => {

    let feed = doc.getElementById('feed');

    if (feed.childElementCount > 0) {

      let h_full = feed.scrollHeight;

      let h_visible = feed.offsetHeight;

      // Showing full height of the feed to create full canvas.
      feed.style.overflow = 'unset';
      container.style.height = `${h_full}px`;

      html2canvas(feed)
      .then(canvas => {
        canvas.toBlob(function(blob) {
            saveAs(blob, "Dashboard.png");
        });
      })
      .then(() => {
        // back to normal height.
        feed.style.overflow = 'scroll';
        container.style.height = `${h_visible}px`;
      });
    } else {
      alert('Nothing to download.')
    }
  });
}

init();
