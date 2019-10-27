// import {ProductBundles} from "./modules/ProductBundles";
import './styles/main.scss';
import loadSVGs from './modules/svg-replace';
import 'popper.js';
import 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  loadSVGs();

  const apiUrl = 'https://www.algaecal.com/wp-json/acf/v3/options/options';
  const callCenterDiv = document.getElementsByClassName('call-center')[0];
  callCenterDiv.classList.add('invisible');

  const fetchModalContent = (elementId, apiObj) => {
    const copy = document.getElementById(elementId);
    fetch(apiUrl)
      .then(resp => resp.json())
      .then((data) => {
        copy.innerHTML = data.acf[apiObj];
      })
      .catch((error) => {
        console.log(error);
      });
  };
  fetchModalContent('guaranteeCopy', '7yr_full_copy');

  const callCenterResolver = () => {
    fetch(apiUrl)
      .then(resp => resp.json())
      .then((data) => {
        const officeHours = data.acf.office_hours;
        const dateDayNumberString = new Date().getDay().toString();

        const timeNow = () => {
          const d = new Date();
          const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
          const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
          const s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
          return `${h}:${m}:${s}`;
        };
        const formatTime = (fourDigitTime) => {
          const hours24 = fourDigitTime.substring(0, 2);
          const minutes = fourDigitTime.substring(2);
          return `${hours24}:${minutes}:00`;
        };

        officeHours.forEach((obj) => {
          if (obj.day === dateDayNumberString) {
            const start = formatTime(obj.starting_time);
            const close = formatTime(obj.closing_time);
            console.log('starting time:', start);
            console.log('closing time:', close);
            console.log('current time:', timeNow());

            const timeRange = [start, close];
            const isInRange = timeNow() >= timeRange[0] && timeNow() < timeRange[1];
            if (!isInRange) callCenterDiv.classList.remove('invisible');
          }
        });
      });
  };
  callCenterResolver();

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
