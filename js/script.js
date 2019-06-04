// Largely based on the YouTube tutorial by Brad Traversy.
// https://youtu.be/C22hQKE_32c

const doc = window.document;

const container = doc.getElementById('container');
const stock = doc.getElementById('stock');
const feed = doc.getElementById('feed');
const rowInput = doc.getElementById('rows-input');

const adjustTiles = () => {
  const feedWidth = Math.min(feed.scrollWidth, feed.offsetWidth);
  tileSize = Math.floor(feedWidth / 3) - 3;
  for (tile_cont of [...feed.childNodes]) {
    tile_cont.style.width = `${tileSize}px`;
    tile_cont.style.height = `${tileSize}px`;

    for (tile of [...tile_cont.childNodes]) {
      setTileParams(tile_cont, tile);
    }
  }
}

const fitTiles = e => {


  if (feed.childElementCount > 0) {
    container.style.height = `${window.innerHeight - 150}px`;

    // This ridiculousness due to the browsers' scrollbar width ambiguity.
    // Basically doing the same thing twice.
    // Surely may be optimised but screw it.
    adjustTiles();

    if (feed.offsetWidth != feed.scrollWidth) {
      adjustTiles();
    }
  }
}

const processUrl = f => {
  const reader = new FileReader();
  reader.readAsDataURL(f);

  reader.onload = rlev => {

    const img = new Image();
    img.src = rlev.target.result;

    img.onload = () => {
      const srcHeight = img.height;
      const srcWidth = img.width;
      const scaleFactor = 150 / Math.min(srcHeight, srcWidth);

      const elem = document.createElement('canvas');
      elem.width = srcWidth * scaleFactor;
      elem.height = srcHeight * scaleFactor;
      const ctx = elem.getContext('2d');
      ctx.drawImage(img, 0, 0, elem.width, elem.height);

      const url = ctx.canvas.toDataURL(img);

      const stockTileContainer = doc.createElement('div');
      stockTileContainer.style.width = '100px';
      stockTileContainer.style.height = '100px';
      stockTileContainer.classList.add('tile-container');

      addTileContainerEvents(stockTileContainer);

      const tile = doc.createElement('div');
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

const setTileParams = (parent, child) => {
  const parent_width = parent.offsetWidth;
  const parent_height = parent.offsetHeight;

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

const popChildren = parent => {
  while (parent.firstChild)
    parent.removeChild(parent.firstChild);
}

const addTileContainerEvents = tileContainer => {
  tileContainer.addEventListener('dragover', dragOver);
  tileContainer.addEventListener('dragenter', dragEnter);
  tileContainer.addEventListener('dragleave', dragLeave);
  tileContainer.addEventListener('drop', dragDrop);
}

const handleFileSelect = e => {

  container.style.display = 'flex';
  container.style.height = `${window.innerHeight - 150}px`;

  const files = [...e.target.files].filter( s => s.type.includes("image") );

  for (file of files) {
    processUrl(file);
  }
}

const randomColor = () => {
  const red = parseInt(Math.random()*255);
  const green = parseInt(Math.random()*255);
  const blue = parseInt(Math.random()*255);

  return `rgb(${red},${green},${blue})`
}

var ego = null;

// Tiles events
const dragStart = e => {
  e.dataTransfer.setData('Text', '');
  ego = e.currentTarget;
  setTimeout(() => ego.classList.add('invisible'), 0);
}

const dragEnd = e => {
  e.currentTarget.classList.remove('invisible');
}

// Tile-container events
const dragOver = e => {
  e.preventDefault();
}

const dragEnter = e => {
  e.preventDefault();
  e.currentTarget.classList.add('hovered');
}

const dragLeave = e => {
  e.currentTarget.classList.remove('hovered');
}

const dragDrop = e => {
  if (e.currentTarget.childElementCount != 0) { // need to switch parents

    const ego_parent = ego.parentNode;
    const existing_child = e.currentTarget.childNodes[0];
    ego_parent.appendChild(existing_child);

    setTileParams(ego_parent, existing_child);
  }

  e.currentTarget.appendChild(ego);

  setTileParams(e.currentTarget, ego);

  e.currentTarget.classList.remove('hovered');
}

const init = () => {
  window.addEventListener('resize', fitTiles);
  doc.getElementById('files').addEventListener('change', handleFileSelect, false);
  doc.getElementById('add-rows-button').addEventListener('click', () => {

    const nRows = parseInt(rowInput.value);
    if (nRows) {
      const feedWidth = Math.min(feed.scrollWidth, feed.offsetWidth);
      const tileSize = feedWidth/3 - 3;

      for (var i = 0; i < nRows*3; i++) {
        const feedTileContainer = doc.createElement('div');
        feedTileContainer.style.width = `${tileSize}px`; // '148px';
        feedTileContainer.style.height = `${tileSize}px`; // '148px';
        feedTileContainer.classList.add('tile-container');

        addTileContainerEvents(feedTileContainer);
        feed.insertBefore(feedTileContainer, feed.firstElementChild);
      }
    }
  });

  doc.getElementById('download').addEventListener('click', () => {

    if (feed.childElementCount > 0) {

      const h_full = feed.scrollHeight;
      const h_visible = feed.offsetHeight;

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
