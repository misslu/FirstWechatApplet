//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    boards: [{ key: 'in_theaters' }, { key: 'coming_soon' }, { key: 'top250' }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad(options) {
    wx.getStorage({
      key: 'has_shown_splash',
      fail: err => {

        wx.redirectTo({
          url: '/pages/doudou/splash',
        })
      },
      success: res => {
        console.log('aaa')
        this.retrieveData();
      },
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  retrieveData() {
    let app = getApp();
    var promises = this.data.boards.map(function (board) {
      return app.request(`https://douban.uieee.com/v2/movie/${board.key}?start=0&count=10`)
        .then(function (d) {
          if (!d) return board;
          board.title = d.title;
          board.movies = d.subjects;
          return board;
        }).catch(err => cosole.log(err));
    });

    return app.promise.all(promises).then(boards => {
      if (!boards || !boards.length) return;
      this.setData({ boards: boards, loading: false });
    });
  }
})