<template>
  <div
    v-loading.body="pageLoading"
    class="main-content"
  >
    <el-row class="padding-md">
      <el-col
        :span="6"
        class="margin-lg-bottom"
      >
        <div
          class="text-center"
          style="margin: auto;width: 90px;"
        >
          <el-button
            type="default"
            class="margin-sm-bottom"
            style="width: 80px;height: 80px;"
            circle
          >
            {{ newUsers }}
          </el-button>
          <span>新增用户</span>
        </div>
      </el-col>
      <el-col
        :span="6"
        class="margin-lg-bottom"
      >
        <div
          class="text-center"
          style="margin: auto;width: 90px;"
        >
          <el-button
            type="default"
            class="margin-sm-bottom"
            style="width: 80px;height: 80px;"
            circle
          >
            {{ newBooks }}
          </el-button>
          <span>新增小说</span>
        </div>
      </el-col>
      <el-col
        :span="6"
        class="margin-lg-bottom"
      >
        <div
          class="text-center"
          style="margin: auto;width: 90px;"
        >
          <el-button
            type="default"
            class="margin-sm-bottom"
            style="width: 80px;height: 80px;"
            circle
          >
            {{ newArticle }}
          </el-button>
          <span>新增文章</span>
        </div>
      </el-col>
      <el-col
        :span="6"
        class="margin-lg-bottom"
      >
        <div
          class="text-center"
          style="margin: auto;width: 90px;"
        >
          <el-button
            type="default"
            class="margin-sm-bottom"
            style="width: 80px;height: 80px;"
            circle
          >
            {{ newVideo }}
          </el-button>
          <span>新增视频</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div
          id="site_update"
          style="height: 240px;"
        >
          <i
            v-if="requestSiteUpdateData"
            class="el-icon-loading "
            style="font-size: 36px;"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div
          id="video_update"
          style="height: 240px;"
        >
          <i
            v-if="requestSiteUpdateData"
            class="el-icon-loading "
            style="font-size: 36px;"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import staticsApi from '../../api/staticsApi'
import * as echarts from 'echarts'

export default {
  data () {
    return {
      pageLoading: false,
      requestSiteUpdateData: false,
      siteUpdateData: [],
      newUsers: 0,
      newBooks: 0,
      newArticle: 0,
      newVideo: 0
    }
  },
  computed: {},
  mounted () {
    // 这里获取数据
    this.loadData()
  },
  updated () {
  },
  methods: {
    // 获取数据 必须要要有个loadData方法以供刷新使用
    loadData () {
      // if (this.pageLoading) return;
      let that = this
      this.requestSiteUpdateData = true
      staticsApi.query({ page_size: 30 }, function (data) {
        console.debug("请求成功", data);
        that.siteUpdateData = data
        that.requestSiteUpdateData = false
        that.drawChapters(data)
        that.drawVideos(data)
        that.setYesterdayValue(data)
      }, function (err) {
        console.debug("请求失败",err)
//        tools.alertError(err);
        that.requestSiteUpdateData = false
      })
    },
    setYesterdayValue (data) {
      let tempDate = (new Date()).getTime() - 24 * 3600 * 1000
      let yesterday = parseInt((new Date(tempDate).format('yyyyMMdd')))
      for (var k = 0; k < data.length; k++) {
        if (data[k].a_date === yesterday) {
          this.newUsers = data[k].new_users
          this.newBooks = data[k].new_book
          this.newArticle = data[k].new_articles
          this.newVideo = data[k].new_videos
          break
        }
      }
    },

    drawVideos (data) {
      let lineChart = echarts.init(document.getElementById('video_update'))
      var option = {
        title: {
          text: '近7日视频更新统计'
        },
        tooltip: { show: true },
        xAxis: {
          axisPointer: {
            snap: true,
            label: {
              show: true,
              formatter: function (params) {
                return params.value
              }
            },
            handle: {
              show: false
            }
          },
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {}
        }, {
          data: [],
          type: 'line'
        }]
      }
      let showDays = 7
      let now = (new Date()).getTime() - showDays * 24 * 3600 * 1000
      for (var j = 0; j < showDays; j++) {
        option.xAxis.data.push(new Date(now).format('MM-dd'))
        now = now + 24 * 3600 * 1000
        option.series[0].data.push(0)
        // option.series[1].data.push(0)
      }

      for (var i = 0; i < data.length; i++) {
        let tempDate = (new Date()).getTime() - showDays * 24 * 3600 * 1000
        for (var k = 0; k < showDays; k++) {
          if (data[i].a_date == (new Date(tempDate).format('yyyyMMdd'))) {
            // option.series[0].data[k] = (data[i].new_chapters)
            option.series[0].data[k] = (data[i].new_video_source)
            // option.series[1].data[k] = (data[i].new_videos) //new_articles)
            // option.series[2].data[k] = (data[i].new_videos)
            // option.series[3].data[k] = (data[i].new_book)
            // option.series[4].data[k] = (data[i].new_users)
            break
          }
          tempDate += 24 * 3600 * 1000
        }
      }
      // console.debug(option.series)
      lineChart.setOption(option)
    },
    drawChapters (data) {
      // console.debug(data)
      console.debug(echarts)
      let lineChart = echarts.init(document.getElementById('site_update'))
      var option = {
        title: {
          text: '近7日小说章节更新统计'
        },
        tooltip: { show: true },
        xAxis: {
          axisPointer: {
            value: '10-7',
            snap: true,
            label: {
              show: true,
              formatter: function (params) {
                return params.value
              }
            },
            handle: {
              show: false
            }
          },
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {}
        }]
      }
      let showDays = 7
      let now = (new Date()).getTime() - showDays * 24 * 3600 * 1000
      for (var j = 0; j < showDays; j++) {
        option.xAxis.data.push(new Date(now).format('MM-dd'))
        now = now + 24 * 3600 * 1000
        option.series[0].data.push(0)
      }

      for (var i = 0; i < data.length; i++) {
        let tempDate = (new Date()).getTime() - showDays * 24 * 3600 * 1000
        for (var k = 0; k < showDays; k++) {
          if (data[i].a_date == (new Date(tempDate).format('yyyyMMdd'))) {
            option.series[0].data[k] = (data[i].new_chapters)
            // option.series[0].data[k] = (data[i].new_video_source)
            // option.series[1].data[k] = (data[i].new_articles)
            // option.series[2].data[k] = (data[i].new_videos)
            break
          }
          tempDate += 24 * 3600 * 1000
        }
      }
      // console.debug(option.series)
      lineChart.setOption(option)
    }
  }
}
</script>
