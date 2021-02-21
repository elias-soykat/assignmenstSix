const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const spin = document.querySelector('.spinner_container');
const search = document.querySelector('#search');
const dots = document.querySelector('.dots');

spin.classList.add('none');
// selected image 
let sliders = [];

const spinner = function(){
  spin.classList.toggle('none');
  imagesArea.classList.toggle('none');
}
// spinner();
// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  
      // console.log(images);

  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  // console.log(images.length, Boolean(images), images);
  if (images.length===0){
    // console.log('nothing found');
    if(document.querySelector('.err')) return spinner();
    let div = document.createElement('div');

    div.className = 'col-lg-12 err display-1 d-flex justify-content-center';
    div.innerHTML = `Image not found!`;
    imagesArea.appendChild(div);
    spinner();
    return;
  }
  if(document.querySelector('.err')) document.querySelector('.err').remove();
  images.forEach((image,inx) => {
    let div = document.createElement('div');

    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") data-iid="${inx}" src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    
  })
  spinner();
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      // console.log(data.hits);

      return showImages(data.hits);
    })
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // console.log(element,img);
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  // console.log(item);
  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.remove('added');
    sliders.splice(item,1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 images.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;  

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const temp = document.getElementById('duration').value || 1000;
  const duration = Math.abs(temp);
  document.getElementById('duration').value = duration;
  dots.innerHTML = '';
  let html = '';
  // console.log(sliders);
  sliders.forEach((slide,inx) => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    html = `<span class="dot ${inx}" data-id="d${inx}" ></span>`;
    // console.log(html);
    dots.insertAdjacentHTML('beforeend',html);
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    // console.log(slideIndex);
    changeSlide(slideIndex,slideIndex-1);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index,inx='0') => {

  const items = document.querySelectorAll('.slider-item');
  const dots = document.querySelectorAll('.dot');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })
  dots.forEach(dot=>{
    // console.log(dot);
    dot.classList.remove('activeDot');
  })
// console.log(dots[0]);
dots[inx].classList.add('activeDot');
  
  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  spinner();

  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  // console.log(search.value);
  getImages(search.value)
  
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

search.addEventListener('keypress',function(e){
  
  if(e.key === 'Enter'){
    searchBtn.click();
  }
})