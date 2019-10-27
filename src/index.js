// import {ProductBundles} from "./modules/ProductBundles";
import './styles/main.scss';
import { DateTime } from 'luxon';
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
        console.log(error); // eslint-disable-line
      });
  };
  fetchModalContent('guaranteeCopy', '7yr_full_copy');

  const callCenterResolver = () => {
    fetch(apiUrl)
      .then(resp => resp.json())
      .then((data) => {
        const officeHours = data.acf.office_hours;
        const dateDayNumber = new Date().getDay();
        const officeHoursFormatted = officeHours.map((obj, i) => ({ ...obj, day: i }));
        const convertTimezone = DateTime.local().setZone('America/New_York').toString();
        const timeNow = () => {
          const d = new Date(convertTimezone);
          const h = (d.getHours() < 10 ? '0' : '') + d.getHours();
          const m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
          const s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
          return `${h}:${m}:${s}`;
        };
        const formattedTime = (fourDigitTime) => {
          const hours24 = fourDigitTime.substring(0, 2);
          const minutes = fourDigitTime.substring(2);
          return `${hours24}:${minutes}:00`;
        };

        officeHoursFormatted.forEach((obj) => {
          if (obj.day === dateDayNumber) {
            const start = formattedTime(obj.starting_time);
            const close = formattedTime(obj.closing_time);
            const timeRange = [start, close];
            const isInRange = timeNow() >= timeRange[0] && timeNow() < timeRange[1];
            if (isInRange) callCenterDiv.classList.remove('invisible');
          }
        });
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line
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
