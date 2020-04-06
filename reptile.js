const request = require('superagent')
const cheerio = require('cheerio')
const path = require('path')

const DOMAIN_NAME = 'https://www.cnblogs.com/'

/**
 * 爬取列表
 * @param {number} [page=0] - 页码，需要爬取的列表页码，默认为1
 * @param {callback function} cb - 回调
 * @param {array json} cb.data - 回调参数，json 数组
 */
function reptilePosts (page= 1, cb) {
  request
    .post(DOMAIN_NAME + 'AggSite/AggSitePostList')
    .send({
      CategoryType: 'SiteHome',
      ParentCategoryId: 0,
      CategoryId: 808,
      PageIndex: page,
      TotalPostCount: 4000,
      ItemListActionName: 'AggSitePostList'
    })
    .set('Accept', 'text/plain')
    .then(res => {
      const posts = []
      const $ = cheerio.load(res.text)

      $('.post_item_body').each((i, ele) => {
        const href = $(ele).find('.titlelnk').attr('href')
        const id = path.basename(href, '.html')
        const json = {
          id,
          url: './post/' + path.dirname(href).replace(DOMAIN_NAME, '') + '/' + id,
          title: $(ele).find('.titlelnk').text(),
          href: $(ele).find('.titlelnk').attr('href'),
          summary: $(ele).find('.post_item_summary').text(),
          author: $(ele).find('.lightblue').text(),
          authorHref: $(ele).find('.lightblue').attr('href')
        }
        posts.push(json)
      })
      cb(posts)
    })
    .catch(err => {
      console.log(err)
    })
}

/**
 * 爬取详情
 * @param {number} id - 文章id
 * @param {callback function} cb - 回调
 * @param {object} cb.data - 回调参数
 */
function reptileDetail (url, cb) {
  request
    .get(DOMAIN_NAME + url + '.html')
    .set('Accept', 'text/html')
    .then(res => {
      const $ = cheerio.load(res.text, { decodeEntities: false })
      const json = {
        title: $('.postTitle2').text(),
        content: $.html('.blogpost-body')
      }
      cb(json)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports.posts = reptilePosts
module.exports.detail = reptileDetail