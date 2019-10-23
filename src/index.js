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
});
