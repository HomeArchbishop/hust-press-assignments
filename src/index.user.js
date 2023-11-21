// ==UserScript==
// @name        hust press assignments
// @namespace   Violentmonkey Scripts
// @match       http://bookcenter.hustp.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/10/10 10:21:13
// ==/UserScript==

function addStartUI () {
  const _ = document.createElement('div')
  _.innerHTML = `<div id="scriptUI" style="
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
  ">
    <div id="startBtn" style="
      background: #e53e31;
      padding: 16px 12px;
      font-size: 20px;
      font-weight: 800;
      border-radius: 8px;
      user-select: none;
      cursor: pointer;
      color: #fff;
    ">
      START
    </div>
  </div>`
  document.body.append(..._.childNodes)
}

if (/\/(mobile\/)?exercises\/detail\//.test(location.pathname)) {
  if (localStorage.getItem('bot:hasAnswer') === 'true') {
    window.alert = () => {}
    // addTipUI
    const ansList = JSON.parse(localStorage.getItem('bot:ansList'))
    console.log(ansList)
    Array.from(document.querySelectorAll('li.item')).forEach((el, i) => {
      ansList[i].forEach(ans => {
        let clickAns = ans
        if (ans === '正确') { clickAns = 'A' }
        if (ans === '错误') { clickAns = 'B' }
        console.log(ans, clickAns)
        el.querySelector(`input[value=${clickAns}]`)?.click()
      })
    })
    localStorage.setItem('bot:hasAnswer', 'false')
    setTimeout(() => {
      document.querySelector('.submit_btn').click()
    }, 1000)
  } else {
    window.alert = () => {}
    addStartUI()
    document.querySelector('#startBtn')?.addEventListener('click', () => {
      Array.from(document.querySelectorAll('.e_type_1 input[value=A]')).forEach(el => {
        el.click()
      })
      ;[
        ...Array.from(document.querySelectorAll('.e_type_2 input[value=A]')),
        ...Array.from(document.querySelectorAll('.e_type_2 input[value=B]'))
      ].forEach(el => {
        el.click()
      })
      Array.from(document.querySelectorAll('.e_type_3 input[value=A]')).forEach(el => {
        el.click()
      })
      setTimeout(() => {
        localStorage.setItem('bot:exerciseURL', location.href)
        document.querySelector('.submit_btn').click()
      }, 1000)
    })
  }
}

if (/\/(mobile\/)?exercises\/report\//.test(location.pathname)) {
  const ansList = []
  Array.from(document.querySelectorAll('.result_box')).forEach(el => {
    const list = el.querySelectorAll('span')[0].innerHTML.replace(/(正确答案：)|\s/g, '').split(',')
    ansList.push(list)
  })
  const exerciseURL = localStorage.getItem('bot:exerciseURL')
  if (exerciseURL !== null) {
    localStorage.setItem('bot:ansList', JSON.stringify(ansList))
    localStorage.setItem('bot:hasAnswer', 'true')
    localStorage.removeItem('bot:exerciseURL')
    location.href = exerciseURL
  }
}
