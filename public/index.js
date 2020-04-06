(function () {
  // 当前页码
  let page = 1

  const $btn = document.querySelector('.btn.next')

  $btn.addEventListener('click', function (e) {
    page++
    fetch('./page/' + page, {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    }).then(function (res) {
      return res.json()
    }).then(function (res) {
      const data = res.map(function (post) {
        return `
          <div class="post_item">
              <h3>
                  <a href="${post.url}" class="post_item-title" target="_blank">${post.title}</a>
              </h3>
              <p class="post_item_summary">${post.summary}</p>
              <p>
                  <a class="post_item_author" href="${post.authorHref}">${post.author}</a>
              </p>
          </div>
        `
      })
      const $content = document.querySelector('.content')
      $content.innerHTML += data
    })
  })
})()