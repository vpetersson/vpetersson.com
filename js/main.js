/**
 * Toggle hamburger menu
 */

(function() {
  const openBtn = document.querySelector('.open-menu')
  const closeBtn = document.querySelector('.close-menu')
  const menu = document.querySelector('.mobile-menu')

  openBtn.addEventListener('click', () => {
    menu.classList.remove('hidden')
  })

  closeBtn.addEventListener('click', () => {
    menu.classList.add('hidden')
  })  
}())