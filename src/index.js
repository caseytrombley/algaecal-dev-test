// import {ProductBundles} from "./modules/ProductBundles";
import './styles/main.scss';
import loadSVGs from './modules/svg-replace';
import 'popper.js';
import 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  loadSVGs();

  const hideElementWhenZero = (elementClassname, elementDataAttribute) => {
    const elements = document.getElementsByClassName(elementClassname);
    let i;
    for (i = 0; i < elements.length; i += 1) {
      if (elements[i].getAttribute(elementDataAttribute) === '0') {
        elements[i].style.visibility = 'hidden';
      }
    }
  };
  hideElementWhenZero('percent-off', 'data-total-savings-amount');

  const fetchModalContent = (elementId, apiObj) => {
    const copy = document.getElementById(elementId);
    const url = 'https://www.algaecal.com/wp-json/acf/v3/options/options';
    fetch(url)
      .then(resp => resp.json())
      .then((data) => {
        copy.innerHTML = data.acf[apiObj];
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fetchModalContent('guaranteeCopy', '7yr_full_copy');
});
